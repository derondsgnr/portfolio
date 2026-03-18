import { ALL_CASE_STUDIES } from "@/data/case-studies";
import { CaseStudiesClient } from "./case-studies-client";

/**
 * Server component loads case studies at request time — avoids stale client bundle.
 */
export default function AdminCaseStudiesPage() {
  return <CaseStudiesClient initialStudies={ALL_CASE_STUDIES} />;
}
