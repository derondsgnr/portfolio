"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./navbar";
import { BookingProvider } from "./v2/booking-context";
import { BookingDrawer } from "./v2/booking-drawer";
import { SiteConfigProvider } from "@/contexts/site-config-context";
import { TestimonialsProvider } from "@/contexts/testimonials-context";
import type { TestimonialItem } from "@/lib/content/testimonials";
import { useArmAudio } from "@/hooks/useSound";
import type { NavItem } from "@/lib/content/nav";
import type { GlobalConfig } from "@/lib/content/global";
import type { SoundsConfig } from "@/lib/content/sounds";

type ProvidersProps = {
  children: React.ReactNode;
  nav?: NavItem[];
  global?: GlobalConfig;
  sounds?: SoundsConfig;
  testimonials?: TestimonialItem[];
};

export function Providers({ children, nav = [], global: globalConfig, sounds, testimonials = [] }: ProvidersProps) {
  useArmAudio();
  useEffect(() => {
    if (sounds && typeof window !== "undefined") {
      (window as unknown as { __SOUNDS__?: SoundsConfig }).__SOUNDS__ = sounds;
    }
  }, [sounds]);
  const pathname = usePathname();
  const isCaseStudy = /^\/work\/[^/]+$/.test(pathname ?? "");
  const isBlogPost = /^\/blog\/[^/]+$/.test(pathname ?? "");
  const isNow = pathname === "/now";
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  const effectiveNav = nav.length > 0 ? nav : ([{ label: "Work", path: "/work" }, { label: "Craft", path: "/craft" }, { label: "About", path: "/about" }, { label: "Now", path: "/now" }] as NavItem[]);
  const effectiveGlobal = globalConfig ?? {
    socialLinks: [{ label: "Twitter / X", url: "https://twitter.com/derondsgnr" }, { label: "LinkedIn", url: "https://linkedin.com/in/derondsgnr" }, { label: "Dribbble", url: "https://dribbble.com/derondsgnr" }],
    footerCopyright: "© 2025 DERONDSGNR",
    footerTagline: "Designed & built by hand",
    ctaButtonLabel: "Book a call",
  } as GlobalConfig;

  return (
    <SiteConfigProvider nav={effectiveNav} global={effectiveGlobal}>
    <TestimonialsProvider testimonials={testimonials}>
    <BookingProvider>
        <div className="relative min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: "var(--color-background)" }}>
        {!isCaseStudy && !isBlogPost && !isNow && !isAdmin && <Navbar />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname ?? "root"}
            initial={isAdmin ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={isAdmin ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: isAdmin ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <BookingDrawer />
      </div>
    </BookingProvider>
    </TestimonialsProvider>
    </SiteConfigProvider>
  );
}
