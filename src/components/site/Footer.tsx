import defaultLogo from "@/assets/logo-default.png";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function Footer() {
  const settings = useSiteSettings();
  return (
    <footer className="relative mt-32 border-t border-[var(--neon)]/20">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={settings?.logo_url || defaultLogo} alt="" className="h-12 w-12 object-contain drop-shadow-[0_0_18px_var(--neon)]" />
            <div>
              <div className="font-display font-black text-xl"><span className="text-gradient">RED EYES</span></div>
              <div className="text-xs tracking-[0.3em] text-muted-foreground">OFFICIAL</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            {settings?.tagline || "Dominate. Conquer. Reign."}
          </p>
        </div>
        <div>
          <h4 className="font-display uppercase tracking-widest text-sm mb-4 text-[var(--neon)]">Navigate</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/roster" className="hover:text-[var(--neon)]">Roster</a></li>
            <li><a href="/management" className="hover:text-[var(--neon)]">Management</a></li>
            <li><a href="/news" className="hover:text-[var(--neon)]">News</a></li>
            <li><a href="/auth/register" className="hover:text-[var(--neon)]">Join</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RED EYES OFFICIAL — All rights reserved.
      </div>
    </footer>
  );
}
