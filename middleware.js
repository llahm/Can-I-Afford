import { NextResponse } from "next/server";
export function middleware(request) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard") && !request.cookies.get("app_session")) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };