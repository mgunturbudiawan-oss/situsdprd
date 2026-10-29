"use client";

import { useEffect, useState } from "react";
import { Check, Facebook, Link2, MessageCircle, Twitter } from "lucide-react";

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href), []);
  const enc = encodeURIComponent;
  const links = [
    { label: "WhatsApp", Icon: MessageCircle, href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, cls: "bg-green-500" },
    { label: "Facebook", Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, cls: "bg-blue-600" },
    { label: "X", Icon: Twitter, href: `https://x.com/intent/post?text=${enc(title)}&url=${enc(url)}`, cls: "bg-slate-900" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm font-semibold text-slate-600">Bagikan:</span>
      {links.map(({ label, Icon, href, cls }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:opacity-80 ${cls}`} aria-label={label}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300"
        aria-label="Salin tautan"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
