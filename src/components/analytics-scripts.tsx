import Script from "next/script";
import type { IntegrationsConfig } from "@/lib/content/integrations";

type Props = { integrations: IntegrationsConfig };

export function AnalyticsScripts({ integrations }: Props) {
  const { googleAnalytics, googleTagManager } = integrations;

  const gaEnabled =
    googleAnalytics.enabled && Boolean(googleAnalytics.measurementId?.trim());
  const gtmEnabled =
    googleTagManager.enabled && Boolean(googleTagManager.containerId?.trim());

  return (
    <>
      {/* GA4 — only when enabled and measurementId present */}
      {gaEnabled && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics.measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalytics.measurementId}');`}
          </Script>
        </>
      )}

      {/* GTM — only when enabled and containerId present */}
      {gtmEnabled && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${googleTagManager.containerId}');`}
        </Script>
      )}

      {/* GTM noscript fallback — in body for no-JS users */}
      {gtmEnabled && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManager.containerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
    </>
  );
}
