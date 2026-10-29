import { Check, Search, XCircle } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { cn, formatDateTime } from "@/lib/utils";

export const metadata = { title: "Lacak Aspirasi" };

const STEPS = ["Baru", "Diproses", "Ditindaklanjuti", "Selesai"];
const LABEL: Record<string, string> = { Baru: "Diterima", Diproses: "Diverifikasi & Diproses", Ditindaklanjuti: "Ditindaklanjuti", Selesai: "Selesai" };

export default async function LacakPage({ searchParams }: { searchParams: Promise<{ kode?: string }> }) {
  const kode = ((await searchParams).kode || "").trim().toUpperCase();
  const a = kode ? (await readDB()).aspirasi.find((x) => x.kode.toUpperCase() === kode) : undefined;
  const komisi = a ? getLookups(await readDB()).komisi.get(a.komisiId) : undefined;
  const stepIdx = a ? STEPS.indexOf(a.status) : -1;

  return (
    <>
      <PageHeader title="Lacak Aspirasi" subtitle="Pantau status tindak lanjut aspirasi yang telah Anda kirimkan." crumbs={[{ label: "Aspirasi", href: "/aspirasi" }, { label: "Lacak" }]} />
      <div className="container max-w-3xl py-16">
        <form className="card flex gap-3 p-4">
          <input name="kode" defaultValue={kode} required placeholder="Masukkan kode, contoh: ASP-261029-AB12" className="input uppercase" />
          <button className="btn-primary">
            <Search className="h-4 w-4" /> Lacak
          </button>
        </form>

        {kode && !a && (
          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-center text-red-700">
            <XCircle className="mx-auto mb-2 h-10 w-10" />
            Aspirasi dengan kode <b>{kode}</b> tidak ditemukan. Periksa kembali kode Anda.
          </div>
        )}

        {a && (
          <div className="card mt-8 overflow-hidden">
            <div className="bg-primary-800 p-6 text-white">
              <p className="font-mono text-sm text-accent-300">{a.kode}</p>
              <h2 className="mt-1 font-display text-xl font-bold">{a.judul}</h2>
              <p className="mt-1 text-sm text-white/70">
                Dikirim {formatDateTime(a.createdAt)} · {a.kategori}
                {komisi && ` · ${komisi.nama}`}
              </p>
            </div>
            <div className="p-6 md:p-8">
              {a.status === "Ditolak" ? (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">Aspirasi tidak dapat ditindaklanjuti.</div>
              ) : (
                <ol className="relative grid grid-cols-4">
                  {STEPS.map((s, i) => (
                    <li key={s} className="relative flex flex-col items-center text-center">
                      {i > 0 && <span className={cn("absolute right-1/2 top-5 h-1 w-full -translate-y-1/2", i <= stepIdx ? "bg-green-500" : "bg-slate-200")} />}
                      <span className={cn("relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-sm font-bold shadow", i <= stepIdx ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500")}>
                        {i <= stepIdx ? <Check className="h-5 w-5" /> : i + 1}
                      </span>
                      <span className={cn("mt-2 text-xs font-semibold md:text-sm", i <= stepIdx ? "text-slate-900" : "text-slate-400")}>{LABEL[s]}</span>
                    </li>
                  ))}
                </ol>
              )}
              <div className="mt-8">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Isi Aspirasi</h3>
                <p className="whitespace-pre-line text-slate-700">{a.isi}</p>
              </div>
              <div className="mt-6 rounded-xl border-l-4 border-accent-500 bg-accent-50 p-5">
                <h3 className="mb-1 font-semibold text-slate-900">Tanggapan DPRD</h3>
                <p className="whitespace-pre-line text-slate-700">{a.tanggapan || "Belum ada tanggapan. Aspirasi Anda sedang dalam antrean verifikasi."}</p>
                {a.tanggapan && <p className="mt-2 text-xs text-slate-500">Diperbarui {formatDateTime(a.updatedAt)}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
