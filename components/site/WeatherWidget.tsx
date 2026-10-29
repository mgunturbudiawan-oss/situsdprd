"use client";

import { useEffect, useState } from "react";
import {
  Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Droplets, MapPin, Moon, Sun, Wind,
  type LucideIcon,
} from "lucide-react";
import type { CuacaResponse } from "@/app/api/cuaca/route";
import { cn } from "@/lib/utils";

/** Kode cuaca WMO → keterangan & ikon. */
function weatherInfo(kode: number, siang: boolean): { label: string; Icon: LucideIcon } {
  if (kode === 0) return { label: "Cerah", Icon: siang ? Sun : Moon };
  if (kode <= 2) return { label: "Cerah Berawan", Icon: siang ? CloudSun : CloudMoon };
  if (kode === 3) return { label: "Berawan", Icon: Cloud };
  if (kode === 45 || kode === 48) return { label: "Berkabut", Icon: CloudFog };
  if (kode >= 51 && kode <= 57) return { label: "Gerimis", Icon: CloudDrizzle };
  if ((kode >= 61 && kode <= 67) || (kode >= 80 && kode <= 82)) return { label: kode >= 65 || kode === 82 ? "Hujan Lebat" : "Hujan", Icon: CloudRain };
  if ((kode >= 71 && kode <= 77) || kode === 85 || kode === 86) return { label: "Salju", Icon: CloudSnow };
  if (kode >= 95) return { label: "Hujan Petir", Icon: CloudLightning };
  return { label: "Berawan", Icon: Cloud };
}

/** Kategori indeks kualitas udara (skala AQI US, label mengikuti istilah ISPU). */
function aqiInfo(aqi: number) {
  if (aqi <= 50) return { label: "Baik", color: "bg-green-500", text: "text-green-300" };
  if (aqi <= 100) return { label: "Sedang", color: "bg-yellow-400", text: "text-yellow-300" };
  if (aqi <= 150) return { label: "Tidak Sehat (Sensitif)", color: "bg-orange-500", text: "text-orange-300" };
  if (aqi <= 200) return { label: "Tidak Sehat", color: "bg-red-500", text: "text-red-300" };
  if (aqi <= 300) return { label: "Sangat Tidak Sehat", color: "bg-purple-600", text: "text-purple-300" };
  return { label: "Berbahaya", color: "bg-rose-900", text: "text-rose-300" };
}

export function WeatherWidget() {
  const [data, setData] = useState<CuacaResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/cuaca")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: CuacaResponse) => alive && setData(d))
        .catch(() => alive && setFailed(true));
    load();
    const refresh = setInterval(load, 10 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(refresh);
    };
  }, []);

  const slides = data ? [data.cuaca && "cuaca", data.udara && "udara"].filter(Boolean) : [];
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (failed) return null;

  const shell = "w-[9.5rem] overflow-hidden rounded-2xl border border-white/20 bg-primary-950/40 text-white shadow-2xl backdrop-blur-md sm:w-60 lg:w-44";

  if (!data) {
    return (
      <div className={cn(shell, "p-3 sm:p-4 lg:p-3")} aria-label="Memuat cuaca">
        <div className="flex items-center gap-3">
          <div className="skeleton-light h-9 w-9 shrink-0 rounded-full sm:h-12 sm:w-12 lg:h-9 lg:w-9" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-light h-4 w-12 rounded sm:h-6 sm:w-16" />
            <div className="skeleton-light h-2.5 w-16 rounded sm:w-24" />
          </div>
        </div>
        <div className="skeleton-light mt-3 hidden h-2.5 w-full rounded sm:block lg:hidden" />
      </div>
    );
  }

  const active = slides[slide % Math.max(slides.length, 1)];
  const w = data.cuaca ? weatherInfo(data.cuaca.kode, data.cuaca.siang) : null;
  const q = data.udara ? aqiInfo(data.udara.aqi) : null;

  return (
    <div className={shell} role="region" aria-label={`Cuaca dan kualitas udara ${data.lokasi}`} aria-live="polite">
      <div className="flex items-center gap-1 border-b border-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:px-4 sm:text-[11px] lg:px-3 lg:text-[10px]">
        <MapPin className="h-3 w-3 shrink-0 text-accent-400" />
        <span className="truncate">{data.lokasi}</span>
      </div>

      <div className="relative h-[3.75rem] sm:h-[5.5rem] lg:h-[3.75rem]">
        {data.cuaca && w && (
          <div className={cn("absolute inset-0 flex items-center gap-3 px-3 transition-all duration-700 sm:px-4 lg:px-3", active === "cuaca" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0")}>
            <w.Icon className="h-9 w-9 shrink-0 text-accent-400 sm:h-12 sm:w-12 lg:h-9 lg:w-9" strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="font-display text-2xl font-extrabold leading-none sm:text-3xl lg:text-2xl">{data.cuaca.suhu}°C</p>
              <p className="mt-1 truncate text-[11px] font-medium text-white/85 sm:text-sm lg:text-xs">{w.label}</p>
              <p className="mt-0.5 hidden items-center gap-2.5 text-[11px] text-white/60 sm:flex lg:hidden">
                <span className="flex items-center gap-0.5"><Droplets className="h-3 w-3" />{data.cuaca.kelembapan}%</span>
                <span className="flex items-center gap-0.5"><Wind className="h-3 w-3" />{data.cuaca.angin} km/j</span>
              </p>
            </div>
          </div>
        )}
        {data.udara && q && (
          <div className={cn("absolute inset-0 flex items-center gap-3 px-3 transition-all duration-700 sm:px-4 lg:px-3", active === "udara" ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}>
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold text-white shadow-lg ring-2 ring-white/30 sm:h-12 sm:w-12 sm:text-base lg:h-9 lg:w-9 lg:text-sm", q.color)}>
              {data.udara.aqi}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:text-[11px] lg:text-[10px]">Kualitas Udara</p>
              <p className={cn("truncate text-xs font-bold sm:text-sm lg:text-xs", q.text)}>{q.label}</p>
              <p className="mt-0.5 hidden text-[11px] text-white/60 sm:block lg:hidden">
                PM2.5 {data.udara.pm25} · PM10 {data.udara.pm10} µg/m³
              </p>
            </div>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex gap-1 px-3 pb-2 sm:px-4 lg:px-3">
          {slides.map((s, i) => (
            <button
              key={String(s)}
              onClick={() => setSlide(i)}
              aria-label={s === "cuaca" ? "Tampilkan cuaca" : "Tampilkan kualitas udara"}
              className={cn("h-1 rounded-full transition-all", i === slide % slides.length ? "w-5 bg-accent-400" : "w-2 bg-white/30")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
