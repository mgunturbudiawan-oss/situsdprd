import type { Anggota, DB, Komisi } from "./types";
import { todayISO } from "./utils";

// Semua fungsi menerima snapshot `db` (hasil `await readDB()`) agar halaman cukup sekali membaca data.

const JABATAN_RANK: Record<string, number> = { "Ketua DPRD": 0, "Wakil Ketua DPRD": 1 };

export function sortAnggota(a: Anggota, b: Anggota) {
  return (JABATAN_RANK[a.jabatan] ?? 9) - (JABATAN_RANK[b.jabatan] ?? 9) || a.urutan - b.urutan || a.nama.localeCompare(b.nama);
}

export function getPimpinan(db: DB) {
  return db.anggota.filter((a) => a.jabatan in JABATAN_RANK).sort(sortAnggota);
}

export function getLookups(db: DB) {
  return {
    anggota: new Map(db.anggota.map((a) => [a.id, a])),
    fraksi: new Map(db.fraksi.map((f) => [f.id, f])),
    komisi: new Map(db.komisi.map((k) => [k.id, k])),
  };
}

export function komisiMembers(db: DB, k: Komisi) {
  const extra = new Set([...(k.anggotaIds || []), k.ketuaId, k.wakilKetuaId, k.sekretarisId].filter(Boolean));
  return db.anggota.filter((a) => a.komisiId === k.id || extra.has(a.id)).sort(sortAnggota);
}

export function getBerita(db: DB, opts: { limit?: number; kategori?: string; q?: string } = {}) {
  let items = db.berita.filter((b) => b.publish);
  if (opts.kategori) items = items.filter((b) => b.kategori === opts.kategori);
  if (opts.q) {
    const q = opts.q.toLowerCase();
    items = items.filter((b) => (b.judul + " " + b.ringkasan).toLowerCase().includes(q));
  }
  items = [...items].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  return opts.limit ? items.slice(0, opts.limit) : items;
}

export function getAgendaMendatang(db: DB, limit?: number) {
  const today = todayISO();
  const items = db.agenda
    .filter((a) => a.tanggal >= today && a.status !== "Dibatalkan")
    .sort((a, b) => (a.tanggal + a.waktuMulai).localeCompare(b.tanggal + b.waktuMulai));
  return limit ? items.slice(0, limit) : items;
}

export function getVideos(db: DB, limit?: number) {
  const items = [...db.videos].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  return limit ? items.slice(0, limit) : items;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page || 1), totalPages);
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages, total: items.length };
}
