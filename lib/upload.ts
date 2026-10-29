import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { put } from "@vercel/blob";
import { DATA_DIR } from "./db";

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  ico: "image/x-icon",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  mp4: "video/mp4",
  webm: "video/webm",
};

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif", "ico"];
/** Vercel membatasi body request fungsi serverless ±4,5 MB; di server sendiri batasnya 25 MB. */
export const MAX_UPLOAD_MB = process.env.VERCEL ? 4 : 25;

/**
 * Kredensial Vercel Blob. Store yang dihubungkan ke project mengisi salah satu dari:
 * - BLOB_READ_WRITE_TOKEN (atau <PREFIX>_READ_WRITE_TOKEN bila prefiksnya diganti), atau
 * - BLOB_STORE_ID (atau <PREFIX>_STORE_ID) — autentikasi lewat OIDC Vercel, tanpa token.
 */
function findEnv(suffix: string, test: (v: string) => boolean = () => true) {
  const key = Object.keys(process.env).find((k) => k.endsWith(suffix) && test(process.env[k] || ""));
  return key ? { key, value: process.env[key]! } : undefined;
}

export function blobCredentials() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
    ? { key: "BLOB_READ_WRITE_TOKEN", value: process.env.BLOB_READ_WRITE_TOKEN }
    : findEnv("_READ_WRITE_TOKEN", (v) => v.startsWith("vercel_blob_rw_"));
  if (token) return { via: token.key, options: { token: token.value } };
  const store = process.env.BLOB_STORE_ID
    ? { key: "BLOB_STORE_ID", value: process.env.BLOB_STORE_ID }
    : findEnv("_STORE_ID", (v) => v.startsWith("store_"));
  if (store) return { via: store.key, options: { storeId: store.value } };
  return undefined;
}

export const usingBlob = () => !!blobCredentials();

/** Akses store Blob: BLOB_ACCESS=public|private, atau dideteksi otomatis saat unggahan pertama. */
let blobAccess: "public" | "private" | undefined =
  process.env.BLOB_ACCESS === "private" || process.env.BLOB_ACCESS === "public" ? process.env.BLOB_ACCESS : undefined;

async function putBlob(pathname: string, file: File, contentType: string) {
  const opts = { ...blobCredentials()?.options, contentType, addRandomSuffix: false };
  if (blobAccess !== "private") {
    try {
      const blob = await put(pathname, file, { ...opts, access: "public" });
      blobAccess = "public";
      return blob.url;
    } catch (e) {
      if (blobAccess === "public") throw e;
    }
  }
  // Store private: file dilayani lewat route /uploads/... yang membacanya dengan token.
  await put(pathname, file, { ...opts, access: "private" });
  blobAccess = "private";
  return "/" + pathname;
}

/**
 * Simpan file unggahan dan kembalikan URL-nya.
 * - Vercel Blob bila store terhubung (wajib di Vercel, karena disk serverless tidak permanen).
 *   Store public → URL blob langsung; store private → /uploads/... (diproksikan oleh route).
 * - Folder storage/uploads/YYYY/MM bila tidak (dilayani oleh route /uploads/...).
 */
export async function saveUpload(file: File, kind: "image" | "file" = "file") {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!MIME[ext]) throw new Error(`Tipe file .${ext} tidak diizinkan`);
  if (kind === "image" && !IMAGE_EXT.includes(ext)) throw new Error("File harus berupa gambar (jpg, png, webp, gif)");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`Ukuran file maksimal ${MAX_UPLOAD_MB} MB`);

  const now = new Date();
  const sub = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const base = path.basename(file.name, "." + ext).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "file";
  const name = `${base}-${randomBytes(4).toString("hex")}.${ext}`;

  if (usingBlob()) {
    return putBlob(`uploads/${sub}/${name}`, file, MIME[ext]);
  }

  if (process.env.VERCEL) {
    throw new Error("Penyimpanan file belum terhubung. Hubungkan Vercel Blob (Storage → Blob) ke project ini, lalu redeploy.");
  }
  const dir = path.join(UPLOAD_DIR, ...sub.split("/"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${sub}/${name}`;
}
