import { getContentWithGitHubOverlay } from "@/lib/admin/content-overlay";
import { getCaseStudies } from "@/lib/content/case-studies";
import { CaseStudiesClient } from "./case-studies-client";

/**
 * Server component loads case studies at request time — avoids stale client bundle.
 */
export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  const initialStudies = await getContentWithGitHubOverlay(
    "content/case-studies.json",
    () => getCaseStudies({ includeDrafts: true, includeArchived: true }),
    (local, parsed) => (Array.isArray(parsed) ? parsed : local)
  );

  return <CaseStudiesClient initialStudies={initialStudies} />;
}
