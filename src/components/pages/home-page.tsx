"use client";

import { SynthesisVariation } from "../v2/v2-synthesis";
import { PageBuilder } from "../v2/page-builder";
import type { Project } from "@/lib/content/projects";
import type { LandingContent } from "@/lib/content/landing";
import type { PageConfig } from "@/lib/content/pages";

export function HomePage({
  projects,
  landing,
  pageConfig,
}: {
  projects: Project[];
  landing: LandingContent;
  pageConfig: PageConfig;
}) {
  if (pageConfig.sections.length > 0) {
    return <PageBuilder pageConfig={pageConfig} projects={projects} landing={landing} />;
  }
  return <SynthesisVariation projects={projects} landing={landing} />;
}
