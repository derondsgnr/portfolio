import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashAdminToken } from "@/lib/admin/hash";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }

  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const expected = await hashAdminToken(secret);
  if (token !== expected) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("admin_session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
