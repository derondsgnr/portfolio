"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useEffect } from "react";

// Custom FontSize extension built on TextStyle
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size:${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => ReturnType<Editor["chain"]> }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ReturnType<Editor["chain"]> }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "40px"];

const TOOL_BTN =
  "px-2 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors duration-150 border";
const active = (on: boolean) =>
  on
    ? "border-[#ECFF95] text-[#ECFF95] bg-[#ECFF95]/10"
    : "border-transparent text-white/40 hover:text-white/70 hover:border-white/20";

function Toolbar({ editor, compact = false }: { editor: Editor | null; compact?: boolean }) {
  if (!editor) return null;

  const currentFontSize =
    editor.getAttributes("textStyle").fontSize ?? "";

  return (
    <div
      className="flex flex-wrap items-center gap-1 p-2 border-b"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "#111" }}
    >
      {/* Text style */}
      <button
        type="button"
        title="Bold"
        className={`${TOOL_BTN} ${active(editor.isActive("bold"))} font-bold`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
      >
        B
      </button>
      <button
        type="button"
        title="Italic"
        className={`${TOOL_BTN} ${active(editor.isActive("italic"))} italic`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
      >
        I
      </button>

      <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

      {/* Headings + lists — hidden in compact mode */}
      {!compact && (
        <>
          {([1, 2, 3] as const).map((level) => (
            <button
              key={level}
              type="button"
              title={`Heading ${level}`}
              className={`${TOOL_BTN} ${active(editor.isActive("heading", { level }))}`}
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level }).run(); }}
            >
              H{level}
            </button>
          ))}
          <button
            type="button"
            title="Paragraph"
            className={`${TOOL_BTN} ${active(!editor.isActive("heading") && !editor.isActive("bulletList") && !editor.isActive("orderedList"))}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }}
          >
            P
          </button>

          <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

          <button
            type="button"
            title="Bullet list"
            className={`${TOOL_BTN} ${active(editor.isActive("bulletList"))}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          >
            UL
          </button>
          <button
            type="button"
            title="Ordered list"
            className={`${TOOL_BTN} ${active(editor.isActive("orderedList"))}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          >
            OL
          </button>

          <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />
        </>
      )}

      {/* Alignment */}
      {(["left", "center", "right"] as const).map((align) => (
        <button
          key={align}
          type="button"
          title={`Align ${align}`}
          className={`${TOOL_BTN} ${active(editor.isActive({ textAlign: align }))}`}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign(align).run(); }}
        >
          {align === "left" ? "⬅" : align === "center" ? "☰" : "➡"}
        </button>
      ))}

      <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

      {/* Font size */}
      <select
        title="Font size"
        value={currentFontSize}
        className="text-[10px] font-mono px-1 py-0.5 border"
        style={{
          background: "#111",
          borderColor: "rgba(255,255,255,0.12)",
          color: currentFontSize ? "#ECFF95" : "rgba(255,255,255,0.4)",
          outline: "none",
        }}
        onChange={(e) => {
          e.preventDefault();
          if (e.target.value) {
            (editor.chain().focus() as unknown as Record<string, (s: string) => { run: () => void }>)
              .setFontSize(e.target.value)
              .run();
          } else {
            (editor.chain().focus() as unknown as Record<string, () => { run: () => void }>)
              .unsetFontSize()
              .run();
          }
        }}
      >
        <option value="">Size</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here…",
  minHeight,
  compact = false,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  compact?: boolean;
}) {
  const resolvedMinHeight = minHeight ?? (compact ? 48 : 160);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose-rte outline-none${compact ? " prose-rte-compact" : ""}`,
        style: `min-height:${resolvedMinHeight}px; padding:${compact ? "8px 12px" : "12px 14px"};`,
        "data-placeholder": placeholder,
      },
    },
  });

  // Sync external value changes (e.g. slide type switch)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#16171B" }}
    >
      <Toolbar editor={editor} compact={compact} />
      <EditorContent editor={editor} />
    </div>
  );
}
