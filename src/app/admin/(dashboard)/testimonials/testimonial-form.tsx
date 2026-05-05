"use client";

import { useState } from "react";
import type { TestimonialItem } from "@/lib/content/testimonials";

type Props = {
  testimonial?: TestimonialItem;
  onSave: (data: Partial<TestimonialItem>) => void;
  onCancel: () => void;
};

export function TestimonialForm({ testimonial, onSave, onCancel }: Props) {
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [name, setName] = useState(testimonial?.name ?? "");
  const [role, setRole] = useState(testimonial?.role ?? "");
  const [company, setCompany] = useState(testimonial?.company ?? "");
  const [avatar, setAvatar] = useState(testimonial?.avatar ?? "");
  const [companyLogo, setCompanyLogo] = useState(testimonial?.companyLogo ?? "");
  const [status, setStatus] = useState(testimonial?.status ?? "published");
  const [featured, setFeatured] = useState(Boolean(testimonial?.featured));
  const [pinned, setPinned] = useState(Boolean(testimonial?.pinned));

  const inputClass =
    "w-full px-4 py-2 bg-[#111] border border-white/10 text-white placeholder:text-white/40 font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50";
  const labelClass = "block font-mono text-xs text-white/60 mb-1";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave({
      quote,
      name,
      role,
      company,
      avatar: avatar.trim() || null,
      companyLogo: companyLogo.trim() || null,
      status,
      featured,
      pinned,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border border-white/10 bg-white/[0.02] space-y-4 max-w-2xl"
    >
      <h3 className="font-mono text-sm text-white/80 uppercase tracking-wider">
        {testimonial ? "Edit testimonial" : "Add testimonial"}
      </h3>
      <div>
        <label htmlFor="quote" className={labelClass}>
          Quote
        </label>
        <textarea
          id="quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={3}
          required
          className={inputClass}
          placeholder="Client testimonial text…"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            Role
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
            placeholder="CEO"
          />
        </div>
      </div>
      <div>
        <label htmlFor="company" className={labelClass}>
          Company
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
          placeholder="Acme Inc"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="status" className={labelClass}>
            Lifecycle
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft" | "archived")}
            className={inputClass}
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-4 pb-2">
          <label className="font-mono text-xs text-white/70 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Featured
          </label>
          <label className="font-mono text-xs text-white/70 inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-[#E2B93B]"
            />
            Pinned
          </label>
        </div>
      </div>
      <div className="rounded border border-[#E2B93B]/25 bg-[#E2B93B]/[0.05] px-3 py-2">
        <p className="font-mono text-[11px] text-[#E2B93B]/85">
          Image fields are here: add profile photo in Avatar URL and brand mark in Company logo URL.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="avatar" className={labelClass}>
            Avatar URL (user photo)
          </label>
          <input
            id="avatar"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
          {avatar.trim() ? (
            <img
              src={avatar}
              alt=""
              className="mt-2 h-10 w-10 rounded-full object-cover border border-white/10"
            />
          ) : null}
        </div>
        <div>
          <label htmlFor="companyLogo" className={labelClass}>
            Company logo URL
          </label>
          <input
            id="companyLogo"
            type="url"
            value={companyLogo}
            onChange={(e) => setCompanyLogo(e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
          {companyLogo.trim() ? (
            <img
              src={companyLogo}
              alt=""
              className="mt-2 h-8 w-auto object-contain border border-white/10 px-2 py-1"
            />
          ) : null}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-white/20 text-white/70 font-mono text-xs hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
