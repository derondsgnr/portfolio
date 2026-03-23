import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/pages/case-study-page";
import { getCaseStudyBySlug } from "@/data/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
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
  return <CaseStudyPage slug={slug} />;
}
