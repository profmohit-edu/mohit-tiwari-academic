import type { Metadata } from "next";
import { ArrowRight, Braces, Database, FileBadge2, LibraryBig } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { researchCounts, researchSoftware, softwareOutputs } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Research Resources", description: "A synchronized index of datasets, research software, repositories, and patent records associated with Mohit Tiwari.", path: "/resources" });

const collections = [
  { title: "Datasets", href: "/datasets", description: "Dataset and benchmark records classified from the ORCID scholarly record.", count: researchCounts.datasets, label: "records", icon: Database },
  { title: "Software", href: "/software", description: "GitHub repositories and citable software outputs from synchronized sources.", count: researchCounts.software, label: "outputs", icon: Braces },
  { title: "Patents", href: "/patents", description: "Verified invention records from ORCID and explicitly maintained academic data.", count: researchCounts.patents, label: "records", icon: FileBadge2 },
];

export default function ResourcesPage() {
  const recentSoftware = [...researchSoftware.map((repository) => ({ name: repository.name, detail: repository.category, href: repository.url })), ...softwareOutputs.map((output) => ({ name: output.title, detail: output.type, href: output.links.doi ?? output.links.publisher ?? "/software" }))].slice(0, 5);
  return <PageShell><PageHero eyebrow="Research record" title="Resources" description="A durable index of reusable outputs synchronized independently of the presentation layer." icon={LibraryBig} /><ContentSection><div className="grid gap-5 lg:grid-cols-3">{collections.map(({ title, href, description, count, label, icon: Icon }) => <Link key={href} href={href} className="luxury-card group flex min-h-80 flex-col rounded-3xl border p-7 sm:p-8"><div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="size-5" /></span><p><span className="font-display text-4xl text-primary">{count}</span> <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span></p></div><h2 className="mt-10 font-display text-4xl transition-colors group-hover:text-primary">{title}</h2><p className="mt-4 flex-1 leading-[1.75] text-muted-foreground">{description}</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explore {title.toLowerCase()} <ArrowRight aria-hidden="true" className="size-4" /></span></Link>)}</div><section className="mt-24" aria-labelledby="resource-directory"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Current synchronized outputs</p><h2 id="resource-directory" className="mt-4 font-display text-4xl sm:text-5xl">Resource directory</h2></div><Button asChild variant="outline"><Link href="/publications">Browse the scholarly record <ArrowRight aria-hidden="true" className="size-4" /></Link></Button></div>{recentSoftware.length > 0 ? <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card">{recentSoftware.map((item, index) => <a key={`${item.name}-${index}`} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="grid gap-2 border-b border-border p-5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7"><div><p className="font-mono font-semibold">{item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.detail}</p></div><span className="text-sm font-semibold text-primary">Open resource</span></a>)}</div> : <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">No synchronized reusable outputs are available yet.</div>}</section></ContentSection></PageShell>;
}
