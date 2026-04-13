import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import * as kv from "./kv_store.ts";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const path = url.pathname;
  const matchComments = path.match(/\/comments\/([^/]+)$/);
  const isCommentsPost = path.endsWith("/comments") && path.includes("make-server");
  const isGrowthGet = req.method === "GET" && path.endsWith("/admin/growth") && path.includes("make-server");
  const isGrowthPost = req.method === "POST" && path.endsWith("/admin/growth") && path.includes("make-server");
  const isGrowthHeartbeatPost =
    req.method === "POST" && path.endsWith("/admin/growth/heartbeat") && path.includes("make-server");

  try {
    // GET /.../comments/:slug
    if (req.method === "GET" && matchComments) {
      const slug = matchComments[1];
      const comments = await kv.getByPrefix(`comment:${slug}:`);
      const sorted = (comments as { createdAt: string }[]).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return json({ comments: sorted });
    }

    // POST /.../comments
    if (req.method === "POST" && isCommentsPost) {
      const { slug, name, text } = await req.json();
      if (!slug || !text?.trim()) {
        return json({ error: "Missing required fields: slug, text" }, 400);
      }
      const comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        slug,
        name: name?.trim() || "Anonymous",
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      await kv.set(`comment:${slug}:${comment.id}`, comment);
      return json({ success: true, comment });
    }

    // GET /.../admin/growth
    if (isGrowthGet) {
      const state = await kv.get("content:growth:state");
      return json({ state: state ?? null });
    }

    // POST /.../admin/growth
    if (isGrowthPost) {
      const body = await req.json();
      await kv.set("content:growth:state", body);
      return json({ success: true });
    }

    // POST /.../admin/growth/heartbeat
    if (isGrowthHeartbeatPost) {
      const event = await req.json();
      const current = (await kv.get("content:growth:state")) ?? {};
      const automations = Array.isArray((current as { automations?: unknown[] }).automations)
        ? ((current as { automations?: unknown[] }).automations as Array<Record<string, unknown>>)
        : [];

      const nextAutomations = automations.map((automation) => {
        if (automation.id !== event.automationId) return automation;
        return {
          ...automation,
          health: event.health ?? automation.health,
          throughput: event.throughput ?? automation.throughput,
          lastRun: event.lastRun ?? "just now",
        };
      });

      const nextState = {
        ...(current as Record<string, unknown>),
        automations: nextAutomations,
        settings: {
          ...(((current as { settings?: Record<string, unknown> }).settings ?? {}) as Record<string, unknown>),
          lastUpdated: new Date().toISOString(),
        },
      };

      await kv.set("content:growth:state", nextState);
      await kv.set(`growth:heartbeat:${Date.now()}`, {
        ...event,
        receivedAt: new Date().toISOString(),
      });

      return json({ success: true });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
