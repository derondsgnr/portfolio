"use client";

import { useRouter } from "next/navigation";
import { CaseStudyEngine } from "../v2/case-study/case-study-engine";
import { notFound } from "next/navigation";
import type { CaseStudy } from "@/types/case-study";

export function CaseStudyPage({
  slug,
  caseStudy,
  allCaseStudies,
}: {
  slug: string;
  caseStudy?: CaseStudy;
  allCaseStudies: CaseStudy[];
}) {
  const router = useRouter();

  if (!caseStudy || (caseStudy.status ?? "published") !== "published") {
    notFound();
  }

  return (
    <CaseStudyEngine
      caseStudy={caseStudy}
      allCaseStudies={allCaseStudies}
      onSwitchCaseStudy={(newSlug) => router.push(`/work/${newSlug}`)}
    />
  );
}
