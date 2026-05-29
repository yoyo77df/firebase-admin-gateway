import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl font-black text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-display uppercase tracking-widest">Signal Lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is off the grid.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] px-5 py-2.5 text-sm font-display uppercase tracking-widest text-white shadow-[var(--shadow-glow-sm)]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl uppercase tracking-widest">Connection Lost</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on the server.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[var(--blood)] to-[var(--neon)] px-5 py-2.5 text-sm font-display uppercase tracking-widest text-white"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RED EYES OFFICIAL" },
      { name: "description", content: "RED EYES OFFICIAL — a premium esports organization. Roster, matches, achievements, highlights and more." },
      { name: "theme-color", content: "#0a0506" },
      { property: "og:title", content: "RED EYES OFFICIAL" },
      { property: "og:description", content: "RED EYES OFFICIAL — a premium esports organization. Roster, matches, achievements, highlights and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RED EYES OFFICIAL" },
      { name: "twitter:description", content: "RED EYES OFFICIAL — a premium esports organization. Roster, matches, achievements, highlights and more." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0f8d8d8f-4203-4b8e-b20b-6fba65cbae28" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0f8d8d8f-4203-4b8e-b20b-6fba65cbae28" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster theme="dark" position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
