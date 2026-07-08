/**
 * Pill icon system — maps a category/tag string to a filled Phosphor icon + an
 * accent color. Powers <PillChip>. The label carries no color (stays neutral);
 * the icon carries the accent, which keeps every hue legible on the dark chip.
 *
 * Resolution order: exact-ish keyword rules (first match wins), then a
 * deterministic fallback so any freeform tag still gets a stable icon + color.
 */
import {
  Brain, PenNib, FlowArrow, Notebook, Wrench, Buildings, Heartbeat, Sparkle,
  Note, Code, CurrencyDollar, Receipt, DeviceMobile, Browser, Stack, Cube,
  MagnifyingGlass, Compass, UsersThree, Car, Briefcase, Tag, SquaresFour,
  type Icon,
} from "@phosphor-icons/react";
import { pillFor } from "./pill-palette";

export type PillIconSpec = { Icon: Icon; color: string };

const LIME = "#ECFF95";
const PURPLE = "#904FD3";
const ORANGE = "#E5A94E";
const MINT = "#95FFA5";
const PINK = "#D34F79";

/** Ordered — first pattern to match the normalized key wins. Specific first. */
const RULES: [RegExp, Icon, string][] = [
  [/^all$/, SquaresFour, LIME],
  [/think|idea|mind/, Brain, PURPLE],
  [/case ?note|notebook/, Notebook, ORANGE],
  [/design system|\btokens?\b|handoff|component/, Stack, ORANGE],
  [/craft|brand|logo|type|visual/, PenNib, LIME],
  [/research|discovery|insight|finding/, MagnifyingGlass, MINT],
  [/strateg|roadmap|vision|positioning/, Compass, ORANGE],
  [/\bai\b|ml\b|gpt|llm|model|agent/, Sparkle, MINT],
  [/fintech|payment|bank|escrow|wallet|money|finance|payout/, CurrencyDollar, MINT],
  [/tax|invoice|receipt|billing/, Receipt, ORANGE],
  [/mobile|\bios\b|android|app\b/, DeviceMobile, PURPLE],
  [/web|browser|site|landing/, Browser, PURPLE],
  [/engineer|full-?stack|\bdev\b|code|api|\bbuild\b|ship/, Code, ORANGE],
  [/\btools?\b/, Wrench, PINK],
  [/team|\bb2b\b|people|users?|community|multi-?sided/, UsersThree, PURPLE],
  [/process|workflow|pipeline|\bflow\b|system/, FlowArrow, MINT],
  [/transport|rideshare|mobility|logistics|\bcar\b/, Car, ORANGE],
  [/career|hiring|job|work ?os|resume/, Briefcase, PURPLE],
  [/wellness|health|life|fitness|mind/, Heartbeat, PINK],
  [/\bux\b|\bui\b|interaction|prototyp|usability/, PenNib, PURPLE],
  [/product/, Cube, LIME],
  [/industr|business|company|market|enterprise/, Buildings, PURPLE],
  [/note|writing|essay|journal|word/, Note, ORANGE],
];

/** Resolve a category/tag to its icon + color. Never returns null. */
export function pillIconFor(key: string): PillIconSpec {
  const norm = key.trim().toLowerCase();
  for (const [re, Icon, color] of RULES) {
    if (re.test(norm)) return { Icon, color };
  }
  return { Icon: Tag, color: pillFor(key) };
}
