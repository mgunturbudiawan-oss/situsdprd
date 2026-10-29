import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Landmark, MapPin, Radio, Tag } from "lucide-react";
import { findById, getSettings, readDB } from "@/lib/db";
import { getAgendaMendatang, getLookups } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Prose } from "@/components/site/Prose";
import { AgendaCard } from "@/components/site/Cards";
import { formatDate, todayISO, ZONA_WAKTU } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: (await findById("agenda", (await params).id))?.judul || "Agenda" };
}

export default async function AgendaDetail({ params }: Props) {
  const a = await findById("agenda", (await params).id);
  if (!a) notFound();
  const s = await getSettings();
  const k = getLookups(await readDB()).komisi.get(a.komisiId);
  const lainnya = getAgendaMendatang(await readDB(), 4).filter((x) => x.id !== a.id).slice(0, 3);
  const isToday = a.tanggal === todayISO();

  const info = [
    { icon: CalendarDays, label: "Tanggal", value: formatDate(a.tanggal, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    { icon: Clock, label: "Waktu", value: `${a.waktuMulai}${a.waktuSelesai ? ` – ${a.waktuSelesai}` : ""} ${ZONA_WAKTU}` },
    { icon: MapPin, label: "Lokasi", value: a.lokasi },
    { icon: Tag, label: "Jenis / Status", value: `${a.jenis} · ${a.status}` },
    { icon: Landmark, label: "Alat Kelengkapan", value: k?.nama },
  ].filter((i) => i.value);

  return (
    <>
      <PageHeader title={a.judul} crumbs={[{ label: "Agenda", href: "/agenda" }, { label: "Detail" }]} />
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 rounded-2xl bg-slate-50 p-5">
                <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-1 font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {a.disiarkan && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-3 text-red-800">
                <Radio className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Kegiatan ini disiarkan melalui TV DPRD</p>
                  <p className="text-sm text-red-700/80">{isToday && s.tvLiveAktif ? "Siaran sedang berlangsung" : "Saksikan pada waktu yang dijadwalkan"}</p>
                </div>
              </div>
              <Link href="/tv" className="btn bg-red-600 text-white hover:bg-red-700">Tonton TV DPRD</Link>
            </div>
          )}
          <div className="mt-10">
            <Prose content={a.deskripsi} />
          </div>
        </div>
        <aside className="lg:col-span-4">
          <h3 className="mb-4 font-display text-lg font-bold">Agenda Lainnya</h3>
          <div className="space-y-4">
            {lainnya.map((x) => (
              <AgendaCard key={x.id} a={x} />
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
