import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated || !session.role) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, role: session.role });
}

