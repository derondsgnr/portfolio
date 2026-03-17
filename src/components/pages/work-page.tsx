"use client";

import { SynthesisWorkPage } from "../v2/pages/synthesis-pages";
import type { Project } from "@/lib/content/projects";

export function WorkPage({ projects }: { projects: Project[] }) {
  return <SynthesisWorkPage projects={projects} />;
}
