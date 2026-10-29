"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { readDB, upsert } from "@/lib/db";
import { KATEGORI_ASPIRASI } from "@/lib/resources";
import { saveUpload } from "@/lib/upload";

export type AspirasiState = { ok: true; kode: string } | { ok: false; error: string } | null;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeKode() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Array.from(randomBytes(4), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `ASP-${ymd}-${rand}`;
}

export async function submitAspirasi(_prev: AspirasiState, formData: FormData): Promise<AspirasiState> {
  // Honeypot anti-spam: bot biasanya mengisi semua kolom
  if (String(formData.get("website") || "")) return { ok: true, kode: makeKode() };

  const get = (k: string) => String(formData.get(k) || "").trim();
  const data = {
    nama: get("nama"),
    email: get("email"),
    telepon: get("telepon"),
    alamat: get("alamat"),
    kategori: KATEGORI_ASPIRASI.includes(get("kategori")) ? get("kategori") : "Lainnya",
    komisiId: get("komisiId"),
    judul: get("judul"),
    isi: get("isi"),
    anonim: formData.get("anonim") === "on",
  };

  if (data.nama.length < 3) return { ok: false, error: "Nama wajib diisi (minimal 3 karakter)." };
  if (!data.email && !data.telepon) return { ok: false, error: "Isi email atau nomor telepon agar kami dapat menghubungi Anda." };
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) return { ok: false, error: "Format email tidak valid." };
  if (data.judul.length < 5) return { ok: false, error: "Judul aspirasi minimal 5 karakter." };
  if (data.isi.length < 20) return { ok: false, error: "Isi aspirasi minimal 20 karakter." };
  if (data.isi.length > 5000) return { ok: false, error: "Isi aspirasi maksimal 5000 karakter." };
  if (data.komisiId && !(await readDB()).komisi.some((k) => k.id === data.komisiId)) data.komisiId = "";

  let lampiran = "";
  const file = formData.get("lampiran");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Lampiran maksimal 5 MB." };
    try {
      lampiran = await saveUpload(file);
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }

  const kode = makeKode();
  try {
    await upsert("aspirasi", null, { ...data, kode, lampiran, status: "Baru", tanggapan: "", tampilPublik: false });
  } catch (e) {
    console.error("Gagal menyimpan aspirasi:", e);
    return { ok: false, error: "Maaf, aspirasi belum dapat disimpan saat ini. Silakan coba lagi nanti." };
  }
  revalidatePath("/admin");
  return { ok: true, kode };
}
