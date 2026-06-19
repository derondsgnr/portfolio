import { getAboutContent } from "@/lib/content/about";
import { AboutForm } from "./about-form";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const initial = await getAboutContent();
  return (
    <div>
      <h1 className="text-2xl font-mono text-white mb-2">About</h1>
      <p className="text-white/50 font-mono text-sm mb-2">
        Edit the About page — copy, films, games, and which sections are shown.
      </p>
      <p className="text-white/35 font-mono text-xs mb-8">
        Wrap a word in *asterisks* to render it gold (e.g. <span className="text-[#E2B93B]/80">I build so *fewer people* get left.</span>).
        Toggle sections on/off at the bottom — hidden sections vanish from the page.
      </p>
      <AboutForm initial={initial} />
    </div>
  );
}
