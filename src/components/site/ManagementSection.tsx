import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";

export function ManagementSection() {
  const { data } = useQuery({
    queryKey: ["management"],
    queryFn: async () => {
      const { data } = await supabase.from("management").select("*").order("sort_order");
      return data ?? [];
    },
  });
  return (
    <section id="management" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="The Brain Trust" title="Management" subtitle="The strategists behind the squad." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass rounded-xl p-6 hover:border-[var(--neon)] transition-all hover:shadow-[var(--shadow-glow-sm)] hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden glow-ring bg-surface flex-shrink-0">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--blood)] to-[var(--neon)] flex items-center justify-center font-display font-black text-xl">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-display font-bold text-lg">{m.name}</div>
                  <div className="text-xs uppercase tracking-widest text-[var(--neon)]">{m.role}</div>
                </div>
              </div>
              {m.bio && <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>}
            </motion.div>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-full glass rounded-xl py-12 text-center text-muted-foreground">
              No management members yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
