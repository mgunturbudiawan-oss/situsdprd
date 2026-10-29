export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uid() {
  return crypto.randomUUID();
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Tanggal "YYYY-MM-DD" diformat di UTC agar tidak bergeser hari; timestamp di zona WIB. */
export function formatDate(
  value: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { ...opts, timeZone: DATE_ONLY.test(value) ? "UTC" : "Asia/Jakarta" }).format(d);
}

export function formatDateTime(value: string) {
  return formatDate(value, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function dateParts(value: string) {
  return {
    day: formatDate(value, { day: "2-digit" }),
    month: formatDate(value, { month: "short" }),
    weekday: formatDate(value, { weekday: "long" }),
    year: formatDate(value, { year: "numeric" }),
  };
}

/** Tanggal hari ini (WIB) dalam format YYYY-MM-DD. */
export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export type VideoKind = "youtube" | "hls" | "file" | "embed";

export function videoKind(url: string): VideoKind {
  if (youtubeId(url)) return "youtube";
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".m3u8")) return "hls";
  if (/\.(mp4|webm|ogg|mov)$/.test(clean)) return "file";
  return "embed";
}

export function videoThumb(v: { url: string; thumbnail?: string }) {
  if (v.thumbnail) return v.thumbnail;
  const id = youtubeId(v.url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function initials(name: string) {
  return name
    .replace(/\b(H|Hj|Dr|Dra|Ir|Drs|Prof)\.\s*/gi, "")
    .split(",")[0]
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function truncate(text: string, n: number) {
  return text.length > n ? text.slice(0, n).trimEnd() + "…" : text;
}

export function lines(text: string) {
  return (text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return [11, 94, 168];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const MIX: Record<number, [number, "w" | "b"]> = {
  50: [0.95, "w"], 100: [0.9, "w"], 200: [0.75, "w"], 300: [0.6, "w"], 400: [0.4, "w"], 500: [0.18, "w"],
  600: [0, "w"], 700: [0.15, "b"], 800: [0.3, "b"], 900: [0.45, "b"], 950: [0.62, "b"],
};

/** Membangkitkan variabel CSS skala warna 50–950 dari satu warna dasar (dipakai sebagai 600). */
export function colorScaleVars(name: string, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return Object.entries(MIX)
    .map(([shade, [amt, to]]) => {
      const t = to === "w" ? 255 : 0;
      const mix = (c: number) => Math.round(c + (t - c) * amt);
      return `--${name}-${shade}: ${mix(r)} ${mix(g)} ${mix(b)};`;
    })
    .join(" ");
}
