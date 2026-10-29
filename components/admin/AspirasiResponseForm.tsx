"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { FormState } from "@/app/admin/actions";
import { SubmitButton, type Option } from "./ResourceForm";

export function AspirasiResponseForm({
  action,
  statuses,
  komisi,
  values,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  statuses: string[];
  komisi: Option[];
  values: { status: string; komisiId: string; tanggapan: string; tampilPublik: boolean };
}) {
  const [state, formAction] = useActionState(action, null);
  return (
    <form action={formAction} className="card space-y-5 p-6">
      <h2 className="font-semibold text-slate-900">Tindak Lanjut</h2>
      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" /> {state.success}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label">Status</label>
          <select name="status" defaultValue={values.status} className="input">
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Diteruskan ke</label>
          <select name="komisiId" defaultValue={values.komisiId} className="input">
            <option value="">Pimpinan DPRD</option>
            {komisi.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Tanggapan untuk Masyarakat</label>
        <textarea name="tanggapan" defaultValue={values.tanggapan} rows={6} className="input" placeholder="Tanggapan ini akan terlihat oleh pengirim saat melacak aspirasi." />
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input type="checkbox" name="tampilPublik" defaultChecked={values.tampilPublik} className="h-4 w-4 rounded border-slate-300" />
        Tampilkan di halaman publik "Aspirasi yang Telah Ditanggapi"
      </label>
      <div className="flex justify-end">
        <SubmitButton label="Simpan Tindak Lanjut" />
      </div>
    </form>
  );
}
