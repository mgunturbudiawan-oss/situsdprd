"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code2, Columns3, Eraser, Highlighter, ImagePlus, Image as ImageIcon,
  Italic, Link2, Link2Off, List, ListOrdered, Loader2, Maximize2, Minimize2, Minus, Quote, Redo2, Rows3, Strikethrough,
  Subscript as SubIcon, Superscript as SupIcon, Table as TableIcon, Trash2, Underline as UnderlineIcon, Undo2, Youtube as YoutubeIcon,
  type LucideIcon,
} from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

const looksHtml = (s: string) => /^\s*<(p|h[1-6]|ul|ol|blockquote|div|table|figure|img|hr)[\s>]/i.test(s || "");

function Btn({ icon: Icon, label, onClick, active, disabled }: { icon: LucideIcon; label: string; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-30",
        active ? "bg-primary-700 text-white" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

const Sep = () => <span className="mx-1 h-6 w-px shrink-0 bg-slate-200" aria-hidden />;

function Toolbar({ editor, onImageUpload, uploading, source, toggleSource, full, toggleFull }: {
  editor: Editor;
  onImageUpload: () => void;
  uploading: boolean;
  source: boolean;
  toggleSource: () => void;
  full: boolean;
  toggleFull: () => void;
}) {
  const c = () => editor.chain().focus();
  const block = editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : editor.isActive("heading", { level: 4 }) ? "h4" : "p";
  const inTable = editor.isActive("table");

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Alamat tautan (URL):", prev || "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") return c().extendMarkRange("link").unsetLink().run();
    c().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };
  const imageFromUrl = () => {
    const url = window.prompt("URL gambar:", "https://");
    if (url && /^(https?:\/\/|\/)/.test(url)) c().setImage({ src: url, alt: window.prompt("Keterangan gambar (alt):", "") || "" }).run();
  };
  const youtube = () => {
    const url = window.prompt("Tempel link video YouTube:");
    if (url) c().setYoutubeVideo({ src: url }).run();
  };

  return (
    <div className="no-scrollbar flex items-center gap-0.5 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 py-1.5 md:flex-wrap md:overflow-visible">
      <Btn icon={Undo2} label="Urungkan (Ctrl+Z)" onClick={() => c().undo().run()} disabled={source || !editor.can().undo()} />
      <Btn icon={Redo2} label="Ulangi (Ctrl+Y)" onClick={() => c().redo().run()} disabled={source || !editor.can().redo()} />
      <Sep />
      <select
        aria-label="Jenis teks"
        value={block}
        disabled={source}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") c().setParagraph().run();
          else c().setHeading({ level: Number(v[1]) as 2 | 3 | 4 }).run();
        }}
        className="h-8 shrink-0 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      >
        <option value="p">Paragraf</option>
        <option value="h2">Judul 1</option>
        <option value="h3">Judul 2</option>
        <option value="h4">Judul 3</option>
      </select>
      <Sep />
      <Btn icon={Bold} label="Tebal (Ctrl+B)" onClick={() => c().toggleBold().run()} active={editor.isActive("bold")} disabled={source} />
      <Btn icon={Italic} label="Miring (Ctrl+I)" onClick={() => c().toggleItalic().run()} active={editor.isActive("italic")} disabled={source} />
      <Btn icon={UnderlineIcon} label="Garis bawah (Ctrl+U)" onClick={() => c().toggleUnderline().run()} active={editor.isActive("underline")} disabled={source} />
      <Btn icon={Strikethrough} label="Coret" onClick={() => c().toggleStrike().run()} active={editor.isActive("strike")} disabled={source} />
      <Btn icon={Highlighter} label="Stabilo" onClick={() => c().toggleHighlight().run()} active={editor.isActive("highlight")} disabled={source} />
      <Btn icon={SubIcon} label="Subskrip" onClick={() => c().toggleSubscript().run()} active={editor.isActive("subscript")} disabled={source} />
      <Btn icon={SupIcon} label="Superskrip" onClick={() => c().toggleSuperscript().run()} active={editor.isActive("superscript")} disabled={source} />
      <Sep />
      <Btn icon={AlignLeft} label="Rata kiri" onClick={() => c().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} disabled={source} />
      <Btn icon={AlignCenter} label="Rata tengah" onClick={() => c().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} disabled={source} />
      <Btn icon={AlignRight} label="Rata kanan" onClick={() => c().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} disabled={source} />
      <Btn icon={AlignJustify} label="Rata kiri-kanan" onClick={() => c().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} disabled={source} />
      <Sep />
      <Btn icon={List} label="Daftar berbutir" onClick={() => c().toggleBulletList().run()} active={editor.isActive("bulletList")} disabled={source} />
      <Btn icon={ListOrdered} label="Daftar bernomor" onClick={() => c().toggleOrderedList().run()} active={editor.isActive("orderedList")} disabled={source} />
      <Btn icon={Quote} label="Kutipan" onClick={() => c().toggleBlockquote().run()} active={editor.isActive("blockquote")} disabled={source} />
      <Btn icon={Minus} label="Garis pemisah" onClick={() => c().setHorizontalRule().run()} disabled={source} />
      <Sep />
      <Btn icon={Link2} label="Sisipkan tautan" onClick={setLink} active={editor.isActive("link")} disabled={source} />
      <Btn icon={Link2Off} label="Hapus tautan" onClick={() => c().unsetLink().run()} disabled={source || !editor.isActive("link")} />
      <Btn icon={uploading ? Loader2 : ImagePlus} label="Unggah gambar" onClick={onImageUpload} disabled={source || uploading} />
      <Btn icon={ImageIcon} label="Gambar dari URL" onClick={imageFromUrl} disabled={source} />
      <Btn icon={YoutubeIcon} label="Video YouTube" onClick={youtube} disabled={source} />
      <Btn icon={TableIcon} label="Sisipkan tabel 3×3" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} disabled={source} />
      {inTable && !source && (
        <>
          <Sep />
          <span className="px-1 text-[11px] font-semibold uppercase text-slate-400">Tabel</span>
          <Btn icon={Rows3} label="Tambah baris" onClick={() => c().addRowAfter().run()} />
          <Btn icon={Columns3} label="Tambah kolom" onClick={() => c().addColumnAfter().run()} />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => c().deleteRow().run()} className="h-8 shrink-0 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-200">− Baris</button>
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => c().deleteColumn().run()} className="h-8 shrink-0 rounded-md px-2 text-xs text-slate-600 hover:bg-slate-200">− Kolom</button>
          <Btn icon={Trash2} label="Hapus tabel" onClick={() => c().deleteTable().run()} />
        </>
      )}
      <Sep />
      <Btn icon={Eraser} label="Hapus format" onClick={() => c().unsetAllMarks().clearNodes().run()} disabled={source} />
      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        <Btn icon={Code2} label={source ? "Kembali ke editor visual" : "Edit HTML"} onClick={toggleSource} active={source} />
        <Btn icon={full ? Minimize2 : Maximize2} label={full ? "Keluar layar penuh" : "Layar penuh"} onClick={toggleFull} active={full} />
      </div>
    </div>
  );
}

