import Link from "next/link";
import { CheckCircle2, Eye, Target } from "lucide-react";
import { getSettings, readDB } from "@/lib/db";
import { getPimpinan } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { Avatar } from "@/components/site/Avatar";
import { lines } from "@/lib/utils";

export const metadata = { title: "Profil DPRD" };

export default async function ProfilPage() {
  const s = await getSettings();
  const ketua = getPimpinan(await readDB()).find((p) => p.jabatan === "Ketua DPRD");
  const toc = [
    ["sambutan", "Sambutan Ketua"],
    ["sejarah", "Sejarah"],
    ["visi-misi", "Visi & Misi"],
    ["tugas", "Tugas & Fungsi"],
  ];

  return (
    <>
      <PageHeader title={`Profil DPRD ${s.namaDaerah}`} subtitle={s.tagline} crumbs={[{ label: "Profil" }]} />
      <div className="container grid gap-8 py-8 md:py-16 lg:grid-cols-12 lg:gap-12">
        <aside className="lg:col-span-3">
          <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:sticky lg:top-28 lg:mx-0 lg:block lg:space-y-1 lg:rounded-2xl lg:border lg:border-slate-200 lg:p-3">
            {toc.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700 lg:block lg:rounded-lg lg:border-0 lg:py-2.5">
                {label}
              </a>
            ))}
            <Link href="/profil/pimpinan" className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-700 lg:block lg:rounded-lg lg:border-0 lg:py-2.5">
              Pimpinan DPRD
            </Link>
          </nav>
        </aside>

        <div className="space-y-14 lg:col-span-9 lg:space-y-20">
          <section id="sambutan" className="scroll-mt-36">
            <span className="eyebrow">Sambutan</span>
            <h2 className="heading mb-8">{s.sambutanJudul}</h2>
            <div className="grid gap-8 md:grid-cols-[220px_1fr]">
              {ketua && (
                <div>
                  <Avatar src={ketua.foto} name={ketua.nama} className="aspect-[3/4] w-full shadow-lg" />
                  <p className="mt-3 font-semibold text-slate-900">{ketua.nama}</p>
                  <p className="text-sm text-primary-700">Ketua DPRD</p>
                </div>
              )}
              <Prose content={s.sambutanKetua} />
            </div>
          </section>

          <section id="sejarah" className="scroll-mt-36">
            <span className="eyebrow">Sejarah</span>
            <h2 className="heading mb-8">Sejarah Singkat DPRD</h2>
            <Prose content={s.sejarah} />
          </section>

          <section id="visi-misi" className="scroll-mt-36">
            <span className="eyebrow">Arah Lembaga</span>
            <h2 className="heading mb-8">Visi & Misi</h2>
            <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 p-8 text-white shadow-xl md:p-10">
              <div className="flex items-center gap-3 text-accent-300">
                <Eye className="h-6 w-6" /> <span className="text-sm font-bold uppercase tracking-widest">Visi</span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold leading-snug md:text-3xl">“{s.visi}”</p>
            </div>
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-3 text-primary-700">
                <Target className="h-6 w-6" /> <span className="text-sm font-bold uppercase tracking-widest">Misi</span>
              </div>
              <ol className="grid gap-4 md:grid-cols-2">
                {lines(s.misi).map((m, i) => (
                  <li key={i} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 font-bold text-accent-800">{i + 1}</span>
                    <span className="text-slate-700">{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section id="tugas" className="scroll-mt-36">
            <span className="eyebrow">Kewenangan</span>
            <h2 className="heading mb-8">Tugas & Fungsi</h2>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {["Legislasi", "Anggaran", "Pengawasan"].map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-2xl bg-primary-50 p-5 font-bold text-primary-800">
                  <CheckCircle2 className="h-6 w-6 text-primary-600" /> Fungsi {f}
                </div>
              ))}
            </div>
            <Prose content={s.tugasFungsi} />
          </section>
        </div>
      </div>
    </>
  );
}
