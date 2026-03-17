"use client";

import { useRouter } from "next/navigation";
import { getCaseStudyBySlug, ALL_CASE_STUDIES } from "@/data/case-studies";
import { CaseStudyEngine } from "../v2/case-study/case-study-engine";

export function CaseStudyPage({ slug }: { slug: string }) {
  const router = useRouter();
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-6">
        <h1 className="text-4xl md:text-6xl text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          404
        </h1>
        <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "monospace" }}>
          Case study not found
        </p>
        <button
          onClick={() => router.push("/work")}
          className="text-[10px] tracking-[0.2em] text-[#E2B93B] border border-[#E2B93B]/30 px-4 py-2 hover:bg-[#E2B93B]/10 transition-colors"
          style={{ fontFamily: "monospace" }}
        >
          BACK TO WORK
        </button>
      </div>
    );
  }

  return (
    <CaseStudyEngine
      caseStudy={caseStudy}
      allCaseStudies={ALL_CASE_STUDIES}
      onSwitchCaseStudy={(newSlug) => router.push(`/work/${newSlug}`)}
    />
  );
}
