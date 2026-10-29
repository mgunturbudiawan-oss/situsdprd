import { getSettings } from "@/lib/db";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MessageCircle } from "lucide-react";
import { formatDate, todayISO } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Header
        namaDaerah={s.namaDaerah}
        logo={s.logo}
        telepon={s.telepon}
        email={s.email}
        today={formatDate(todayISO(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        live={s.tvLiveAktif}
        social={{ facebook: s.facebook, instagram: s.instagram, youtube: s.youtube, twitter: s.twitter, tiktok: s.tiktok }}
      />
      <main className="min-h-[60vh]">{children}</main>
      <Footer s={s} />
      {s.whatsapp && (
        <a
          href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi via WhatsApp"
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-110 lg:bottom-6 lg:right-6 lg:h-14 lg:w-14"
        >
          <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" />
        </a>
      )}
    </div>
  );
}
