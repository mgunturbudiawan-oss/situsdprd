// Pindahkan data lokal (storage/db.json + storage/uploads) ke PostgreSQL dan Vercel Blob.
//
// Pemakaian:
//   1. Isi DATABASE_URL (dan BLOB_READ_WRITE_TOKEN bila ada file unggahan) di .env.local
//   2. npm run db:import            -> menolak bila database tujuan sudah berisi data
//      npm run db:import -- --force -> menimpa data di database tujuan
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { put } from "@vercel/blob";

const root = process.cwd();
const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, "storage"));
const dbFile = path.join(dataDir, "db.json");
const uploadDir = path.join(dataDir, "uploads");
const force = process.argv.includes("--force");

const MIME = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", ico: "image/x-icon",
  pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip", mp4: "video/mp4", webm: "video/webm",
};

function fail(msg) {
  console.error(`✘ ${msg}`);
  process.exit(1);
}

if (!process.env.DATABASE_URL) fail("DATABASE_URL belum diisi (tambahkan di .env.local).");
if (!fs.existsSync(dbFile)) fail(`File data tidak ditemukan: ${dbFile}`);

let json = fs.readFileSync(dbFile, "utf8");

// 1) Unggah file lokal ke Vercel Blob dan ganti URL /uploads/... di data
const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])) : []);
const files = walk(uploadDir);
if (files.length) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(`! Ada ${files.length} file di storage/uploads, tetapi BLOB_READ_WRITE_TOKEN belum diisi — file tidak dipindahkan.`);
  } else {
    console.log(`Mengunggah ${files.length} file ke Vercel Blob…`);
    for (const file of files) {
      const rel = path.relative(uploadDir, file).split(path.sep).join("/");
      const localUrl = `/uploads/${rel}`;
      if (!json.includes(localUrl)) continue; // file yang tidak dipakai di data dilewati
      const ext = rel.split(".").pop().toLowerCase();
      const blob = await put(`uploads/${rel}`, fs.readFileSync(file), { access: "public", contentType: MIME[ext], addRandomSuffix: false, allowOverwrite: true });
      json = json.split(localUrl).join(blob.url);
      console.log(`  ✔ ${localUrl} → ${blob.url}`);
    }
  }
}

// 2) Tulis ke PostgreSQL (satu baris per kunci: settings + tiap koleksi)
const data = JSON.parse(json);
const url = process.env.DATABASE_URL;
const sql = postgres(url, { max: 1, prepare: false, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : "require", onnotice: () => {} });

try {
  await sql`CREATE TABLE IF NOT EXISTS dprd_store (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM dprd_store`;
  if (count > 0 && !force) fail("Database tujuan sudah berisi data. Jalankan dengan --force untuk menimpanya.");

  await sql.begin(async (tx) => {
    for (const [key, value] of Object.entries(data)) {
      await tx`INSERT INTO dprd_store (key, value, updated_at) VALUES (${key}, ${tx.json(value)}, now())
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
    }
  });
  const summary = Object.entries(data).map(([k, v]) => `${k}${Array.isArray(v) ? `(${v.length})` : ""}`).join(", ");
  console.log(`✔ Data berhasil diimpor ke PostgreSQL: ${summary}`);
} finally {
  await sql.end();
}
