import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentDb = readDb();
  const userRecords = currentDb.calculations.filter((r) => r.userId === user.id);

  return NextResponse.json(
    { records: userRecords, userId: user.id },
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
  const currentDb = readDb();

  const newRecord = {
    id: "rec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    userId: user.id,
    createdAt: new Date().toISOString(),
    ...body,
  };

  currentDb.calculations.unshift(newRecord);
  writeDb(currentDb);

  const userRecords = currentDb.calculations.filter((r) => r.userId === user.id);
  return NextResponse.json({
    success: true,
    record: newRecord,
    records: userRecords,
  });
}

export async function DELETE(request) {
  const user = await getCurrentUser(request);
  // Attack 1 Mitigation: Block unauthenticated deletes
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  const currentDb = readDb();
  const record = currentDb.calculations.find((r) => r.id === id);

  if (!record) {
    // If it was only in client localStorage, still allow client to remove it cleanly
    return NextResponse.json({ success: true });
  }

  // Attack 2 Mitigation: Refuse deletion if record belongs to another user
  if (record.userId !== user.id) {
    return NextResponse.json(
      { error: "Forbidden: Record belongs to another user" },
      { status: 403 }
    );
  }

  currentDb.calculations = currentDb.calculations.filter((r) => r.id !== id);
  writeDb(currentDb);

  const userRecords = currentDb.calculations.filter((r) => r.userId === user.id);
  return NextResponse.json({ success: true, records: userRecords });
}