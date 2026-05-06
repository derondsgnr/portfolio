"use client";

import dynamic from "next/dynamic";
import { SynthesisVariation } from "../v2/v2-synthesis";

const PageBuilder = dynamic(() => import("../v2/page-builder").then((m) => ({ default: m.PageBuilder })), {
  ssr: true,
});
import type { BlogPost } from "@/types/blog";
import type { Project } from "@/lib/content/projects";
import type { LandingContent } from "@/lib/content/landing";
import type { PageConfig } from "@/lib/content/pages";
import type { PageCopy } from "@/lib/content/copy";

export function HomePage({
  projects,
  landing,
  pageConfig,
  pageCopy,
  latestPosts,
}: {
  projects: Project[];
  landing: LandingContent;
  pageConfig: PageConfig;
  pageCopy?: PageCopy;
  latestPosts?: BlogPost[];
}) {
  if (pageConfig.sections.length > 0) {
    return (
      <PageBuilder
        pageConfig={pageConfig}
        projects={projects}
        landing={landing}
        pageCopy={pageCopy}
        latestPosts={latestPosts}
      />
    );
  }
  return <SynthesisVariation projects={projects} landing={landing} />;
}
