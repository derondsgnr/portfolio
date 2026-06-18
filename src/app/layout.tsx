import type { Metadata } from "next";
import { Anton, Instrument_Sans, Inter, Playfair_Display, Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { getSiteMeta } from "@/lib/content/site-meta";
import { getIntegrations } from "@/lib/content/integrations";
import { getTestimonials } from "@/lib/content/testimonials";
import { getTheme } from "@/lib/content/theme";
import { getNav, getHiddenNavPaths } from "@/lib/content/nav";
import { getGlobal } from "@/lib/content/global";
import { getSounds } from "@/lib/content/sounds";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const instrumentSans = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });

const allFontVars = `${anton.variable} ${instrumentSans.variable} ${inter.variable} ${playfair.variable} ${spaceGrotesk.variable} ${dmSans.variable}`;

const FONT_PAIR_VARS: Record<string, { heading: string; body: string }> = {
  "anton-instrument": { heading: "var(--font-anton)", body: "var(--font-instrument)" },
  "inter-playfair": { heading: "var(--font-playfair)", body: "var(--font-inter)" },
  "space-dm": { heading: "var(--font-space)", body: "var(--font-dm)" },
};

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMeta();
  const ogImage = meta.ogImage
    ? (meta.ogImage.startsWith("http") ? meta.ogImage : `${meta.url}${meta.ogImage.startsWith("/") ? "" : "/"}${meta.ogImage}`)
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(meta.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      siteName: meta.siteName,
      url: meta.url,
      images: ogImage ? [{ url: ogImage, alt: meta.ogImageAlt }] : undefined,
      type: "website",
    },
    twitter: {
      card: (meta.twitterCard as "summary" | "summary_large_image") || "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ogImage ? [ogImage] : undefined,
    },
    icons: meta.favicon && meta.favicon !== "/favicon.ico"
      ? { icon: meta.favicon }
      : meta.logo
        ? { icon: meta.logo }
        : { icon: "/icon" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [integrations, theme, nav, global, sounds, testimonials, siteMeta, hiddenPaths] = await Promise.all([
    getIntegrations(),
    getTheme(),
    getNav(),
    getGlobal(),
    getSounds(),
    getTestimonials(),
    getSiteMeta(),
    getHiddenNavPaths(),
  ]);
  const pair = theme.fonts.pair in FONT_PAIR_VARS ? theme.fonts.pair : "anton-instrument";
  const fonts = FONT_PAIR_VARS[pair];

  const themeStyles = [
    `--color-primary: ${theme.colors.primary}`,
    `--color-secondary: ${theme.colors.secondary}`,
    `--color-accent: ${theme.colors.accent}`,
    `--color-background: ${theme.colors.background}`,
    `--color-text: ${theme.colors.text}`,
    `--accent: ${theme.colors.accent}`,
    `--background: ${theme.colors.background}`,
    `--font-primary: ${fonts.heading}`,
    `--font-secondary: ${fonts.body}`,
    `--font-heading: ${fonts.heading}`,
    `--font-body: ${fonts.body}`,
    `--spacing-xs: ${theme.spacing.xs}`,
    `--spacing-sm: ${theme.spacing.sm}`,
    `--spacing-md: ${theme.spacing.md}`,
    `--spacing-lg: ${theme.spacing.lg}`,
    `--spacing-xl: ${theme.spacing.xl}`,
    // Typography (line-heights unitless; letter-spacings get the em unit appended)
    `--body-leading: ${theme.typography.bodyLineHeight}`,
    `--body-tracking: ${theme.typography.bodyLetterSpacing}em`,
    `--reader-leading: ${theme.typography.readerLineHeight}`,
    `--meta-tracking: ${theme.typography.metaLetterSpacing}em`,
  ].join("; ");

  return (
    <html lang="en" className={allFontVars}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: `:root { ${themeStyles} }` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${siteMeta.url}/#person`,
                  name: "Deron",
                  url: siteMeta.url,
                  jobTitle: "Product Designer & Builder",
                  description: siteMeta.description,
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteMeta.url}/#website`,
                  url: siteMeta.url,
                  name: siteMeta.siteName,
                  description: siteMeta.description,
                  author: { "@id": `${siteMeta.url}/#person` },
                  dateModified: "2026-05-08",
                },
              ],
            }),
          }}
        />
        <Providers nav={nav} global={global} sounds={sounds} testimonials={testimonials} logo={siteMeta.logo} hiddenPaths={hiddenPaths}>{children}</Providers>
        <AnalyticsScripts integrations={integrations} />
      </body>
    </html>
  );
}
