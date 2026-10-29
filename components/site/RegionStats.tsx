import { Building2, Home, Map, Users } from "lucide-react";
import type { Settings } from "@/lib/types";

/** Strip data wilayah (penduduk, luas, kecamatan, kelurahan) tepat di bawah hero. */
export function RegionStats({ s }: { s: Settings }) {
  const items = [
    { icon: Users, value: s.statPenduduk, unit: "jiwa", label: "Jumlah Penduduk" },
    { icon: Map, value: s.statLuas, unit: "km²", label: "Luas Wilayah" },
    { icon: Building2, value: s.statKecamatan, unit: "", label: "Kecamatan" },
    { icon: Home, value: s.statKelurahan, unit: "", label: "Kelurahan" },
  ].filter((i) => i.value?.trim());
  if (!items.length) return null;

  return (
    <section className="relative border-b border-slate-200 bg-white" aria-label={`Data wilayah ${s.statWilayah}`}>
      <div className="h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-primary-600" aria-hidden />
      <div className="container py-6 md:py-8">
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">
            Sekilas <span className="text-accent-600">{s.statWilayah}</span>
          </p>
          {s.statSumber && <p className="text-[11px] text-slate-400">Sumber: {s.statSumber}</p>}
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
          {items.map(({ icon: Icon, value, unit, label }) => (
            <div key={label} className="group flex items-center gap-3 bg-white p-4 transition hover:bg-primary-50/50 sm:gap-4 sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-700 text-accent-400 shadow-md transition group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl">
                <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
              </span>
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">{label}</dt>
                <dd className="font-display text-xl font-extrabold leading-none text-primary-900 sm:text-3xl">
                  {value}
                  {unit && <span className="ml-1 text-xs font-bold text-slate-500 sm:text-sm">{unit}</span>}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
