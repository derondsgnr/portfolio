import { motion } from "motion/react";
import { Reveal, TextReveal, LineDraw } from "./motion-primitives";

const PRINCIPLES = [
  {
    number: "01",
    title: "Clarity over\ndecoration",
    body: "I strip products down to what actually matters. Your MVP ships with conviction, not compromise. No fluff, no feature bloat — just the thing that needs to exist, designed to feel inevitable.",
    service: "Product Design for Early-Stage Startups",
  },
  {
    number: "02",
    title: "Speed is a\ndesign decision",
    body: "I move fast because founders need fast. But speed without intention is just chaos. Every decision is deliberate — I just don't take three weeks to make it.",
    service: "Framer Product Websites & Interactive Prototypes",
  },
  {
    number: "03",
    title: "Looks are\nnon-negotiable",
    body: "Your product will be judged before anyone clicks a button. I design interfaces that earn trust on sight — because first impressions aren't a second chance.",
    service: "AI-Powered Product Systems",
  },
];

export function PhilosophySection() {
  return (
    <section className="py-24 md:py-40 px-6 md:px-10">
      {/* Section header */}
      <div className="mb-16 md:mb-24">
        <Reveal>
          <p
            className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Philosophy & Services
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p
            className="text-white/40 text-[0.9rem] max-w-md"
            style={{ fontFamily: "var(--font-body)", lineHeight: 1.7 }}
          >
            What I believe shapes what I build. Each principle isn't just a value — it's a service promise.
          </p>
        </Reveal>
      </div>

      {/* Principles */}
      <div className="space-y-0">
        {PRINCIPLES.map((principle, i) => (
          <div key={principle.number}>
            <LineDraw delay={i * 0.1} />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 py-12 md:py-16 group"
            >
              {/* Number — massive, bleeds left */}
              <div className="md:col-span-2 md:col-start-1">
                <Reveal delay={i * 0.1}>
                  <span
                    className="text-white/[0.06] block"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(4rem, 8vw, 8rem)",
                      lineHeight: 0.85,
                      letterSpacing: "-0.02em",
                      marginLeft: "-0.05em",
                    }}
                  >
                    {principle.number}
                  </span>
                </Reveal>
              </div>

              {/* Title — large Anton */}
              <div className="md:col-span-4 md:col-start-3 flex items-start">
                <TextReveal delay={0.1 + i * 0.1}>
                  <h3
                    className="text-white whitespace-pre-line"
                    style={{
                      fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {principle.title}
                  </h3>
                </TextReveal>
              </div>

              {/* Body + service tag — right column, offset */}
              <div className="md:col-span-4 md:col-start-8 flex flex-col justify-between gap-6">
                <Reveal delay={0.2 + i * 0.1}>
                  <p
                    className="text-white/50 text-[0.9rem]"
                    style={{ fontFamily: "var(--font-body)", lineHeight: 1.8 }}
                  >
                    {principle.body}
                  </p>
                </Reveal>
                <Reveal delay={0.3 + i * 0.1}>
                  <span
                    className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.15em] inline-flex items-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <span className="w-4 h-px bg-[#e2b93b]/40" />
                    {principle.service}
                  </span>
                </Reveal>
              </div>
            </motion.div>
          </div>
        ))}
        <LineDraw delay={0.3} />
      </div>

      {/* Design + Strategy + Psychology + Execution accent tag */}
      <Reveal delay={0.4}>
        <p
          className="text-[#e2b93b] text-[0.8rem] uppercase tracking-[0.2em] mt-12 md:mt-16 md:text-right"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Design + Strategy + Psychology + Execution.
        </p>
      </Reveal>
    </section>
  );
}
