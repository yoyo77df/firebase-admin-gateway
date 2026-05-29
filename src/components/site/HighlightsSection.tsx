import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";

export function HighlightsSection() {
  const { data } = useQuery({
    queryKey: ["highlights"],
    queryFn: async () => {
      const { data } = await supabase.from("highlights").select("*").order("published_at", { ascending: false }).limit(6);
      return data ?? [];
    },
  });
  return (
    <section id="highlights" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Watch" title="Highlights" subtitle="The best plays, captured." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data ?? []).map((h, i) => (
            <motion.a
              key={h.id}
              href={`https://www.youtube.com/watch?v=${h.youtube_id}`}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative block glass rounded-xl overflow-hidden hover:border-[var(--neon)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${h.youtube_id}/hqdefault.jpg`}
                  alt={h.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--blood)] to-[var(--neon)] flex items-center justify-center shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="font-display font-bold line-clamp-2">{h.title}</div>
                {h.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{h.description}</p>}
              </div>
            </motion.a>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-full glass rounded-xl py-12 text-center text-muted-foreground">
              No highlights yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
