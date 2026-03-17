/* Supabase config — use env vars in production for key rotation */

const projectId =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ?? "meyqmckflkcdblmadrvv";
const publicAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1leXFtY2tmbGtjZGJsbWFkcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjY1NDYsImV4cCI6MjA4OTI0MjU0Nn0.FRK1PSCpo2WjTC05z_6crG4n3AhfyQKp3VoAOOPI2dU";

export { projectId, publicAnonKey };
