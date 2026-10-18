import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function POST(request) {
  const { name, username, password, currentLocation, baselineSalary } = await request.json();
  if (!name || !username || !password || password.length < 6) {
    return NextResponse.json({ error: "Provide name, username, and a 6+ char password." }, { status: 400 });
  }
  if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return NextResponse.json({ error: "Username already taken." }, { status: 400 });
  }
  const newUser = { id: "usr_" + Date.now(), name, username, password, currentLocation: currentLocation || "California", baselineSalary: Number(baselineSalary) || 85000 };
  db.users.push(newUser);
  const payload = { id: newUser.id, name: newUser.name, username: newUser.username, currentLocation: newUser.currentLocation, baselineSalary: newUser.baselineSalary };
  const res = NextResponse.json({ success: true, user: payload });
  res.cookies.set("app_session", JSON.stringify(payload), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 86400 });
  return res;
}