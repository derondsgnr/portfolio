"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { getCommentLoadErrorMessage, getCommentSubmitErrorMessage } from "@/lib/public-feedback";

interface Comment {
  id: string;
  slug: string;
  name: string;
  text: string;
  createdAt: string;
}

interface CommentsSectionProps {
  slug: string;
}

export function CommentsSection({ slug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments/${slug}`);
        const data = await res.json();
        if (res.ok && data.comments) {
          setComments(data.comments);
          setLoadError(null);
        } else {
          setLoadError(getCommentLoadErrorMessage(data.error));
        }
      } catch (err) {
        setLoadError(getCommentLoadErrorMessage());
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [slug]);

  // Submit comment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: name.trim(), text: text.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setName("");
        setText("");
        setShowForm(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setSubmitError(getCommentSubmitErrorMessage(data.error));
        console.error("Error submitting comment:", data.error);
      }
    } catch (err) {
      setSubmitError(getCommentSubmitErrorMessage());
      console.error("Error submitting comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  return (
    <div
      ref={sectionRef}
      className="relative z-10 px-6 md:px-16 lg:px-24 py-16 border-t border-[#1a1a1a]"
    >
      <div className="max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <span
              className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-2"
              style={{ fontFamily: "monospace" }}
            >
              COMMENTS
            </span>
            <h3
              className="text-2xl md:text-3xl text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Thoughts?
            </h3>
          </div>

          {!showForm && !loadError && (
            <button
              onClick={() => setShowForm(true)}
              className="text-[10px] tracking-[0.15em] text-[#0A0A0A] bg-[#E2B93B] px-4 py-2 hover:bg-[#E2B93B]/90 transition-colors"
              style={{ fontFamily: "monospace" }}
            >
              LEAVE A COMMENT
            </button>
          )}
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 border border-[#E2B93B]/30 bg-[#E2B93B]/5 px-4 py-3"
            >
              <span
                className="text-[11px] text-[#E2B93B]"
                style={{ fontFamily: "monospace" }}
              >
                Comment posted. Thanks for the feedback.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {loadError && (
          <div className="mb-6 border border-red-500/30 bg-red-500/5 px-4 py-3">
            <span
              className="text-[11px] text-red-400"
              style={{ fontFamily: "monospace" }}
            >
              {loadError}
            </span>
          </div>
        )}

        {/* Comment form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="mb-10 overflow-hidden"
            >
              <div className="border border-[#222] bg-[#0f0f0f] p-5 space-y-4">
                {/* Name field */}
                <div>
                  <label
                    className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
                    style={{ fontFamily: "monospace" }}
                  >
                    NAME (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full bg-[#0A0A0A] border border-[#222] px-3 py-2 text-sm text-white placeholder-[#333] focus:border-[#E2B93B]/40 focus:outline-none transition-colors"
                    style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                  />
                </div>

                {/* Comment field */}
                <div>
                  <label
                    className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
                    style={{ fontFamily: "monospace" }}
                  >
                    YOUR COMMENT
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What did you think? Questions? Ways I could have done it better?"
                    rows={4}
                    className="w-full bg-[#0A0A0A] border border-[#222] px-3 py-2 text-sm text-white placeholder-[#333] focus:border-[#E2B93B]/40 focus:outline-none transition-colors resize-none"
                    style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
                    required
                  />
                </div>

                {/* Actions */}
                {submitError && (
                  <div className="border border-red-500/30 bg-red-500/5 px-4 py-3">
                    <span
                      className="text-[11px] text-red-400"
                      style={{ fontFamily: "monospace" }}
                    >
                      {submitError}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || !text.trim()}
                    className="text-[10px] tracking-[0.15em] text-[#0A0A0A] bg-[#E2B93B] px-4 py-2 hover:bg-[#E2B93B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    {submitting ? "POSTING..." : "POST"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-[10px] tracking-[0.15em] text-[#555] hover:text-[#999] px-3 py-2 transition-colors"
                    style={{ fontFamily: "monospace" }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Comments list */}
        {loading ? (
          <div className="py-8">
            <span
              className="text-[10px] tracking-[0.15em] text-[#333]"
              style={{ fontFamily: "monospace" }}
            >
              LOADING...
            </span>
          </div>
        ) : loadError ? null : comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-8 border-t border-[#1a1a1a]"
          >
            <p
              className="text-[#333] text-sm"
              style={{ fontFamily: "monospace" }}
            >
              No comments yet. Be the first.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-0">
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className="border-t border-[#1a1a1a] py-5"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span
                    className="text-[11px] text-[#E2B93B]"
                    style={{ fontFamily: "monospace" }}
                  >
                    {comment.name}
                  </span>
                  <span
                    className="text-[9px] tracking-[0.1em] text-[#333]"
                    style={{ fontFamily: "monospace" }}
                  >
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p
                  className="text-[#999] text-sm"
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    lineHeight: 1.7,
                  }}
                >
                  {comment.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
