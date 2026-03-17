import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { V2_PROJECTS, V2_CRAFT_ITEMS, V2_ABOUT } from "../v2-data";

/* ═══════════════════════════════════════════════════════════════
   GRAVITY PAGES — Everything has weight. Elements drop, settle.
   Heavy typography sinks. Spring physics. Gold ground lines.
   ═══════════════════════════════════════════════════════════════ */

/* ─── WORK PAGE ──────────────────────────────────────────────── */
export function GravityWorkPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — drops with weight */}
      <section className="relative h-[70vh] flex flex-col justify-end overflow-hidden pb-16 px-8">
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 12, mass: 3, delay: 0.3 }}
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(6rem, 20vw, 22rem)", lineHeight: 0.8, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            WORK
          </span>
        </motion.div>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1.5, delay: 0.8 }}
          className="mt-4 flex items-center gap-6"
        >
          <div style={{ width: 80, height: 3, background: "#E2B93B" }} />
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {V2_PROJECTS.length} Selected Projects
          </span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{ background: "#E2B93B" }}
        />
      </section>

      {/* Projects — heavy stacking blocks */}
      <section className="relative py-16 px-8">
        <div className="max-w-6xl mx-auto space-y-2">
          {V2_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ y: -80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, mass: 2, delay: i * 0.1 }}
              className="relative group cursor-pointer overflow-hidden"
              style={{ height: "min(500px, 60vh)" }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(0.3) brightness(0.6)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95), transparent)" }}>
                <div>
                  <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
                    {project.title}
                  </span>
                  <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                    {project.category}
                  </span>
                  <p className="mt-3 max-w-md" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300, color: "rgba(255,255,255,0.3)" }}>
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", color: "#E2B93B", letterSpacing: "0.1em" }}>{project.year}</span>
                  <div style={{ width: 40, height: 3, background: "#E2B93B" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 mb-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Gravity / Work</span>
      </div>
    </main>
  );
}

/* ─── CRAFT PAGE ─────────────────────────────────────────────── */
export function GravityCraftPage() {
  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] flex flex-col justify-end pb-16 px-8">
        <motion.div
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 12, mass: 3 }}
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(5rem, 16vw, 14rem)", lineHeight: 0.8, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            CRAFT
          </span>
        </motion.div>
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
          className="mt-4 flex items-center gap-6"
        >
          <div style={{ width: 60, height: 3, background: "#E2B93B" }} />
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
            Side explorations with weight
          </span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
          style={{ background: "#E2B93B" }}
        />
      </section>

      {/* Craft grid — heavy masonry */}
      <section className="relative py-16 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {V2_CRAFT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ y: -60 + i * -15, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1.5, delay: i * 0.08 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden" style={{ aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/2" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(0.3) brightness(0.7)" }}
                />
              </div>
              <div className="mt-3 pb-3" style={{ borderBottom: "2px solid rgba(226,185,59,0.15)" }}>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.1em", color: "#E2B93B" }}>{item.category}</span>
                <span className="block mt-1" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{item.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto mt-16 mb-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Gravity / Craft</span>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────────── */
export function GravityAboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <main className="relative bg-[#0A0A0A] min-h-screen">
      {/* Hero — name drops with weight */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden pb-16 px-8">
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 12, mass: 3, delay: 0.3 }}
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(6rem, 20vw, 22rem)", lineHeight: 0.8, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#f0f0f0", display: "block" }}>
            DERON
          </span>
        </motion.div>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1.5, delay: 0.8 }}
          className="mt-4 flex items-center gap-6"
        >
          <div style={{ width: 80, height: 3, background: "#E2B93B" }} />
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            {V2_ABOUT.title}
          </span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
          className="absolute bottom-0 left-0 right-0 h-1 origin-left"
          style={{ background: "#E2B93B" }}
        />
      </section>

      {/* Bio — heavy text blocks */}
      <section className="relative py-32 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {V2_ABOUT.bio.map((p, i) => (
              <p key={i} className={i > 0 ? "mt-6" : ""} style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "1rem", lineHeight: 1.9, fontWeight: 300, color: "rgba(255,255,255,0.45)" }}>
                {p}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="space-y-10">
              {/* Location */}
              <div>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "#E2B93B", textTransform: "uppercase" }}>Based in</span>
                <span className="block mt-2" style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1, letterSpacing: "-0.02em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                  {V2_ABOUT.location}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {V2_ABOUT.stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: -40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 120, damping: 12, mass: 2, delay: i * 0.15 }}
                  >
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, color: "#E2B93B", display: "block" }}>{stat.value}</span>
                    <span className="block mt-2" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>{stat.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Tools */}
              <div>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "#E2B93B", textTransform: "uppercase" }}>Tools</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {V2_ABOUT.tools.map((tool) => (
                    <span key={tool} style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", padding: "4px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy — heavy bold */}
      <section ref={ref} className="relative py-48 px-8 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute right-0 top-0 select-none pointer-events-none">
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(15rem, 40vw, 45rem)", lineHeight: 0.8, color: "rgba(255,255,255,0.02)", display: "block" }}>&amp;</span>
        </motion.div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.95, letterSpacing: "-0.03em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", display: "block" }}>
              Products with
              <br />
              <span style={{ color: "#E2B93B" }}>Gravitational</span>
              <br />
              Pull
            </span>
          </motion.div>
        </div>
      </section>

      {/* Social + CTA */}
      <section className="relative py-16 px-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 15, mass: 3 }}
          className="max-w-6xl mx-auto p-16 text-center"
          style={{ background: "#E2B93B" }}
        >
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 0.95, letterSpacing: "-0.03em", textTransform: "uppercase", color: "#0A0A0A", display: "block" }}>
            Let&rsquo;s Build
          </span>
          <div className="flex justify-center gap-8 mt-6">
            {V2_ABOUT.socials.map((s) => (
              <a key={s.label} href={s.url} style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "rgba(10,10,10,0.5)", textTransform: "uppercase" }}>
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto mt-8 mb-8 px-8 flex justify-between" style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
        <span>&copy; 2025 derondsgnr</span>
        <span>Gravity / About</span>
      </div>
    </main>
  );
}
