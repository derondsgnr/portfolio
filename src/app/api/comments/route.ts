import { NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!projectId || !publicAnonKey) {
  console.warn("Supabase env vars not set — comments API will fail");
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3fa6479f`;

// ─── In-memory rate limiter (per IP, 5 comments per hour) ────────
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

// ─── Input validation ────────────────────────────────────────────
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TEXT_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;

export async function POST(req: Request) {
  try {
    // Rate limit by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many comments. Please try again later." },
        { status: 429 }
      );
    }

    if (!projectId || !publicAnonKey) {
      return NextResponse.json({ error: "Comments service not configured" }, { status: 503 });
    }

    const body = await req.json();
    const { slug, name, text } = body;

    // Validate slug
    if (!slug || typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    // Validate text
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Comment too long (max ${MAX_TEXT_LENGTH} characters)` },
        { status: 400 }
      );
    }

    // Validate name
    const cleanName = typeof name === "string" ? name.trim().slice(0, MAX_NAME_LENGTH) : "";

    // Strip HTML tags from text
    const cleanText = text.trim().replace(/<[^>]*>/g, "");

    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ slug, name: cleanName, text: cleanText }),
    });
    const data = await res.json();
    if (data.comment) {
      return NextResponse.json(data);
    }
    return NextResponse.json(
      { error: data.error ?? "Failed to post comment" },
      { status: res.ok ? 500 : res.status }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
