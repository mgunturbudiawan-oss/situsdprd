"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, FileUp, Loader2, Save } from "lucide-react";
import type { Field } from "@/lib/resources";
import type { FormState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";

export type Option = { value: string; label: string };

export function SubmitButton({ label = "Simpan" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

function ImageInput({ field, value }: { field: Field; value: string }) {
  const [url, setUrl] = useState(value);
  const [preview, setPreview] = useState(value);
  const isImage = field.type === "image";
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      {isImage && preview && <img src={preview} alt="" className="max-h-48 rounded-lg border bg-white object-contain" />}
      {!isImage && url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline">
          <FileUp className="h-4 w-4" /> {url.split("/").pop()}
        </a>
      )}
      <input
        type="file"
        name={`${field.name}__file`}
        accept={isImage ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && isImage) setPreview(URL.createObjectURL(f));
        }}
        className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-800"
      />
      <input
        name={field.name}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setPreview(e.target.value);
        }}
        placeholder="…atau tempel URL"
        className="input text-xs"
      />
    </div>
  );
}

function MultiRelation({ field, value, options }: { field: Field; value: string[]; options: Option[] }) {
  const [q, setQ] = useState("");
  const selected = new Set(value);
  return (
    <div className="rounded-xl border border-slate-300">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter..." className="w-full rounded-t-xl border-b px-3 py-2 text-sm focus:outline-none" />
      <div className="grid max-h-64 gap-1 overflow-y-auto p-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50", q && !o.label.toLowerCase().includes(q.toLowerCase()) && "hidden")}>
            <input type="checkbox" name={field.name} value={o.value} defaultChecked={selected.has(o.value)} className="h-4 w-4 rounded border-slate-300" />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function FieldInput({ field, value, options }: { field: Field; value: unknown; options?: Option[] }) {
  const v = value ?? "";
  switch (field.type) {
    case "textarea":
      return <textarea name={field.name} defaultValue={String(v)} rows={4} required={field.required} placeholder={field.placeholder} className="input" />;
    case "richtext":
      return <RichTextEditor name={field.name} defaultValue={String(v)} placeholder={field.placeholder} required={field.required} />;
    case "image":
    case "file":
      return <ImageInput field={field} value={String(v)} />;
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} className="h-5 w-5 rounded border-slate-300 text-primary-600" />
          <span className="text-sm font-medium text-slate-700">{field.label}</span>
        </label>
      );
    case "select":
      return (
        <select name={field.name} defaultValue={String(v)} className="input">
          {(field.options || []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "relation":
      return (
        <select name={field.name} defaultValue={String(v)} className="input">
          <option value="">— Tidak ada —</option>
          {(options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "multirelation":
      return <MultiRelation field={field} value={Array.isArray(value) ? (value as string[]) : []} options={options || []} />;
    case "color":
      return (
        <div className="flex items-center gap-3">
          <input type="color" name={field.name} defaultValue={String(v) || "#0b5ea8"} className="h-11 w-16 cursor-pointer rounded-lg border border-slate-300 p-1" />
          <span className="text-xs text-slate-500">Klik untuk memilih warna</span>
        </div>
      );
    case "password":
      return <input type="password" name={field.name} autoComplete="new-password" className="input" />;
    default:
      return (
        <input
          type={field.type === "text" ? "text" : field.type}
          name={field.name}
          defaultValue={String(v)}
          required={field.required}
          placeholder={field.placeholder}
          className="input"
        />
      );
  }
}

export function ResourceForm({
  fields,
  values,
  options = {},
  action,
  cancelHref,
  submitLabel,
}: {
  fields: Field[];
  values: Record<string, unknown>;
  options?: Record<string, Option[]>;
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  cancelHref?: string;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, null);

  const sections: { name: string; fields: Field[] }[] = [];
  for (const f of fields) {
    const name = f.section || "";
    let s = sections.find((x) => x.name === name);
    if (!s) sections.push((s = { name, fields: [] }));
    s.fields.push(f);
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
          <AlertCircle className="h-5 w-5" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-5 w-5" /> {state.success}
        </div>
      )}
      {sections.map((s) => (
        <div key={s.name} className="card p-6">
          {s.name && <h2 className="mb-5 border-b pb-3 font-display text-lg font-bold text-slate-900">{s.name}</h2>}
          <div className="grid gap-5 md:grid-cols-2">
            {s.fields.map((f) => (
              <div key={f.name} className={cn(f.full && "md:col-span-2")}>
                {f.type !== "checkbox" && (
                  <label className="label">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                )}
                <FieldInput field={f} value={values[f.name]} options={options[f.name]} />
                {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-end gap-3 border-t bg-white/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        {cancelHref && (
          <Link href={cancelHref} className="btn-outline">
            Batal
          </Link>
        )}
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
