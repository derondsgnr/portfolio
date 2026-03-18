import { NextResponse } from "next/server";

const projectId =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? "meyqmckflkcdblmadrvv";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3fa6479f`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, name, text } = body;
    if (!slug || !text?.trim()) {
      return NextResponse.json({ error: "slug and text required" }, { status: 400 });
    }
    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ slug, name: (name ?? "").trim(), text: text.trim() }),
    });
    const data = await res.json();
    if (data.comment) {
      return NextResponse.json(data);
    }
    return NextResponse.json(
      { error: data.error ?? "Failed to post comment" },
      { status: res.ok ? 500 : res.status }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
