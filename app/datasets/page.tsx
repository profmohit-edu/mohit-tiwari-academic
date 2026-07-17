import type { Metadata } from "next";
import { Database } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { PublicationCard } from "@/components/publication-card";
import { datasets } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Research Datasets", description: "ORCID-synchronized datasets and research benchmarks published by Mohit Tiwari.", path: "/datasets" });

export default function DatasetsPage() {
  return <PageShell><PageHero eyebrow="Reproducible research" title="Datasets & benchmarks" description="Dataset records are imported from ORCID and enriched through DOI metadata services when available." icon={Database} /><ContentSection>{datasets.length > 0 ? <div className="space-y-4">{datasets.map((dataset) => <PublicationCard key={dataset.id} paper={dataset} />)}</div> : <div className="rounded-3xl border border-dashed border-border p-10 text-center"><h2 className="font-display text-3xl">No verified dataset records are currently classified.</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">The section is synchronization-ready and will populate when a public ORCID work is identified as a dataset.</p></div>}</ContentSection></PageShell>;
}
