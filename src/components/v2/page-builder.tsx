"use client";

import { useState, useEffect } from "react";
import { SignalGrid, ScanLineOverlay, CipherAmbientGrid } from "./shared/texture-layers";
import { AnimatePresence, motion } from "motion/react";
import { SectionRenderer } from "@/lib/section-registry";
import type { PageConfig } from "@/lib/content/pages";
import type { Project } from "@/lib/content/projects";
import type { LandingContent } from "@/lib/content/landing";

function SimpleLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(async () => {
      if (typeof window !== "undefined") {
        const { playSound, ensureAudioResumed } = await import("@/lib/sound");
        await ensureAudioResumed();
        playSound("loaderComplete");
      }
      onComplete();
    }, 1600);
    return () => clearTimeout(t);
  }, [onComplete]);
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex items-center justify-center"
      exit={{ x: "100%" }}
      transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
    >
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: "100vw" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-1/2 h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #E2B93B, transparent)" }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, times: [0, 0.2, 0.7, 1] }}
        style={{
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}
      >
        Initializing
      </motion.span>
    </motion.div>
  );
}

type Props = {
  pageConfig: PageConfig;
  projects: Project[];
  landing: LandingContent;
};

export function PageBuilder({ pageConfig, projects, landing }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative bg-[#0A0A0A]">
      <SignalGrid />
      <ScanLineOverlay />
      <CipherAmbientGrid />

      <AnimatePresence>
        {!loaded && <SimpleLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-[2]"
        >
          {pageConfig.sections.map(({ id, variation }) => (
            <SectionRenderer
              key={`${id}-${variation}`}
              id={id}
              variation={variation}
              projects={projects}
              landing={landing}
            />
          ))}
        </motion.div>
      )}
    </main>
  );
}
