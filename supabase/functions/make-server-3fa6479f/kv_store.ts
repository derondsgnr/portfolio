/**
 * KV store for comments and contact data.
 * Table: kv_store_3fa6479f (key TEXT, value JSONB)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TABLE = "kv_store_3fa6479f";

export function client() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key);
}

export async function set(key: string, value: unknown): Promise<void> {
  const { error } = await client().from(TABLE).upsert({ key, value });
  if (error) throw new Error(error.message);
}

export async function get(key: string): Promise<unknown | null> {
  const { data, error } = await client().from(TABLE).select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as { value?: unknown } | null)?.value ?? null;
}

export async function getByPrefix(prefix: string): Promise<unknown[]> {
  const { data, error } = await client()
    .from(TABLE)
    .select("key, value")
    .like("key", prefix + "%");
  if (error) throw new Error(error.message);
  return (data ?? []).map((d) => (d as { value: unknown }).value);
}
