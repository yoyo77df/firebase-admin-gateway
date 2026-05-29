import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("news_posts")
      .select("title, excerpt, published_at, author, cover_url")
      .eq("slug", params.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const title = loaderData?.title ?? params.slug;
    const desc = (loaderData?.excerpt ?? `Read ${title} on RED EYES OFFICIAL news.`).slice(0, 160);
    const url = `/news/${params.slug}`;
    return {
      meta: [
        { title: `${title} — RED EYES OFFICIAL` },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(loaderData?.cover_url ? [{ property: "og:image", content: loaderData.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: loaderData.title,
                datePublished: loaderData.published_at,
                author: { "@type": "Person", name: loaderData.author || "RED EYES OFFICIAL" },
                ...(loaderData.cover_url ? { image: loaderData.cover_url } : {}),
              }),
            },
          ]
        : [],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Post not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{(error as Error).message}</p>
    </div>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["news_posts", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_posts").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        {isLoading || !data ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : (
          <article>
            {data.cover_url && (
              <img src={data.cover_url} alt={data.title} className="w-full aspect-[16/9] object-cover rounded-xl glow-ring mb-8" />
            )}
            <div className="text-[11px] uppercase tracking-widest text-[var(--neon)] flex items-center gap-1.5 mb-2">
              <CalendarDays className="w-3 h-3" />
              {new Date(data.published_at).toLocaleDateString()} · {data.author || "Staff"}
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl text-glow mb-6">{data.title}</h1>
            {data.excerpt && <p className="text-lg text-muted-foreground mb-6">{data.excerpt}</p>}
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {data.content}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
