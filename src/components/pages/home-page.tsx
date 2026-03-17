"use client";

import { SynthesisVariation } from "../v2/v2-synthesis";
import type { Project } from "@/lib/content/projects";

export function HomePage({ projects }: { projects: Project[] }) {
  return <SynthesisVariation projects={projects} />;
}
