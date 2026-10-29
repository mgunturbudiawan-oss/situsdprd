import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readDB } from "./db";
import type { User } from "./types";

const COOKIE = "dprd_session";
const MAX_AGE = 60 * 60 * 12; // 12 jam
const DEV_SECRET = "dev-secret-ganti-di-produksi";

/** Kunci penandatangan sesi. Spasi di tepi diabaikan; NEXTAUTH_SECRET diterima sebagai alternatif. */
export function authSecretValue() {
  return (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

function secret() {
  const s = authSecretValue();
  // Di Vercel/produksi jangan pernah memakai kunci bawaan yang tertulis di kode publik
  if (!s && (process.env.VERCEL || process.env.NODE_ENV === "production" && process.env.DATABASE_URL)) {
    throw new Error("AUTH_SECRET belum diisi. Tambahkan di Environment Variables.");
  }
  return s || DEV_SECRET;
}

function sign(body: string) {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

function encode(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): { uid: string; exp: number } | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  (await cookies()).set(COOKIE, encode({ uid: userId, exp: Date.now() + MAX_AGE * 1000 }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true" || !!process.env.VERCEL,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const payload = decode(token);
  if (!payload) return null;
  return (await readDB()).users.find((u) => u.id === payload.uid) || null;
}

export async function requireUser(role?: "admin") {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin?forbidden=1");
  return user;
}
