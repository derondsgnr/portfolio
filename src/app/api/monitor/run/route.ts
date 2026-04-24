import { NextResponse } from "next/server";
import { runMonitoringSweep } from "@/lib/monitoring/health";

export const dynamic = "force-dynamic";

function getCronSecret() {
  return process.env.MONITORING_CRON_SECRET ?? process.env.CRON_SECRET ?? null;
}

function isAuthorized(req: Request) {
  const secret = getCronSecret();
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  return req.headers.get("x-monitor-secret") === secret;
}

async function handleRun(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const overview = await runMonitoringSweep();
    return NextResponse.json({
      ok: true,
      checkedAt: overview.checkedAt,
      summary: overview.summary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Monitoring sweep failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleRun(req);
}

export async function POST(req: Request) {
  return handleRun(req);
}
