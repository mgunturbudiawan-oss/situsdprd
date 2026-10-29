import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { Logo } from "./Logo";
import { lines } from "@/lib/utils";
import { SocialLinks } from "./SocialLinks";

const links = [
  { title: "Kelembagaan", items: [["Profil DPRD", "/profil"], ["Pimpinan", "/profil/pimpinan"], ["Anggota Dewan", "/anggota"], ["Fraksi", "/fraksi"], ["Komisi & Badan", "/komisi"]] },
  { title: "Informasi Publik", items: [["Berita", "/berita"], ["Agenda", "/agenda"], ["Produk Hukum", "/dokumen"], ["Galeri", "/galeri"], ["TV DPRD", "/tv"]] },
  { title: "Layanan", items: [["Sampaikan Aspirasi", "/aspirasi"], ["Lacak Aspirasi", "/aspirasi/lacak"], ["Kontak", "/kontak"], ["Pencarian", "/cari"]] },
];

export function Footer({ s }: { s: Settings }) {
  const terkait = lines(s.tautanTerkait).map((l) => l.split("|").map((x) => x.trim()));
  const groups = terkait.length ? [...links, { title: "Tautan Terkait", items: terkait }] : links;
  return (
    <footer className="relative overflow-hidden bg-primary-950 text-white/70">
      <div className="pattern-dots absolute inset-0 opacity-40" />
      <div className="container relative grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:py-16 lg:grid-cols-6">
        <div className="col-span-2 md:col-span-4 lg:col-span-2">
          <Logo namaDaerah={s.namaDaerah} logo={s.logo} light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{s.footerTentang}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {s.alamat && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {s.alamat}
              </li>
            )}
            {s.telepon && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {s.telepon}
              </li>
            )}
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {s.email}
              </li>
            )}
            {s.jamLayanan && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" /> {s.jamLayanan}
              </li>
            )}
          </ul>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">{group.title}</h3>
            <ul className="space-y-2.5 text-sm">
              {group.items.map(([label, href]) => (
                <li key={href}>
                  <Link href={href || "#"} target={href?.startsWith("http") ? "_blank" : undefined} className="transition hover:text-accent-400">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs md:flex-row">
          <p>
            © {new Date().getFullYear()} Sekretariat DPRD {s.namaDaerah}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <SocialLinks facebook={s.facebook} instagram={s.instagram} youtube={s.youtube} twitter={s.twitter} tiktok={s.tiktok} />
          </div>
        </div>
      </div>
    </footer>
  );
}
