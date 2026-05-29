import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";

export function NewsSection({ limit = 3 }: { limit?: number }) {
  const { data } = useQuery({
    queryKey: ["news_posts", "preview", limit],
    queryFn: async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(limit);
      return data ?? [];
    },
  });
  return (
    <section id="news" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Updates" title="Latest News" subtitle="Reports from the front line." />
        <div className="grid md:grid-cols-3 gap-6">
          {(data ?? []).map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-xl overflow-hidden group hover:border-[var(--neon)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow-sm)]"
            >
              <Link to="/news/$slug" params={{ slug: n.slug }} className="block">
                {n.cover_url && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={n.cover_url} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-widest text-[var(--neon)] flex items-center gap-1.5 mb-2">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(n.published_at).toLocaleDateString()}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-[var(--neon)] transition-colors">{n.title}</h3>
                  {n.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{n.excerpt}</p>}
                  <div className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--neon)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Read full article: {n.title} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-full glass rounded-xl py-12 text-center text-muted-foreground">
              No news posts yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
