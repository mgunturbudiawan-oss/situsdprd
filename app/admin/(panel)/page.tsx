import Link from "next/link";
import { ArrowRight, Calendar, Film, MessageSquareText, Newspaper, Plus, Radio, Users } from "lucide-react";
import { readDB } from "@/lib/db";
import { getAgendaMendatang } from "@/lib/queries";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Flash, PageTitle } from "@/components/admin/PageTitle";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toggleLive } from "../actions";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const db = await readDB();
  const s = db.settings;
  const baru = db.aspirasi.filter((a) => a.status === "Baru").length;
  const stats = [
    { label: "Berita", value: db.berita.length, icon: Newspaper, href: "/admin/berita", color: "bg-primary-600" },
    { label: "Agenda", value: db.agenda.length, icon: Calendar, href: "/admin/agenda", color: "bg-violet-500" },
    { label: "Anggota", value: db.anggota.length, icon: Users, href: "/admin/anggota", color: "bg-emerald-500" },
    { label: "Video", value: db.videos.length, icon: Film, href: "/admin/videos", color: "bg-orange-500" },
    { label: "Aspirasi Baru", value: baru, icon: MessageSquareText, href: "/admin/aspirasi?status=Baru", color: "bg-rose-500" },
  ];
  const aspirasi = [...db.aspirasi].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const agenda = getAgendaMendatang(db, 5);

  return (
    <>
      <PageTitle title="Dashboard" desc={`Selamat datang di CMS DPRD ${s.namaDaerah}`} />
      <Flash sp={sp} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="card flex items-center gap-4 p-5 transition hover:shadow-md">
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${color}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className={`card mt-6 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center ${s.tvLiveAktif ? "border-red-200 bg-red-50" : ""}`}>
        <div className="flex items-center gap-4">
          <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tvLiveAktif ? "bg-red-600 text-white" : "bg-slate-200 text-slate-500"}`}>
            <Radio className={`h-6 w-6 ${s.tvLiveAktif ? "animate-pulse" : ""}`} />
          </span>
          <div>
            <p className="font-semibold text-slate-900">TV DPRD: {s.tvLiveAktif ? "SEDANG SIARAN LANGSUNG" : "Tidak siaran"}</p>
            <p className="text-sm text-slate-500">{s.tvJudul}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/tv" className="btn-outline">Atur Siaran</Link>
          <form action={toggleLive}>
            <button className={s.tvLiveAktif ? "btn-outline" : "btn bg-red-600 text-white hover:bg-red-700"}>{s.tvLiveAktif ? "Hentikan Live" : "Mulai Live"}</button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold text-slate-900">Aspirasi Terbaru</h2>
            <Link href="/admin/aspirasi" className="flex items-center gap-1 text-sm font-medium text-primary-700">
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y">
            {aspirasi.map((a) => (
              <Link key={a.id} href={`/admin/aspirasi/${a.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{a.judul}</p>
                  <p className="text-xs text-slate-500">
                    {a.nama} · {a.kategori} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </Link>
            ))}
            {!aspirasi.length && <p className="p-5 text-sm text-slate-500">Belum ada aspirasi.</p>}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-slate-900">Agenda Mendatang</h2>
              <Link href="/admin/agenda/new" className="rounded-lg p-1.5 text-primary-700 hover:bg-primary-50" aria-label="Tambah agenda">
                <Plus className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y">
              {agenda.map((a) => (
                <Link key={a.id} href={`/admin/agenda/${a.id}`} className="block px-5 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900">{a.judul}</p>
                  <p className="text-xs text-slate-500">
                    {formatDate(a.tanggal)} · {a.waktuMulai} WIB
                  </p>
                </Link>
              ))}
              {!agenda.length && <p className="p-5 text-sm text-slate-500">Tidak ada agenda.</p>}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["/admin/berita/new", "Tulis Berita"],
                ["/admin/agenda/new", "Buat Agenda"],
                ["/admin/videos/new", "Unggah Video"],
                ["/admin/galeri/new", "Tambah Foto"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-lg border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-700 hover:border-primary-300 hover:bg-primary-50">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
