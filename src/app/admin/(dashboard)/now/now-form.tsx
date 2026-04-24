"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { saveNow } from "@/app/admin/actions";
import { AdminSaveFeedback } from "@/components/admin/admin-save-feedback";
import { useAdmin } from "@/components/admin/admin-context";
import { adminCx, PageHeader, FieldGroup, FormField, SaveButton } from "@/components/admin/admin-primitives";
import {
  STATUS_CONFIG, ACTIVITY_CONFIG,
  type WorkStatus, type ActivityType, type ActivityEntry, type TodoItem, type TodoCategory,
} from "@/lib/data/now-data";
import type { NowConfig } from "@/lib/content/now";
import { Plus, Trash2, Check } from "lucide-react";

const WORK_STATUSES: WorkStatus[] = ["deep-work", "meetings", "resting", "sick", "traveling", "offline"];
const ACTIVITY_TYPES: ActivityType[] = ["design", "code", "writing", "planning", "research"];
const TODO_CATEGORIES: TodoCategory[] = ["design", "code", "writing", "admin", "meeting"];

export function AdminNowForm({ initial }: { initial: NowConfig }) {
  const { pushHistory, pendingRevert, clearPendingRevert } = useAdmin();
  const [config, setConfig] = useState<NowConfig>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [toolInput, setToolInput] = useState("");

  useEffect(() => {
    setConfig(initial);
  }, [initial]);

  useEffect(() => {
    if (pendingRevert?.section === "now") {
      setConfig(pendingRevert.snapshot as NowConfig);
      clearPendingRevert();
    }
  }, [pendingRevert, clearPendingRevert]);

  function set<K extends keyof NowConfig>(key: K, value: NowConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    const result = await saveNow(config, "Update now page");
    if (result.ok) {
      pushHistory("now", "Now", `Status: ${config.status} — ${config.focus}`, config);
      setLastSaved(new Date().toLocaleTimeString());
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? null);
    }
  }

  function addTool() {
    const t = toolInput.trim();
    if (!t || config.toolsToday.includes(t)) return;
    set("toolsToday", [...config.toolsToday, t]);
    setToolInput("");
  }
  function removeTool(t: string) {
    set("toolsToday", config.toolsToday.filter((x) => x !== t));
  }

  function addActivity() {
    const newEntry: ActivityEntry = {
      id: `a-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: "design",
      description: "",
      tool: "",
      duration: "",
    };
    set("activity", [newEntry, ...config.activity]);
  }
  function updateActivity(id: string, key: keyof ActivityEntry, value: string) {
    set("activity", config.activity.map((a) => a.id === id ? { ...a, [key]: value } : a));
  }
  function removeActivity(id: string) {
    set("activity", config.activity.filter((a) => a.id !== id));
  }

  function addTodo() {
    const newTodo: TodoItem = {
      id: `t-${Date.now()}`,
      text: "",
      category: "design",
      completed: false,
    };
    set("todos", [...config.todos, newTodo]);
  }
  function updateTodo(id: string, key: keyof TodoItem, value: unknown) {
    set("todos", config.todos.map((t) => t.id === id ? { ...t, [key]: value } : t));
  }
  function removeTodo(id: string) {
    set("todos", config.todos.filter((t) => t.id !== id));
  }

  return (
    <div>
      <PageHeader
        index={7}
        title="Now"
        description="Update your current status, focus, streak, and today's activity log shown on the /now page."
        lastSaved={lastSaved}
      />

      <form onSubmit={handleSave} className="max-w-2xl space-y-10">
        <FieldGroup legend="Current State">
          <FormField label="Work Status">
            <div className="grid grid-cols-3 gap-2">
              {WORK_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("status", s)}
                    className={`flex items-center gap-2 px-3 py-2.5 border text-[11px] font-['Instrument_Sans'] tracking-wider uppercase transition-all ${
                      config.status === s
                        ? "border-[#E2B93B]/40 bg-[#E2B93B]/[0.06] text-white"
                        : "border-white/[0.06] text-white/30 hover:border-white/[0.15]"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField label="Current Focus">
            <input
              className={adminCx.input}
              value={config.focus}
              onChange={(e) => set("focus", e.target.value)}
              placeholder="What are you working on today?"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Streak (days)">
              <input
                type="number"
                className={adminCx.input}
                value={config.streak}
                onChange={(e) => set("streak", parseInt(e.target.value) || 0)}
                min={0}
              />
            </FormField>
            <FormField label="Streak Start Date">
              <input
                type="date"
                className={adminCx.input}
                value={config.streakStart}
                onChange={(e) => set("streakStart", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Tools Today">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {config.toolsToday.map((tool) => (
                <span key={tool} className="flex items-center gap-1.5 px-2.5 py-1 border border-white/[0.08] text-[11px] font-['Instrument_Sans'] text-white/50">
                  {tool}
                  <button type="button" onClick={() => removeTool(tool)} className="text-white/25 hover:text-red-400/70 transition-colors">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={adminCx.input}
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTool())}
                placeholder="Figma, Cursor, Notion..."
              />
              <button type="button" onClick={addTool} className="px-4 border border-white/[0.08] text-white/30 hover:text-white hover:border-white/20 transition-colors text-sm">
                +
              </button>
            </div>
          </FormField>
        </FieldGroup>

        <FieldGroup legend="Recent Activity">
          <div className="flex justify-end mb-2">
            <button type="button" onClick={addActivity} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/60 hover:text-[#E2B93B] transition-colors">
              <Plus size={11} /> Add Entry
            </button>
          </div>
          <div className="space-y-3">
            {config.activity.map((entry) => {
              const cfg = ACTIVITY_CONFIG[entry.type];
              return (
                <motion.div key={entry.id} layout className="group p-3 border border-white/[0.06] bg-white/[0.01] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-['Instrument_Sans']" style={{ background: cfg.bg, color: cfg.color }}>
                      {cfg.label}
                    </div>
                    <button type="button" onClick={() => removeActivity(entry.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400/60 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className={adminCx.input} value={entry.date} onChange={(e) => updateActivity(entry.id, "date", e.target.value)} />
                    <select className={adminCx.select} value={entry.type} onChange={(e) => updateActivity(entry.id, "type", e.target.value)}>
                      {ACTIVITY_TYPES.map((t) => <option key={t} value={t} style={{ background: "#0A0A0A" }}>{t}</option>)}
                    </select>
                  </div>
                  <input className={adminCx.input} value={entry.description} onChange={(e) => updateActivity(entry.id, "description", e.target.value)} placeholder="What did you work on?" />
                  <div className="grid grid-cols-2 gap-2">
                    <input className={adminCx.input} value={entry.tool ?? ""} onChange={(e) => updateActivity(entry.id, "tool", e.target.value)} placeholder="Tool (Figma, Cursor...)" />
                    <input className={adminCx.input} value={entry.duration ?? ""} onChange={(e) => updateActivity(entry.id, "duration", e.target.value)} placeholder="Duration (3h 20m)" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup legend="Today's Schedule">
          <div className="flex justify-end mb-2">
            <button type="button" onClick={addTodo} className="flex items-center gap-1.5 text-[10px] font-['Instrument_Sans'] tracking-wider uppercase text-[#E2B93B]/60 hover:text-[#E2B93B] transition-colors">
              <Plus size={11} /> Add Block
            </button>
          </div>
          <div className="space-y-2">
            {config.todos.map((todo) => (
              <motion.div key={todo.id} layout className="group flex items-center gap-3 p-3 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => updateTodo(todo.id, "completed", !todo.completed)}
                  className={`shrink-0 w-4 h-4 border flex items-center justify-center transition-colors ${todo.completed ? "bg-[#E2B93B] border-[#E2B93B]" : "border-white/20"}`}
                >
                  {todo.completed && <Check size={10} className="text-[#0A0A0A]" />}
                </button>
                <input
                  className="flex-1 bg-transparent text-[12px] font-['Instrument_Sans'] text-white/60 focus:outline-none placeholder:text-white/20"
                  value={todo.text}
                  onChange={(e) => updateTodo(todo.id, "text", e.target.value)}
                  placeholder="Task description..."
                />
                <div className="flex items-center gap-2 shrink-0">
                  <input className="w-16 bg-transparent border-b border-white/[0.08] text-[10px] font-['Instrument_Sans'] text-white/25 focus:outline-none text-center" value={todo.startTime ?? ""} onChange={(e) => updateTodo(todo.id, "startTime", e.target.value)} placeholder="09:00" />
                  <span className="text-white/15 text-[10px]">→</span>
                  <input className="w-16 bg-transparent border-b border-white/[0.08] text-[10px] font-['Instrument_Sans'] text-white/25 focus:outline-none text-center" value={todo.endTime ?? ""} onChange={(e) => updateTodo(todo.id, "endTime", e.target.value)} placeholder="11:00" />
                  <select className="bg-transparent text-[9px] font-['Instrument_Sans'] text-white/20 focus:outline-none cursor-pointer" value={todo.category} onChange={(e) => updateTodo(todo.id, "category", e.target.value)}>
                    {TODO_CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{c}</option>)}
                  </select>
                  <button type="button" onClick={() => removeTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-white/15 hover:text-red-400/60 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </FieldGroup>

        <div className="space-y-4">
          <SaveButton status={status} />
          <AdminSaveFeedback
            status={status}
            error={errorMsg}
            savingMessage="Saving changes to content/now.json..."
            successMessage="Saved to content/now.json."
          />
        </div>
      </form>
    </div>
  );
}
