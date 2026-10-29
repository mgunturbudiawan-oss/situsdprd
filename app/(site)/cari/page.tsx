import Link from "next/link";
import { Search } from "lucide-react";
import { readDB } from "@/lib/db";
import { PageHeader } from "@/components/site/PageHeader";
import { formatDate, truncate } from "@/lib/utils";
import { stripTags } from "@/lib/html";

export const metadata = { title: "Pencarian" };

export default async function CariPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q || "").trim();
  const db = await readDB();
  const match = (...t: string[]) => t.join(" ").toLowerCase().includes(q.toLowerCase());

  const groups = q
    ? [
        { title: "Berita", items: db.berita.filter((b) => b.publish && match(b.judul, b.ringkasan, stripTags(b.konten))).map((b) => ({ href: `/berita/${b.slug}`, title: b.judul, meta: formatDate(b.tanggal), desc: b.ringkasan || stripTags(b.konten) })) },
        { title: "Agenda", items: db.agenda.filter((a) => match(a.judul, a.lokasi, a.jenis)).map((a) => ({ href: `/agenda/${a.id}`, title: a.judul, meta: `${a.jenis} · ${formatDate(a.tanggal)}`, desc: a.lokasi })) },
        { title: "Anggota Dewan", items: db.anggota.filter((a) => match(a.nama, a.dapil)).map((a) => ({ href: `/anggota/${a.slug}`, title: a.nama, meta: a.jabatan, desc: a.dapil })) },
        { title: "Komisi & Fraksi", items: [...db.komisi.map((k) => ({ href: `/komisi/${k.slug}`, title: k.nama, meta: k.jenis, desc: k.bidang })), ...db.fraksi.map((f) => ({ href: `/fraksi/${f.slug}`, title: f.nama, meta: "Fraksi", desc: f.singkatan }))].filter((x) => match(x.title, x.desc)) },
        { title: "Produk Hukum", items: db.dokumen.filter((d) => match(d.judul, d.nomor)).map((d) => ({ href: `/dokumen?q=${encodeURIComponent(d.judul)}`, title: d.judul, meta: `${d.jenis} · ${d.tahun}`, desc: "" })) },
        { title: "Video", items: db.videos.filter((v) => match(v.judul, v.deskripsi)).map((v) => ({ href: `/tv?v=${v.id}`, title: v.judul, meta: formatDate(v.tanggal), desc: v.deskripsi })) },
      ].filter((g) => g.items.length)
    : [];
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHeader title="Pencarian" crumbs={[{ label: "Cari" }]} />
      <div className="container max-w-4xl py-12">
        <form className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} autoFocus placeholder="Cari berita, agenda, anggota, perda..." className="input py-4 pl-12 text-base" />
        </form>
        {q && (
          <p className="mt-6 text-sm text-slate-600">
            Ditemukan <b>{total}</b> hasil untuk “{q}”
          </p>
        )}
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-700">
                {g.title} ({g.items.length})
              </h2>
              <div className="divide-y rounded-2xl border border-slate-200">
                {g.items.slice(0, 10).map((x) => (
                  <Link key={x.href} href={x.href} className="block p-4 hover:bg-slate-50">
                    <p className="font-semibold text-slate-900">{x.title}</p>
                    <p className="text-xs text-slate-500">{x.meta}</p>
                    {x.desc && <p className="mt-1 text-sm text-slate-600">{truncate(x.desc, 160)}</p>}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
