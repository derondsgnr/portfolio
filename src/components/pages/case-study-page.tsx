"use client";

import { useRouter } from "next/navigation";
import { getCaseStudyBySlug, ALL_CASE_STUDIES } from "@/data/case-studies";
import { CaseStudyEngine } from "../v2/case-study/case-study-engine";
import { notFound } from "next/navigation";

export function CaseStudyPage({ slug }: { slug: string }) {
  const router = useRouter();
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <CaseStudyEngine
      caseStudy={caseStudy}
      allCaseStudies={ALL_CASE_STUDIES}
      onSwitchCaseStudy={(newSlug) => router.push(`/work/${newSlug}`)}
    />
  );
}
