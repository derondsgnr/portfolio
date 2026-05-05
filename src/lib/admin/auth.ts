import { cookies } from "next/headers";
import { hashAdminToken } from "./hash";
import { timingSafeEqual } from "crypto";

const ADMIN_COOKIE = "admin_session";
export type AdminRole = "owner" | "content_manager";

function secureEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

async function matchesToken(token: string, secret: string | undefined): Promise<boolean> {
  const normalized = secret?.trim();
  if (!normalized) return false;
  const expected = await hashAdminToken(normalized);
  return token === expected;
}

export async function getAdminSession(): Promise<{ authenticated: boolean; role: AdminRole | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return { authenticated: false, role: null };

  if (await matchesToken(token, process.env.ADMIN_SECRET)) {
    return { authenticated: true, role: "owner" };
  }

  if (await matchesToken(token, process.env.ADMIN_CONTENT_SECRET)) {
    return { authenticated: true, role: "content_manager" };
  }

  return { authenticated: false, role: null };
}

export async function verifyAdminSession(): Promise<boolean> {
  const session = await getAdminSession();
  return session.authenticated;
}

export async function createAdminSession(password: string): Promise<AdminRole | null> {
  const input = password?.trim();
  if (!input) return null;

  const ownerSecret = process.env.ADMIN_SECRET?.trim();
  if (ownerSecret && secureEquals(input, ownerSecret)) return "owner";

  const contentSecret = process.env.ADMIN_CONTENT_SECRET?.trim();
  if (contentSecret && secureEquals(input, contentSecret)) return "content_manager";

  return null;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export async function getAdminCookieValue(role: AdminRole): Promise<string | null> {
  const secret = role === "owner" ? process.env.ADMIN_SECRET : process.env.ADMIN_CONTENT_SECRET;
  if (!secret?.trim()) return null;
  return hashAdminToken(secret.trim());
}
