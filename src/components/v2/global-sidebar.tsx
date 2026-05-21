"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siX, siGithub, siDribbble } from "simple-icons";
import { useSiteConfig } from "@/contexts/site-config-context";

// LinkedIn dropped from simple-icons v16
const SI_LINKEDIN =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

function socialIconPath(label: string): string | null {
  const l = label.toLowerCase();
  if (l.includes("x") || l.includes("twitter")) return siX.path;
  if (l.includes("linkedin")) return SI_LINKEDIN;
  if (l.includes("dribbble")) return siDribbble.path;
  if (l.includes("github")) return siGithub.path;
  return null;
}

export const SIDEBAR_WIDTH = 260;

export function GlobalSidebar() {
  const { nav, global: g } = useSiteConfig();
  const pathname = usePathname();

  return (
    <>
      <style>{`@keyframes glow-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <aside
        className="fixed top-0 left-0 h-screen flex flex-col z-40"
        style={{
          width: SIDEBAR_WIDTH,
          background: "#0A0A0A",
          borderRight: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* Logo */}
        <div className="px-8 pt-8 pb-6">
          <Link href="/">
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: "22px",
                letterSpacing: "0.08em",
                color: "#E2B93B",
                textTransform: "uppercase",
              }}
            >
              D/
            </span>
          </Link>
        </div>

        {/* Nav — vertically centered */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
          {nav.map((link) => {
            const href = link.path ?? link.href ?? "/";
            const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={link.label}
                href={href}
                style={{
                  fontFamily: "monospace",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: active ? "#E2B93B" : "rgba(255,255,255,0.28)",
                  padding: "10px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color 0.2s",
                  borderLeft: active ? "2px solid #E2B93B" : "2px solid transparent",
                  paddingLeft: active ? 10 : 0,
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = "#F0F0F0";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Identity — bottom */}
        <div className="px-8 pb-8">
          {/* Availability pulse */}
          <div className="flex items-center gap-2 mb-5">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#4ade80",
                display: "block",
                boxShadow: "0 0 6px #4ade80",
                animation: "glow-pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Available for work
            </span>
          </div>

          {/* Profile initial + name */}
          <div className="flex items-center gap-3 mb-5">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Anton', sans-serif",
                  fontSize: "14px",
                  color: "#E2B93B",
                  letterSpacing: "0.04em",
                }}
              >
                D
              </span>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "13px",
                  color: "#F0F0F0",
                  fontWeight: 500,
                  marginBottom: 1,
                }}
              >
                Deron
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                @derondsgnr
              </p>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {g.socialLinks.map((s) => {
              const iconPath = socialIconPath(s.label);
              if (!iconPath) return null;
              return (
                <Link
                  key={s.label}
                  href={s.url}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E2B93B";
                    e.currentTarget.style.borderColor = "#E2B93B";
                    e.currentTarget.style.background = "rgba(226,185,59,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden>
                    <path d={iconPath} />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
