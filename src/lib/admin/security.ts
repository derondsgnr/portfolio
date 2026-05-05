type HeaderBag = Pick<Headers, "get">;

type RateLimitBucket = {
  count: number;
  windowStart: number;
};

type LockBucket = {
  failures: number[];
  lockedUntil: number;
};

const rateLimitStore = new Map<string, RateLimitBucket>();
const loginLockStore = new Map<string, LockBucket>();

function normalizeIp(raw: string | null | undefined): string {
  if (!raw) return "unknown";
  const first = raw.split(",")[0]?.trim() ?? "";
  return first || "unknown";
}

export function getClientIp(headers: HeaderBag): string {
  return normalizeIp(
    headers.get("x-real-ip") ??
      headers.get("cf-connecting-ip") ??
      headers.get("x-forwarded-for")
  );
}

function hostFromHeaders(headers: HeaderBag): string {
  return (
    headers.get("x-forwarded-host") ??
    headers.get("host") ??
    ""
  ).toLowerCase();
}

function parseHost(value: string | null): string {
  if (!value) return "";
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return "";
  }
}

export function isSameOriginMutation(headers: HeaderBag): boolean {
  const expectedHost = hostFromHeaders(headers);
  if (!expectedHost) return false;

  const originHost = parseHost(headers.get("origin"));
  if (originHost) return originHost === expectedHost;

  const refererHost = parseHost(headers.get("referer"));
  if (refererHost) return refererHost === expectedHost;

  return false;
}

function matchesAllowlist(ip: string, allowlistEntry: string): boolean {
  const trimmed = allowlistEntry.trim();
  if (!trimmed) return false;
  if (trimmed === "*") return true;
  if (trimmed.endsWith(".*")) {
    const prefix = trimmed.slice(0, -1);
    return ip.startsWith(prefix);
  }
  return ip === trimmed;
}

export function isIpAllowed(ip: string): boolean {
  const allowlistRaw = process.env.ADMIN_ALLOWED_IPS?.trim();
  if (!allowlistRaw) return true;

  const allowlist = allowlistRaw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (allowlist.length === 0) return true;
  return allowlist.some((entry) => matchesAllowlist(ip, entry));
}

export function consumeRateLimit(
  namespace: string,
  key: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const storageKey = `${namespace}:${key}`;
  const existing = rateLimitStore.get(storageKey);

  if (!existing || now - existing.windowStart >= windowMs) {
    rateLimitStore.set(storageKey, { count: 1, windowStart: now });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= max) {
    const retryAfterMs = windowMs - (now - existing.windowStart);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  existing.count += 1;
  rateLimitStore.set(storageKey, existing);
  return { ok: true, retryAfterSec: 0 };
}

export function registerLoginFailure(ip: string): { locked: boolean; retryAfterSec: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxFailures = 5;
  const lockMs = 15 * 60 * 1000;

  const current = loginLockStore.get(ip) ?? { failures: [], lockedUntil: 0 };
  const failures = current.failures.filter((ts) => now - ts < windowMs);
  failures.push(now);

  if (failures.length >= maxFailures) {
    const lockedUntil = now + lockMs;
    loginLockStore.set(ip, { failures, lockedUntil });
    return { locked: true, retryAfterSec: Math.ceil(lockMs / 1000) };
  }

  loginLockStore.set(ip, { failures, lockedUntil: current.lockedUntil });
  return { locked: false, retryAfterSec: 0 };
}

export function clearLoginFailures(ip: string) {
  loginLockStore.delete(ip);
}

export function getLoginLock(ip: string): { locked: boolean; retryAfterSec: number } {
  const current = loginLockStore.get(ip);
  if (!current) return { locked: false, retryAfterSec: 0 };
  const now = Date.now();
  if (current.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.ceil((current.lockedUntil - now) / 1000) };
  }
  if (current.lockedUntil > 0) {
    loginLockStore.delete(ip);
  }
  return { locked: false, retryAfterSec: 0 };
}

