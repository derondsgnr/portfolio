"use client";

import { useState, useEffect } from "react";
import { getContactsForAdmin, deleteContactForAdmin } from "@/app/actions/contact";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Trash2, RefreshCw } from "lucide-react";
import { AdminNotice } from "@/components/admin/admin-notice";
import { getAdminErrorMessage } from "@/lib/admin/feedback";

import type { ContactRecord } from "@/lib/contact";

type Contact = ContactRecord;

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = { initial: Contact[]; initialError?: string | null };

export function ContactsList({ initial, initialError = null }: Props) {
  const [contacts, setContacts] = useState<Contact[]>(initial);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<{ kind: "info" | "success" | "error"; text: string } | null>(
    initialError ? { kind: "error", text: getAdminErrorMessage(initialError) } : null
  );

  async function handleRefresh() {
    setRefreshing(true);
    setNotice({ kind: "info", text: "Refreshing contact messages..." });
    const result = await getContactsForAdmin();
    if (result.ok) {
      setContacts(result.contacts as Contact[]);
      setNotice({ kind: "success", text: "Contact messages refreshed." });
    } else {
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
    setRefreshing(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact?")) return;
    setDeleting(id);
    setNotice(null);
    const result = await deleteContactForAdmin(id);
    if (result.ok) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setExpanded(null);
      setNotice({ kind: "success", text: "Contact message deleted." });
    } else {
      setNotice({ kind: "error", text: getAdminErrorMessage(result.error) });
    }
    setDeleting(null);
  }

  if (contacts.length === 0) {
    return (
      <div className="py-16 text-center">
        {notice ? (
          <div className="mx-auto mb-6 max-w-xl text-left">
            <AdminNotice kind={notice.kind}>{notice.text}</AdminNotice>
          </div>
        ) : null}
        <Mail className="mx-auto mb-4 text-white/20" size={48} />
        <p className="font-mono text-sm text-white/50">No contact messages yet.</p>
        <p className="font-mono text-xs text-white/30 mt-2">
          Messages from the booking drawer will appear here.
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-6 px-4 py-2 border border-white/10 text-white/60 font-mono text-xs hover:bg-white/5 disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notice ? <AdminNotice kind={notice.kind}>{notice.text}</AdminNotice> : null}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/50">{contacts.length} messages</span>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-white/60 font-mono text-xs hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <ul className="space-y-3">
        <AnimatePresence>
          {contacts.map((c) => (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="border border-white/10 bg-white/[0.02]"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full flex items-start justify-between gap-4 text-left p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm text-white/90 truncate">
                    {c.name || "Anonymous"} — {c.email}
                  </p>
                  <p className="font-mono text-xs text-white/40 mt-0.5">
                    {formatDate(c.createdAt as string)}
                    {c.budget && c.budget !== "Not specified" && ` · ${c.budget}`}
                  </p>
                  {expanded !== c.id && (
                    <p className="font-mono text-xs text-white/30 mt-1 truncate">
                      {String(c.message).slice(0, 80)}
                      {(c.message as string).length > 80 ? "…" : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                    disabled={deleting === c.id}
                    className="p-2 text-white/30 hover:text-red-400 disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </button>

              <AnimatePresence>
                {expanded === c.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5 px-4 py-3"
                  >
                    <p
                      className="font-mono text-sm text-white/70 whitespace-pre-wrap"
                      style={{ lineHeight: 1.7 }}
                    >
                      {c.message}
                    </p>
                    <p className="font-mono text-[10px] text-white/30 mt-3">
                      Reply to: <a href={`mailto:${c.email}`} className="text-[#E2B93B]/70 hover:underline">{c.email}</a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
