"use server";

import { headers } from "next/headers";
import { submitContact } from "@/lib/contact";
import { getAdminSession } from "@/lib/admin/auth";
import { hasAdminCapability } from "@/lib/admin/permissions";
import { consumeRateLimit, getClientIp, isIpAllowed, isSameOriginMutation } from "@/lib/admin/security";
import {
  getContacts as getContactsFromDb,
  deleteContact as deleteContactFromDb,
  markContactRead as markContactReadInDb,
  type ContactRecord,
} from "@/lib/contact";

async function requireAdminContactAccess(mutation = false) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  if (!isIpAllowed(ip)) return { ok: false, error: "Forbidden" as const };

  const session = await getAdminSession();
  if (!session.authenticated || !session.role) return { ok: false, error: "Unauthorized" as const };
  if (!hasAdminCapability(session.role, "contacts")) return { ok: false, error: "Forbidden" as const };

  if (mutation) {
    if (!isSameOriginMutation(hdrs)) return { ok: false, error: "Invalid origin" as const };
    const limiter = consumeRateLimit("admin-contact-mutation", ip, 120, 60_000);
    if (!limiter.ok) return { ok: false, error: "Too many requests" as const };
  }

  return { ok: true } as const;
}

export async function submitContactForm(formData: FormData) {
  const name = (formData.get("name") as string)?.trim() || "Anonymous";
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const budget = (formData.get("budget") as string) || "Not specified";

  return submitContact({ name, email, message, budget });
}

export async function getContactsForAdmin(): Promise<{ ok: boolean; contacts: ContactRecord[]; error?: string }> {
  const guard = await requireAdminContactAccess();
  if (!guard.ok) {
    return { ok: false, contacts: [], error: guard.error };
  }

  return { ok: true, contacts: await getContactsFromDb() };
}

export async function deleteContactForAdmin(id: string) {
  const guard = await requireAdminContactAccess(true);
  if (!guard.ok) return { ok: false, error: guard.error };
  return deleteContactFromDb(id);
}

export async function markContactReadForAdmin(id: string, read = true) {
  const guard = await requireAdminContactAccess(true);
  if (!guard.ok) return { ok: false, error: guard.error };
  return markContactReadInDb(id, read);
}
