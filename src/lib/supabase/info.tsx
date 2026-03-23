/* Supabase config — requires env vars (NEXT_PUBLIC_SUPABASE_PROJECT_ID, NEXT_PUBLIC_SUPABASE_ANON_KEY) */

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? "";
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export { projectId, publicAnonKey };
