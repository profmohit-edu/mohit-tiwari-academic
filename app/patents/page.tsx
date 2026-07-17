import type { Metadata } from "next";
import { FileBadge2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { patents } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Patents", description: "Granted and published patents in responsible forecasting and privacy-preserving sensing.", path: "/patents" });

export default function PatentsPage() {
  return <PageShell><PageHero eyebrow="Translation" title="Patents and inventions" description="Protected methods developed through interdisciplinary research and responsible technology transfer." icon={FileBadge2} /><ContentSection className="max-w-5xl"><div className="space-y-5">{patents.map((patent) => <article key={patent.number} className="luxury-card group grid gap-6 rounded-3xl border p-7 sm:grid-cols-[7rem_1fr] sm:p-9"><div><p className="font-display text-3xl text-primary">{patent.year}</p><Badge className="mt-3">{patent.status}</Badge></div><div><h2 className="font-display text-3xl transition-colors group-hover:text-primary">{patent.title}</h2><p className="mt-4 text-muted-foreground">Inventors: {patent.inventors}</p><p className="mt-5 font-mono text-sm text-primary">{patent.number}</p></div></article>)}</div></ContentSection></PageShell>;
}
