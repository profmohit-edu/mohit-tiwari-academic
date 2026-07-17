import type { Metadata } from "next";
import { FileBadge2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { PublicationCard } from "@/components/publication-card";
import { Badge } from "@/components/ui/badge";
import { manualPatents, orcidPatents } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Patents", description: "Verified patent and invention records associated with Mohit Tiwari.", path: "/patents" });

export default function PatentsPage() {
  const count = orcidPatents.length + manualPatents.length;
  return <PageShell><PageHero eyebrow="Technology translation" title="Patents & inventions" description="Records appear only when verified through ORCID or explicitly added to the manual scholarly record." icon={FileBadge2} /><ContentSection className="max-w-5xl">{count === 0 ? <div className="rounded-3xl border border-dashed border-border p-10 text-center"><h2 className="font-display text-3xl">No verified patent records are currently published.</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">No patent claims have been inferred from unrelated research outputs.</p></div> : <div className="space-y-5">{orcidPatents.map((patent) => <PublicationCard key={patent.id} paper={patent} />)}{manualPatents.map((patent) => <article key={patent.number} className="luxury-card rounded-3xl border p-7 sm:p-9"><div className="flex flex-wrap items-center gap-3"><Badge>{patent.status}</Badge><span className="font-mono text-sm text-primary">{patent.number}</span></div><h2 className="mt-5 font-display text-3xl">{patent.title}</h2><p className="mt-4 text-muted-foreground">{patent.inventors.join(", ")} {patent.year && `· ${patent.year}`}</p></article>)}</div>}</ContentSection></PageShell>;
}
