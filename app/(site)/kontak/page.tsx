import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSettings } from "@/lib/db";
import { PageHeader } from "@/components/site/PageHeader";
import { SocialLinks } from "@/components/site/SocialLinks";

export const metadata = { title: "Kontak" };

export default async function KontakPage() {
  const s = await getSettings();
  const items = [
    { icon: MapPin, label: "Alamat", value: s.alamat },
    { icon: Phone, label: "Telepon", value: s.telepon, href: `tel:${s.telepon.replace(/[^\d+]/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: s.whatsapp ? `+${s.whatsapp}` : "", href: `https://wa.me/${s.whatsapp}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: Clock, label: "Jam Layanan", value: s.jamLayanan },
  ].filter((i) => i.value);

  return (
    <>
      <PageHeader title="Hubungi Kami" subtitle={`Sekretariat DPRD ${s.namaDaerah}`} crumbs={[{ label: "Kontak" }]} />
      <div className="container grid gap-10 py-16 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {items.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="card flex gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                {href ? (
                  <a href={href} className="font-medium text-slate-900 hover:text-primary-700">{value}</a>
                ) : (
                  <p className="font-medium text-slate-900">{value}</p>
                )}
              </div>
            </div>
          ))}
          <div className="card flex items-center gap-4 p-5 text-slate-600">
            <span className="text-sm font-semibold">Media Sosial:</span>
            <SocialLinks facebook={s.facebook} instagram={s.instagram} youtube={s.youtube} twitter={s.twitter} tiktok={s.tiktok} className="h-5 w-5" />
          </div>
          <div className="rounded-2xl bg-primary-800 p-6 text-white">
            <h3 className="font-display text-lg font-bold">Punya aspirasi atau pengaduan?</h3>
            <p className="mt-1 text-sm text-white/75">Gunakan kanal Aspirasi Rakyat agar dapat dilacak dan ditindaklanjuti.</p>
            <Link href="/aspirasi" className="btn-accent mt-4">Sampaikan Aspirasi</Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          {s.mapsEmbed ? (
            <iframe src={s.mapsEmbed} className="h-full min-h-[300px] w-full rounded-2xl border-0 shadow-lg md:min-h-[480px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Peta lokasi" />
          ) : (
            <div className="flex h-full min-h-[300px] items-center md:min-h-[480px] justify-center rounded-2xl bg-slate-100 text-slate-500">Peta belum diatur</div>
          )}
        </div>
      </div>
    </>
  );
}
