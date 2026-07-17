import { BookOpenText, Database, FileBadge2, FolderGit2, Github, MessageSquareText, Sparkles, Star, TerminalSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { datasets, patents, publications, repositories, softwareOutputs, talks } from "@/lib/content";

const publicationTime = (date: string | null, year: number | null) => date ? new Date(date).getTime() : (year ?? 0) * 31_536_000_000;
const newestPublication = [...publications].sort((left, right) => publicationTime(right.publicationDate, right.year) - publicationTime(left.publicationDate, left.year))[0];
const mostCited = [...publications].filter((publication) => publication.citationCount !== null && publication.sources.includes("OpenAlex") && publication.citationCount > 0).sort((left, right) => (right.citationCount ?? 0) - (left.citationCount ?? 0))[0];
const newestDataset = [...datasets].sort((left, right) => publicationTime(right.publicationDate, right.year) - publicationTime(left.publicationDate, left.year))[0];
const newestSoftware = [...softwareOutputs].sort((left, right) => publicationTime(right.publicationDate, right.year) - publicationTime(left.publicationDate, left.year))[0];
const newestRepository = [...repositories].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0];
const newestProject = [...repositories].filter((repository) => !repository.archived && !repository.fork && !["Teaching", "Utilities", "Research Platforms"].includes(repository.category)).sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0];
const newestPatent = [...patents].sort((left, right) => (right.year ?? 0) - (left.year ?? 0))[0];
const newestTalk = [...talks].sort((left, right) => right.year - left.year)[0];
const newestPatentDetail = newestPatent ? ("status" in newestPatent ? [newestPatent.status, newestPatent.year].filter(Boolean).join(" · ") : [newestPatent.type, newestPatent.year].filter(Boolean).join(" · ")) : "Patent record pending";
const newestPatentHref = newestPatent ? ("url" in newestPatent ? newestPatent.url : newestPatent.links.publisher ?? newestPatent.links.doi) : null;

const entries = [
  { label: "Latest publication", title: newestPublication?.title ?? "No verified publication", detail: newestPublication ? [newestPublication.type, newestPublication.year].filter(Boolean).join(" · ") : "ORCID record pending", href: newestPublication?.links.doi ?? newestPublication?.links.publisher, icon: BookOpenText },
  { label: "Most cited publication", title: mostCited?.title ?? "Citation record unavailable", detail: mostCited ? `${mostCited.citationCount} OpenAlex citations` : "Shown only with a verifiable citation source", href: mostCited?.links.doi ?? mostCited?.links.publisher, icon: Star },
  { label: "Newest dataset", title: newestDataset?.title ?? "No verified dataset", detail: newestDataset ? String(newestDataset.year ?? "Date unavailable") : "Dataset record pending", href: newestDataset?.links.dataset ?? newestDataset?.links.doi ?? newestDataset?.links.publisher, icon: Database },
  { label: "Newest software", title: newestSoftware?.title ?? "No verified software release", detail: newestSoftware ? String(newestSoftware.year ?? "Date unavailable") : "Software record pending", href: newestSoftware?.links.github ?? newestSoftware?.links.publisher, icon: TerminalSquare },
  { label: "Newest GitHub repository", title: newestRepository?.name ?? "No repository available", detail: newestRepository ? `Created ${new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(newestRepository.createdAt))}` : "GitHub sync pending", href: newestRepository?.url, icon: Github },
  { label: "Newest project", title: newestProject?.name ?? "No research project available", detail: newestProject?.category ?? "Project record pending", href: newestProject?.url, icon: FolderGit2 },
  { label: "Newest patent", title: newestPatent?.title ?? "No verified patent listed", detail: newestPatentDetail, href: newestPatentHref, icon: FileBadge2 },
  { label: "Newest talk", title: newestTalk?.title ?? "No verified talk listed", detail: newestTalk ? `${newestTalk.event} · ${newestTalk.year}` : "Talk record pending", href: newestTalk?.videoUrl, icon: MessageSquareText },
] as const;

export function ResearchDashboard() {
  return (
    <section className="content-auto border-b border-border/60 bg-muted/25 py-20 sm:py-24" aria-labelledby="research-dashboard-title">
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-4">Research intelligence</p>
          <div className="flex items-center gap-3"><Sparkles aria-hidden="true" className="size-5 text-primary" /><h2 id="research-dashboard-title" className="font-display text-4xl tracking-tight sm:text-5xl">Research dashboard</h2></div>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Current milestones selected automatically from verified scholarly and open-source records.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map(({ label, title, detail, href, icon: Icon }) => {
            const content = <Card className="group h-full"><CardContent className="flex min-h-56 flex-col p-6"><Icon aria-hidden="true" className="size-5 text-primary" /><p className="eyebrow mt-7">{label}</p><h3 className="mt-3 line-clamp-3 font-display text-xl leading-snug transition-colors group-hover:text-primary">{title}</h3><p className="mt-auto pt-5 text-xs leading-relaxed text-muted-foreground">{detail}</p></CardContent></Card>;
            return href ? <a key={label} href={href} target="_blank" rel="noreferrer" className="block h-full rounded-[1.75rem]">{content}<span className="sr-only"> Opens in a new tab.</span></a> : <div key={label}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
