"use client";

/**
 * ADMIN — COMMENTS
 * Moderation view for case study and blog post comments.
 *
 * TODO (Cursor): Wire to Supabase KV:
 *   GET /make-server-3fa6479f/admin/comments → Comment[]
 *   PATCH /make-server-3fa6479f/admin/comments/:id → update status
 *   DELETE /make-server-3fa6479f/admin/comments/:id → delete
 *
 * Key pattern in KV: comment:{slug}:{id}
 * Comment shape matches the server contract from the case study / blog reader.
 */

import { useState } from "react";
import { PageHeader, adminCx } from "@/components/admin/admin-primitives";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, Trash2, Flag, MessageSquare, Search, RefreshCw,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
type CommentStatus = "pending" | "approved" | "spam";
type ContentType = "case-study" | "blog";

interface Comment {
  id: string;
  contentType: ContentType;
  contentSlug: string;
  contentTitle: string;
  author: string;
  email: string;
  body: string;
  timestamp: number;
  status: CommentStatus;
}

// ─── Mock data (replaced by Supabase fetch) ───────────────────────
const MOCK_COMMENTS: Comment[] = [
  {
    id: "c-01", contentType: "case-study", contentSlug: "kora",
    contentTitle: "Kora", author: "Tunde Akinlade", email: "tunde@example.com",
    body: "The way you handled the cultural tension in the identity system is something I've never seen done this deliberately. The constraint-as-brand-principle angle was genuinely new to me.",
    timestamp: Date.now() - 1000 * 60 * 45, status: "pending",
  },
  {
    id: "c-02", contentType: "blog", contentSlug: "designing-in-the-age-of-ai",
    contentTitle: "Designing in the Age of AI", author: "Amara Osei", email: "amara@example.com",
    body: "This is exactly the piece I needed to read today. 'Taste is not a prompt' is going on my wall.",
    timestamp: Date.now() - 1000 * 60 * 120, status: "approved",
  },
  {
    id: "c-03", contentType: "case-study", contentSlug: "dara",
    contentTitle: "Dara", author: "Femi Balogun", email: "femi@example.com",
    body: "The onboarding rethink is brilliant. Were there any constraints around the therapy session length that influenced the information architecture?",
    timestamp: Date.now() - 1000 * 60 * 60 * 3, status: "pending",
  },
  {
    id: "c-04", contentType: "blog", contentSlug: "why-i-build-what-i-design",
    contentTitle: "Why I Build What I Design", author: "Chidinma Eze", email: "chi@example.com",
    body: "I've been lurking on your portfolio for months waiting for this post. The part about 'design in a different medium' reframed how I think about my own practice.",
    timestamp: Date.now() - 1000 * 60 * 60 * 6, status: "approved",
  },
  {
    id: "c-05", contentType: "case-study", contentSlug: "pulse",
    contentTitle: "Pulse", author: "spambot@offers.ru", email: "spambot@offers.ru",
    body: "Great site! Check out our amazing SEO services at...",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, status: "spam",
  },
];

