"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Link from "next/link";
import {
  STATUS_CONFIG,
  ACTIVITY_CONFIG,
  TODO_CONFIG,
  type WorkStatus,
  type ActivityType,
  type TodoCategory,
} from "@/lib/data/now-data";
import type { NowConfig } from "@/lib/content/now";
import type { ActivityEntry, TodoItem } from "@/lib/data/now-data";
import { ToolBadge } from "@/components/tool-badge";

function formatDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function dayLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase().slice(0, 2);
}

function ActivityHeatmap({ activity }: { activity: ActivityEntry[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: string; label: string; entries: ActivityEntry[] }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    days.push({
      date: iso,
      label: dayLabel(iso),
      entries: activity.filter((a) => a.date === iso),
    });
  }

  const getColor = (entries: ActivityEntry[]): string => {
    if (!entries.length) return "#1a1a1a";
    const types = entries.map((e) => e.type);
    if (types.includes("design") && types.includes("code")) return "#E2B93B";
    const t = types[0];
    return ACTIVITY_CONFIG[t]?.color || "#333";
  };

  const getOpacity = (entries: ActivityEntry[]): number => {
    if (!entries.length) return 1;
    return Math.min(0.3 + entries.length * 0.3, 1);
  };

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref}>
      <div className="flex gap-2">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.04, duration: 0.4 }}
            className="flex flex-col items-center gap-2 flex-1 min-w-0 group relative"
          >
            <div
              className="w-full aspect-square rounded-[2px] relative cursor-default transition-transform group-hover:scale-110"
              style={{
                background: getColor(day.entries),
                opacity: getOpacity(day.entries),
                boxShadow: day.entries.length ? `0 0 8px ${getColor(day.entries)}40` : "none",
              }}
            />
            <span className="text-[8px] tracking-[0.1em] text-[#333] group-hover:text-[#666] transition-colors" style={{ fontFamily: "monospace" }}>
              {day.label}
            </span>
            {day.entries.length > 0 && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111] border border-[#2a2a2a] px-3 py-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-max max-w-[180px]">
                <span className="text-[9px] tracking-[0.1em] text-[#666] block mb-1" style={{ fontFamily: "monospace" }}>
                  {formatDate(day.date)}
                </span>
                {day.entries.map((e) => (
                  <div key={e.id} className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] tracking-[0.1em] px-1.5 py-0.5" style={{ fontFamily: "monospace", color: ACTIVITY_CONFIG[e.type].color, background: ACTIVITY_CONFIG[e.type].bg }}>
                      {ACTIVITY_CONFIG[e.type].label}
                    </span>
                    <span className="text-[9px] text-[#888] flex items-center gap-1" style={{ fontFamily: "monospace" }}>
                      <ToolBadge tool={e.tool} size={12} showLabel />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed({ activity }: { activity: ActivityEntry[] }) {
  const unique = activity.filter((a, i, arr) => arr.findIndex((b) => b.id === a.id) === i).slice(0, 7);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="space-y-0">
      {unique.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.07, duration: 0.5 }}
          className="flex items-start gap-4 py-4 border-b border-[#111] group hover:border-[#2a2a2a] transition-colors"
        >
          <span className="text-[10px] tracking-[0.1em] text-[#444] min-w-[54px] mt-0.5 group-hover:text-[#666] transition-colors" style={{ fontFamily: "monospace" }}>
            {formatDate(entry.date)}
          </span>
          <span className="text-[9px] tracking-[0.15em] px-2 py-1 min-w-[68px] text-center flex-shrink-0 mt-0.5" style={{ fontFamily: "monospace", color: ACTIVITY_CONFIG[entry.type].color, background: ACTIVITY_CONFIG[entry.type].bg }}>
            {ACTIVITY_CONFIG[entry.type].label}
          </span>
          {entry.tool && (
            <span className="text-[10px] tracking-[0.08em] text-[#555] min-w-[52px] flex-shrink-0 mt-0.5 hidden md:flex md:items-center" style={{ fontFamily: "monospace" }}>
              <ToolBadge tool={entry.tool} size={14} showLabel />
            </span>
          )}
          <span className="text-[11px] text-[#888] group-hover:text-[#aaa] transition-colors leading-relaxed flex-1" style={{ fontFamily: "monospace" }}>
            {entry.description}
          </span>
          {entry.duration && (
            <span className="text-[10px] text-[#333] group-hover:text-[#555] transition-colors flex-shrink-0 mt-0.5" style={{ fontFamily: "monospace" }}>
              {entry.duration}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TimeBlocks({ todos }: { todos: TodoItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[76px] top-3 bottom-3 w-px bg-[#1a1a1a] hidden md:block" />
      <div className="space-y-0">
        {todos.map((todo, i) => {
          const cfg = TODO_CONFIG[todo.category];
          return (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-stretch gap-4 md:gap-6 group"
            >
              <div className="flex flex-col items-end min-w-[72px] pt-4 pb-4 flex-shrink-0">
                {todo.startTime && <span className="text-[10px] tracking-[0.08em] text-[#444] group-hover:text-[#666] transition-colors leading-none" style={{ fontFamily: "monospace" }}>{todo.startTime}</span>}
                {todo.endTime && <span className="text-[9px] tracking-[0.06em] text-[#2a2a2a] mt-1 leading-none" style={{ fontFamily: "monospace" }}>{todo.endTime}</span>}
              </div>
              <div className="hidden md:flex flex-col items-center pt-5 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${todo.completed ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`} style={{ background: cfg.color }} />
              </div>
              <div className={`flex-1 flex items-center gap-3 py-3.5 px-4 border-l-2 my-2 transition-all group-hover:border-opacity-100 ${todo.completed ? "opacity-40" : ""}`} style={{ borderColor: todo.completed ? "#2a2a2a" : cfg.color + "60", background: todo.completed ? "transparent" : cfg.bg }}>
                <div className="w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors" style={{ borderColor: todo.completed ? "#333" : cfg.color + "60", background: todo.completed ? cfg.bg : "transparent" }}>
                  {todo.completed && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke={cfg.color} strokeWidth="1.5" /></svg>}
                </div>
                <span className="text-[9px] tracking-[0.15em] px-2 py-0.5 flex-shrink-0 hidden md:block" style={{ fontFamily: "monospace", color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                <span className={`text-[12px] leading-snug flex-1 transition-colors ${todo.completed ? "line-through text-[#444]" : "text-[#aaa] group-hover:text-white"}`} style={{ fontFamily: "monospace" }}>{todo.text}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const ADMIN_PIN = "1234";

function PinModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const handleChange = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError(false);
    if (val && i < 3) inputRefs.current[i + 1]?.focus();
    if (next.every((d) => d !== "") && val) {
      if (next.join("") === ADMIN_PIN) onSuccess();
      else {
        setError(true);
        setTimeout(() => { setDigits(["", "", "", ""]); setError(false); inputRefs.current[0]?.focus(); }, 700);
      }
    }
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center px-6" onClick={onClose}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.3 }} className="bg-[#0f0f0f] border border-[#1a1a1a] p-8 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] text-[#E2B93B] block mb-2" style={{ fontFamily: "monospace" }}>ADMIN ACCESS</span>
          <p className="text-[13px] text-[#555]" style={{ fontFamily: "monospace" }}>Enter your PIN to continue</p>
        </div>
        <motion.div animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}} transition={{ duration: 0.4 }} className="flex gap-3 justify-center mb-6">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="password" inputMode="numeric" maxLength={1} value={d} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKey(i, e)} className="w-12 h-12 text-center text-lg bg-transparent border outline-none transition-all" style={{ fontFamily: "monospace", borderColor: error ? "#ef4444" : d ? "#E2B93B" : "#222", color: "#fff", caretColor: "#E2B93B" }} />
          ))}
        </motion.div>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[10px] tracking-[0.15em] text-[#ef4444] mb-4" style={{ fontFamily: "monospace" }}>INCORRECT PIN</motion.p>}
        <button onClick={onClose} className="w-full text-[10px] tracking-[0.2em] text-[#333] hover:text-[#666] transition-colors pt-2" style={{ fontFamily: "monospace" }}>CANCEL</button>
      </motion.div>
    </motion.div>
  );
}

const ALL_STATUSES: WorkStatus[] = ["deep-work", "meetings", "resting", "sick", "traveling", "offline"];
const ALL_ACTIVITY_TYPES: ActivityType[] = ["design", "code", "writing", "planning", "research"];
const ALL_TODO_CATS: TodoCategory[] = ["design", "code", "writing", "admin", "meeting"];

function AdminDrawer({
  onClose,
  currentStatus,
  onStatusChange,
  currentFocus,
  todos,
  onToggleTodo,
  onAddTodo,
}: {
  onClose: () => void;
  currentStatus: WorkStatus;
  onStatusChange: (s: WorkStatus) => void;
  currentFocus: string;
  todos: TodoItem[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (todo: Omit<TodoItem, "id" | "completed">) => void;
}) {
  const [activityType, setActivityType] = useState<ActivityType>("design");
  const [activityTool, setActivityTool] = useState("");
  const [activityDesc, setActivityDesc] = useState("");
  const [activityDuration, setActivityDuration] = useState("");
  const [activityLogged, setActivityLogged] = useState(false);
  const [todoText, setTodoText] = useState("");
  const [todoStart, setTodoStart] = useState("");
  const [todoEnd, setTodoEnd] = useState("");
  const [todoCat, setTodoCat] = useState<TodoCategory>("design");

  const handleLogActivity = () => {
    if (!activityDesc) return;
    setActivityLogged(true);
    setTimeout(() => { setActivityLogged(false); setActivityDesc(""); setActivityTool(""); setActivityDuration(""); }, 1500);
  };

  const handleAddTodo = () => {
    if (!todoText) return;
    onAddTodo({ text: todoText, startTime: todoStart || undefined, endTime: todoEnd || undefined, category: todoCat });
    setTodoText("");
    setTodoStart("");
    setTodoEnd("");
  };

  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 35 }} className="fixed right-0 top-0 bottom-0 z-[90] bg-[#0a0a0a] border-l border-[#1a1a1a] w-full md:w-[440px] overflow-y-auto">
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between z-10">
        <span className="text-[11px] tracking-[0.3em] text-[#E2B93B]" style={{ fontFamily: "monospace" }}>ADMIN PANEL</span>
        <button onClick={onClose} className="w-8 h-8 border border-[#222] flex items-center justify-center text-[#555] hover:text-white hover:border-[#444] transition-colors">×</button>
      </div>
      <div className="p-6 space-y-8">
        <div>
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-4" style={{ fontFamily: "monospace" }}>SET STATUS</span>
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = s === currentStatus;
              return (
                <button key={s} onClick={() => onStatusChange(s)} className="flex items-center gap-3 px-4 py-3 border text-left transition-all" style={{ borderColor: active ? cfg.color + "60" : "#1a1a1a", background: active ? cfg.color + "0d" : "transparent" }}>
                  <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                  <span className="text-[10px] tracking-[0.12em]" style={{ fontFamily: "monospace", color: active ? cfg.color : "#555" }}>{cfg.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-3" style={{ fontFamily: "monospace" }}>CURRENT FOCUS</span>
          <textarea defaultValue={currentFocus} rows={2} className="w-full bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-4 py-3 text-[12px] text-[#aaa] outline-none resize-none transition-colors" style={{ fontFamily: "monospace" }} placeholder="What are you building today?" />
          <button className="mt-2 text-[9px] tracking-[0.2em] text-[#E2B93B]/60 hover:text-[#E2B93B] transition-colors" style={{ fontFamily: "monospace" }}>SAVE FOCUS →</button>
        </div>
        <div>
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-4" style={{ fontFamily: "monospace" }}>LOG ACTIVITY</span>
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_ACTIVITY_TYPES.map((t) => {
              const cfg = ACTIVITY_CONFIG[t];
              return <button key={t} onClick={() => setActivityType(t)} className="text-[9px] tracking-[0.15em] px-3 py-1.5 border transition-all" style={{ fontFamily: "monospace", borderColor: activityType === t ? cfg.color + "60" : "#1a1a1a", color: activityType === t ? cfg.color : "#444", background: activityType === t ? cfg.bg : "transparent" }}>{cfg.label}</button>;
            })}
          </div>
          <div className="space-y-2">
            <input value={activityTool} onChange={(e) => setActivityTool(e.target.value)} placeholder="Tool (Figma, Cursor…)" className="w-full bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-4 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors" style={{ fontFamily: "monospace" }} />
            <input value={activityDesc} onChange={(e) => setActivityDesc(e.target.value)} placeholder="What did you do?" className="w-full bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-4 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors" style={{ fontFamily: "monospace" }} />
            <input value={activityDuration} onChange={(e) => setActivityDuration(e.target.value)} placeholder="Duration (e.g. 2h 30m)" className="w-full bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-4 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors" style={{ fontFamily: "monospace" }} />
          </div>
          <AnimatePresence mode="wait">
            {activityLogged ? (
              <motion.div key="logged" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-[10px] tracking-[0.15em] text-[#22c55e]" style={{ fontFamily: "monospace" }}>✓ LOGGED</motion.div>
            ) : (
              <motion.button key="btn" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleLogActivity} disabled={!activityDesc} className="mt-3 text-[9px] tracking-[0.2em] px-5 py-2.5 border transition-all disabled:opacity-20 disabled:cursor-not-allowed" style={{ fontFamily: "monospace", borderColor: "#E2B93B40", color: "#E2B93B" }}>ADD ENTRY →</motion.button>
            )}
          </AnimatePresence>
        </div>
        <div>
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-4" style={{ fontFamily: "monospace" }}>ADD TIME BLOCK</span>
          <div className="flex flex-wrap gap-2 mb-3">
            {ALL_TODO_CATS.map((c) => {
              const cfg = TODO_CONFIG[c];
              return <button key={c} onClick={() => setTodoCat(c)} className="text-[9px] tracking-[0.15em] px-3 py-1.5 border transition-all" style={{ fontFamily: "monospace", borderColor: todoCat === c ? cfg.color + "60" : "#1a1a1a", color: todoCat === c ? cfg.color : "#444", background: todoCat === c ? cfg.bg : "transparent" }}>{cfg.label}</button>;
            })}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input value={todoStart} onChange={(e) => setTodoStart(e.target.value)} placeholder="09:00" className="w-24 bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-3 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors text-center" style={{ fontFamily: "monospace" }} />
              <span className="text-[#333] self-center" style={{ fontFamily: "monospace" }}>–</span>
              <input value={todoEnd} onChange={(e) => setTodoEnd(e.target.value)} placeholder="11:00" className="w-24 bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-3 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors text-center" style={{ fontFamily: "monospace" }} />
            </div>
            <input value={todoText} onChange={(e) => setTodoText(e.target.value)} placeholder="Task description" className="w-full bg-transparent border border-[#1a1a1a] focus:border-[#E2B93B]/40 px-4 py-2.5 text-[12px] text-[#aaa] outline-none transition-colors" style={{ fontFamily: "monospace" }} onKeyDown={(e) => e.key === "Enter" && handleAddTodo()} />
          </div>
          <button onClick={handleAddTodo} disabled={!todoText} className="mt-3 text-[9px] tracking-[0.2em] px-5 py-2.5 border transition-all disabled:opacity-20 disabled:cursor-not-allowed" style={{ fontFamily: "monospace", borderColor: "#E2B93B40", color: "#E2B93B" }}>ADD BLOCK →</button>
        </div>
        <div>
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-4" style={{ fontFamily: "monospace" }}>TODAY&apos;S BLOCKS</span>
          <div className="space-y-2">
            {todos.map((todo) => {
              const cfg = TODO_CONFIG[todo.category];
              return (
                <div key={todo.id} className="flex items-center gap-3 px-3 py-2.5 border transition-all" style={{ borderColor: todo.completed ? "#1a1a1a" : cfg.color + "30", background: todo.completed ? "transparent" : cfg.bg, opacity: todo.completed ? 0.4 : 1 }}>
                  <button onClick={() => onToggleTodo(todo.id)} className="w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors" style={{ borderColor: todo.completed ? "#333" : cfg.color + "60", background: todo.completed ? cfg.bg : "transparent" }}>
                    {todo.completed && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke={cfg.color} strokeWidth="1.5" /></svg>}
                  </button>
                  {todo.startTime && <span className="text-[9px] text-[#444] flex-shrink-0" style={{ fontFamily: "monospace" }}>{todo.startTime}{todo.endTime ? `–${todo.endTime}` : ""}</span>}
                  <span className={`text-[11px] flex-1 ${todo.completed ? "line-through text-[#333]" : "text-[#888]"}`} style={{ fontFamily: "monospace" }}>{todo.text}</span>
                  <span className="text-[8px] tracking-[0.1em] px-1.5 py-0.5 flex-shrink-0" style={{ fontFamily: "monospace", color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function NowClient({ initial }: { initial: NowConfig }) {
  const [showPin, setShowPin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [status, setStatus] = useState<WorkStatus>(initial.status);
  const [todos, setTodos] = useState<TodoItem[]>(initial.todos);
  const statusCfg = STATUS_CONFIG[status];
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const handlePinSuccess = () => {
    setShowPin(false);
    setAdminOpen(true);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTodo = (todo: Omit<TodoItem, "id" | "completed">) => {
    setTodos((prev) => [...prev, { ...todo, id: `t-${Date.now()}`, completed: false }]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />

      <div ref={heroRef} className="relative z-10 px-6 md:px-14 lg:px-20 pt-16 pb-20">
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="text-[10px] tracking-[0.2em] text-[#444] hover:text-[#E2B93B] transition-colors" style={{ fontFamily: "monospace" }}>← derondsgnr</Link>
          <button onClick={() => setShowPin(true)} className="group flex items-center gap-2 text-[10px] tracking-[0.15em] text-[#2a2a2a] hover:text-[#E2B93B] transition-colors" style={{ fontFamily: "monospace" }}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="group-hover:stroke-[#E2B93B] transition-colors" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="6" width="10" height="7" rx="1" /><path d="M3.5 6V4a2.5 2.5 0 015 0v2" /></svg>
            ADMIN
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="flex items-center gap-4">
            <div className="relative w-3 h-3 flex-shrink-0">
              <div className="w-3 h-3 rounded-full" style={{ background: statusCfg.color }} />
              {(status === "deep-work" || status === "meetings") && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: statusCfg.color, opacity: 0.4 }} />}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl uppercase leading-none tracking-tight" style={{ fontFamily: "var(--font-heading)", color: statusCfg.color, letterSpacing: "-0.03em" }}>
              {statusCfg.label}
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="flex-shrink-0 text-right md:text-left">
            <div className="text-5xl md:text-6xl lg:text-7xl leading-none" style={{ fontFamily: "var(--font-heading)", color: "#E2B93B", letterSpacing: "-0.02em" }}>{initial.streak}</div>
            <span className="text-[9px] tracking-[0.25em] text-[#444] block mt-1" style={{ fontFamily: "monospace" }}>DAY STREAK</span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="mb-4">
          <span className="text-[9px] tracking-[0.25em] text-[#444] block mb-2" style={{ fontFamily: "monospace" }}>CURRENTLY BUILDING</span>
          <p className="text-base md:text-lg text-[#999] max-w-xl" style={{ fontFamily: "monospace", lineHeight: 1.7 }}>&quot;{initial.focus}&quot;</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.45 }} className="flex items-center gap-3 flex-wrap">
          <span className="text-[9px] tracking-[0.2em] text-[#333]" style={{ fontFamily: "monospace" }}>ACTIVE</span>
          {initial.toolsToday.map((tool) => (
            <span key={tool} className="text-[10px] tracking-[0.1em] px-3 py-1 border border-[#222] text-[#555] inline-flex items-center gap-1.5" style={{ fontFamily: "monospace" }}>
              <ToolBadge tool={tool} size={14} showLabel />
            </span>
          ))}
        </motion.div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent mx-6 md:mx-14 lg:mx-20" />

      <div className="relative z-10 px-6 md:px-14 lg:px-20 py-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[9px] tracking-[0.3em] text-[#444]" style={{ fontFamily: "monospace" }}>LAST 14 DAYS</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <div className="flex items-center gap-3">
            {(["design", "code", "writing"] as ActivityType[]).map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[1px]" style={{ background: ACTIVITY_CONFIG[t].color, opacity: 0.8 }} />
                <span className="text-[9px] tracking-[0.1em] text-[#333] hidden md:block" style={{ fontFamily: "monospace" }}>{ACTIVITY_CONFIG[t].label}</span>
              </div>
            ))}
          </div>
        </div>
        <ActivityHeatmap activity={initial.activity} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent mx-6 md:mx-14 lg:mx-20" />

      <div className="relative z-10 px-6 md:px-14 lg:px-20 py-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[9px] tracking-[0.3em] text-[#444]" style={{ fontFamily: "monospace" }}>RECENT ACTIVITY</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
        </div>
        <ActivityFeed activity={initial.activity} />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent mx-6 md:mx-14 lg:mx-20" />

      <div className="relative z-10 px-6 md:px-14 lg:px-20 py-16 pb-32">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[9px] tracking-[0.3em] text-[#444]" style={{ fontFamily: "monospace" }}>TODAY&apos;S BLOCKS</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <span className="text-[9px] tracking-[0.1em] text-[#333]" style={{ fontFamily: "monospace" }}>{todos.filter((t) => t.completed).length}/{todos.length} done</span>
        </div>
        <TimeBlocks todos={todos} />

        <div className="mt-8 h-px bg-[#111]">
          <motion.div className="h-full bg-[#E2B93B]" initial={{ width: 0 }} animate={{ width: `${todos.length ? (todos.filter((t) => t.completed).length / todos.length) * 100 : 0}%` }} transition={{ duration: 1, delay: 0.5 }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[9px] text-[#2a2a2a]" style={{ fontFamily: "monospace" }}>00:00</span>
          <span className="text-[9px] text-[#2a2a2a]" style={{ fontFamily: "monospace" }}>24:00</span>
        </div>
      </div>

      <AnimatePresence>
        {showPin && <PinModal onSuccess={handlePinSuccess} onClose={() => setShowPin(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {adminOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAdminOpen(false)} className="fixed inset-0 z-[80] bg-[#0a0a0a]/60 backdrop-blur-sm" />
            <AdminDrawer onClose={() => setAdminOpen(false)} currentStatus={status} onStatusChange={setStatus} currentFocus={initial.focus} todos={todos} onToggleTodo={handleToggleTodo} onAddTodo={handleAddTodo} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
