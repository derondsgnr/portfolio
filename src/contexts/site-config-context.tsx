"use client";

import { createContext, useContext } from "react";
import type { NavItem } from "@/lib/content/nav";
import type { GlobalConfig } from "@/lib/content/global";

export type SiteConfig = {
  nav: NavItem[];
  global: GlobalConfig;
};

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  nav,
  global: globalConfig,
  children,
}: {
  nav: NavItem[];
  global: GlobalConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={{ nav, global: globalConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return {
      nav: [
        { label: "Work", path: "/work" },
        { label: "Craft", path: "/craft" },
        { label: "Writing", path: "/blog" },
        { label: "About", path: "/about" },
        { label: "Now", path: "/now" },
      ],
      global: {
        socialLinks: [
          { label: "Twitter / X", url: "https://twitter.com/derondsgnr" },
          { label: "LinkedIn", url: "https://linkedin.com/in/derondsgnr" },
          { label: "Dribbble", url: "https://dribbble.com/derondsgnr" },
        ],
        footerCopyright: "© 2025 DERONDSGNR",
        footerTagline: "Designed & built by hand",
        ctaButtonLabel: "Book a call",
      },
    };
  }
  return ctx;
}
