import { CaseStudyPage } from "@/components/pages/case-study-page";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CaseStudyPage slug={slug} />;
}
