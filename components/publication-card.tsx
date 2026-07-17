import { Database, ExternalLink, FileText, Github, Presentation, Video } from "lucide-react";
import { PublicationActions } from "@/components/publication-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Publication } from "@/types/research";

export function PublicationCard({ paper, showAbstract = true, headingLevel = "h2" }: { paper: Publication; showAbstract?: boolean; headingLevel?: "h2" | "h3" }) {
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
          <div className="mb-3 flex flex-wrap gap-2"><Badge>{paper.type}</Badge>{paper.venue && <Badge>{paper.venue}</Badge>}{paper.citationCount !== null && <Badge>{paper.citationCount} citations</Badge>}</div>
          <Heading className="font-display text-2xl leading-snug transition-colors group-hover:text-primary sm:text-3xl">{paper.title}</Heading>
          {paper.authors.length > 0 && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{paper.authors.join(", ")}</p>}
          {(paper.publisher || paper.volume || paper.issue || paper.pages) && <p className="mt-2 text-sm text-muted-foreground">{[paper.publisher, paper.volume && `Vol. ${paper.volume}`, paper.issue && `Issue ${paper.issue}`, paper.pages && `pp. ${paper.pages}`].filter(Boolean).join(" · ")}</p>}
          {showAbstract && paper.abstract && <p className="mt-4 max-w-3xl leading-[1.75] text-muted-foreground">{paper.abstract}</p>}
          {showAbstract && (paper.researchAreas.length > 0 || paper.keywords.length > 0) && <div className="mt-5 flex flex-wrap gap-2">{[...paper.researchAreas, ...paper.keywords.slice(0, 5)].map((keyword) => <Badge key={keyword}>{keyword}</Badge>)}</div>}
          <div className="mt-5 flex flex-wrap items-center gap-2"><PublicationActions citation={paper.citation} bibtex={paper.bibtex} />{links.map(([label, href, Icon]) => href && <Button key={label} asChild variant="ghost" size="sm"><a href={href} target="_blank" rel="noreferrer"><Icon aria-hidden="true" className="size-3.5" /> {label}</a></Button>)}</div>
        </div>
        {(paper.links.doi || paper.links.publisher) && <Button asChild variant="outline" size="icon" className="self-start"><a href={paper.links.doi ?? paper.links.publisher ?? "#"} target="_blank" rel="noreferrer" aria-label={`Open publication: ${paper.title}`}><ExternalLink aria-hidden="true" className="size-4" /></a></Button>}
      </div>
    </article>
  );
}
