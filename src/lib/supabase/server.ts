import { createClient } from "@supabase/supabase-js";

function getProjectId() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PROJECT_ID is required");
  }
  return projectId;
}

export function getSupabaseProjectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? `https://${getProjectId()}.supabase.co`;
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }
  return key;
}

export function getSupabasePublicAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  }
  return key;
}

export function getSupabaseServerAdmin() {
  return createClient(getSupabaseProjectUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
