import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/store";

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ records: db.calculations.filter((r) => r.userId === user.id) });
}

export async function POST(request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const rec = { id: "rec_" + Date.now(), userId: user.id, ...body };
  db.calculations.unshift(rec);
  return NextResponse.json({ success: true, record: rec });
}

export async function DELETE(request) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  const record = db.calculations.find((r) => r.id === id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (record.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  db.calculations = db.calculations.filter((r) => r.id !== id);
  return NextResponse.json({ success: true });
}