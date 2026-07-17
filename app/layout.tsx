import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.title}`, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["trustworthy AI", "machine learning", "human-centered AI", "climate informatics", "academic research"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: absoluteUrl() },
  openGraph: { type: "website", locale: "en_US", url: absoluteUrl(), siteName: siteConfig.name, title: `${siteConfig.name} — ${siteConfig.title}`, description: siteConfig.description, images: [{ url: absoluteUrl("/og-image.svg"), width: 1200, height: 630, alt: `${siteConfig.name} research portfolio` }] },
  twitter: { card: "summary_large_image", title: `${siteConfig.name} — ${siteConfig.title}`, description: siteConfig.description, images: [absoluteUrl("/og-image.svg")] },
  icons: { icon: withBasePath("/favicon.svg") },
  manifest: withBasePath("/site.webmanifest"),
  category: "education"
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark", themeColor: [{ media: "(prefers-color-scheme: light)", color: "#faf9f6" }, { media: "(prefers-color-scheme: dark)", color: "#0f1118" }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteConfig.name,
      url: absoluteUrl(),
      jobTitle: "Associate Professor and AI Researcher",
      email: `mailto:${siteConfig.email}`,
      address: { "@type": "PostalAddress", addressLocality: siteConfig.location },
      sameAs: [siteConfig.github, siteConfig.scholar, siteConfig.linkedin, siteConfig.youtube],
      knowsAbout: ["Trustworthy artificial intelligence", "Human-centered machine learning", "Climate informatics", "Responsible data systems"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${siteConfig.name} Research Portfolio`,
      url: absoluteUrl(),
      description: siteConfig.description,
      author: { "@type": "Person", name: siteConfig.name },
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd data={structuredData} />
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
