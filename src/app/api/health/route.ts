import { NextResponse } from "next/server";
import { getPublicHealthSnapshot } from "@/lib/monitoring/health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getPublicHealthSnapshot();
    const status = snapshot.status === "healthy" ? 200 : 503;
    return NextResponse.json(snapshot, { status });
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        checkedAt: new Date().toISOString(),
        checks: [],
        error: error instanceof Error ? error.message : "Health check failed.",
      },
      { status: 500 }
    );
  }
}
