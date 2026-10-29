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

export const usingBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Simpan file unggahan dan kembalikan URL publiknya.
 * - Vercel Blob bila BLOB_READ_WRITE_TOKEN diisi (wajib di Vercel, karena disk serverless tidak permanen).
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
    const blob = await put(`uploads/${sub}/${name}`, file, { access: "public", contentType: MIME[ext], addRandomSuffix: false });
    return blob.url;
  }

  const dir = path.join(UPLOAD_DIR, ...sub.split("/"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${sub}/${name}`;
}
