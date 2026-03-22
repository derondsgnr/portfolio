"use client";

/**
 * ADMIN — COMMENTS
 * Moderation view for case study and blog post comments.
 * Fetches real comments from Supabase KV on mount.
 */

import { useState, useEffect, useCallback } from "react";
import { PageHeader, adminCx } from "@/components/admin/admin-primitives";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, Trash2, Flag, MessageSquare, Search, RefreshCw,
} from "lucide-react";
import {
  fetchAllComments,
  updateCommentStatus,
  deleteComment as deleteCommentAction,
} from "@/app/admin/actions";

// ─── Types ─────────────────────────────────────────────────────────
type CommentStatus = "pending" | "approved" | "spam";

interface Comment {
  id: string;
  slug: string;
  name: string;
  text: string;
  createdAt: string;
  status?: CommentStatus;
  _kvKey: string;
}

// ─── Format time ───────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(diff / 3600000);
  if (hr < 24) return `${hr}h ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
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
  const status = comment.status ?? "pending";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`group p-5 border transition-colors ${
        status === "pending"
          ? "border-[#E2B93B]/15 bg-[#E2B93B]/[0.01]"
          : status === "spam"
          ? "border-red-500/10 bg-red-500/[0.01]"
          : "border-white/[0.06]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-['Anton'] text-white/40">
              {comment.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[12px] font-['Instrument_Sans'] text-white/80">{comment.name}</p>
            <p className="text-[10px] text-white/25 font-['Instrument_Sans']">on /{comment.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          <span className="text-[9px] text-white/20 font-['Instrument_Sans']">{timeAgo(comment.createdAt)}</span>
        </div>
      </div>

      {/* Source */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[8px] tracking-[0.12em] uppercase font-['Instrument_Sans'] px-2 py-0.5 bg-blue-500/10 text-blue-400/50">
          Case Study
        </span>
        <a href={`/work/${comment.slug}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-['Instrument_Sans'] text-white/30 hover:text-white/60 transition-colors">
          {comment.slug} →
        </a>
      </div>

      {/* Body */}
      <p className="text-[13px] font-['Instrument_Sans'] text-white/60 leading-relaxed mb-4">
        {comment.text}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {status !== "approved" && (
          <button onClick={onApprove} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-green-400/60 hover:text-green-400 border border-green-500/20 hover:border-green-500/40 px-3 py-1.5 transition-all">
            <Check size={11} /> Approve
          </button>
        )}
        {status !== "spam" && (
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchAllComments();
    if (result.ok) {
      setComments(result.comments as Comment[]);
    } else {
      setError(result.error ?? "Failed to load comments");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadComments(); }, [loadComments]);

  async function handleUpdateStatus(kvKey: string, status: CommentStatus) {
    setComments((c) => c.map((cm) => cm._kvKey === kvKey ? { ...cm, status } : cm));
    await updateCommentStatus(kvKey, status);
  }

  async function handleDelete(kvKey: string) {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setComments((c) => c.filter((cm) => cm._kvKey !== kvKey));
    await deleteCommentAction(kvKey);
  }

  async function approveAll() {
    const pending = comments.filter((c) => (c.status ?? "pending") === "pending");
    setComments((c) => c.map((cm) => (cm.status ?? "pending") === "pending" ? { ...cm, status: "approved" as CommentStatus } : cm));
    await Promise.all(pending.map((c) => updateCommentStatus(c._kvKey, "approved")));
  }

  const filtered = comments.filter((c) => {
    const s = c.status ?? "pending";
    if (statusFilter !== "all" && s !== statusFilter) return false;
    if (search && !c.text.toLowerCase().includes(search.toLowerCase()) && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: comments.length,
    pending: comments.filter((c) => (c.status ?? "pending") === "pending").length,
    approved: comments.filter((c) => c.status === "approved").length,
    spam: comments.filter((c) => c.status === "spam").length,
  };

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

        {counts.pending > 0 && (
          <button onClick={approveAll} className="ml-auto flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-green-400/50 hover:text-green-400 border border-green-500/15 hover:border-green-500/30 px-3 py-1.5 transition-all">
            <Check size={11} /> Approve All Pending ({counts.pending})
          </button>
        )}

        <button onClick={loadComments} className="p-2 text-white/20 hover:text-white/60 border border-white/[0.06] hover:border-white/[0.12] transition-all">
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 border border-red-500/20 bg-red-500/[0.03]">
          <p className="text-[11px] text-red-400/70 font-['Instrument_Sans']">{error}</p>
        </div>
      )}

      {/* Comment list */}
      {isLoading && comments.length === 0 ? (
        <div className="py-16 border border-white/[0.04] text-center">
          <RefreshCw size={20} className="text-white/10 mx-auto mb-3 animate-spin" />
          <p className="text-[11px] text-white/20 font-['Instrument_Sans'] tracking-wider">Loading comments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 border border-white/[0.04] text-center">
          <MessageSquare size={28} className="text-white/10 mx-auto mb-3" />
          <p className="text-[11px] text-white/20 font-['Instrument_Sans'] tracking-wider">
            {search || statusFilter !== "all" ? "No comments match your filters" : "No comments yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((comment) => (
              <CommentCard
                key={comment._kvKey}
                comment={comment}
                onApprove={() => handleUpdateStatus(comment._kvKey, "approved")}
                onSpam={() => handleUpdateStatus(comment._kvKey, "spam")}
                onDelete={() => handleDelete(comment._kvKey)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AdminCommentsPage;
