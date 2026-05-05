"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

type FeatureGuide = {
  title: string;
  canDo: string;
  youNeedToDo: string;
  limits: string;
};

const GUIDE_MAP: Record<string, FeatureGuide> = {
  "/admin": {
    title: "Dashboard",
    canDo: "See your core admin control-room cards and jump into each subsystem.",
    youNeedToDo: "Use this as the entry point; click into a feature to perform edits.",
    limits: "It does not edit content directly.",
  },
  "/admin/copy": {
    title: "Copy",
    canDo: "Edit global site copy blocks used across key pages.",
    youNeedToDo: "Save changes from the copy form and review impacted pages.",
    limits: "It does not rewrite copy automatically by AI.",
  },
  "/admin/case-studies": {
    title: "Case Studies",
    canDo: "Manage case-study content, structure, and presentation data.",
    youNeedToDo: "Review visual output after updates, especially mockups/media.",
    limits: "Missing assets are flagged but not auto-restored.",
  },
  "/admin/testimonials": {
    title: "Testimonials",
    canDo: "Create, edit, and reorder social proof/testimonial content.",
    youNeedToDo: "Curate quality and keep statements concise and credible.",
    limits: "No automatic sentiment verification or legal checks.",
  },
  "/admin/contacts": {
    title: "Contacts",
    canDo: "View contact submissions and monitor inbound interest.",
    youNeedToDo:
      "Set NEXT_PUBLIC_BOOKING_URL, CONTACT_EMAIL, and RESEND_API_KEY in env vars, then respond manually or connect outbound workflows.",
    limits:
      "Without booking/email env setup, only the message storage flow works; no auto-follow-up sequence is included by default.",
  },
  "/admin/blog": {
    title: "Blog",
    canDo: "Manage blog entries, metadata, and editorial structure.",
    youNeedToDo: "Publish and QA post formatting manually before sharing.",
    limits: "No automated publishing pipeline built in here.",
  },
  "/admin/now": {
    title: "Now",
    canDo: "Update your current-status/public-now page content.",
    youNeedToDo: "Keep updates concise and current.",
    limits: "No scheduled auto-refresh from external sources.",
  },
  "/admin/comments": {
    title: "Comments",
    canDo: "Moderate and review community comments.",
    youNeedToDo: "Approve/remove entries and monitor moderation hygiene.",
    limits: "No fully autonomous moderation without extra policy tooling.",
  },
  "/admin/bookmarks": {
    title: "Bookmarks",
    canDo: "Store and categorize inspiration/bookmark references.",
    youNeedToDo: "Curate and tag items for retrieval quality.",
    limits: "No automatic scraping/downloading from social platforms.",
  },
  "/admin/knowledge": {
    title: "Knowledge Vault",
    canDo: "Queue links, process with local AI, retry/pause batches, and search semantically.",
    youNeedToDo: "Add raw source text and handle media capture manually.",
    limits: "Auto media ingestion and cloud pipeline are not yet fully automated.",
  },
  "/admin/growth": {
    title: "Growth OS",
    canDo: "Track growth state, automation health, and pipeline overview.",
    youNeedToDo: "Connect real automation payloads and verify heartbeat signals.",
    limits: "Without connected workflows, this remains a control shell.",
  },
  "/admin/content-queue": {
    title: "Content Queue",
    canDo: "Plan and monitor queued content execution.",
    youNeedToDo: "Prioritize, status items, and route production manually.",
    limits: "No full end-to-end autopublish configured by default.",
  },
  "/admin/leads": {
    title: "Leads",
    canDo: "Track incoming leads and outreach state.",
    youNeedToDo: "Qualify leads and move them through your own sales routine.",
    limits: "No built-in CRM automation depth unless integrated externally.",
  },
  "/admin/outreach": {
    title: "Outreach",
    canDo: "Organize outreach targets and progression.",
    youNeedToDo: "Execute messaging and follow-ups.",
    limits: "No autonomous multichannel sender enabled by default.",
  },
  "/admin/automations": {
    title: "Automations",
    canDo: "Monitor and manage automation-related entries and status.",
    youNeedToDo: "Connect your actual workflow engine/webhooks.",
    limits: "UI alone does not run automations without backend flows.",
  },
  "/admin/media": {
    title: "Media + Cloudinary Workflow",
    canDo: "Update image/video URLs for hero assets, craft items, and explorations.",
    youNeedToDo:
      "Upload files to Cloudinary, copy each Secure URL, paste into matching fields in Media, then save each edited section.",
    limits: "This panel stores URLs only; it does not upload files to Cloudinary for you.",
  },
  "/admin/presentation-studio": {
    title: "Presentation Studio",
    canDo: "Curate selected references into presentation-ready inspiration sets.",
    youNeedToDo: "Select/compose high-signal references before presenting.",
    limits: "No one-click fully generated deck pipeline yet.",
  },
};

const DEFAULT_GUIDE: FeatureGuide = {
  title: "Admin Feature",
  canDo: "Manage this section from a unified admin workflow.",
  youNeedToDo: "Review outputs after edits before considering complete.",
  limits: "Automation depth depends on connected backend/services.",
};

export function AdminFeatureGuide() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const guide = useMemo(() => {
    const exact = GUIDE_MAP[pathname ?? ""];
    if (exact) return exact;
    const match = Object.entries(GUIDE_MAP).find(([prefix]) => pathname?.startsWith(prefix));
    return match ? match[1] : DEFAULT_GUIDE;
  }, [pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[340px] max-w-[calc(100vw-2rem)] border border-white/[0.10] bg-[#0A0A0A]/95 backdrop-blur-sm shadow-2xl">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-white/[0.08]"
      >
        <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#E2B93B]/85 font-['Instrument_Sans']">
          <BookOpen size={12} />
          How This Feature Works
        </span>
        <span className="text-white/50">{open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}</span>
      </button>

      {open && (
        <div className="p-4 space-y-3">
          <p className="text-sm text-white font-['Anton'] tracking-[0.06em] uppercase">{guide.title}</p>
          <div className="space-y-2">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">Can do</p>
            <p className="text-sm text-white/75 leading-relaxed">{guide.canDo}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">You need to do</p>
            <p className="text-sm text-white/75 leading-relaxed">{guide.youNeedToDo}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">Current limits</p>
            <p className="text-sm text-white/75 leading-relaxed">{guide.limits}</p>
          </div>
        </div>
      )}
    </div>
  );
}
