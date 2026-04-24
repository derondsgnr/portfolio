"use server";

import { submitContact } from "@/lib/contact";
import { verifyAdminSession } from "@/lib/admin/auth";
import {
  getContacts as getContactsFromDb,
  deleteContact as deleteContactFromDb,
  type ContactRecord,
} from "@/lib/contact";

export async function submitContactForm(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || "Anonymous";
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const budget = (formData.get("budget") as string) || "Not specified";

  return submitContact({ name, email, message, budget });
}

export async function getContactsForAdmin(): Promise<{ ok: boolean; contacts: ContactRecord[]; error?: string }> {
  const ok = await verifyAdminSession();
  if (!ok) {
    return { ok: false, contacts: [], error: "Unauthorized" };
  }

  return { ok: true, contacts: await getContactsFromDb() };
}

export async function deleteContactForAdmin(id: string) {
  const ok = await verifyAdminSession();
  if (!ok) return { ok: false, error: "Unauthorized" };
  return deleteContactFromDb(id);
}
