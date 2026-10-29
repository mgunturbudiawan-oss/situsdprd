import fs from "fs";
import path from "path";
import { cache } from "react";
import postgres from "postgres";
import type { CollectionName, DB, Settings } from "./types";
import { createSeed, DEFAULT_SETTINGS } from "./seed";
import { uid } from "./utils";

/*
 * Lapisan data dengan dua driver:
 * - PostgreSQL bila DATABASE_URL diisi (wajib untuk Vercel/serverless).
 * - File JSON (storage/db.json) bila tidak, cocok untuk pengembangan lokal atau VPS.
 * Data disimpan per "kunci" (settings + tiap koleksi) sebagai dokumen JSON.
 */

export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "storage"));
const DB_FILE = path.join(DATA_DIR, "db.json");

export const COLLECTIONS: CollectionName[] = [
  "slides", "berita", "agenda", "anggota", "fraksi", "komisi", "videos", "aspirasi", "dokumen", "galeri", "users",
];
type Key = keyof DB;
const KEYS: Key[] = ["settings", ...COLLECTIONS];

/** Lengkapi kunci yang mungkin belum ada (mis. setelah pembaruan aplikasi). */
function normalize(raw: Partial<DB>): DB {
  const db = { ...raw, settings: { ...DEFAULT_SETTINGS, ...(raw.settings || {}) } } as DB;
  for (const c of COLLECTIONS) if (!Array.isArray(db[c])) (db as unknown as Record<string, unknown[]>)[c] = [];
  return db;
}

/* ---------------- Driver: file JSON ---------------- */

let fileCache: { mtime: number; data: DB } | null = null;

/**
 * Di lingkungan serverless (mis. Vercel) disk bersifat read-only. Tanpa DATABASE_URL situs tetap
 * ditampilkan memakai data contoh di memori, tetapi perubahan dari CMS tidak bisa disimpan.
 */
const memory = globalThis as unknown as { __dprdMemoryDB?: DB };
export const readOnlyFallback = () => !process.env.DATABASE_URL && !!process.env.VERCEL;

export class DatabaseNotConnectedError extends Error {
  constructor() {
    super(
      "Database belum terhubung. Hubungkan PostgreSQL (Vercel → Storage → Neon) agar DATABASE_URL terisi, lalu redeploy. " +
        "Sampai saat itu situs menampilkan data contoh dan perubahan tidak bisa disimpan.",
    );
  }
}

function fileWrite(db: DB) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + "." + process.pid + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_FILE);
  fileCache = { mtime: fs.statSync(DB_FILE).mtimeMs, data: db };
}

function fileLoad(fresh = false): DB {
  if (readOnlyFallback()) {
    memory.__dprdMemoryDB ??= createSeed();
    return fresh ? structuredClone(memory.__dprdMemoryDB) : memory.__dprdMemoryDB;
  }
  if (!fs.existsSync(DB_FILE)) fileWrite(createSeed());
  const mtime = fs.statSync(DB_FILE).mtimeMs;
  if (!fresh && fileCache && fileCache.mtime === mtime) return fileCache.data;
  const data = normalize(JSON.parse(fs.readFileSync(DB_FILE, "utf8")));
  fileCache = { mtime, data };
  return fresh ? structuredClone(data) : data;
}

/* ---------------- Driver: PostgreSQL ---------------- */

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __dprdSql?: Sql; __dprdReady?: Promise<void> };

function sql(): Sql {
  if (!g.__dprdSql) {
    const url = process.env.DATABASE_URL!;
    const local = /localhost|127\.0\.0\.1/.test(url);
    g.__dprdSql = postgres(url, {
      max: process.env.VERCEL ? 1 : 5,
      idle_timeout: 20,
      prepare: false, // kompatibel dengan pooler (PgBouncer/Supavisor/Neon pooler)
      ssl: local ? false : "require",
      onnotice: () => {},
    });
  }
  return g.__dprdSql;
}

