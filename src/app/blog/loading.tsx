export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <span
        className="text-[10px] tracking-[0.3em] text-[#E2B93B]/40 animate-pulse"
        style={{ fontFamily: "monospace" }}
      >
        LOADING
      </span>
    </div>
  );
}
