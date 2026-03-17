"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { CaseStudy } from "@/types/case-study";
import { ReaderView } from "./reader-view";
import { CinematicViewer } from "./cinematic-viewer";

/**
 * CASE STUDY ENGINE
 * =================
 * Orchestrates Reader and Cinematic modes.
 *
 * Default: Reader mode (continuous scroll)
 * User can switch to Cinematic mode via button.
 *
 * UX: Cinematic X → /work (complete exit). "READER" → reader mode.
 *
 * TODO (Cursor):
 *   - Scroll-to-top on case study switch (when slug changes via onSwitchCaseStudy)
 *   - Mode should reset to "reader" when switching case studies
 *   - Comments API (comments-section.tsx) has no rate limiting — add server-side
 *     rate limiting (e.g., max 5 comments per IP per hour) in the server endpoint
 */

interface CaseStudyEngineProps {
  caseStudy: CaseStudy;
  allCaseStudies?: CaseStudy[];
  onSwitchCaseStudy?: (slug: string) => void;
}

export function CaseStudyEngine({
  caseStudy,
  allCaseStudies = [],
  onSwitchCaseStudy,
}: CaseStudyEngineProps) {
  const [mode, setMode] = useState<"reader" | "cinematic">("reader");
  const router = useRouter();

  // Reset mode to reader and scroll to top when case study changes
  useEffect(() => {
    setMode("reader");
    window.scrollTo(0, 0);
  }, [caseStudy.slug]);

  return (
    <div className="relative">
      {/* Reader mode (always mounted, hidden when cinematic) */}
      <div style={{ display: mode === "reader" ? "block" : "none" }}>
        <ReaderView
          caseStudy={caseStudy}
          onSwitchToCinematic={() => setMode("cinematic")}
          allCaseStudies={allCaseStudies}
          onSwitchCaseStudy={onSwitchCaseStudy}
        />
      </div>

      {/* Cinematic mode (overlay) */}
      <AnimatePresence>
        {mode === "cinematic" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CinematicViewer
              caseStudy={caseStudy}
              onExit={() => setMode("reader")}
              onNavigateBack={() => router.push("/work")}
              allCaseStudies={allCaseStudies}
              onSwitchCaseStudy={onSwitchCaseStudy}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}