// ─── Format time ───────────────────────────────────────────────────
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(diff / 3600000);
  if (hr < 24) return `${hr}h ago`;
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: CommentStatus }) {
  const cfg: Record<CommentStatus, { label: string; cls: string }> = {
    pending:  { label: "Pending",  cls: "bg-[#E2B93B]/10 text-[#E2B93B]/70 border-[#E2B93B]/20" },
    approved: { label: "Approved", cls: "bg-green-500/10 text-green-400/70 border-green-500/20" },
    spam:     { label: "Spam",     cls: "bg-red-500/10 text-red-400/70 border-red-500/20" },
  };
  const { label, cls } = cfg[status];
  return (
    <span className={`text-[8px] tracking-[0.15em] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Comment Card ──────────────────────────────────────────────────
function CommentCard({
  comment,
  onApprove,
  onSpam,
  onDelete,
}: {
  comment: Comment;
  onApprove: () => void;
  onSpam: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`group p-5 border transition-colors ${
        comment.status === "pending"
          ? "border-[#E2B93B]/15 bg-[#E2B93B]/[0.01]"
          : comment.status === "spam"
          ? "border-red-500/10 bg-red-500/[0.01]"
          : "border-white/[0.06]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-['Anton'] text-white/40">
              {comment.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[12px] font-['Instrument_Sans'] text-white/80">{comment.author}</p>
            <p className="text-[10px] text-white/25 font-['Instrument_Sans']">{comment.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={comment.status} />
          <span className="text-[9px] text-white/20 font-['Instrument_Sans']">{timeAgo(comment.timestamp)}</span>
        </div>
      </div>

      {/* Source */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[8px] tracking-[0.12em] uppercase font-['Instrument_Sans'] px-2 py-0.5 ${comment.contentType === "case-study" ? "bg-blue-500/10 text-blue-400/50" : "bg-purple-500/10 text-purple-400/50"}`}>
          {comment.contentType === "case-study" ? "Case Study" : "Blog"}
        </span>
        <a href={`/${comment.contentType === "case-study" ? "work" : "blog"}/${comment.contentSlug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-['Instrument_Sans'] text-white/30 hover:text-white/60 transition-colors">
          {comment.contentTitle} →
        </a>
      </div>

      {/* Body */}
      <p className="text-[13px] font-['Instrument_Sans'] text-white/60 leading-relaxed mb-4">
        {comment.body}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {comment.status !== "approved" && (
          <button onClick={onApprove} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-green-400/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/40 px-3 py-1.5 transition-all">
            <Check size={11} /> Approve
          </button>
        )}
        {comment.status !== "spam" && (
          <button onClick={onSpam} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-white/20 hover:text-red-400/60 border border-white/[0.08] hover:border-red-500/20 px-3 py-1.5 transition-all">
            <Flag size={11} /> Spam
          </button>
        )}
        <button onClick={onDelete} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-white/15 hover:text-red-400/70 border border-white/[0.06] hover:border-red-500/20 px-3 py-1.5 transition-all ml-auto">
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </motion.div>
  );
}

// ─── Comments Page ─────────────────────────────────────────────────
function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateStatus(id: string, status: CommentStatus) {
    setComments((c) => c.map((cm) => cm.id === id ? { ...cm, status } : cm));
  }

  function deleteComment(id: string) {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setComments((c) => c.filter((cm) => cm.id !== id));
  }

  const filtered = comments.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.contentType !== typeFilter) return false;
    if (search && !c.body.toLowerCase().includes(search.toLowerCase()) && !c.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => c.status === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    spam: comments.filter((c) => c.status === "spam").length,
  };

  function approveAll() {
    setComments((c) => c.map((cm) => cm.status === "pending" ? { ...cm, status: "approved" as CommentStatus } : cm));
  }

  return (
    <div>
      <PageHeader
        index={9}
        title="Comments"
        description="Moderate reader comments from case studies and blog posts. Approve, mark spam, or delete."
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["all", "pending", "approved", "spam"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-3 border text-left transition-all ${statusFilter === s ? "border-[#E2B93B]/30 bg-[#E2B93B]/[0.04]" : "border-white/[0.06] hover:border-white/[0.12]"}`}
          >
            <p className="font-['Anton'] text-2xl text-white">{counts[s]}</p>
            <p className="text-[9px] tracking-[0.15em] uppercase font-['Instrument_Sans'] text-white/30 mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            className={adminCx.input + " pl-9"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments…"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "case-study", "blog"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as typeof typeFilter)}
              className={`px-3 py-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase transition-colors ${
                typeFilter === t ? "bg-white/[0.08] text-white" : "text-white/25 hover:text-white/50"
              }`}
            >
              {t === "all" ? "All" : t === "case-study" ? "Case Studies" : "Blog"}
            </button>
          ))}
        </div>

        {counts.pending > 0 && (
          <button onClick={approveAll} className="ml-auto flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-green-400/50 hover:text-green-400 border border-green-500/15 hover:border-green-500/30 px-3 py-1.5 transition-all">
            <Check size={11} /> Approve All Pending ({counts.pending})
          </button>
        )}

        <button onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} className="p-2 text-white/20 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] transition-all">
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Comment list */}
      {filtered.length === 0 ? (
        <div className="py-16 border border-white/[0.04] text-center">
          <MessageSquare size={28} className="text-white/10 mx-auto mb-3" />
          <p className="text-[11px] text-white/20 font-['Instrument_Sans'] tracking-wider">
            {search || statusFilter !== "all" || typeFilter !== "all" ? "No comments match your filters" : "No comments yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onApprove={() => updateStatus(comment.id, "approved")}
                onSpam={() => updateStatus(comment.id, "spam")}
                onDelete={() => deleteComment(comment.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-8 p-4 border border-white/[0.05] max-w-2xl">
        <p className="text-[10px] text-white/20 font-['Instrument_Sans'] leading-relaxed">
          <span className="text-white/35">Note:</span> Comments are currently showing mock data. Connect Supabase KV to load real comments (key prefix: <code className="text-[#E2B93B]/40 text-[9px]">comment:</code>).
        </p>
      </div>
    </div>
  );
}

export default AdminCommentsPage;
