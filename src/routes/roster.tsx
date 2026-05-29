import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { RosterSection } from "@/components/site/RosterSection";

export const Route = createFileRoute("/roster")({
  head: () => ({
    meta: [
      { title: "Roster — RED EYES OFFICIAL" },
      { name: "description", content: "Meet the active competitive roster of RED EYES OFFICIAL — player profiles, roles, countries and in-game stats." },
      { property: "og:title", content: "Roster — RED EYES OFFICIAL" },
      { property: "og:description", content: "Meet the active competitive roster of RED EYES OFFICIAL — player profiles, roles, countries and in-game stats." },
      { property: "og:url", content: "/roster" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/roster" }],
  }),
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <h1 className="sr-only">RED EYES OFFICIAL Roster</h1>
        <RosterSection />
      </main>
      <Footer />
    </div>
  ),
});
