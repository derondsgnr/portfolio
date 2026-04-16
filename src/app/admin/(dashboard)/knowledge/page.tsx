"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { adminCx, FormField, PageHeader } from "@/components/admin/admin-primitives";
import { knowledgeToInspiration, enqueueInspirationRefs } from "@/lib/admin/presentation-inspiration";
import Link from "next/link";
import { CheckCircle2, Clapperboard, Download, ExternalLink, Pause, Play, RefreshCcw, Search, Upload, Wifi, WifiOff } from "lucide-react";

type Source = "x_post" | "x_article" | "instagram_post" | "manual";
type Status = "queued" | "processed" | "reviewed";

type Item = {
  id: string;
  source: Source;
  url: string;
  title: string;
  rawText: string;
  tags: string[];
  notesAtomic: string[];
  humanCard: string;
  llmSnippet: string;
  embedding: number[];
  processingError: string;
  status: Status;
  updatedAt: number;
};

const STORAGE_KEY = "admin_knowledge_items_v1";
const SETTINGS_KEY = "admin_knowledge_settings_v1";

type Settings = {
  ollamaBaseUrl: string;
  synthesisModel: string;
  embeddingModel: string;
};

const DEFAULT_SETTINGS: Settings = {
  ollamaBaseUrl: "http://localhost:11434",
  synthesisModel: "gemma3:4b",
  embeddingModel: "nomic-embed-text",
};

