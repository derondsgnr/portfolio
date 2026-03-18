"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useBooking } from "./booking-context";
import { submitContactForm } from "@/app/actions/contact";

/* ═══════════════════════════════════════════════════════════════
   BOOKING DRAWER — Hybrid "Book a Call" + "Send a Message"

   Architecture:
     - Full-screen overlay with slide-up drawer
     - Two tabs: Cal.com embed (primary) + Contact form (secondary)
     - Cal.com loads via iframe (zero npm dependency)
     - Contact form submits to Supabase KV via server
     - Triggered from anywhere via useBooking() context

   Design DNA:
     - Dark foundation, gold accents, monospace labels
     - Synthesis aesthetic throughout
   ═══════════════════════════════════════════════════════════════ */

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "";

const BUDGET_OPTIONS = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Not sure yet",
];

export function BookingDrawer() {
  const { isOpen, activeTab, close, setTab } = useBooking();
  const drawerRef = useRef<HTMLDivElement>(null);
  const hasBooking = Boolean(BOOKING_URL);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-[#0A0A0A] border-t border-[#E2B93B]/20 rounded-t-2xl max-h-[92vh] overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Book a call or send a message"
          >
            {/* ─── Handle bar (mobile drag hint) ─── */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#333]" />
            </div>

            {/* ─── Header ─── */}
            <div className="px-6 md:px-10 pt-2 pb-4 flex items-center justify-between">
              <div>
                <span
                  className="text-[9px] tracking-[0.3em] text-[#E2B93B] block mb-1"
                  style={{ fontFamily: "monospace" }}
                >
                  [OPEN_CHANNEL]
                </span>
                <h2
                  className="text-2xl md:text-3xl text-white"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                  }}
                >
                  LET'S BUILD
                </h2>
              </div>
              <button
                onClick={close}
                className="w-10 h-10 flex items-center justify-center border border-[#222] hover:border-[#E2B93B]/40 text-[#666] hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ─── Tab switcher (only when booking URL is configured) ─── */}
            {hasBooking && (
            <div className="px-6 md:px-10 flex items-center gap-1 mb-4">
              <button
                onClick={() => setTab("book")}
                  className="px-4 py-2 text-[10px] tracking-[0.15em] transition-all duration-300"
                  style={{
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    color: activeTab === "book" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
                    background: activeTab === "book" ? "#E2B93B" : "transparent",
                    border: activeTab === "book" ? "1px solid #E2B93B" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  BOOK A CALL
                </button>
              <button
                onClick={() => setTab("message")}
                className="px-4 py-2 text-[10px] tracking-[0.15em] transition-all duration-300"
                style={{
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  color: activeTab === "message" ? "#0A0A0A" : "rgba(255,255,255,0.3)",
                  background: activeTab === "message" ? "#E2B93B" : "transparent",
                  border: activeTab === "message" ? "1px solid #E2B93B" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                SEND A MESSAGE
              </button>
            </div>
            )}

            {/* ─── Content ─── */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-8">
              <AnimatePresence mode="wait">
                {activeTab === "book" && hasBooking ? (
                  <motion.div
                    key="book"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CalEmbed url={BOOKING_URL} />
                  </motion.div>
                ) : activeTab === "message" || !hasBooking ? (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ContactForm onSuccess={close} />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Booking embed (Calendly or Cal.com) ────────────────────── */
function CalEmbed({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <p
        className="text-[#666] text-sm mb-2"
        style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
      >
        Free 30-minute discovery call. Pick a time that works for you.
      </p>

      {/* Cal.com iframe */}
      <div
        className="relative w-full bg-[#111] border border-[#1a1a1a] rounded-lg overflow-hidden"
        style={{ minHeight: "520px" }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Loading pulse */}
            <div className="w-6 h-6 border-2 border-[#E2B93B]/30 border-t-[#E2B93B] rounded-full animate-spin" />
            <span
              className="text-[10px] tracking-[0.2em] text-[#555]"
              style={{ fontFamily: "monospace" }}
            >
              LOADING CALENDAR...
            </span>
          </div>
        )}
        <iframe
          src={
            url.includes("cal.com")
              ? `${url}?embed=true&theme=dark&layout=month_view`
              : url
          }
          className="w-full border-0"
          style={{
            height: "520px",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
          onLoad={() => setLoaded(true)}
          title="Book a call"
          allow="payment"
        />
      </div>

      {/* Fallback direct link */}
      <div className="flex items-center justify-between pt-2">
        <span
          className="text-[9px] tracking-[0.15em] text-[#333]"
          style={{ fontFamily: "monospace" }}
        >
          {url.includes("calendly.com") ? "POWERED BY CALENDLY" : "POWERED BY CAL.COM"}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.15em] text-[#E2B93B]/50 hover:text-[#E2B93B] transition-colors"
          style={{ fontFamily: "monospace" }}
        >
          OPEN IN NEW TAB &rarr;
        </a>
      </div>
    </div>
  );
}

/* ─── Contact Form ───────────────────────────────────────────── */
function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("message", message);
      formData.set("budget", budget);

      const result = await submitContactForm(formData);
      if (result.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
          // Reset after close animation
          setTimeout(() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setMessage("");
            setBudget("");
          }, 400);
        }, 2000);
      } else {
        setError(result.error ?? "Something went wrong. Try again.");
        console.error("Contact form error:", result.error);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Contact form network error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-16 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-6 border-2 border-[#E2B93B] rounded-full flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E2B93B" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3
          className="text-xl text-white mb-2"
          style={{ fontFamily: "'Anton', sans-serif", textTransform: "uppercase", letterSpacing: "-0.02em" }}
        >
          MESSAGE SENT
        </h3>
        <p
          className="text-[#666] text-sm"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          I'll get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <p
        className="text-[#666] text-sm mb-6"
        style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
      >
        Not ready for a call? Drop me a message and I'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label
            className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
            style={{ fontFamily: "monospace" }}
          >
            NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-[#0f0f0f] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#333] focus:border-[#E2B93B]/40 focus:outline-none transition-colors"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          />
        </div>

        {/* Email */}
        <div>
          <label
            className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
            style={{ fontFamily: "monospace" }}
          >
            EMAIL <span className="text-[#E2B93B]/50">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full bg-[#0f0f0f] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#333] focus:border-[#E2B93B]/40 focus:outline-none transition-colors"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          />
        </div>

        {/* Budget */}
        <div>
          <label
            className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
            style={{ fontFamily: "monospace" }}
          >
            BUDGET RANGE <span className="text-[#333]">(OPTIONAL)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setBudget(budget === opt ? "" : opt)}
                className="px-3 py-1.5 text-[10px] tracking-[0.1em] transition-all duration-200"
                style={{
                  fontFamily: "monospace",
                  color: budget === opt ? "#0A0A0A" : "rgba(255,255,255,0.3)",
                  background: budget === opt ? "#E2B93B" : "transparent",
                  border: budget === opt ? "1px solid #E2B93B" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            className="text-[10px] tracking-[0.15em] text-[#555] block mb-2"
            style={{ fontFamily: "monospace" }}
          >
            YOUR MESSAGE <span className="text-[#E2B93B]/50">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your project — what problem you're solving, timeline, any context that helps."
            rows={5}
            required
            className="w-full bg-[#0f0f0f] border border-[#222] px-4 py-3 text-sm text-white placeholder-[#333] focus:border-[#E2B93B]/40 focus:outline-none transition-colors resize-none"
            style={{ fontFamily: "'Instrument Sans', sans-serif", lineHeight: 1.7 }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/5 px-4 py-3">
            <span className="text-[11px] text-red-400" style={{ fontFamily: "monospace" }}>
              {error}
            </span>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting || !email.trim() || !message.trim()}
            className="text-[10px] tracking-[0.15em] text-[#0A0A0A] bg-[#E2B93B] px-6 py-3 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "monospace" }}
          >
            {submitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
          <span
            className="text-[9px] tracking-[0.1em] text-[#333]"
            style={{ fontFamily: "monospace" }}
          >
            TYPICALLY RESPONDS WITHIN 24H
          </span>
        </div>
      </form>
    </div>
  );
}
