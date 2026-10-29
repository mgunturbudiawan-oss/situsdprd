import { authSecretValue } from "@/lib/auth";
import { readDB, usingPostgres } from "@/lib/db";
import { blobCredentials } from "@/lib/upload";

/**
 * Diagnosis konfigurasi deployment. Hanya menampilkan ada/tidaknya variabel (tanpa nilai rahasia),
 * untuk memastikan Environment Variables di Vercel sudah terbaca oleh deployment yang aktif.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  let database: { terhubung: boolean; namaDaerah?: string; error?: string };
  try {
    const db = await readDB();
    database = { terhubung: usingPostgres(), namaDaerah: db.settings.namaDaerah };
  } catch (e) {
    database = { terhubung: false, error: (e as Error).message.replace(/postgres(ql)?:\/\/\S+/gi, "[url disembunyikan]") };
  }
  return Response.json(
    {
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || "lokal",
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
      variabel: {
        AUTH_SECRET: authSecretValue() ? "terisi" : "BELUM TERBACA",
        DATABASE_URL: process.env.DATABASE_URL ? "terisi" : "BELUM TERBACA",
        BLOB: blobCredentials()?.via ?? "BELUM TERHUBUNG (unggah file tidak aktif)",
        variabelTerkaitBlob: Object.keys(process.env).filter((k) => /BLOB|STORE_ID|READ_WRITE_TOKEN/.test(k)),
      },
      database,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
