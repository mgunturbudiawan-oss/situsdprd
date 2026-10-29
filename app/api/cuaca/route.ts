import { getSettings } from "@/lib/db";

// Data dari Open-Meteo (gratis, tanpa API key). Disimpan di memori 10 menit per koordinat.
const TTL = 10 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();

export type CuacaResponse = {
  lokasi: string;
  cuaca: { suhu: number; terasa: number; kelembapan: number; angin: number; kode: number; siang: boolean } | null;
  udara: { aqi: number; pm25: number; pm10: number } | null;
  waktu: string;
};

async function getJson(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(6000), cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function GET() {
  const s = await getSettings();
  const lat = Number(s.cuacaLat);
  const lon = Number(s.cuacaLon);
  if (!s.cuacaAktif || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "Widget cuaca tidak aktif" }, { status: 404 });
  }

  const key = `${lat},${lon}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return Response.json({ ...(hit.data as CuacaResponse), lokasi: s.cuacaLokasi });

  const q = `latitude=${lat}&longitude=${lon}&timezone=Asia%2FJakarta`;
  const [w, a] = await Promise.allSettled([
    getJson(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day`),
    getJson(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi,pm2_5,pm10`),
  ]);

  const wc = w.status === "fulfilled" ? w.value.current : null;
  const ac = a.status === "fulfilled" ? a.value.current : null;
  if (!wc && !ac) {
    // Pakai data lama bila ada, daripada widget hilang
    if (hit) return Response.json({ ...(hit.data as CuacaResponse), lokasi: s.cuacaLokasi });
    return Response.json({ error: "Data cuaca tidak tersedia" }, { status: 502 });
  }

  const data: CuacaResponse = {
    lokasi: s.cuacaLokasi,
    cuaca: wc
      ? {
          suhu: Math.round(wc.temperature_2m),
          terasa: Math.round(wc.apparent_temperature),
          kelembapan: Math.round(wc.relative_humidity_2m),
          angin: Math.round(wc.wind_speed_10m),
          kode: wc.weather_code,
          siang: wc.is_day === 1,
        }
      : null,
    udara: ac && ac.us_aqi != null ? { aqi: Math.round(ac.us_aqi), pm25: Math.round(ac.pm2_5), pm10: Math.round(ac.pm10) } : null,
    waktu: (wc || ac).time,
  };
  cache.set(key, { at: Date.now(), data });
  return Response.json(data, { headers: { "Cache-Control": "public, max-age=300" } });
}
