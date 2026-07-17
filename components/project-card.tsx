import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ResearchProject } from "@/types/research";

export function ProjectCard({ project, compact = false }: { project: ResearchProject; compact?: boolean }) {
  return (
    <Card className="group h-full">
      <CardContent className={`flex h-full flex-col p-7 ${compact ? "min-h-80" : "min-h-96 sm:p-8"}`}>
        <div className="flex items-center justify-between gap-4">
          <Badge className="text-primary">{project.status}</Badge>
          <span className="text-xs font-medium text-muted-foreground">{project.period}</span>
        </div>
        <h2 className={`mt-8 font-display leading-tight transition-colors group-hover:text-primary ${compact ? "text-3xl" : "text-4xl"}`}>{project.title}</h2>
        <p className={`mt-5 flex-1 leading-[1.75] text-muted-foreground ${compact ? "" : "text-lg"}`}>{project.description}</p>
        {!compact && <div className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>}
        <a href={project.link} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
          View on GitHub <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </CardContent>
    </Card>
  );
}