/** Buat tabel bila belum ada dan isi data contoh saat database masih kosong. */
function ready() {
  if (!g.__dprdReady) {
    g.__dprdReady = (async () => {
      const db = sql();
      await db`CREATE TABLE IF NOT EXISTS dprd_store (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
      const [{ count }] = await db`SELECT count(*)::int AS count FROM dprd_store`;
      if (count === 0) {
        const seed = createSeed();
        await db.begin(async (tx) => {
          for (const k of KEYS) {
            await tx`INSERT INTO dprd_store (key, value) VALUES (${k}, ${tx.json(seed[k] as never)}) ON CONFLICT (key) DO NOTHING`;
          }
        });
      }
    })().catch((e) => {
      g.__dprdReady = undefined;
      throw e;
    });
  }
  return g.__dprdReady;
}

function rowsToDB(rows: { key: string; value: unknown }[]) {
  const raw: Record<string, unknown> = {};
  for (const r of rows) raw[r.key] = r.value;
  return normalize(raw as Partial<DB>);
}

async function pgLoad(): Promise<DB> {
  await ready();
  const rows = await sql()<{ key: string; value: unknown }[]>`SELECT key, value FROM dprd_store`;
  return rowsToDB(rows);
}

async function pgMutate<T>(fn: (db: DB) => T): Promise<T> {
  await ready();
  return sql().begin(async (tx) => {
    // Kunci semua baris agar perubahan bersamaan tidak saling menimpa
    const rows = await tx<{ key: string; value: unknown }[]>`SELECT key, value FROM dprd_store FOR UPDATE`;
    const db = rowsToDB(rows);
    const before = Object.fromEntries(KEYS.map((k) => [k, JSON.stringify(db[k])]));
    const result = fn(db);
    for (const k of KEYS) {
      if (JSON.stringify(db[k]) === before[k]) continue;
      await tx`INSERT INTO dprd_store (key, value, updated_at) VALUES (${k}, ${tx.json(db[k] as never)}, now())
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
    }
    return result;
  }) as Promise<T>;
}

/* ---------------- API publik ---------------- */

export const usingPostgres = () => !!process.env.DATABASE_URL;

/**
 * Baca seluruh database. Hasil di-memo per request (React cache), jadi aman dipanggil berkali-kali
 * dalam satu render. Jangan memodifikasi hasilnya; gunakan mutate()/upsert()/remove().
 */
export const readDB = cache(async (): Promise<DB> => (usingPostgres() ? pgLoad() : fileLoad()));

/** Ubah database secara atomik (transaksi di Postgres, tulis-ganti file di driver JSON). */
export async function mutate<T>(fn: (db: DB) => T): Promise<T> {
  if (usingPostgres()) return pgMutate(fn);
  if (readOnlyFallback()) throw new DatabaseNotConnectedError();
  const db = fileLoad(true);
  const result = fn(db);
  fileWrite(db);
  return result;
}

export async function getSettings(): Promise<Settings> {
  return (await readDB()).settings;
}

export async function findById<K extends CollectionName>(name: K, id: string): Promise<DB[K][number] | undefined> {
  return ((await readDB())[name] as DB[K][number][]).find((x) => x.id === id);
}

export async function findBySlug<K extends "berita" | "anggota" | "fraksi" | "komisi">(name: K, slug: string) {
  const items = (await readDB())[name] as DB[K][number][];
  return items.find((x) => x.slug === slug || x.id === slug);
}

export function upsert(name: CollectionName, id: string | null, data: Record<string, unknown>) {
  return mutate((db) => {
    const items = db[name] as unknown as Record<string, unknown>[];
    const now = new Date().toISOString();
    if (id) {
      const idx = items.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error("Data tidak ditemukan");
      items[idx] = { ...items[idx], ...data, id, updatedAt: now };
      return items[idx];
    }
    const item = { ...data, id: uid(), createdAt: now, updatedAt: now };
    items.unshift(item);
    return item;
  });
}

export function remove(name: CollectionName, id: string) {
  return mutate((db) => {
    (db as unknown as Record<string, { id: string }[]>)[name] = (db[name] as { id: string }[]).filter((x) => x.id !== id);
  });
}

export function updateSettings(data: Partial<Settings>) {
  return mutate((db) => {
    db.settings = { ...db.settings, ...data };
  });
}
