import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function POST(request) {
  const { username, password } = await request.json();
  const user = db.users.find((u) => u.username.toLowerCase() === String(username || "").toLowerCase() && u.password === password);
  if (!user) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  const payload = { id: user.id, name: user.name, username: user.username, currentLocation: user.currentLocation, baselineSalary: user.baselineSalary };
  const res = NextResponse.json({ success: true, user: payload });
  res.cookies.set("app_session", JSON.stringify(payload), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("app_session");
  return res;
}