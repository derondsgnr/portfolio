import type { Metadata } from "next";
import { TransmissionServicesFrequency } from "@/components/v2/sections/transmission-services-frequency";
import { TransmissionServicesIndex } from "@/components/v2/sections/transmission-services-index";
import { TransmissionServicesTicker } from "@/components/v2/sections/transmission-services-ticker";

/* TEMPORARY preview route — compare the three services-section directions.
   Delete this file (and the two unused variants) once a direction is chosen. */

export const metadata: Metadata = {
  title: "Services — Preview",
  robots: { index: false, follow: false },
};

function VariantLabel({ tag, name, note }: { tag: string; name: string; note: string }) {
  return (
    <div
      className="px-6 sm:px-8 md:px-10"
      style={{ paddingTop: 56, paddingBottom: 4 }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#E2B93B",
        }}
      >
        {tag} — {name}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          display: "block",
          marginTop: 6,
        }}
      >
        {note}
      </span>
    </div>
  );
}

export default function ServicesPreviewPage() {
  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <div
        className="px-6 sm:px-8 md:px-10"
        style={{ paddingTop: 80, paddingBottom: 8 }}
      >
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            textTransform: "uppercase",
            color: "#F0F0F0",
            letterSpacing: "0.02em",
          }}
        >
          Services — three directions
        </h1>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            marginTop: 12,
          }}
        >
          Hover / focus the rows to feel each one. Pick a direction — the winner ships after About.
        </p>
      </div>

      <VariantLabel tag="A" name="Frequency Channels" note="Most native to Transmission — services as broadcast channels that tune in." />
      <TransmissionServicesFrequency />

      <VariantLabel tag="B" name="Editorial Index" note="Magazine contents page — muted list + swapping detail panel." />
      <TransmissionServicesIndex />

      <VariantLabel tag="C" name="Broadcast Ticker" note="Kinetic crawl — hover pauses and holds a channel." />
      <TransmissionServicesTicker />

      <div style={{ height: 120 }} />
    </main>
  );
}
