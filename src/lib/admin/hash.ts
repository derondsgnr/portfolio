const SALT = "portfolio_admin_v1";

export async function hashAdminToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret + SALT);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
