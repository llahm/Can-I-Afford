import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/store";

export const dynamic = "force-dynamic";

function getMergedCalculations(request) {
  const cookieRaw = request.cookies.get("app_calcs")?.value;
  let cookieCalcs = [];
  if (cookieRaw) {
    try {
      cookieCalcs = JSON.parse(decodeURIComponent(cookieRaw));
    } catch {
      cookieCalcs = [];
    }
  }

  // Merge cookie records with seed records (deduplicated by ID, newest first)
  const map = new Map();
  for (const item of [...cookieCalcs, ...db.calculations]) {
    if (item && item.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

function saveCalculationsToCookie(response, userCalcs) {
  // Keep up to 15 compact records in the httpOnly cookie so it never exceeds 4KB
  const compact = userCalcs.slice(0, 15).map((r) => ({
    id: r.id,
    userId: r.userId,
    salary: r.salary,
    requiredSalary: r.requiredSalary,
    percentageDiff: r.percentageDiff,
    purchasingPowerGain: r.purchasingPowerGain,
    createdAt: r.createdAt || new Date().toISOString(),
    locationA: {
      searchedLocation: r.locationA?.searchedLocation,
      costIndex: r.locationA?.costIndex,
      description: r.locationA?.description,
      cpi: r.locationA?.cpi,
      period: r.locationA?.period,
    },
    locationB: {
      searchedLocation: r.locationB?.searchedLocation,
      costIndex: r.locationB?.costIndex,
      description: r.locationB?.description,
      cpi: r.locationB?.cpi,
      period: r.locationB?.period,
    },
  }));

  response.cookies.set("app_calcs", encodeURIComponent(JSON.stringify(compact)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allCalcs = getMergedCalculations(request);
  const userRecords = allCalcs.filter((r) => r.userId === user.id);

  return NextResponse.json(
    { records: userRecords },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}

export async function POST(request) {
  const user = await getCurrentUser(request);
  // Attack 1 Mitigation: Block unauthenticated writes
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allCalcs = getMergedCalculations(request);

  const newRecord = {
    id: "rec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    userId: user.id,
    createdAt: new Date().toISOString(),
    ...body,
  };

  const updatedAll = [newRecord, ...allCalcs];
  db.calculations = updatedAll;

  const userRecords = updatedAll.filter((r) => r.userId === user.id);
  const res = NextResponse.json({ success: true, record: newRecord, total: userRecords.length });
  saveCalculationsToCookie(res, userRecords);
  return res;
}

export async function DELETE(request) {
  const user = await getCurrentUser(request);
  // Attack 1 Mitigation: Block unauthenticated deletes
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  const allCalcs = getMergedCalculations(request);
  const record = allCalcs.find((r) => r.id === id);

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Attack 2 Mitigation: Refuse deletion if record belongs to another user
  if (record.userId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden: Record belongs to another user" },
      { status: 403 }
    );
  }

  const updatedAll = allCalcs.filter((r) => r.id !== id);
  db.calculations = updatedAll;

  const userRecords = updatedAll.filter((r) => r.userId === user.id);
  const res = NextResponse.json({ success: true });
  saveCalculationsToCookie(res, userRecords);
  return res;
}