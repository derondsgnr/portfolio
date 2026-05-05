import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hashAdminToken } from "@/lib/admin/hash";
import { canAccessAdminPath } from "@/lib/admin/permissions";

type MiddlewareRateBucket = {
  count: number;
  windowStart: number;
};

const middlewareRateStore = new Map<string, MiddlewareRateBucket>();
type AdminRole = "owner" | "content_manager";

function normalizeIp(raw: string | null | undefined): string {
  if (!raw) return "unknown";
  const first = raw.split(",")[0]?.trim() ?? "";
  return first || "unknown";
}

function isIpAllowed(ip: string): boolean {
  const allowlistRaw = process.env.ADMIN_ALLOWED_IPS?.trim();
  if (!allowlistRaw) return true;

  const allowlist = allowlistRaw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (allowlist.length === 0) return true;

  return allowlist.some((entry) => {
    if (entry === "*") return true;
    if (entry.endsWith(".*")) return ip.startsWith(entry.slice(0, -1));
    return ip === entry;
  });
}

function consumeMiddlewareRateLimit(
  namespace: string,
  key: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const storageKey = `${namespace}:${key}`;
  const existing = middlewareRateStore.get(storageKey);

  if (!existing || now - existing.windowStart >= windowMs) {
    middlewareRateStore.set(storageKey, { count: 1, windowStart: now });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= max) {
    const retryAfterMs = windowMs - (now - existing.windowStart);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  existing.count += 1;
  middlewareRateStore.set(storageKey, existing);
  return { ok: true, retryAfterSec: 0 };
}

async function roleFromToken(token: string): Promise<AdminRole | null> {
  const ownerSecret = process.env.ADMIN_SECRET?.trim();
  if (ownerSecret) {
    const ownerExpected = await hashAdminToken(ownerSecret);
    if (token === ownerExpected) return "owner";
  }

  const contentSecret = process.env.ADMIN_CONTENT_SECRET?.trim();
  if (contentSecret) {
    const contentExpected = await hashAdminToken(contentSecret);
    if (token === contentExpected) return "content_manager";
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const ip = normalizeIp(
    request.headers.get("x-real-ip") ??
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")
  );

  if (!isIpAllowed(ip)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rateLimit = consumeMiddlewareRateLimit("admin-request", ip, 240, 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSec) },
      }
    );
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const ownerSecret = process.env.ADMIN_SECRET?.trim();
  const contentSecret = process.env.ADMIN_CONTENT_SECRET?.trim();
  if (!ownerSecret && !contentSecret) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }

  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const role = await roleFromToken(token);
  if (!role) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("admin_session");
    return res;
  }

  if (!canAccessAdminPath(role, pathname)) {
    return NextResponse.redirect(new URL("/admin?error=forbidden", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
