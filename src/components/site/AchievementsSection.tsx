import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { Trophy } from "lucide-react";

export function AchievementsSection() {
  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data } = await supabase.from("achievements").select("*").order("event_date", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <section id="achievements" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Legacy" title="Achievements" subtitle="A timeline of trophies and titles." />
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--neon)] to-transparent" />
          {(data ?? []).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className={`relative grid md:grid-cols-2 gap-6 mb-8 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`pl-12 md:pl-0 ${i % 2 ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                <div className="glass rounded-xl p-6 hover:border-[var(--neon)] transition-all hover:shadow-[var(--shadow-glow-sm)]">
                  <div className="text-[11px] uppercase tracking-widest text-[var(--neon)] mb-1">
                    {new Date(a.event_date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </div>
                  <h3 className="font-display font-black text-xl mb-1">{a.title}</h3>
                  {a.placement && (
                    <div className="text-sm font-bold text-[var(--neon)] mb-2">{a.placement}</div>
                  )}
                  {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                  {a.game && <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{a.game}</div>}
                </div>
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 w-8 h-8 rounded-full glass-strong flex items-center justify-center border-2 border-[var(--neon)] shadow-[var(--shadow-glow-sm)]">
                <Trophy className="w-4 h-4 text-[var(--neon)]" />
              </div>
              <div className="hidden md:block" />
            </motion.div>
          ))}
          {(!data || data.length === 0) && (
            <div className="glass rounded-xl py-12 text-center text-muted-foreground">
              No achievements logged yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
