"use client";

import { SynthesisHeroSection } from "@/components/v2/sections/synthesis-hero";
import { SynthesisAboutSection } from "@/components/v2/sections/synthesis-about";
import { SynthesisCTASection } from "@/components/v2/sections/synthesis-cta";
import { getSectionKey } from "./section-options";
import { VoidHero, VoidProcess, VoidWork, VoidPhilosophy, VoidTestimonial, VoidCTA } from "@/components/v2/v2-void";
import { SignalHero, SignalProcess, SignalWork, SignalServices, SignalTestimonials, SignalCTA } from "@/components/v2/v2-signal";
import { CipherHero, CipherWork, CipherServices, CipherPhilosophy, CipherTestimonials, CipherCTA } from "@/components/v2/v2-cipher";
import {
  DriftHero,
  DriftProcess,
  DriftWork,
  DriftPhilosophy,
  DriftTestimonials,
  DriftCTA,
} from "@/components/v2/v2-drift";
import {
  EchoHero,
  EchoProcess,
  EchoWork,
  EchoPhilosophy,
  EchoTestimonials,
  EchoCTA,
} from "@/components/v2/v2-echo";
import {
  FractureHero,
  FractureProcess,
  FractureWork,
  FracturePhilosophy,
  FractureTestimonials,
  FractureCTA,
} from "@/components/v2/v2-fracture";
import {
  GravityHero,
  GravityProcess,
  GravityWork,
  GravityPhilosophy,
  GravityTestimonials,
  GravityCTA,
} from "@/components/v2/v2-gravity";
import { SynthesisProcess, SynthesisCapabilities, SynthesisWork, SynthesisPhilosophy, SynthesisTestimonials } from "@/components/v2/v2-synthesis";
import type { Project } from "@/lib/content/projects";
import type { LandingContent } from "@/lib/content/landing";
import type { PageCopy } from "@/lib/content/copy";

export type SectionProps = {
  projects?: Project[];
  landing?: LandingContent;
  pageCopy?: PageCopy;
  sectionOverrides?: Record<string, unknown>;
};

const REGISTRY: Record<string, React.ComponentType<SectionProps>> = {
  hero_synthesis: (p) => {
    const hero = p.pageCopy?.hero ?? p.landing?.hero;
    return (
      <SynthesisHeroSection
        name={(p.sectionOverrides?.name as string) ?? hero?.name}
        tagline={(p.sectionOverrides?.tagline as string) ?? hero?.tagline}
        philosophy={(p.sectionOverrides?.philosophy as string) ?? hero?.philosophy}
      />
    );
  },
  hero_void: () => <VoidHero />,
  hero_signal: () => <SignalHero />,
  hero_cipher: () => <CipherHero />,
  hero_drift: () => <DriftHero />,
  hero_echo: () => <EchoHero />,
  hero_fracture: () => <FractureHero />,
  hero_gravity: () => <GravityHero />,

  about_synthesis: (p) => {
    const about = p.pageCopy?.about ?? p.landing?.about;
    return (
      <SynthesisAboutSection
        label={(p.sectionOverrides?.label as string) ?? about?.label}
        headline={(p.sectionOverrides?.headline as string) ?? about?.headline}
        headlineAccent={(p.sectionOverrides?.headlineAccent as string) ?? about?.headlineAccent}
        bioParagraphs={(p.sectionOverrides?.bioParagraphs as string[]) ?? about?.bioParagraphs}
        stats={(p.sectionOverrides?.stats as { label: string; value: string }[]) ?? about?.stats}
      />
    );
  },

  capabilities_synthesis: () => <SynthesisCapabilities />,

  process_synthesis: () => <SynthesisProcess />,
  process_void: () => <VoidProcess />,
  process_signal: () => <SignalProcess />,
  process_drift: () => <DriftProcess />,
  process_echo: () => <EchoProcess />,
  process_fracture: () => <FractureProcess />,
  process_gravity: () => <GravityProcess />,

  work_synthesis: (p) => <SynthesisWork projects={p.projects} />,
  work_void: (p) => <VoidWork projects={p.projects} />,
  work_signal: (p) => <SignalWork projects={p.projects} />,
  work_cipher: (p) => <CipherWork projects={p.projects} />,
  work_drift: (p) => <DriftWork projects={p.projects} />,
  work_echo: (p) => <EchoWork projects={p.projects} />,
  work_fracture: (p) => <FractureWork projects={p.projects} />,
  work_gravity: (p) => <GravityWork projects={p.projects} />,

  philosophy_synthesis: () => <SynthesisPhilosophy />,
  philosophy_void: () => <VoidPhilosophy />,
  philosophy_cipher: () => <CipherPhilosophy />,
  philosophy_drift: () => <DriftPhilosophy />,
  philosophy_echo: () => <EchoPhilosophy />,
  philosophy_fracture: () => <FracturePhilosophy />,
  philosophy_gravity: () => <GravityPhilosophy />,

  services_signal: () => <SignalServices />,
  services_cipher: () => <CipherServices />,

  testimonials_synthesis: () => <SynthesisTestimonials />,
  testimonials_void: () => <VoidTestimonial />,
  testimonials_signal: () => <SignalTestimonials />,
  testimonials_cipher: () => <CipherTestimonials />,
  testimonials_drift: () => <DriftTestimonials />,
  testimonials_echo: () => <EchoTestimonials />,
  testimonials_fracture: () => <FractureTestimonials />,
  testimonials_gravity: () => <GravityTestimonials />,

  cta_synthesis: (p) => {
    const cta = p.pageCopy?.cta ?? p.landing?.cta;
    return (
      <SynthesisCTASection
        label={(p.sectionOverrides?.label as string) ?? cta?.label}
        headline={(p.sectionOverrides?.headline as string) ?? cta?.headline}
        ctaPrimary={(p.sectionOverrides?.ctaPrimary as string) ?? cta?.ctaPrimary}
        ctaSecondary={(p.sectionOverrides?.ctaSecondary as string) ?? cta?.ctaSecondary}
        subtext={(p.sectionOverrides?.subtext as string) ?? cta?.subtext}
        tagline={(p.sectionOverrides?.tagline as string) ?? cta?.tagline}
      />
    );
  },
  cta_void: () => <VoidCTA />,
  cta_signal: () => <SignalCTA />,
  cta_cipher: () => <CipherCTA />,
  cta_drift: () => <DriftCTA />,
  cta_echo: () => <EchoCTA />,
  cta_fracture: () => <FractureCTA />,
  cta_gravity: () => <GravityCTA />,
};

export { SECTION_OPTIONS, getSectionKey } from "./section-options";

export function SectionRenderer({
  id,
  variation,
  projects,
  landing,
  pageCopy,
  sectionOverrides,
}: { id: string; variation: string } & SectionProps) {
  const key = getSectionKey(id, variation);
  const Component = REGISTRY[key];
  if (!Component) return null;
  return (
    <Component
      projects={projects}
      landing={landing}
      pageCopy={pageCopy}
      sectionOverrides={sectionOverrides}
    />
  );
}
