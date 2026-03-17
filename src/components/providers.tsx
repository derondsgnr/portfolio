"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./navbar";
import { BookingProvider } from "./v2/booking-context";
import { BookingDrawer } from "./v2/booking-drawer";
import { SiteConfigProvider } from "@/contexts/site-config-context";
import { useArmAudio } from "@/hooks/useSound";
import type { NavItem } from "@/lib/content/nav";
import type { GlobalConfig } from "@/lib/content/global";

type ProvidersProps = {
  children: React.ReactNode;
  nav?: NavItem[];
  global?: GlobalConfig;
};

export function Providers({ children, nav = [], global: globalConfig }: ProvidersProps) {
  useArmAudio();
  const pathname = usePathname();
  const isCaseStudy = /^\/work\/[^/]+$/.test(pathname ?? "");
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  const effectiveNav = nav.length > 0 ? nav : ([{ label: "Work", path: "/work" }, { label: "Craft", path: "/craft" }, { label: "About", path: "/about" }] as NavItem[]);
  const effectiveGlobal = globalConfig ?? {
    socialLinks: [{ label: "Twitter / X", url: "https://twitter.com/derondsgnr" }, { label: "LinkedIn", url: "https://linkedin.com/in/derondsgnr" }, { label: "Dribbble", url: "https://dribbble.com/derondsgnr" }],
    footerCopyright: "© 2025 DERONDSGNR",
    footerTagline: "Designed & built by hand",
    ctaButtonLabel: "Book a call",
  } as GlobalConfig;

  return (
    <SiteConfigProvider nav={effectiveNav} global={effectiveGlobal}>
    <BookingProvider>
        <div className="relative min-h-screen text-white overflow-x-hidden" style={{ backgroundColor: "var(--color-background)" }}>
        {!isCaseStudy && !isAdmin && <Navbar />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname ?? "root"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <BookingDrawer />
      </div>
    </BookingProvider>
    </SiteConfigProvider>
  );
}
