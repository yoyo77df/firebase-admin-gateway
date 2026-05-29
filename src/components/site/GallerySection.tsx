import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";

export function GallerySection() {
  const { data } = useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_items").select("*").order("sort_order").limit(12);
      return data ?? [];
    },
  });
  return (
    <section id="gallery" className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Moments" title="Gallery" subtitle="Behind the visor." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(data ?? []).map((g, i) => (
            <motion.a
              key={g.id}
              href={g.image_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              className={`group relative block overflow-hidden rounded-lg glass ${i % 5 === 0 ? "row-span-2" : ""}`}
            >
              <img
                src={g.image_url}
                alt={g.title || `RED EYES OFFICIAL gallery photo ${i + 1}`}
                className={`w-full ${i % 5 === 0 ? "h-full min-h-[300px]" : "h-44"} object-cover group-hover:scale-110 transition-transform duration-700`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {g.title && (
                <div className="absolute bottom-2 left-2 right-2 text-xs font-display uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {g.title}
                </div>
              )}
            </motion.a>
          ))}
          {(!data || data.length === 0) && (
            <div className="col-span-full glass rounded-xl py-12 text-center text-muted-foreground">
              No images yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
