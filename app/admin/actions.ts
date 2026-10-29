"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { findById, readDB, remove, updateSettings, upsert } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { isHtml, sanitizeHtml } from "@/lib/html";
import { getResource, SETTINGS_FIELDS, STATUS_ASPIRASI, TV_FIELDS, type Field } from "@/lib/resources";
import type { CollectionName, Settings } from "@/lib/types";
import { saveUpload } from "@/lib/upload";
import { slugify } from "@/lib/utils";

export type FormState = { error?: string; success?: string } | null;

/* ---------- Autentikasi ---------- */

const attempts = new Map<string, { count: number; until: number }>();

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const username = String(fd.get("username") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const rec = attempts.get(username);
  if (rec && rec.until > Date.now()) return { error: "Terlalu banyak percobaan gagal. Coba lagi dalam beberapa menit." };

  const user = (await readDB()).users.find((u) => u.username.toLowerCase() === username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    const count = (rec?.count || 0) + 1;
    attempts.set(username, { count, until: count >= 5 ? Date.now() + 10 * 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Username atau password salah." };
  }
  attempts.delete(username);
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- Parsing field form generik ---------- */

async function parseFields(fields: Field[], fd: FormData) {
  const data: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = fd.get(f.name);
    const str = typeof raw === "string" ? raw.trim() : "";
    switch (f.type) {
      case "checkbox":
        data[f.name] = raw === "on";
        break;
      case "number":
        data[f.name] = Number(str) || 0;
        break;
      case "richtext":
        data[f.name] = isHtml(str) ? sanitizeHtml(str) : str;
        break;
      case "multirelation":
        data[f.name] = fd.getAll(f.name).map(String).filter(Boolean);
        break;
      case "password":
        if (str) {
          if (str.length < 6) throw new Error("Password minimal 6 karakter");
          data.passwordHash = hashPassword(str);
        }
        break;
      case "image":
      case "file": {
        const file = fd.get(`${f.name}__file`);
        data[f.name] = file instanceof File && file.size > 0 ? await saveUpload(file, f.type) : str;
        break;
      }
      default:
        data[f.name] = str;
    }
    if (f.required && f.type !== "password" && f.type !== "checkbox" && !data[f.name]) {
      throw new Error(`${f.label} wajib diisi`);
    }
  }
  return data;
}

/* ---------- CRUD generik ---------- */

export async function saveResource(key: string, id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const res = getResource(key);
  if (!res) return { error: "Resource tidak dikenal" };
  await requireUser(res.adminOnly ? "admin" : undefined);

  let data: Record<string, unknown>;
  try {
    data = await parseFields(res.fields, fd);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const items = (await readDB())[res.key] as unknown as Record<string, unknown>[];

  if (res.slugFrom) {
    const base = slugify(String(data.slug || data[res.slugFrom] || "")) || "item";
    let slug = base;
    for (let n = 2; items.some((x) => x.slug === slug && x.id !== id); n++) slug = `${base}-${n}`;
    data.slug = slug;
  }

  if (res.key === "users") {
    data.username = String(data.username).toLowerCase();
    if (!/^[a-z0-9._-]{3,}$/.test(String(data.username))) return { error: "Username minimal 3 karakter (huruf kecil, angka, titik, strip)" };
    if (items.some((u) => u.username === data.username && u.id !== id)) return { error: "Username sudah dipakai" };
    if (!id && !data.passwordHash) return { error: "Password wajib diisi untuk pengguna baru" };
    if (!["admin", "editor"].includes(String(data.role))) data.role = "editor";
  }

  try {
    await upsert(res.key, id, data);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/", "layout");
  redirect(`/admin/${res.key}?saved=1`);
}

export async function deleteResource(key: string, id: string) {
  const res = getResource(key);
  if (!res) return;
  const me = await requireUser(res.adminOnly ? "admin" : undefined);
  if (res.key === "users") {
    const users = (await readDB()).users;
    if (id === me.id) redirect(`/admin/users?error=${encodeURIComponent("Tidak dapat menghapus akun sendiri")}`);
    if (users.find((u) => u.id === id)?.role === "admin" && users.filter((u) => u.role === "admin").length <= 1) {
      redirect(`/admin/users?error=${encodeURIComponent("Minimal harus ada satu admin")}`);
    }
  }
  await remove(res.key, id);
  revalidatePath("/", "layout");
  redirect(`/admin/${res.key}?deleted=1`);
}

/* ---------- Pengaturan ---------- */

export async function saveSettings(group: "umum" | "tv", _prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser(group === "umum" ? "admin" : undefined);
  try {
    const data = await parseFields(group === "tv" ? TV_FIELDS : SETTINGS_FIELDS, fd);
    await updateSettings(data as Partial<Settings>);
  } catch (e) {
    return { error: (e as Error).message };
  }
  revalidatePath("/", "layout");
  return { success: "Pengaturan berhasil disimpan." };
}

export async function toggleLive() {
  await requireUser();
  const current = (await readDB()).settings.tvLiveAktif;
  await updateSettings({ tvLiveAktif: !current });
  revalidatePath("/", "layout");
}

/* ---------- Aspirasi ---------- */

export async function updateAspirasi(id: string, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser();
  if (!await findById("aspirasi", id)) return { error: "Aspirasi tidak ditemukan" };
  const status = String(fd.get("status") || "");
  await upsert("aspirasi", id, {
    status: STATUS_ASPIRASI.includes(status) ? status : "Baru",
    komisiId: String(fd.get("komisiId") || ""),
    tanggapan: String(fd.get("tanggapan") || "").trim(),
    tampilPublik: fd.get("tampilPublik") === "on",
  });
  revalidatePath("/", "layout");
  return { success: "Aspirasi berhasil diperbarui." };
}

export async function deleteAspirasi(id: string) {
  await requireUser();
  await remove("aspirasi" as CollectionName, id);
  revalidatePath("/", "layout");
  redirect("/admin/aspirasi?deleted=1");
}

/* ---------- Akun sendiri ---------- */

export async function changePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser();
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  if (!verifyPassword(current, me.passwordHash)) return { error: "Password saat ini salah" };
  if (next.length < 6) return { error: "Password baru minimal 6 karakter" };
  if (next !== fd.get("confirm")) return { error: "Konfirmasi password tidak cocok" };
  await upsert("users", me.id, { passwordHash: hashPassword(next) });
  return { success: "Password berhasil diubah." };
}
