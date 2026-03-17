"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useBooking } from "./v2/booking-context";
import { withSound } from "@/hooks/useSound";
import { SoundToggle } from "./sound-toggle";

const NAV_ITEMS = [
  { label: "Work", path: "/work" },
  { label: "Craft", path: "/craft" },
  { label: "About", path: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { open } = useBooking();

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <nav className="flex items-center justify-between px-6 md:px-10 py-5 pointer-events-auto">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="text-white tracking-wider text-[1.1rem] uppercase"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            derondsgnr
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="relative text-white/70 hover:text-white transition-colors duration-300 text-[0.85rem] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.label}
                  {pathname === item.path && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}

            {/* Sound toggle */}
            <li><SoundToggle /></li>
            {/* CTA button — accent */}
            <li>
              <button
                onClick={withSound(() => open("book"))}
                className="text-[0.8rem] uppercase tracking-[0.15em] px-5 py-2 border border-[#e2b93b]/40 text-[#e2b93b] hover:bg-[#e2b93b] hover:text-[#0a0a0a] transition-all duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book a call
              </button>
            </li>
          </ul>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-5 flex flex-col justify-between z-[60]"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block w-full h-px bg-white origin-left"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-full h-px bg-white"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="block w-full h-px bg-white origin-left"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-between px-8 pb-12 pt-24"
          >
            <nav className="space-y-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <h2 className="text-white hover:text-white/60 transition-colors duration-300">
                      {item.label}
                    </h2>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/40">Sound</span>
                <SoundToggle />
              </div>
              <button
                onClick={withSound(() => {
                  setMobileOpen(false);
                  setTimeout(() => open("book"), 300);
                })}
                className="inline-block text-[0.85rem] uppercase tracking-[0.15em] px-6 py-3 bg-[#e2b93b] text-[#0a0a0a]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book a call
              </button>
              <button
                onClick={withSound(() => {
                  setMobileOpen(false);
                  setTimeout(() => open("message"), 300);
                })}
                className="block text-[0.75rem] uppercase tracking-[0.15em] text-[#e2b93b]/60 hover:text-[#e2b93b] transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Or send a message &rarr;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
