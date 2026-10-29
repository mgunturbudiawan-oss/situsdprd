import { Facebook, Instagram, Music2, Twitter, Youtube } from "lucide-react";

export function SocialLinks({
  facebook,
  instagram,
  youtube,
  twitter,
  tiktok,
  className = "h-4 w-4",
}: {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  className?: string;
}) {
  const items = [
    { href: facebook, Icon: Facebook, label: "Facebook" },
    { href: instagram, Icon: Instagram, label: "Instagram" },
    { href: youtube, Icon: Youtube, label: "YouTube" },
    { href: twitter, Icon: Twitter, label: "X" },
    { href: tiktok, Icon: Music2, label: "TikTok" },
  ].filter((i) => i.href);
  return (
    <>
      {items.map(({ href, Icon, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition hover:text-accent-400">
          <Icon className={className} />
        </a>
      ))}
    </>
  );
}
