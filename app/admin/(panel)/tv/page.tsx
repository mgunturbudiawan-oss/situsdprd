import Link from "next/link";
import { Film } from "lucide-react";
import { getSettings } from "@/lib/db";
import { TV_FIELDS } from "@/lib/resources";
import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { LivePlayer } from "@/components/site/LivePlayer";
import { saveSettings } from "../../actions";

export const metadata = { title: "Siaran Langsung" };

export default async function TvSettingsPage() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle
        title="TV DPRD — Siaran Langsung"
        desc="Atur sumber stream live dan jadwal siaran."
        actions={
          <Link href="/admin/videos" className="btn-outline">
            <Film className="h-4 w-4" /> Arsip Video
          </Link>
        }
      />
      <div className="card mb-6 p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Pratinjau</h2>
        <LivePlayer url={s.tvUrl} title={s.tvJudul} poster={s.tvPoster} />
      </div>
      <ResourceForm fields={TV_FIELDS} values={s as unknown as Record<string, unknown>} action={saveSettings.bind(null, "tv")} submitLabel="Simpan Siaran" />
    </div>
  );
}
