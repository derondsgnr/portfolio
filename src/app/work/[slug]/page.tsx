import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/pages/case-study-page";
import { getCaseStudyBySlug, getCaseStudies } from "@/lib/content/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: `${cs.meta.title} | derondsgnr`,
    description: cs.meta.summary,
    openGraph: {
      title: cs.meta.title,
      description: cs.meta.summary,
      images: cs.meta.cover ? [{ url: cs.meta.cover }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cs.meta.title,
      description: cs.meta.summary,
      images: cs.meta.cover ? [cs.meta.cover] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [caseStudy, allCaseStudies] = await Promise.all([
    getCaseStudyBySlug(slug),
    getCaseStudies(),
  ]);
  return (
    <CaseStudyPage
      slug={slug}
      caseStudy={caseStudy}
      allCaseStudies={allCaseStudies}
    />
  );
}
