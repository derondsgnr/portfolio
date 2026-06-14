"use client";

import dynamic from "next/dynamic";
import { AboutV2 } from "../v2/pages/about-v2";

const PageBuilder = dynamic(() => import("../v2/page-builder").then((m) => ({ default: m.PageBuilder })), {
  ssr: true,
});
import type { Project } from "@/lib/content/projects";
import type { PageCopy } from "@/lib/content/copy";
import type { LandingContent } from "@/lib/content/landing";
import type { PageConfig } from "@/lib/content/pages";

export function AboutPage({
  copy,
  pageConfig,
  landing,
  projects,
  profileImage,
}: {
  copy?: PageCopy;
  pageConfig: PageConfig;
  landing: LandingContent;
  projects?: Project[];
  profileImage?: string;
}) {
  if (pageConfig.sections.length > 0) {
    return (
      <PageBuilder
        pageConfig={pageConfig}
        projects={projects ?? []}
        landing={landing}
        pageCopy={copy}
      />
    );
  }
  return <AboutV2 profileImage={profileImage} />;
}
