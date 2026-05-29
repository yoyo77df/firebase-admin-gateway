import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { Gamepad2 } from "lucide-react";

export function RosterSection({ limit }: { limit?: number }) {
  const { data: players } = useQuery({
    queryKey: ["players", "active", limit ?? "all"],
    queryFn: async () => {
      let q = supabase.from("players").select("*").eq("active", true).order("sort_order");
      if (limit) q = q.limit(limit);
      const { data } = await q;
      return data ?? [];
    },
  });

  return (
    <section id="roster" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="The Squad" title="Roster" subtitle="Elite competitors representing the red banner." />
        {(!players || players.length === 0) && (
          <div className="glass rounded-xl py-16 text-center text-muted-foreground">
            No players yet — add them from the admin panel.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(players ?? []).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
            >
              <Link
                to="/players/$slug"
                params={{ slug: p.slug }}
                className="group relative block glass clip-blade rounded-xl overflow-hidden h-[400px] hover:border-[var(--neon)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${p.avatar_url || p.banner_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="glass px-2.5 py-1 rounded text-[10px] uppercase tracking-widest text-[var(--neon)] font-bold">
                    {p.role || "Player"}
                  </span>
                  {p.game && (
                    <span className="glass px-2 py-1 rounded text-[10px] flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" /> {p.game}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</div>
                  <div className="font-display font-black text-3xl text-glow leading-tight">
                    {p.ign}
                  </div>
                  {p.country && (
                    <div className="text-xs text-muted-foreground mt-1">{p.country}</div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
