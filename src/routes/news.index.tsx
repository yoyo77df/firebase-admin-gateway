import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { NewsSection } from "@/components/site/NewsSection";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News — RED EYES OFFICIAL" },
      { name: "description", content: "Latest news, announcements, and tournament reports from RED EYES OFFICIAL — straight from the front line." },
      { property: "og:title", content: "News — RED EYES OFFICIAL" },
      { property: "og:description", content: "Latest news, announcements, and tournament reports from RED EYES OFFICIAL — straight from the front line." },
      { property: "og:url", content: "/news" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <h1 className="sr-only">RED EYES OFFICIAL News</h1>
        <NewsSection limit={50} />
      </main>
      <Footer />
    </div>
  ),
});
