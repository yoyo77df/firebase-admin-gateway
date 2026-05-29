import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PlayerSocials, type SocialMap } from "@/components/site/PlayerSocials";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/players/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("players")
      .select("ign, name, role, country, game, bio, avatar_url, banner_url")
      .eq("slug", params.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.ign ?? params.slug;
    const desc = ((loaderData?.bio?.trim()) || `${name} — ${loaderData?.role || "player"} for RED EYES OFFICIAL${loaderData?.game ? ` (${loaderData.game})` : ""}.`).slice(0, 160);
    const url = `/players/${params.slug}`;
    return {
      meta: [
        { title: `${name} — Player Profile` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — RED EYES OFFICIAL` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        ...(loaderData?.banner_url || loaderData?.avatar_url
          ? [{ property: "og:image", content: loaderData.banner_url || loaderData.avatar_url! }]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: loaderData.name || loaderData.ign,
                alternateName: loaderData.ign,
                jobTitle: loaderData.role || "Esports Player",
                nationality: loaderData.country || undefined,
                description: loaderData.bio || undefined,
                image: loaderData.avatar_url || undefined,
                memberOf: { "@type": "SportsOrganization", name: "RED EYES OFFICIAL" },
              }),
            },
          ]
        : [],
    };
  },
  component: PlayerPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Player not found.</p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{(error as Error).message}</p>
    </div>
  ),
});

function PlayerPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["player", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("players").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        {isLoading || !data ? (
          <div className="text-center text-muted-foreground py-32">Loading…</div>
        ) : (
          <>
            {/* Banner */}
            <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
              {data.banner_url ? (
                <img
                  src={data.banner_url}
                  alt={`${data.ign} banner`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--blood)]/30 via-background to-background" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
            </div>

            {/* Profile header — avatar overlapping banner */}
            <div className="max-w-5xl mx-auto px-6 -mt-24 md:-mt-32 relative z-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-[var(--neon)]/60 shadow-[0_0_40px_var(--neon)] bg-background">
                  {data.avatar_url ? (
                    <img src={data.avatar_url} alt={data.ign} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-5xl text-[var(--neon)]">
                      {(data.ign || "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="text-xs uppercase tracking-widest text-[var(--neon)] mb-2">{data.role || "Player"}</div>
                  <h1 className="font-display font-black text-4xl md:text-6xl text-glow leading-none">
                    {data.ign}
                  </h1>
                  <div className="mt-2 text-muted-foreground">
                    {data.name}
                    {data.country ? ` · ${data.country}` : ""}
                    {data.game ? ` · ${data.game}` : ""}
                  </div>
                  <div className="mt-4 flex justify-center md:justify-start">
                    <PlayerSocials socials={data.socials as SocialMap | null} />
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="font-display uppercase tracking-widest text-sm text-[var(--neon)] mb-3">Bio</h2>
                <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{data.bio || "No bio yet."}</p>
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="font-display uppercase tracking-widest text-sm text-[var(--neon)] mb-3">Stats</h3>
                {data.stats_text && data.stats_text.trim() ? (
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed text-sm">{data.stats_text}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No stats provided.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
