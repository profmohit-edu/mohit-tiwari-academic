import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Repository } from "@/types/research";

export function ProjectCard({ project, compact = false }: { project: Repository; compact?: boolean }) {
  const summary = project.description ?? project.readmeSummary ?? "Repository documentation is available on GitHub.";
  const languages = Object.keys(project.languages).slice(0, 3);
  return (
    <Card className="group h-full">
      <CardContent className={`flex h-full flex-col p-7 ${compact ? "min-h-80" : "min-h-96 sm:p-8"}`}>
        <div className="flex items-center justify-between gap-4">
          <Badge className="text-primary">{project.category}</Badge>
          <time dateTime={project.updatedAt} className="text-xs font-medium text-muted-foreground">Updated {new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(project.updatedAt))}</time>
        </div>
        <h2 className={`mt-8 break-words font-mono font-semibold leading-tight transition-colors group-hover:text-primary ${compact ? "text-2xl" : "text-3xl"}`}>{project.name}</h2>
        <p className={`mt-5 flex-1 leading-[1.75] text-muted-foreground ${compact ? "" : "text-lg"}`}>{summary}</p>
        {!compact && <div className="mt-7 flex flex-wrap gap-2">{[...project.topics.slice(0, 4), ...languages].map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>}
        <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Star aria-hidden="true" className="size-3.5" /> {project.stars}</span><span className="inline-flex items-center gap-1"><GitFork aria-hidden="true" className="size-3.5" /> {project.forks}</span>{project.license && <span>{project.license}</span>}</div>
        <a href={project.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">View repository <ArrowUpRight aria-hidden="true" className="size-4" /></a>
      </CardContent>
    </Card>
  );
}
