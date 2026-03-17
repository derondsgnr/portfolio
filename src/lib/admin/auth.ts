import { cookies } from "next/headers";
import { hashAdminToken } from "./hash";

const ADMIN_COOKIE = "admin_session";

export async function verifyAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const expected = await hashAdminToken(secret);
  return token === expected;
}

export async function createAdminSession(password: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET?.trim();
  const input = password?.trim();
  if (!secret || !input || input !== secret) return false;
  return true;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE;
}

export async function getAdminCookieValue(): Promise<string | null> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return hashAdminToken(secret);
}
