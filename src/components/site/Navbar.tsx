import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import defaultLogo from "@/assets/logo-default.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/roster", label: "Roster" },
  { to: "/management", label: "Management" },
  { to: "/news", label: "News" },
];

export function Navbar() {
  const { user, isModerator, signOut } = useAuth();
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  const logo = settings?.logo_url || defaultLogo;
  const title = settings?.site_title || "RED EYES OFFICIAL";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong border-b" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt={title}
            className="h-9 w-9 object-contain drop-shadow-[0_0_12px_var(--neon)] group-hover:scale-110 transition-transform"
          />
          <span className="font-display font-black tracking-widest text-sm md:text-base">
            <span className="text-gradient">RED EYES</span>
            <span className="text-foreground/80 ml-1">OFFICIAL</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 text-sm uppercase tracking-wider font-semibold rounded-md transition-all ${
                  active
                    ? "text-[var(--neon)] text-glow"
                    : "text-foreground/70 hover:text-[var(--neon)] hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isModerator && (
            <Button asChild variant="outline" size="sm" className="border-[var(--neon)] text-[var(--neon)] hover:bg-[var(--neon)]/10">
              <Link to="/admin">
                <Shield className="w-4 h-4 mr-1" /> Admin
              </Link>
            </Button>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={() => signOut()}>
              Sign out
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] hover:opacity-90 shadow-[var(--shadow-glow-sm)]">
                <Link to="/auth/register">Join</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-strong border-t border-[var(--neon)]/20 px-4 py-4 flex flex-col gap-2 animate-float-up">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 rounded-md hover:bg-white/5 uppercase text-sm tracking-wider">
              {l.label}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          {isModerator && (
            <Link to="/admin" className="px-3 py-2 rounded-md text-[var(--neon)] uppercase text-sm tracking-wider">
              <Shield className="inline w-4 h-4 mr-1" /> Admin Panel
            </Link>
          )}
          {user ? (
            <button onClick={() => signOut()} className="text-left px-3 py-2 rounded-md hover:bg-white/5">
              Sign out
            </button>
          ) : (
            <>
              <Link to="/auth/login" className="px-3 py-2 rounded-md hover:bg-white/5">Login</Link>
              <Link to="/auth/register" className="px-3 py-2 rounded-md bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] text-center font-semibold">
                Join the Squad
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
