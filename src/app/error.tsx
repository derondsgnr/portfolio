"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span
          className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-6"
          style={{ fontFamily: "monospace" }}
        >
          ERROR
        </span>
        <h1
          className="text-4xl md:text-6xl uppercase mb-6"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.03em" }}
        >
          Something broke
        </h1>
        <p
          className="text-[#555] text-sm mb-10"
          style={{ fontFamily: "monospace", lineHeight: 1.9 }}
        >
          An unexpected error occurred. This has been logged.
        </p>
        <button
          onClick={reset}
          className="text-[10px] tracking-[0.2em] px-6 py-3 border border-[#E2B93B] text-[#E2B93B] hover:bg-[#E2B93B] hover:text-[#0a0a0a] transition-all duration-300"
          style={{ fontFamily: "monospace" }}
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
