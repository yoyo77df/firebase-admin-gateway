import { Instagram, Twitter, Youtube, Twitch, Facebook, Globe, MessageCircle, Music2 } from "lucide-react";

const ICONS: Record<string, typeof Globe> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  twitch: Twitch,
  tiktok: Music2,
  discord: MessageCircle,
  website: Globe,
};

export type SocialMap = Record<string, string>;

export function iconFor(platform: string) {
  const k = platform.toLowerCase().trim();
  for (const key of Object.keys(ICONS)) {
    if (k.includes(key)) return ICONS[key];
  }
  return Globe;
}

export function PlayerSocials({ socials }: { socials: SocialMap | null | undefined }) {
  const entries = Object.entries(socials ?? {}).filter(([, v]) => typeof v === "string" && v.trim());
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {entries.map(([platform, url]) => {
        const Icon = iconFor(platform);
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={platform}
            className="glass w-11 h-11 rounded-md flex items-center justify-center text-foreground/80 hover:text-[var(--neon)] hover:scale-110 transition-all hover:shadow-[var(--shadow-glow-sm)]"
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
