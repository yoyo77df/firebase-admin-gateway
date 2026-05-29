import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ManagementSection } from "@/components/site/ManagementSection";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management — RED EYES OFFICIAL" },
      { name: "description", content: "The leadership and management team driving RED EYES OFFICIAL — staff, coaches, and operations behind the organization." },
      { property: "og:title", content: "Management — RED EYES OFFICIAL" },
      { property: "og:description", content: "The leadership and management team driving RED EYES OFFICIAL — staff, coaches, and operations behind the organization." },
      { property: "og:url", content: "/management" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/management" }],
  }),
  component: () => (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-20">
        <h1 className="sr-only">RED EYES OFFICIAL Management Team</h1>
        <ManagementSection />
      </main>
      <Footer />
    </div>
  ),
});
