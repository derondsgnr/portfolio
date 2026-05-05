import type { Metadata } from "next";
import { getBlogSeries, getBlogSeriesBySlug, getSeriesPosts } from "@/lib/content/blog";
import SeriesPageClient from "./series-page-client";

interface Props {
  params: Promise<{ seriesSlug: string }>;
}

export async function generateStaticParams() {
  const series = await getBlogSeries();
  return series.map((item) => ({ seriesSlug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seriesSlug } = await params;
  const series = await getBlogSeriesBySlug(seriesSlug);
  if (!series) return {};
  const posts = await getSeriesPosts(seriesSlug);
  const totalTime = posts.reduce((sum, p) => sum + p.meta.readingTime, 0);
  return {
    title: `${series.title} — Series | derondsgnr`,
    description: `${series.description} ${posts.length} parts, ${totalTime} min total.`,
    openGraph: {
      title: `${series.title} — Series`,
      description: series.description,
      images: series.cover ? [{ url: series.cover }] : undefined,
      type: "website",
    },
  };
}

export default async function Page({ params }: Props) {
  const { seriesSlug } = await params;
  const [series, posts] = await Promise.all([
    getBlogSeriesBySlug(seriesSlug),
    getSeriesPosts(seriesSlug),
  ]);
  return (
    <SeriesPageClient
      series={series ?? null}
      posts={posts}
    />
  );
}
