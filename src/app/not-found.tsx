import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121316] px-6">
      <h1 className="text-4xl md:text-6xl text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
        404
      </h1>
      <p className="text-[#666] text-sm mb-8" style={{ fontFamily: "monospace" }}>
        Page not found
      </p>
      <Link
        href="/"
        className="text-[10px] tracking-[0.2em] text-[#ECFF95] border border-[#ECFF95]/30 px-4 py-2 hover:bg-[#ECFF95]/10 transition-colors"
        style={{ fontFamily: "monospace" }}
      >
        BACK HOME
      </Link>
    </div>
  );
}
