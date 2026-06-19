"use client";

import { createContext, useContext } from "react";
import type { NavItem } from "@/lib/content/nav";
import type { GlobalConfig } from "@/lib/content/global";

export type SiteConfig = {
  nav: NavItem[];
  global: GlobalConfig;
  logo?: string;
  /** Internal paths flagged hidden in nav (e.g. ["/blog"]). Drives hidden-aware links/sections. */
  hiddenPaths: string[];
};

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  nav,
  global: globalConfig,
  logo,
  hiddenPaths = [],
  children,
}: {
  nav: NavItem[];
  global: GlobalConfig;
  logo?: string;
  hiddenPaths?: string[];
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={{ nav, global: globalConfig, logo, hiddenPaths }}>
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
        cinematicEnabled: false,
      },
      hiddenPaths: [],
    };
  }
  return ctx;
}

/**
 * True when `target` points at a hidden page — an exact match (covers anchors
 * like "/#services"), the page itself, or anything nested under it (so hiding
 * "/blog" also hides "/blog/x"). Home ("/") is never hidden.
 */
export function isHiddenPath(target: string | undefined | null, hiddenPaths: string[]): boolean {
  if (!target) return false;
  if (hiddenPaths.includes(target)) return true;
  const base = target.split(/[?#]/)[0] || "/";
  return hiddenPaths.some((h) => h && h !== "/" && (base === h || base.startsWith(`${h}/`)));
}

export function useHiddenPaths(): string[] {
  return useSiteConfig().hiddenPaths;
}

export function useIsHidden(target: string | undefined | null): boolean {
  return isHiddenPath(target, useHiddenPaths());
}
