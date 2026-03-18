import { readFile } from "fs/promises";
import path from "path";
import { DEFAULT_PROJECTS } from "./defaults";

export type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  slug: string;
};

export async function getProjects(): Promise<Project[]> {
  try {
    const filePath = path.join(process.cwd(), "content", "projects.json");
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}
