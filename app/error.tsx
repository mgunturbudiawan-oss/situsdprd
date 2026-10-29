"use client";

import { useEffect } from "react";

/** Halaman galat ramah pengguna (detail teknis tercatat di log server, mis. Vercel → Logs). */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-primary-700">Oops</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Terjadi gangguan saat memuat halaman</h1>
      <p className="mt-2 max-w-md text-slate-600">Silakan coba lagi beberapa saat lagi. Jika masalah berlanjut, hubungi Sekretariat DPRD.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-slate-400">Kode: {error.digest}</p>}
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary">Coba Lagi</button>
        <a href="/" className="btn-outline">Ke Beranda</a>
      </div>
    </div>
  );
}
