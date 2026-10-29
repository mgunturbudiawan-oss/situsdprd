// Cek koneksi ke PostgreSQL (DATABASE_URL) dan tampilkan isi tabel dprd_store.
// Pemakaian: npm run db:check
import postgres from "postgres";

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("✘ DATABASE_URL belum diisi (tambahkan di .env.local).");
  process.exit(1);
}
const url = new URL(raw);
// postgres.js meneruskan parameter URL yang tidak dikenal ke server; channel_binding bukan parameter server
url.searchParams.delete("channel_binding");
const sql = postgres(url.toString(), { max: 1, prepare: false, ssl: /localhost|127\.0\.0\.1/.test(url.hostname) ? false : "require", onnotice: () => {} });

try {
  const t0 = Date.now();
  const [{ version }] = await sql`SELECT version()`;
  console.log(`✔ Terhubung ke ${url.hostname} (${Date.now() - t0} ms)`);
  console.log(`  ${version.split(",")[0]}`);
  const [{ exists }] = await sql`SELECT to_regclass('public.dprd_store') IS NOT NULL AS exists`;
  if (!exists) {
    console.log("  Tabel dprd_store belum ada (akan dibuat otomatis saat situs/db:import pertama kali dijalankan).");
  } else {
    const rows = await sql`SELECT key, jsonb_typeof(value) AS t, CASE WHEN jsonb_typeof(value)='array' THEN jsonb_array_length(value) END AS n, updated_at FROM dprd_store ORDER BY key`;
    console.log("  Isi dprd_store:");
    for (const r of rows) console.log(`   - ${r.key.padEnd(9)} ${r.t === "array" ? `${r.n} item` : "objek"}  (diubah ${r.updated_at.toISOString()})`);
    const [s] = await sql`SELECT value->>'namaDaerah' AS nama, value->>'warnaPrimer' AS warna FROM dprd_store WHERE key='settings'`;
    if (s) console.log(`  Pengaturan: namaDaerah="${s.nama}", warnaPrimer=${s.warna}`);
  }
} catch (e) {
  console.error("✘ Gagal terhubung:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
