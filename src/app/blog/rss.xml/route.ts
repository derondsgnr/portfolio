import type { Slide } from "@/types/case-study";
import { getBlogPosts } from "@/lib/content/blog";

export const dynamic = "force-dynamic";

function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "https://derondsgnr.com";

  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function paragraph(value?: string): string {
  if (!value?.trim()) return "";
  return `<p>${escapeXml(value.trim())}</p>`;
}

function slideToHtml(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return `${paragraph(slide.headline)}${paragraph(slide.subtitle)}`;
    case "section-break":
      return `${paragraph(slide.actTitle)}${paragraph(slide.subtitle)}`;
    case "narrative":
      return `${paragraph(slide.headline)}${paragraph(slide.body)}${paragraph(slide.annotation)}`;
    case "quote":
      return `<blockquote>${escapeXml(slide.quote)}</blockquote>${paragraph(slide.attribution)}`;
    case "insight":
      return `${paragraph(slide.headline)}${paragraph(slide.body)}${paragraph(slide.insightText)}`;
    case "metric":
      return `${paragraph(slide.headline)}${slide.metrics
        .map((metric) => paragraph(`${metric.value} ${metric.label}${metric.delta ? ` (${metric.delta})` : ""}`))
        .join("")}`;
    case "single-mockup":
    case "embed":
    case "video":
      return `${paragraph(slide.headline)}${paragraph(slide.caption)}`;
    case "comparison":
    case "flow":
    case "mockup-gallery":
    case "process":
      return paragraph(slide.headline);
    default:
      return "";
  }
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getBlogPosts();
  const latestDate = posts[0]?.meta.date ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`;
      const body = post.slides.map(slideToHtml).join("");
      const content = body || paragraph(post.meta.summary);

      return `
        <item>
          <title>${escapeXml(post.meta.title)}</title>
          <link>${escapeXml(link)}</link>
          <guid isPermaLink="true">${escapeXml(link)}</guid>
          <pubDate>${new Date(post.meta.date).toUTCString()}</pubDate>
          <description>${escapeXml(post.meta.summary)}</description>
          <category>${escapeXml(post.meta.category)}</category>
          <content:encoded><![CDATA[${content}<p><a href="${escapeXml(link)}">Read on derondsgnr.com</a></p>]]></content:encoded>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>derondsgnr Writing</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    <description>Notes from the intersection of design, code, and craft.</description>
    <language>en</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
