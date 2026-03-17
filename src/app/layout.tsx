import type { Metadata } from "next";
import { Anton, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSiteMeta } from "@/lib/content/site-meta";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMeta();
  const ogImage = meta.ogImage
    ? (meta.ogImage.startsWith("http") ? meta.ogImage : `${meta.url}${meta.ogImage.startsWith("/") ? "" : "/"}${meta.ogImage}`)
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(meta.url),
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
    icons: meta.favicon ? { icon: meta.favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${instrumentSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
