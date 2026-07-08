export default function Loading() {
  return (
    <div className="min-h-screen bg-[#121316] flex items-center justify-center">
      <span
        className="text-[10px] tracking-[0.3em] text-[#ECFF95]/40 animate-pulse"
        style={{ fontFamily: "monospace" }}
      >
        LOADING
      </span>
    </div>
  );
}
