import type { Metadata } from "next";
import { ArrowRight, Braces, Database, FileBadge2, LibraryBig } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { datasets, patents, researchCounts, software } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Research Resources",
  description: "A central index of open datasets, research software, and patents from Dr. Aarya Mehta's research group.",
  path: "/resources",
});

const collections = [
  { title: "Datasets", href: "/datasets", description: "Versioned, licensed, and documented collections built for responsible reuse.", count: researchCounts.datasets, label: "collections", icon: Database },
  { title: "Software", href: "/software", description: "Open-source tools for auditing, uncertainty communication, and data documentation.", count: researchCounts.software, label: "packages", icon: Braces },
  { title: "Patents", href: "/patents", description: "Inventions translating responsible forecasting and sensing research into practice.", count: researchCounts.patents, label: "records", icon: FileBadge2 },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Research commons" title="Resources" description="A durable home for the datasets, software, and inventions produced alongside peer-reviewed scholarship." icon={LibraryBig} />
      <ContentSection>
        <div className="grid gap-5 lg:grid-cols-3">
          {collections.map(({ title, href, description, count, label, icon: Icon }) => (
            <Link key={href} href={href} className="luxury-card group flex min-h-80 flex-col rounded-3xl border p-7 sm:p-8">
              <div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span><p><span className="font-display text-4xl text-primary">{count}</span> <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span></p></div>
              <h2 className="mt-10 font-display text-4xl transition-colors group-hover:text-primary">{title}</h2>
              <p className="mt-4 flex-1 leading-[1.75] text-muted-foreground">{description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore {title.toLowerCase()} <ArrowRight aria-hidden="true" className="size-4" /></span>
            </Link>
          ))}
        </div>

        <section className="mt-24" aria-labelledby="resource-directory">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">At a glance</p><h2 id="resource-directory" className="mt-4 font-display text-4xl sm:text-5xl">Resource directory</h2></div><Button asChild variant="outline"><Link href="/publications">Pair with publications <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div>
          <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="grid gap-3 border-b border-border p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-7"><div><p className="font-mono font-semibold">{datasets[0].name}</p><p className="mt-1 text-sm text-muted-foreground">Featured dataset · {datasets[0].records} records</p></div><Badge>{datasets[0].license}</Badge><Link href="/datasets" className="text-sm font-semibold text-primary">View datasets</Link></div>
            <div className="grid gap-3 border-b border-border p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-7"><div><p className="font-mono font-semibold">{software[0].name}</p><p className="mt-1 text-sm text-muted-foreground">Featured package · {software[0].language}</p></div><Badge>{software[0].license}</Badge><Link href="/software" className="text-sm font-semibold text-primary">View software</Link></div>
            <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-7"><div><p className="font-semibold">{patents[0].title}</p><p className="mt-1 text-sm text-muted-foreground">{patents[0].number}</p></div><Badge>{patents[0].status}</Badge><Link href="/patents" className="text-sm font-semibold text-primary">View patents</Link></div>
          </div>
        </section>
      </ContentSection>
    </PageShell>
  );
}
