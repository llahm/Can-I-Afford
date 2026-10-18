import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
export async function GET(request) {
  return NextResponse.json({ user: (await getCurrentUser(request)) || null });
}