export function RichTextEditor({ name, defaultValue, placeholder, required }: { name: string; defaultValue: string; placeholder?: string; required?: boolean }) {
  const initial = looksHtml(defaultValue) ? defaultValue : renderMarkdown(defaultValue || "");
  const [html, setHtml] = useState(initial);
  const [source, setSource] = useState(false);
  const [full, setFull] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, codeBlock: false, code: false }),
      Underline,
      Highlight,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExt.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      ImageExt.configure({ inline: false }),
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: placeholder || "Mulai menulis di sini…" }),
    ],
    content: initial,
    editorProps: { attributes: { class: "rte-content prose prose-slate max-w-none focus:outline-none" } },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  const uploadImage = async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah");
      editor.chain().focus().setImage({ src: data.url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleSource = () => {
    if (source && editor) editor.commands.setContent(html, true);
    setSource(!source);
  };

  const words = editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20", full && "fixed inset-0 z-[80] flex flex-col rounded-none border-0")}>
      <input type="hidden" name={name} value={html} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
      {editor ? (
        <Toolbar editor={editor} onImageUpload={() => fileRef.current?.click()} uploading={uploading} source={source} toggleSource={toggleSource} full={full} toggleFull={() => setFull(!full)} />
      ) : (
        <div className="h-11 border-b border-slate-200 bg-slate-50" />
      )}
      <div className={cn("overflow-y-auto", full ? "flex-1" : "max-h-[70vh]")}>
        {source ? (
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            className="block min-h-[360px] w-full resize-y border-0 p-4 font-mono text-[13px] leading-relaxed text-slate-800 focus:outline-none"
            style={full ? { height: "100%" } : undefined}
          />
        ) : editor ? (
          <EditorContent editor={editor} className={cn("px-5 py-4", full && "mx-auto max-w-4xl")} />
        ) : (
          <div className="space-y-3 p-5">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
        <span>{source ? "Mode HTML" : `${words} kata`}{required && !html && <span className="ml-2 text-red-500">· wajib diisi</span>}</span>
        <span className="hidden sm:inline">Ctrl+B tebal · Ctrl+I miring · Ctrl+U garis bawah</span>
      </div>
    </div>
  );
}