function makeItem(url: string): Item {
  return {
    id: `kb-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    source: url.includes("instagram.com") ? "instagram_post" : url.includes("/status/") ? "x_post" : url.includes("x.com") || url.includes("twitter.com") ? "x_article" : "manual",
    url: url.trim(),
    title: "",
    rawText: "",
    tags: [],
    notesAtomic: [],
    humanCard: "",
    llmSnippet: "",
    embedding: [],
    processingError: "",
    status: "queued",
    updatedAt: Date.now(),
  };
}

function cosine(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

export default function AdminKnowledgePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [search, setSearch] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(10);
  const [autoRetry, setAutoRetry] = useState(2);
  const [onlyWithRawText, setOnlyWithRawText] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef(false);
  const [progress, setProgress] = useState({ total: 0, done: 0, ok: 0, failed: 0, current: "" });
  const [queryEmbedding, setQueryEmbedding] = useState<number[] | null>(null);
  const [connection, setConnection] = useState<"idle" | "ok" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");
  const importRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { pauseRef.current = isPaused; }, [isPaused]);
  useEffect(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setItems(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {} }, [items]);
  useEffect(() => { try { const raw = localStorage.getItem(SETTINGS_KEY); if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) }); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {} }, [settings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q ? items.filter((i) => `${i.url} ${i.title} ${i.rawText} ${i.tags.join(" ")}`.toLowerCase().includes(q)) : items;
    if (!q || !queryEmbedding) return base;
    return [...base].sort((a, b) => cosine(queryEmbedding, b.embedding) - cosine(queryEmbedding, a.embedding));
  }, [items, search, queryEmbedding]);

  async function ollamaGenerate(prompt: string) {
    const res = await fetch(`${settings.ollamaBaseUrl.replace(/\/+$/, "")}/api/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: settings.synthesisModel, prompt, stream: false }),
    });
    if (!res.ok) throw new Error(`Synthesis failed (${res.status})`);
    return (await res.json()).response as string;
  }
  async function ollamaEmbed(text: string) {
    const res = await fetch(`${settings.ollamaBaseUrl.replace(/\/+$/, "")}/api/embeddings`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: settings.embeddingModel, prompt: text }),
    });
    if (!res.ok) throw new Error(`Embedding failed (${res.status})`);
    return ((await res.json()).embedding ?? []) as number[];
  }

  async function testConnection() {
    setConnection("idle");
    setConnectionMessage("Checking local Ollama...");
    try {
      const res = await fetch(`${settings.ollamaBaseUrl.replace(/\/+$/, "")}/api/tags`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      const modelCount = Array.isArray(payload?.models) ? payload.models.length : 0;
      setConnection("ok");
      setConnectionMessage(`Connected: ${modelCount} model(s) available`);
    } catch {
      setConnection("error");
      setConnectionMessage("Could not reach Ollama");
    }
  }

  async function processIds(ids: string[]) {
    const target = ids.filter(Boolean);
    if (!target.length) return;
    setIsProcessing(true);
    setIsPaused(false);
    let done = 0; let ok = 0; let failed = 0;
    setProgress({ total: target.length, done, ok, failed, current: "Starting..." });
    try {
      for (let i = 0; i < target.length; i += Math.max(1, batchSize)) {
        const batch = target.slice(i, i + Math.max(1, batchSize));
        for (const id of batch) {
          while (pauseRef.current) await new Promise((r) => setTimeout(r, 250));
          const snapshot = items.find((x) => x.id === id);
          if (!snapshot) continue;
          setProgress((p) => ({ ...p, current: snapshot.title || snapshot.url }));
          let attempts = 0;
          let err = "";
          let success = false;
          while (attempts <= autoRetry && !success) {
            attempts += 1;
            try {
              const prompt = `Return JSON with keys: title,tags,notesAtomic,humanCard,llmSnippet for:\nurl:${snapshot.url}\nraw:${snapshot.rawText}`;
              const response = await ollamaGenerate(prompt);
              let parsed: any = {};
              try { parsed = JSON.parse(response); } catch {}
              const title = typeof parsed.title === "string" ? parsed.title : snapshot.title;
              const tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : snapshot.tags;
              const notesAtomic = Array.isArray(parsed.notesAtomic) ? parsed.notesAtomic.slice(0, 4) : snapshot.notesAtomic;
              const humanCard = typeof parsed.humanCard === "string" ? parsed.humanCard : snapshot.humanCard;
              const llmSnippet = typeof parsed.llmSnippet === "string" ? parsed.llmSnippet : snapshot.llmSnippet;
              const embedding = await ollamaEmbed(`${title} ${notesAtomic.join(" ")}`);
              setItems((prev) => prev.map((item) => item.id === id ? { ...item, title, tags, notesAtomic, humanCard, llmSnippet, embedding, processingError: "", status: item.status === "reviewed" ? "reviewed" : "processed", updatedAt: Date.now() } : item));
              ok += 1;
              success = true;
            } catch (e) {
              err = e instanceof Error ? e.message : "Processing failed";
            }
          }
          if (!success) {
            failed += 1;
            setItems((prev) => prev.map((item) => item.id === id ? { ...item, processingError: err, updatedAt: Date.now() } : item));
          }
          done += 1;
          setProgress((p) => ({ ...p, done, ok, failed }));
        }
      }
    } finally {
      setIsProcessing(false);
      setIsPaused(false);
    }
  }

  const queuedCount = items.filter((item) => item.status === "queued").length;
  const queuedReadyCount = items.filter((item) => item.status === "queued" && item.rawText.trim().length > 0).length;
  const failedCount = items.filter((item) => item.processingError.trim().length > 0).length;
  const reviewedCount = items.filter((item) => item.status === "reviewed").length;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-3">
          <PageHeader
            index={22}
            title="Knowledge Vault"
            description="Private learning and retrieval dashboard for your second-brain workflow."
          />
          <div className="flex flex-wrap gap-2 items-center">
            <Link
              href="/admin/presentation-studio"
              className="px-3 py-2 border border-[#E2B93B]/30 text-[#E2B93B]/90 text-xs inline-flex items-center gap-2 hover:bg-[#E2B93B]/10"
            >
              <Clapperboard size={12} /> Presentation Studio
            </Link>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const data = JSON.parse(await f.text()) as Item[];
                setItems(data);
                e.target.value = "";
              }}
            />
            <button onClick={() => importRef.current?.click()} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs inline-flex items-center gap-2">
              <Upload size={12} /> Import
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "knowledge-vault.json";
                a.click();
                URL.revokeObjectURL(a.href);
              }}
              className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs inline-flex items-center gap-2"
            >
              <Download size={12} /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.08] bg-white/[0.01] p-4 space-y-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#E2B93B]/70 font-['Instrument_Sans']">Backfill Onboarding</p>
        <div className="grid md:grid-cols-3 gap-2">
          <div className="border border-white/[0.07] p-3 bg-[#0A0A0A]/60">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">1. Import / Queue</p>
            <p className="text-sm text-white/75 mt-1">Load URLs via JSON import or paste list in Batch Backfill.</p>
            <p className="text-xs text-white/40 mt-2">{items.length} total item(s)</p>
          </div>
          <div className="border border-white/[0.07] p-3 bg-[#0A0A0A]/60">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">2. Add Raw Text</p>
            <p className="text-sm text-white/75 mt-1">Paste extracted source text so queued items become process-ready.</p>
            <p className="text-xs text-white/40 mt-2">{queuedReadyCount}/{queuedCount} queued ready</p>
          </div>
          <div className="border border-white/[0.07] p-3 bg-[#0A0A0A]/60">
            <p className="text-[10px] text-white/25 uppercase tracking-wider">3. Process + Review</p>
            <p className="text-sm text-white/75 mt-1">Run queued processing, retry failures, then mark reviewed.</p>
            <p className="text-xs text-white/40 mt-2">{failedCount} failed, {reviewedCount} reviewed</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="border border-white/[0.08] bg-white/[0.01] p-4 space-y-3">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#E2B93B]/70 font-['Instrument_Sans']">Batch Backfill</p>
          <FormField label="Paste URLs (one per line)">
            <textarea className={adminCx.textarea} rows={6} value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder="https://x.com/...&#10;https://..." />
          </FormField>
          <button
            onClick={() => {
              const urls = bulkInput.split("\n").map((x) => x.trim()).filter(Boolean);
              setItems((p) => [...urls.map(makeItem), ...p]);
              setBulkInput("");
            }}
            className="px-3 py-2 bg-[#E2B93B] text-[#0A0A0A] text-xs uppercase tracking-wider"
          >
            Queue URLs
          </button>
        </div>

        <div className="border border-white/[0.08] bg-white/[0.01] p-4 space-y-3">
          <p className="text-[11px] tracking-[0.14em] uppercase text-[#E2B93B]/70 font-['Instrument_Sans']">Search & Selection</p>
          <FormField label="Search">
            <input className={adminCx.input} placeholder="Search URL, title, tags, text" value={search} onChange={(e) => setSearch(e.target.value)} />
          </FormField>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelected(filtered.map((x) => x.id))} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase">Select filtered</button>
            <button onClick={() => setSelected([])} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase">Clear</button>
            <span className="text-xs text-white/35 font-['Instrument_Sans'] self-center">{selected.length} selected</span>
          </div>
        </div>
      </div>

      <div className="border border-white/[0.08] p-4 bg-white/[0.01] space-y-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#E2B93B]/70 font-['Instrument_Sans']">Local AI Control Center</p>
        <div className="grid lg:grid-cols-3 gap-2">
          <FormField label="Ollama URL">
            <input className={adminCx.input} value={settings.ollamaBaseUrl} onChange={(e) => setSettings((s) => ({ ...s, ollamaBaseUrl: e.target.value }))} placeholder="http://localhost:11434" />
          </FormField>
          <FormField label="Synthesis model">
            <input className={adminCx.input} value={settings.synthesisModel} onChange={(e) => setSettings((s) => ({ ...s, synthesisModel: e.target.value }))} placeholder="gemma3:4b" />
          </FormField>
          <FormField label="Embedding model">
            <input className={adminCx.input} value={settings.embeddingModel} onChange={(e) => setSettings((s) => ({ ...s, embeddingModel: e.target.value }))} placeholder="nomic-embed-text" />
          </FormField>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={testConnection} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase inline-flex items-center gap-2">
            {connection === "ok" ? <Wifi size={12} /> : <WifiOff size={12} />}
            Test connection
          </button>
          <button onClick={async () => { if (!search.trim()) return; setQueryEmbedding(await ollamaEmbed(search)); }} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase inline-flex items-center gap-2"><Search size={12} /> Embed query</button>
          <button onClick={() => processIds(selected)} disabled={isProcessing || !selected.length} className="px-3 py-2 bg-[#E2B93B] text-[#0A0A0A] text-xs uppercase disabled:opacity-40">Process selected</button>
          <button
            type="button"
            onClick={() => {
              const refs = items
                .filter((x) => selected.includes(x.id))
                .map((x) =>
                  knowledgeToInspiration({
                    id: x.id,
                    url: x.url,
                    title: x.title,
                    tags: x.tags,
                    humanCard: x.humanCard,
                  }),
                );
              enqueueInspirationRefs(refs);
            }}
            disabled={!selected.length}
            className="px-3 py-2 border border-[#E2B93B]/35 text-[#E2B93B]/90 text-xs uppercase inline-flex items-center gap-2 disabled:opacity-40"
          >
            <Clapperboard size={12} /> Send selected to Studio
          </button>
          <button onClick={() => processIds(items.filter((x) => x.status === "queued" && (!onlyWithRawText || x.rawText.trim())).map((x) => x.id))} disabled={isProcessing} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase disabled:opacity-40">Process queued</button>
          <button onClick={() => processIds(items.filter((x) => x.processingError).map((x) => x.id))} disabled={isProcessing} className="px-3 py-2 border border-red-500/30 text-red-400/80 text-xs uppercase disabled:opacity-40 inline-flex items-center gap-2"><RefreshCcw size={12} /> Retry failed</button>
          <button onClick={() => setIsPaused((p) => !p)} disabled={!isProcessing} className="px-3 py-2 border border-white/[0.10] text-white/45 text-xs uppercase disabled:opacity-40 inline-flex items-center gap-2">{isPaused ? <Play size={12} /> : <Pause size={12} />}{isPaused ? "Resume" : "Pause"}</button>
          <input type="number" min={1} max={50} value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value) || 1)} className="w-20 px-2 py-1 bg-white/[0.03] border border-white/[0.08] text-white text-xs" />
          <input type="number" min={0} max={5} value={autoRetry} onChange={(e) => setAutoRetry(Number(e.target.value) || 0)} className="w-16 px-2 py-1 bg-white/[0.03] border border-white/[0.08] text-white text-xs" />
          <label className="text-xs text-white/40 inline-flex items-center gap-1"><input type="checkbox" checked={onlyWithRawText} onChange={(e) => setOnlyWithRawText(e.target.checked)} />queued needs raw text</label>
          <span className="text-xs text-white/35">Done {progress.done}/{progress.total} | OK {progress.ok} | Fail {progress.failed}</span>
        </div>
        <p className={`text-xs font-['Instrument_Sans'] ${connection === "ok" ? "text-emerald-400/80" : connection === "error" ? "text-red-400/80" : "text-white/35"}`}>
          {connectionMessage || "No connection test run yet."}
        </p>
        {(isProcessing || progress.total > 0) && (
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-[#E2B93B] transition-all duration-150" style={{ width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%` }} />
            </div>
            <p className="text-xs text-white/35 font-['Instrument_Sans'] truncate">{progress.current || "Idle"}</p>
          </div>
        )}
      </div>

      <div className="border border-white/[0.08] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-white/35 text-sm font-['Instrument_Sans']">No knowledge items match your current filters.</div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="p-4 border-b border-white/[0.06] last:border-b-0 space-y-3 bg-white/[0.01]">
              <div className="flex justify-between gap-3">
                <label className="text-sm text-white/75 inline-flex items-start gap-2 leading-snug">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => setSelected((prev) => (prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]))}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-xs text-white/25 uppercase tracking-wider mb-0.5">{item.source}</span>
                    {item.title || item.url}
                  </span>
                </label>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      enqueueInspirationRefs([
                        knowledgeToInspiration({
                          id: item.id,
                          url: item.url,
                          title: item.title,
                          tags: item.tags,
                          humanCard: item.humanCard,
                        }),
                      ])
                    }
                    className="text-xs text-[#E2B93B]/80 hover:text-[#E2B93B] inline-flex items-center gap-1"
                  >
                    <Clapperboard size={11} /> Studio
                  </button>
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-white/35 inline-flex items-center gap-1">
                    Open <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-2">
                <textarea
                  value={item.rawText}
                  onChange={(e) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, rawText: e.target.value, updatedAt: Date.now() } : x)))}
                  className={adminCx.textarea}
                  rows={3}
                  placeholder="Raw extracted text"
                />
                <input
                  value={item.tags.join(", ")}
                  onChange={(e) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean), updatedAt: Date.now() } : x)))}
                  className={adminCx.input}
                  placeholder="tags, comma-separated"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-2">
                <textarea
                  value={item.humanCard}
                  onChange={(e) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, humanCard: e.target.value, updatedAt: Date.now() } : x)))}
                  className={adminCx.textarea}
                  rows={2}
                  placeholder="Human learning card"
                />
                <textarea
                  value={item.llmSnippet}
                  onChange={(e) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, llmSnippet: e.target.value, updatedAt: Date.now() } : x)))}
                  className={adminCx.textarea}
                  rows={2}
                  placeholder="LLM snippet"
                />
              </div>

              {item.processingError ? (
                <p className="text-xs text-red-400/80">{item.processingError}</p>
              ) : (
                <p className="text-xs text-emerald-400/70 inline-flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {item.status}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
