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
      { title: "JOSEPH MMWA MEDIA GROUP — Global Health Journalism" },
      {
        name: "description",
        content:
          "Independent, verified global medical news and public health reporting by Joseph Mmwa Media Group. Disease outbreaks, vaccines, clinical research, and breakthrough science.",
      },
      { name: "keywords", content: "Joseph Mmwa, Joseph Mmwa Media Group, global health news, medical journalism, disease outbreaks, vaccines, healthcare reporting" },
      { name: "author", content: "Joseph Mmwa Media Group" },

      // 🚀 Essential Google Search Engine Indexing Directives
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },

      // Open Graph / Social Sharing
      { property: "og:site_name", content: "Joseph Mmwa Media Group" },
      { property: "og:title", content: "JOSEPH MMWA MEDIA GROUP — Global Health Journalism" },
      {
        property: "og:description",
        content: "If it's health, it's here. Real-time medical news and verified global health reporting.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://josephmmwa.com" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8e7cc408-23a3-4c05-80b1-1ad0be336fab/id-preview-bc413d71--9c4e72c8-f1b3-41a1-84ce-80c306ea08b0.lovable.app-1782725526265.png" },

      // Twitter / X Meta Tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JOSEPH MMWA MEDIA GROUP — Global Health Journalism" },
      { name: "twitter:description", content: "If it's health, it's here. Real-time medical news and verified global health reporting." },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8e7cc408-23a3-4c05-80b1-1ad0be336fab/id-preview-bc413d71--9c4e72c8-f1b3-41a1-84ce-80c306ea08b0.lovable.app-1782725526265.png" },
    ],
    links: [
      { rel: "canonical", href: "https://josephmmwa.com" },
      { rel: "sitemap", type: "application/xml", href: "https://josephmmwa.com/sitemap.xml" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=Source+Serif+Pro:ital,wght@0,400;0,600;1,400&display=swap",
      },
      { 
        rel: "icon", 
        type: "image/jpeg", 
        href: "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/assets/logo-icon.jpg" 
      },
      { 
        rel: "apple-touch-icon", 
        href: "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/assets/logo-icon.jpg" 
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
        {/* Google Analytics Injection */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QEWD0P1QC1"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QEWD0P1QC1');
          `
        }} />
        {/* Google Search Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Joseph Mmwa Media Group",
              "url": "https://josephmmwa.com",
              "logo": "https://mjvpcfetbvvcnhdwwjrl.supabase.co/storage/v1/object/public/assets/logo-icon.jpg",
              "slogan": "If it's health, it's here.",
              "description": "Independent, reader-funded global health newsroom and journalism network.",
            }),
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
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
