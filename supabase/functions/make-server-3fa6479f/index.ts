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

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
