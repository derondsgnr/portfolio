"use client";

import { SynthesisHeroSection, SynthesisAboutSection, SynthesisCTASection } from "@/components/v2/sections";
import { VoidHero, VoidProcess, VoidWork, VoidPhilosophy, VoidTestimonial, VoidCTA } from "@/components/v2/v2-void";
import { SignalHero, SignalProcess, SignalWork, SignalServices, SignalTestimonials, SignalCTA } from "@/components/v2/v2-signal";
import { CipherHero, CipherWork, CipherServices, CipherPhilosophy, CipherTestimonials, CipherCTA } from "@/components/v2/v2-cipher";
import { SynthesisProcess, SynthesisCapabilities, SynthesisWork, SynthesisPhilosophy, SynthesisTestimonials } from "@/components/v2/v2-synthesis";
import type { Project } from "@/lib/content/projects";
import type { LandingContent } from "@/lib/content/landing";

type SectionProps = {
  projects?: Project[];
  landing?: LandingContent;
};

const REGISTRY: Record<string, React.ComponentType<SectionProps>> = {
  hero_synthesis: (p) => (
    <SynthesisHeroSection
      name={p.landing?.hero.name}
      tagline={p.landing?.hero.tagline}
      philosophy={p.landing?.hero.philosophy}
    />
  ),
  hero_void: () => <VoidHero />,
  hero_signal: () => <SignalHero />,
  hero_cipher: () => <CipherHero />,

  about_synthesis: (p) => (
    <SynthesisAboutSection
      label={p.landing?.about.label}
      headline={p.landing?.about.headline}
      headlineAccent={p.landing?.about.headlineAccent}
      bioParagraphs={p.landing?.about.bioParagraphs}
      stats={p.landing?.about.stats}
    />
  ),

  capabilities_synthesis: () => <SynthesisCapabilities />,

  process_synthesis: () => <SynthesisProcess />,
  process_void: () => <VoidProcess />,
  process_signal: () => <SignalProcess />,

  work_synthesis: (p) => <SynthesisWork projects={p.projects} />,
  work_void: (p) => <VoidWork projects={p.projects} />,
  work_signal: (p) => <SignalWork projects={p.projects} />,
  work_cipher: (p) => <CipherWork projects={p.projects} />,

  philosophy_synthesis: () => <SynthesisPhilosophy />,
  philosophy_void: () => <VoidPhilosophy />,
  philosophy_cipher: () => <CipherPhilosophy />,

  services_signal: () => <SignalServices />,
  services_cipher: () => <CipherServices />,

  testimonials_synthesis: () => <SynthesisTestimonials />,
  testimonials_void: () => <VoidTestimonial />,
  testimonials_signal: () => <SignalTestimonials />,
  testimonials_cipher: () => <CipherTestimonials />,

  cta_synthesis: (p) => (
    <SynthesisCTASection
      label={p.landing?.cta.label}
      headline={p.landing?.cta.headline}
      ctaPrimary={p.landing?.cta.ctaPrimary}
      ctaSecondary={p.landing?.cta.ctaSecondary}
      subtext={p.landing?.cta.subtext}
      tagline={p.landing?.cta.tagline}
    />
  ),
  cta_void: () => <VoidCTA />,
  cta_signal: () => <SignalCTA />,
  cta_cipher: () => <CipherCTA />,
};

export const SECTION_OPTIONS: Record<string, string[]> = {
  hero: ["synthesis", "void", "signal", "cipher"],
  about: ["synthesis"],
  capabilities: ["synthesis"],
  process: ["synthesis", "void", "signal"],
  work: ["synthesis", "void", "signal", "cipher"],
  philosophy: ["synthesis", "void", "cipher"],
  services: ["signal", "cipher"],
  testimonials: ["synthesis", "void", "signal", "cipher"],
  cta: ["synthesis", "void", "signal", "cipher"],
};

export function getSectionKey(id: string, variation: string): string {
  return `${id}_${variation}`;
}

export function SectionRenderer({
  id,
  variation,
  projects,
  landing,
}: { id: string; variation: string } & SectionProps) {
  const key = getSectionKey(id, variation);
  const Component = REGISTRY[key];
  if (!Component) return null;
  return <Component projects={projects} landing={landing} />;
}
