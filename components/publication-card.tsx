import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Publication } from "@/types/research";

export function PublicationCard({ paper, showAbstract = true, headingLevel = "h2" }: { paper: Publication; showAbstract?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="luxury-card group rounded-3xl border p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-[5rem_1fr_auto]">
        <p className="font-display text-2xl text-primary">{paper.year}</p>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>{paper.type}</Badge>
            <Badge>{paper.venue}</Badge>
            {paper.featured && <Badge className="border-primary/20 bg-primary/10 text-primary">Featured</Badge>}
          </div>
          <Heading className="font-display text-2xl leading-snug transition-colors group-hover:text-primary sm:text-3xl">{paper.title}</Heading>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{paper.authors}</p>
          {showAbstract && <p className="mt-4 max-w-3xl leading-[1.75] text-muted-foreground">{paper.abstract}</p>}
        </div>
        <Button asChild variant="outline" size="icon" className="self-start">
          <a href={paper.doi} target="_blank" rel="noreferrer" aria-label={`Read publication: ${paper.title}`}>
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
