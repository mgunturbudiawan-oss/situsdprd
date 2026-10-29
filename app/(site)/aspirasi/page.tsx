import Link from "next/link";
import { CheckCircle2, FileCheck2, MessageSquareReply, Search, Send } from "lucide-react";
import { readDB } from "@/lib/db";
import { getLookups } from "@/lib/queries";
import { KATEGORI_ASPIRASI } from "@/lib/resources";
import { PageHeader } from "@/components/site/PageHeader";
import { AspirasiForm } from "@/components/site/AspirasiForm";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Aspirasi Rakyat" };

export default async function AspirasiPage() {
  const db = await readDB();
  const { komisi } = getLookups(db);
  const komisiList = [...db.komisi].sort((a, b) => a.urutan - b.urutan).map((k) => ({ id: k.id, nama: k.nama }));
  const publik = db.aspirasi
    .filter((a) => a.tampilPublik && a.tanggapan)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);
  const total = db.aspirasi.length;
  const selesai = db.aspirasi.filter((a) => ["Ditindaklanjuti", "Selesai"].includes(a.status)).length;

  const alur = [
    { icon: Send, title: "Kirim Aspirasi", desc: "Isi formulir dengan data dan aspirasi yang jelas." },
    { icon: FileCheck2, title: "Verifikasi", desc: "Sekretariat memverifikasi dan mengklasifikasi aspirasi." },
    { icon: MessageSquareReply, title: "Tindak Lanjut", desc: "Diteruskan ke komisi/pimpinan untuk dibahas." },
    { icon: CheckCircle2, title: "Tanggapan", desc: "Anda menerima tanggapan yang dapat dilacak." },
  ];

  return (
    <>
      <PageHeader title="Aspirasi Rakyat" subtitle="Saluran resmi penyampaian aspirasi, usulan, dan pengaduan masyarakat kepada DPRD." crumbs={[{ label: "Aspirasi" }]} />

      <section className="border-b bg-slate-50 py-8 md:py-12">
        <div className="container grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {alur.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-white shadow-lg sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div>
                <p className="text-xs font-bold text-accent-600">LANGKAH {i + 1}</p>
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{title}</h3>
                <p className="text-xs text-slate-600 sm:text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container grid gap-10 py-10 md:py-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <h2 className="heading mb-2">Formulir Aspirasi</h2>
          <p className="mb-8 text-slate-600">Kolom bertanda * wajib diisi.</p>
          <AspirasiForm kategori={KATEGORI_ASPIRASI} komisi={komisiList} />
        </div>
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 p-6 text-white">
            <h3 className="font-display text-lg font-bold">Lacak Aspirasi</h3>
            <p className="mt-1 text-sm text-white/75">Masukkan kode aspirasi untuk melihat status tindak lanjut.</p>
            <form action="/aspirasi/lacak" className="mt-4 flex gap-2">
              <input name="kode" required placeholder="ASP-XXXXXX-XXXX" className="input border-0 uppercase" />
              <button className="btn-accent px-4" aria-label="Lacak">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-5 text-center">
              <p className="font-display text-3xl font-extrabold text-primary-700">{total}</p>
              <p className="text-xs text-slate-500">Aspirasi Masuk</p>
            </div>
            <div className="card p-5 text-center">
              <p className="font-display text-3xl font-extrabold text-green-600">{selesai}</p>
              <p className="text-xs text-slate-500">Ditindaklanjuti</p>
            </div>
          </div>
          <div className="card p-6 text-sm text-slate-600">
            <h3 className="mb-3 font-semibold text-slate-900">Ketentuan</h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Aspirasi disampaikan dengan bahasa yang sopan.</li>
              <li>Tidak mengandung unsur SARA, fitnah, atau ujaran kebencian.</li>
              <li>Sertakan informasi yang jelas dan dapat diverifikasi.</li>
              <li>Identitas pelapor dijamin kerahasiaannya.</li>
            </ul>
          </div>
        </aside>
      </div>

      {publik.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container">
            <span className="eyebrow">Transparansi</span>
            <h2 className="heading mb-8">Aspirasi yang Telah Ditanggapi</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {publik.map((a) => (
                <div key={a.id} className="card p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="badge bg-primary-50 text-primary-700">{a.kategori}</span>
                    <span className="badge bg-green-50 text-green-700">{a.status}</span>
                    {komisi.get(a.komisiId) && <span className="text-slate-500">→ {komisi.get(a.komisiId)!.nama}</span>}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-900">{a.judul}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.anonim ? "Anonim" : a.nama} · {formatDate(a.createdAt)}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">{a.isi}</p>
                  <div className="mt-4 rounded-xl border-l-4 border-accent-500 bg-accent-50 p-4 text-sm">
                    <p className="mb-1 font-semibold text-slate-900">Tanggapan DPRD:</p>
                    <p className="text-slate-700">{a.tanggapan}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/aspirasi/lacak" className="btn-outline">Lacak aspirasi Anda</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
