import type { Metadata } from "next";
import { getGlobal } from "@/lib/content/global";
import { getAboutContent } from "@/lib/content/about";
import { AboutV2 } from "@/components/v2/pages/about-v2";

/* Preview-only route for the About rework. Lets the owner review the new
   design while the real /about stays hidden. Not indexed. */

export const metadata: Metadata = {
  title: "Preview — About | Deron",
  robots: { index: false, follow: false },
};

export default async function AboutPreviewPage() {
  const [global, aboutContent] = await Promise.all([getGlobal(), getAboutContent()]);
  return <AboutV2 profileImage={global.profileImage} socials={global.socialLinks} content={aboutContent} />;
}
