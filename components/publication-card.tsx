import { Database, ExternalLink, FileText, Github, Link2, Presentation, Video } from "lucide-react";
import { PublicationActions } from "@/components/publication-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Publication, RelatedResearch, RelatedResearchItem } from "@/types/research";

export function PublicationCard({ paper, related, showAbstract = true, headingLevel = "h2" }: { paper: Publication; related?: RelatedResearch; showAbstract?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const links = [
    ["PDF", paper.links.pdf, FileText],
    ["Slides", paper.links.slides, Presentation],
    ["Video", paper.links.video, Video],
    ["GitHub", paper.links.github, Github],
    ["Dataset", paper.links.dataset, Database],
  ] as const;
  return (
    <article className="luxury-card group rounded-3xl border p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-[5rem_1fr_auto]">
        <p className="font-display text-2xl text-primary">{paper.year ?? "—"}</p>
        <div>
          <div className="mb-3 flex flex-wrap gap-2"><Badge>{paper.type}</Badge>{paper.openAccess === "open" && <Badge>Open access</Badge>}{paper.citationCount !== null && paper.sources.includes("OpenAlex") && <Badge>{paper.citationCount} citations · OpenAlex</Badge>}</div>
          <Heading className="font-display text-2xl leading-snug transition-colors group-hover:text-primary sm:text-3xl">{paper.title}</Heading>
          {paper.authors.length > 0 && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{paper.authors.join(", ")}</p>}
          {(paper.venue || paper.publisher || paper.volume || paper.issue || paper.pages) && <p className="mt-2 text-sm text-muted-foreground">{[paper.venue, paper.publisher, paper.volume && `Vol. ${paper.volume}`, paper.issue && `Issue ${paper.issue}`, paper.pages && `pp. ${paper.pages}`].filter(Boolean).join(" · ")}</p>}
          {paper.doi && <p className="mt-2 break-all font-mono text-xs text-muted-foreground">DOI: {paper.doi}</p>}
          {showAbstract && paper.abstract && <p className="mt-4 max-w-3xl leading-[1.75] text-muted-foreground">{paper.abstract}</p>}
          {showAbstract && paper.researchAreas.length > 0 && <div className="mt-5"><p className="mb-2 text-[.65rem] font-bold uppercase tracking-[.16em] text-muted-foreground">Research areas</p><div className="flex flex-wrap gap-2">{paper.researchAreas.map((area) => <Badge key={area} className="text-primary">{area}</Badge>)}</div></div>}
          {showAbstract && paper.keywords.length > 0 && <div className="mt-4"><p className="mb-2 text-[.65rem] font-bold uppercase tracking-[.16em] text-muted-foreground">Keywords</p><div className="flex flex-wrap gap-2">{paper.keywords.slice(0, 8).map((keyword) => <Badge key={keyword}>{keyword}</Badge>)}</div></div>}
          {showAbstract && <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="font-bold uppercase tracking-[.14em]">Sources</span>{paper.sources.map((source) => <span key={source}>{source}</span>)}</div>}
          <div className="mt-5 flex flex-wrap items-center gap-2"><PublicationActions publication={paper} />{links.map(([label, href, Icon]) => href && <Button key={label} asChild variant="ghost" size="sm"><a href={href} target="_blank" rel="noreferrer"><Icon aria-hidden="true" className="size-3.5" /> {label}</a></Button>)}</div>
          {related && Object.values(related).some((items) => items.length > 0) && <details className="mt-5 rounded-2xl border border-border/70 bg-muted/25 p-4"><summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden"><Link2 aria-hidden="true" className="size-4" /> Related research</summary><div className="mt-4 grid gap-4 sm:grid-cols-2">{(Object.entries(related) as Array<[keyof RelatedResearch, RelatedResearchItem[]]>).filter(([, items]) => items.length > 0).map(([group, items]) => <div key={group}><p className="text-[.65rem] font-bold uppercase tracking-[.14em] text-muted-foreground">{group === "repositories" ? "GitHub repositories" : group}</p><ul className="mt-2 space-y-2">{items.map((item) => <li key={`${item.kind}-${item.id}`} className="text-sm leading-snug">{item.href ? <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">{item.title}</a> : item.title}</li>)}</ul></div>)}</div></details>}
        </div>
        {(paper.links.doi || paper.links.publisher) && <Button asChild variant="outline" size="icon" className="self-start"><a href={paper.links.doi ?? paper.links.publisher ?? "#"} target="_blank" rel="noreferrer" aria-label={`Open publication: ${paper.title}`}><ExternalLink aria-hidden="true" className="size-4" /></a></Button>}
      </div>
    </article>
  );
}
