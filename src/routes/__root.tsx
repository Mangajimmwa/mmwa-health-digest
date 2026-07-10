import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-display font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-text-mute">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-gold-hover"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-bold text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-text-mute">
          Something went wrong on our end. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-gold-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0A0A0A" },
      { title: "JOSEPH MMWA — Global Health News You Can Trust" },
      {
        name: "description",
        content:
          "Independent global medical and health news by Joseph Mmwa. Outbreaks, vaccines, clinical research, and the public health stories that matter.",
      },
      { name: "author", content: "Joseph Mmwa" },
      { property: "og:title", content: "JOSEPH MMWA — Global Health News You Can Trust" },
      {
        property: "og:description",
        content: "If it's health, it's here. Real-time medical news and global health reporting.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JOSEPH MMWA — Global Health News You Can Trust" },
      { name: "description", content: "JOSEPH MMWA is a premium medical and health news publication website." },
      { property: "og:description", content: "JOSEPH MMWA is a premium medical and health news publication website." },
      { name: "twitter:description", content: "JOSEPH MMWA is a premium medical and health news publication website." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8e7cc408-23a3-4c05-80b1-1ad0be336fab/id-preview-bc413d71--9c4e72c8-f1b3-41a1-84ce-80c306ea08b0.lovable.app-1782725526265.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8e7cc408-23a3-4c05-80b1-1ad0be336fab/id-preview-bc413d71--9c4e72c8-f1b3-41a1-84ce-80c306ea08b0.lovable.app-1782725526265.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&display=swap",
      },
      /* 🎯 THE FAVICON FIX: Pointing Google strictly to your uploaded logo path */
      { 
        rel: "icon", 
        type: "image/jpeg", 
        href: "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-07-11%20at%2000.53.14.jpeg" 
      },
      { 
        rel: "apple-touch-icon", 
        href: "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/assets/WhatsApp%20Image%202026-07-11%20at%2000.53.14.jpeg" 
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body> {/* 🎯 FIXED: Changed from </head> to </body> to solve the compilation crash */}
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
