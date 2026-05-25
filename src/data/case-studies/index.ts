/**
 * CASE STUDY REGISTRY
 * ===================
 * Import all case studies here. The engine and work grid
 * consume this single array.
 *
 * To add a new case study:
 *   1. Create a new .ts file in this folder (copy _template.ts)
 *   2. Import and add to the ALL_CASE_STUDIES array below
 *   3. (Optional) Add a slug field to v2-data.ts V2_PROJECTS for Work page linking
 *   4. That's it — routing and grid auto-populate
 */

import { CAREEREDGE_CASE_STUDY } from "./careeredge";
import { DARA_CASE_STUDY } from "./dara";
import { BRIDGEPAY_CASE_STUDY } from "./bridgepay";
import { URBAN_CASE_STUDY } from "./urban";
import { CUSTOMER_SUPPORT_PLATFORM_CASE_STUDY } from "./customer-support-platform";
import type { CaseStudy } from "../../types/case-study";

export const ALL_CASE_STUDIES: CaseStudy[] = [
  CAREEREDGE_CASE_STUDY,
  BRIDGEPAY_CASE_STUDY,
  URBAN_CASE_STUDY,
  CUSTOMER_SUPPORT_PLATFORM_CASE_STUDY,
  DARA_CASE_STUDY,
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return ALL_CASE_STUDIES.find((cs) => cs.slug === slug);
}
