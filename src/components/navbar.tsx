"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useBooking } from "./v2/booking-context";
import { useSiteConfig } from "@/contexts/site-config-context";
import { withSound, useSoundOnHover } from "@/hooks/useSound";

export function Navbar() {
  const pathname = usePathname();
  const { open } = useBooking();
  const onHover = useSoundOnHover("hover");
  const { nav, global } = useSiteConfig();
  const ctaLabel = global.ctaButtonLabel || "Book a call";

  return (
    <>
      {/* ── Top header (logo always, desktop nav links) ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <nav className="flex items-center justify-between px-6 md:px-10 py-5 pointer-events-auto">
          {/* Logo */}
          <Link
            href="/"
            className="text-white tracking-wider text-[1.1rem] uppercase"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            derondsgnr
          </Link>

          {/* Mobile CTA — top right, only on small screens */}
          <button
            onClick={withSound(() => open("book"))}
            onMouseEnter={onHover}
            className="md:hidden text-[0.7rem] uppercase tracking-[0.13em] px-4 py-1.5 border transition-all duration-300"
            style={{
              fontFamily: "var(--font-body)",
              borderColor: "color-mix(in srgb, var(--color-accent) 40%, transparent)",
              color: "var(--color-accent)",
            }}
          >
            {ctaLabel}
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {nav.map((item) => {
              const href = item.path ?? item.href ?? "#";
              const isExternal = !!item.href;
              return (
                <li key={item.label}>
                  {isExternal ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={onHover}
                      className="relative text-white/70 hover:text-white transition-colors duration-300 text-[0.85rem] uppercase tracking-[0.15em]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      onMouseEnter={onHover}
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
                  )}
                </li>
              );
            })}
            <li>
              <button
                onClick={withSound(() => open("book"))}
                onMouseEnter={onHover}
                className="text-[0.8rem] uppercase tracking-[0.15em] px-5 py-2 border transition-all duration-300 [border-color:color-mix(in_srgb,var(--color-accent)_40%,transparent)] [color:var(--color-accent)] hover:[background:var(--color-accent)] hover:[color:var(--color-background)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {ctaLabel}
              </button>
            </li>
          </ul>
        </nav>
      </motion.header>

      {/* ── Mobile bottom nav bar ── */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-label="Mobile navigation"
      >
        <div
          className="flex items-stretch"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {nav.map((item) => {
            const href = item.path ?? item.href ?? "#";
            const isExternal = !!item.href;
            const isActive = item.path
              ? pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path))
              : false;

            const label = (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isActive ? "#E2B93B" : "rgba(255,255,255,0.45)",
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </span>
            );

            return (
              <div key={item.label} className="relative flex-1">
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute top-0 left-3 right-3 h-px"
                    style={{ background: "#E2B93B" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                {isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-4"
                  >
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="flex items-center justify-center py-4">
                    {label}
                  </Link>
                )}
              </div>
            );
          })}

        </div>
      </motion.nav>
    </>
  );
}
