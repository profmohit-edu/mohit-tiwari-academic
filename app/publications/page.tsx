import type { Metadata } from "next";
import { Library } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { PublicationAnalyticsApplication, PublicationExplorerApplication } from "@/components/publication-intelligence";
import { ResearchDashboard } from "@/components/research-dashboard";
import { publications, syncMetadata } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({ title: "Publications", description: "ORCID-synchronized publications by Mohit Tiwari across artificial intelligence, cyber security, software engineering, blockchain, cloud computing, and IoT.", path: "/publications" });

export default function PublicationsPage() {
  const structuredData = publications.slice(0, 30).map((paper) => ({
    "@context": "https://schema.org",
    "@type": paper.type === "Book" ? "Book" : paper.type === "Dataset" ? "Dataset" : paper.type === "Software" ? "SoftwareSourceCode" : "ScholarlyArticle",
    headline: paper.title,
    datePublished: paper.publicationDate ?? (paper.year ? String(paper.year) : undefined),
    author: paper.authors.map((name) => ({ "@type": "Person", name })),
    publisher: paper.publisher ? { "@type": "Organization", name: paper.publisher } : undefined,
    url: paper.links.doi ?? paper.links.publisher,
    description: paper.abstract ?? undefined,
    identifier: paper.doi ?? paper.id,
    copyrightHolder: { "@type": "Person", name: siteConfig.name },
  }));
  return <PageShell><JsonLd data={structuredData} /><PageHero eyebrow="ORCID-synchronized scholarship" title="Publications" description="Explore a verified scholarly record with advanced discovery, citation exports, related research, interactive analytics, and Crossref/OpenAlex enrichment." icon={Library} /><ResearchDashboard /><PublicationAnalyticsApplication /><ContentSection className="content-auto"><div className="mb-12 flex flex-wrap gap-x-6 gap-y-2 rounded-2xl border border-border/70 bg-muted/25 px-5 py-4 text-sm text-muted-foreground"><span>ORCID: {siteConfig.orcidId}</span><span>Records: {publications.length}</span><span>Last synchronized: {syncMetadata.orcid ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(syncMetadata.orcid.synchronizedAt)) : "Not yet synchronized"}</span><span>Enrichment: Crossref + OpenAlex</span></div><PublicationExplorerApplication /></ContentSection></PageShell>;
}
