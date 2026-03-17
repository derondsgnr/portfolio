import { getGitHubFile } from "@/lib/admin/github";
import { getLandingContent } from "@/lib/content/landing";
import { CopyForm } from "./copy-form";

export const dynamic = "force-dynamic";

export default async function AdminCopyPage() {
  let initial: Awaited<ReturnType<typeof getLandingContent>>;
  const gh = await getGitHubFile("content/landing.json");
  if (gh?.content) {
    try {
      const parsed = JSON.parse(gh.content);
      initial = { ...(await getLandingContent()), ...parsed };
    } catch {
      initial = await getLandingContent();
    }
  } else {
    initial = await getLandingContent();
  }

  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">Landing Page Copy</h1>
      <p className="text-white/50 font-mono text-sm mb-8">
        Edit hero, about, and CTA text across the homepage.
      </p>
      <CopyForm initial={initial} />
    </div>
  );
}
