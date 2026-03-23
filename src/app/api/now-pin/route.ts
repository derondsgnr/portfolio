import { NextRequest, NextResponse } from "next/server";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minute
const attempts = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  // Rate limiting
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now < record.resetAt) {
    if (record.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }
    record.count++;
  } else {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  const pin = process.env.NOW_ADMIN_PIN;
  if (!pin) {
    return NextResponse.json(
      { ok: false, error: "PIN not configured" },
      { status: 500 }
    );
  }

  let body: { pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }

  if (!body.pin || typeof body.pin !== "string") {
    return NextResponse.json(
      { ok: false, error: "PIN required" },
      { status: 400 }
    );
  }

  if (body.pin === pin) {
    // Clear attempts on success
    attempts.delete(ip);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, error: "Invalid PIN" },
    { status: 401 }
  );
}
