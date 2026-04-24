/**
 * Contact form: send email + store in Supabase kv_store.
 * Used by the booking drawer "Send a message" flow.
 */

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  budget: string;
};

const KV_TABLE = "kv_store_3fa6479f";

function getContactStorageErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("NEXT_PUBLIC_SUPABASE_PROJECT_ID is required") ||
    message.includes("SUPABASE_SERVICE_ROLE_KEY is required")
  ) {
    return "Contact form is temporarily unavailable because message delivery is not configured.";
  }

  return "Couldn't save your message right now. Please try again in a moment.";
}

function getSupabaseAdmin() {
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
  if (!projectId) throw new Error("NEXT_PUBLIC_SUPABASE_PROJECT_ID is required for contact storage");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? `https://${projectId}.supabase.co`;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for contact storage");
  return createClient(url, key);
}

export async function submitContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  const { name, email, message, budget } = payload;
  if (!email?.trim() || !message?.trim()) {
    return { ok: false, error: "Email and message are required" };
  }

  const contact = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name?.trim() || "Anonymous",
    email: email.trim(),
    message: message.trim(),
    budget: budget || "Not specified",
    createdAt: new Date().toISOString(),
    read: false,
  };

  const key = `contact:${contact.id}`;

  // 1. Store in Supabase
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(KV_TABLE).upsert({ key, value: contact });
    if (error) throw error;
  } catch (err) {
    console.error("Contact storage error:", err);
    return { ok: false, error: getContactStorageErrorMessage(err) };
  }

  // 2. Send email
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL;
  if (resendKey && toEmail) {
    try {
      const resend = new Resend(resendKey);
      const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";
      await resend.emails.send({
        from,
        to: toEmail,
        subject: `[Portfolio] New message from ${escapeHtml(contact.name)}`,
        html: `
          <p><strong>From:</strong> ${escapeHtml(contact.name)} &lt;${escapeHtml(contact.email)}&gt;</p>
          <p><strong>Budget:</strong> ${escapeHtml(contact.budget)}</p>
          <hr />
          <p>${escapeHtml(contact.message).replace(/\n/g, "<br>")}</p>
        `,
      });
    } catch (err) {
      console.error("Contact email error:", err);
      // Don't fail the request - we saved to DB. Email is best-effort.
    }
  }

  return { ok: true };
}

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  message: string;
  budget?: string;
  createdAt?: string;
  read?: boolean;
};

export async function getContacts(): Promise<ContactRecord[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select("key, value")
    .like("key", "contact:%")
    .order("key", { ascending: false });

  if (error) {
    console.error("Contacts fetch error:", error);
    return [];
  }

  const contacts = (data ?? [])
    .map((r: { key: string; value: unknown }) => r.value as ContactRecord)
    .sort(
      (a, b) =>
        new Date((b.createdAt as string) ?? 0).getTime() - new Date((a.createdAt as string) ?? 0).getTime()
    );
  return contacts;
}

export async function deleteContact(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from(KV_TABLE).delete().eq("key", `contact:${id}`);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("Contact delete error:", err);
    return { ok: false, error: "Couldn't delete this message right now." };
  }
}
