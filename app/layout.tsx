import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSettings } from "@/lib/db";
import { colorScaleVars } from "@/lib/utils";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const dynamic = "force-dynamic";

export async function generateViewport(): Promise<Viewport> {
  return { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: (await getSettings()).warnaPrimer };
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const site = `DPRD ${s.namaDaerah}`;
  return {
    title: { default: `${site} — ${s.tagline}`, template: `%s | ${site}` },
    description: s.footerTentang,
    icons: s.favicon ? { icon: s.favicon } : s.logo ? { icon: s.logo } : undefined,
    openGraph: { siteName: site, type: "website" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const theme = `:root{${colorScaleVars("primary", s.warnaPrimer)} ${colorScaleVars("accent", s.warnaAksen)}}`;
  return (
    <html lang="id" className={font.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
