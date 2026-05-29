import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import defaultLogo from "@/assets/logo-default.png";
import heroBg from "@/assets/hero-bg.jpg";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Particles } from "./Particles";
import { NextMatchCard } from "./NextMatchCard";

export function Hero() {
  const s = useSiteSettings();
  const logo = s?.logo_url || defaultLogo;
  const bg = s?.dashboard_bg_url || s?.hero_bg_url || heroBg;

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" aria-hidden />
      <div className="absolute inset-0 scan-lines opacity-40" aria-hidden />
      <Particles count={36} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center w-full py-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-[11px] tracking-[0.4em] uppercase text-[var(--neon)] mb-4 flex items-center gap-3"
          >
            <span className="h-px w-12 bg-[var(--neon)]" />
            Premium Esports Organization
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
          >
            <span className="block text-gradient text-glow">{s?.site_title?.split(" ")[0] || "RED"}</span>
            <span className="block text-foreground">
              {s?.site_title?.split(" ").slice(1).join(" ") || "EYES OFFICIAL"}
            </span>
          </motion.h1>

          {/* Logo placed under the title — transparent backdrop (no black box) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-6"
          >
            <img
              src={logo}
              alt="Team logo"
              className="h-20 md:h-28 w-auto drop-shadow-[0_0_40px_var(--neon)] bg-transparent"
              style={{ background: "transparent" }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-6 text-xl md:text-2xl font-display tracking-wider text-[var(--neon)]"
          >
            {s?.tagline || "Dominate. Conquer. Reign."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-3 text-muted-foreground max-w-xl"
          >
            {s?.hero_subtitle || "A premium esports organization built on passion, precision, and victory."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to={s?.hero_cta_url || "/auth/register"}
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-md font-display uppercase tracking-widest text-sm font-bold bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] shadow-[var(--shadow-glow)] hover:shadow-[0_0_50px_var(--neon)] transition-all hover:-translate-y-0.5"
            >
              {s?.hero_cta_label || "Join the Squad"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/roster"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-md font-display uppercase tracking-widest text-sm font-bold glass hover:bg-white/5 hover:border-[var(--neon)] transition-all"
            >
              Meet the Roster
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative"
        >
          <NextMatchCard />
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-muted-foreground animate-pulse">
        Scroll
      </div>
    </section>
  );
}
