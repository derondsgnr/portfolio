import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getTestimonials } from "@/lib/content/testimonials";
import { TestimonialsList } from "./testimonials-list";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const initial = await getContentWithGitHubOverlay(
    "content/testimonials.json",
    getTestimonials,
    (local, parsed) => {
      if (!Array.isArray(parsed)) return local;
      return parsed.map((p: unknown, i: number) => {
        const t = p as Record<string, unknown>;
        return {
          id: t?.id ?? i + 1,
          quote: String(t?.quote ?? ""),
          name: String(t?.name ?? ""),
          role: String(t?.role ?? ""),
          company: String(t?.company ?? ""),
          avatar: (t?.avatar as string) ?? null,
          companyLogo: (t?.companyLogo as string) ?? null,
        };
      }) as Awaited<ReturnType<typeof getTestimonials>>;
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Testimonials</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Manage homepage testimonials. Add quote, name, role, company, avatar, and company logo. Also used in case study outcomes.
      </p>
      <TestimonialsList initial={initial} />
    </div>
  );
}
