"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitAspirasi, type AspirasiState } from "@/app/(site)/aspirasi/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 text-base">
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      {pending ? "Mengirim..." : "Kirim Aspirasi"}
    </button>
  );
}

export function AspirasiForm({ kategori, komisi }: { kategori: string[]; komisi: { id: string; nama: string }[] }) {
  const [state, action] = useActionState<AspirasiState, FormData>(submitAspirasi, null);

  if (state?.ok) {
    return (
      <div className="card p-8 text-center md:p-12">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h3 className="mt-4 font-display text-2xl font-bold">Aspirasi Berhasil Dikirim</h3>
        <p className="mt-2 text-slate-600">Terima kasih atas partisipasi Anda. Simpan kode berikut untuk melacak status aspirasi:</p>
        <div className="mx-auto mt-6 w-fit rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 px-8 py-4 font-mono text-2xl font-bold tracking-wider text-primary-800">
          {state.kode}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/aspirasi/lacak?kode=${state.kode}`} className="btn-primary">Lacak Aspirasi</Link>
          <button onClick={() => window.location.reload()} className="btn-outline">Kirim Aspirasi Lain</button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-5 p-6 md:p-8">
      {state && !state.ok && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> {state.error}
        </div>
      )}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Nama Lengkap *</label>
          <input name="nama" required minLength={3} className="input" placeholder="Nama sesuai KTP" />
        </div>
        <div>
          <label className="label">Nomor Telepon / WhatsApp</label>
          <input name="telepon" type="tel" className="input" placeholder="08xxxxxxxxxx" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="nama@email.com" />
        </div>
        <div>
          <label className="label">Alamat</label>
          <input name="alamat" className="input" placeholder="Desa/Kelurahan, Kecamatan" />
        </div>
        <div>
          <label className="label">Kategori *</label>
          <select name="kategori" required className="input">
            {kategori.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Ditujukan Kepada</label>
          <select name="komisiId" className="input">
            <option value="">Pimpinan DPRD (umum)</option>
            {komisi.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Judul Aspirasi *</label>
        <input name="judul" required minLength={5} className="input" placeholder="Ringkasan singkat aspirasi Anda" />
      </div>
      <div>
        <label className="label">Isi Aspirasi *</label>
        <textarea name="isi" required minLength={20} rows={7} className="input" placeholder="Jelaskan aspirasi, usulan, atau pengaduan Anda secara rinci (lokasi, waktu, kondisi, harapan)..." />
      </div>
      <div>
        <label className="label">Lampiran (opsional)</label>
        <input name="lampiran" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" className="input file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-primary-700" />
        <p className="mt-1 text-xs text-slate-500">Foto atau dokumen pendukung, maksimal 5 MB.</p>
      </div>
      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input type="checkbox" name="anonim" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600" />
        Sembunyikan nama saya jika aspirasi ditampilkan ke publik.
      </label>
      <Submit />
      <p className="text-center text-xs text-slate-500">Data pribadi Anda dijaga kerahasiaannya dan hanya digunakan untuk keperluan tindak lanjut aspirasi.</p>
    </form>
  );
}
