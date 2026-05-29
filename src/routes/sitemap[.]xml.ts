import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/roster", changefreq: "weekly", priority: "0.8" },
          { path: "/management", changefreq: "monthly", priority: "0.6" },
          { path: "/news", changefreq: "daily", priority: "0.8" },
        ];

        try {
          const { data: posts } = await supabase
            .from("news_posts")
            .select("slug, published_at")
            .eq("published", true);
          posts?.forEach((p: { slug: string; published_at: string | null }) => {
            entries.push({
              path: `/news/${p.slug}`,
              lastmod: p.published_at ?? undefined,
              changefreq: "monthly",
              priority: "0.6",
            });
          });
          const { data: players } = await supabase.from("players").select("slug");
          players?.forEach((p: { slug: string }) => {
            entries.push({ path: `/players/${p.slug}`, changefreq: "monthly", priority: "0.6" });
          });
        } catch {
          // ignore — ship static entries
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
