import { NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? "";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3fa6479f`;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ comments: [] });
  }
  try {
    const res = await fetch(`${API_BASE}/comments/${slug}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return NextResponse.json({ comments: data.comments ?? [] });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}
