import type { Field, Resource } from "./resources";
import type { DB } from "./types";
import { formatDate, todayISO } from "./utils";

type Row = Record<string, unknown>;

function labelOf(item: Row) {
  return String(item.nama || item.judul || item.username || item.id);
}

/** Opsi dropdown untuk field relasi. */
export function relationOptions(db: DB, fields: Field[]) {
  const out: Record<string, { value: string; label: string }[]> = {};
  for (const f of fields) {
    if ((f.type === "relation" || f.type === "multirelation") && f.relation) {
      out[f.name] = (db[f.relation] as unknown as Row[])
        .map((x) => ({ value: String(x.id), label: labelOf(x) }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  return out;
}

export function defaultValues(db: DB, res: Resource): Row {
  const v: Row = {};
  for (const f of res.fields) {
    if (f.type === "checkbox") v[f.name] = ["aktif", "publish"].includes(f.name);
    else if (f.type === "select") v[f.name] = f.options?.[0] || "";
    else if (f.type === "date" && f.name === "tanggal") v[f.name] = todayISO();
    else if (f.type === "number") v[f.name] = (db[res.key] as unknown[]).length + 1;
    else if (f.type === "multirelation") v[f.name] = [];
    else if (f.type === "color") v[f.name] = "#0b5ea8";
    else if (f.name === "penulis") v[f.name] = "Humas Sekretariat DPRD";
  }
  return v;
}

/** Nilai tampilan sederhana untuk sel tabel. */
export function cellValue(db: DB, res: Resource, name: string, item: Row): { kind: "image" | "bool" | "text"; value: string | boolean } {
  const f = res.fields.find((x) => x.name === name);
  const raw = item[name];
  if (!f) return { kind: "text", value: String(raw ?? "") };
  if (f.type === "image") return { kind: "image", value: String(raw || "") };
  if (f.type === "checkbox") return { kind: "bool", value: Boolean(raw) };
  if (f.type === "date") return { kind: "text", value: formatDate(String(raw || "")) };
  if (f.type === "relation" && f.relation) {
    const ref = (db[f.relation] as unknown as Row[]).find((x) => x.id === raw);
    return { kind: "text", value: ref ? labelOf(ref) : "—" };
  }
  return { kind: "text", value: String(raw ?? "") };
}

export function publicUrl(res: Resource, item: Row) {
  if (!res.publicPath) return null;
  return res.publicPath.replace(":slug", String(item.slug || item.id)).replace(":id", String(item.id));
}
