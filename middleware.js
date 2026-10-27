import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const session = request.cookies.get("app_session");

  // Block logged-out users from the dashboard
  if (path.startsWith("/dashboard") && !session) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Block logged-in users from auth pages
  if ((path === "/signin" || path === "/signup") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/signin", "/signup"] };