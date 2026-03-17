import { Reveal, LineDraw, TextReveal } from "./motion-primitives";
import { motion } from "motion/react";
import { useBooking } from "./v2/booking-context";

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "https://twitter.com/derondsgnr" },
  { label: "LinkedIn", href: "https://linkedin.com/in/derondsgnr" },
  { label: "Dribbble", href: "https://dribbble.com/derondsgnr" },
  { label: "Instagram", href: "#" },
];

export function Footer() {
  const { open } = useBooking();

  return (
    <footer id="cta" className="px-6 md:px-10 pt-24 md:pt-40 pb-8">
      {/* CTA Statement */}
      <div className="mb-16 md:mb-24">
        <Reveal>
          <p
            className="text-[#e2b93b] text-[0.75rem] uppercase tracking-[0.3em] mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Let's build something
          </p>
        </Reveal>

        <TextReveal>
          <h2
            className="text-white"
            style={{
              fontSize: "clamp(2rem, 5vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            From idea to interface —
          </h2>
        </TextReveal>
        <TextReveal delay={0.15}>
          <h2
            className="text-[#6b6b6b]"
            style={{
              fontSize: "clamp(2rem, 5vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            design that moves
          </h2>
        </TextReveal>
        <TextReveal delay={0.3}>
          <h2
            className="text-[#6b6b6b]"
            style={{
              fontSize: "clamp(2rem, 5vw, 5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            at your speed.
          </h2>
        </TextReveal>

        <Reveal delay={0.5}>
          <div className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={() => open("book")}
              className="inline-block text-[0.85rem] uppercase tracking-[0.15em] px-8 py-4 bg-[#e2b93b] text-[#0a0a0a] hover:bg-[#e2b93b]/80 transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Book a call
            </button>
            <button
              onClick={() => open("message")}
              className="inline-block text-[0.85rem] uppercase tracking-[0.15em] px-8 py-4 border border-[#e2b93b]/30 text-[#e2b93b] hover:bg-[#e2b93b]/10 transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Send a message
            </button>
          </div>
          <p
            className="text-white/30 text-[0.75rem] mt-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Free 30-minute discovery call
          </p>
        </Reveal>
      </div>

      <LineDraw />

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pt-8">
        <Reveal>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <motion.a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[#e2b93b] transition-colors duration-300 text-[0.8rem] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-body)" }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="text-white/20 text-[0.7rem] tracking-[0.15em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            &copy; {new Date().getFullYear()} derondsgnr — All rights reserved
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
