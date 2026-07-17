import type { Metadata } from "next";
import { ArrowUpRight, Database } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { datasets } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Research Datasets", description: "Documented datasets and benchmarks for trustworthy AI and computational sustainability research.", path: "/datasets" });

export default function DatasetsPage() {
  return <PageShell><PageHero eyebrow="Open data" title="Datasets designed for responsible reuse." description="Versioned research collections with explicit licensing, documentation, and known limitations." icon={Database} /><ContentSection><div className="grid gap-6 lg:grid-cols-3">{datasets.map((dataset) => <Card key={dataset.name} className="h-full"><CardContent className="flex h-full min-h-80 flex-col p-7"><div className="flex justify-between gap-4"><span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Database className="size-5" /></span><Badge>v{dataset.version}</Badge></div><h2 className="mt-8 font-mono text-2xl font-semibold">{dataset.name}</h2><p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{dataset.description}</p><dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-sm"><div><dt className="text-muted-foreground">Records</dt><dd className="mt-1 font-semibold">{dataset.records}</dd></div><div><dt className="text-muted-foreground">Size</dt><dd className="mt-1 font-semibold">{dataset.size}</dd></div></dl><div className="mt-5 flex items-center justify-between"><Badge>{dataset.license}</Badge><Button asChild variant="ghost" size="icon"><a href={dataset.link} target="_blank" rel="noreferrer" aria-label={`Access ${dataset.name}`}><ArrowUpRight className="size-4" /></a></Button></div></CardContent></Card>)}</div></ContentSection></PageShell>;
}
