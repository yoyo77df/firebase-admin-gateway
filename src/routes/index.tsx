import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { RosterSection } from "@/components/site/RosterSection";
import { AchievementsSection } from "@/components/site/AchievementsSection";
import { HighlightsSection } from "@/components/site/HighlightsSection";
import { GallerySection } from "@/components/site/GallerySection";
import { NewsSection } from "@/components/site/NewsSection";
import { ManagementSection } from "@/components/site/ManagementSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RED EYES OFFICIAL — Premium Esports Organization" },
      { name: "description", content: "Dominate. Conquer. Reign. Meet the squad, watch the highlights, and follow the championships of RED EYES OFFICIAL." },
      { property: "og:title", content: "RED EYES OFFICIAL — Premium Esports Organization" },
      { property: "og:description", content: "Dominate. Conquer. Reign. Meet the squad, watch the highlights, and follow the championships of RED EYES OFFICIAL." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <RosterSection limit={6} />
        <ManagementSection />
        <AchievementsSection />
        <HighlightsSection />
        <GallerySection />
        <NewsSection limit={3} />
      </main>
      <Footer />
    </div>
  );
}
