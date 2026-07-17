import {
  BadgeCheck,
  BookOpenText,
  Boxes,
  ClipboardCheck,
  Code2,
  Database,
  FileBadge2,
  Github,
  LibraryBig,
  PanelsTopLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { profile, repositories, researchCounts } from "@/lib/content";

const snapshot = [
  { label: "Publications", value: researchCounts.publications, detail: "ORCID scholarly record", icon: BookOpenText },
  { label: "Patents", value: researchCounts.patents, detail: "Verified records", icon: FileBadge2 },
  { label: "Datasets", value: researchCounts.datasets, detail: "Research datasets", icon: Database },
  { label: "Software", value: researchCounts.software, detail: "Research software", icon: Code2 },
  { label: "Open-source projects", value: repositories.length, detail: "Public GitHub repositories", icon: Boxes },
  { label: "Reviewer roles", value: profile.academicService.reviewerRoles ?? "Not listed", detail: profile.academicService.reviewerRoles ? "Verified appointments" : "Awaiting verified record", icon: ClipboardCheck },
  { label: "Editorial boards", value: profile.academicService.editorialBoards ?? "Not listed", detail: profile.academicService.editorialBoards ? "Verified appointments" : "Awaiting verified record", icon: PanelsTopLeft },
  { label: "IEEE membership", value: "Senior Member", detail: "Professional membership", icon: BadgeCheck },
  { label: "ORCID", value: "Verified", detail: profile.orcidId, icon: LibraryBig, href: profile.profiles.orcid.url },
  { label: "GitHub", value: `@${profile.githubUsername}`, detail: `${repositories.length} synchronized repositories`, icon: Github, href: profile.profiles.github.url },
] as const;

export function ResearchSnapshot() {
  return (
    <section aria-labelledby="research-snapshot-title" className="relative z-10 border-y border-border/60 bg-background/70 py-16 backdrop-blur-xl sm:py-20">
      <div className="container">
        <div className="mb-9 max-w-2xl">
          <p className="eyebrow mb-3">At a glance</p>
          <h2 id="research-snapshot-title" className="font-display text-3xl tracking-tight sm:text-4xl">Research snapshot</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">A transparent view of synchronized scholarship, open research outputs, and verified professional standing.</p>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {snapshot.map(({ label, value, detail, icon: Icon, ...item }, index) => {
            const content = (
              <Card className="group h-full">
                <CardContent className="flex min-h-44 flex-col p-5 sm:min-h-48 sm:p-6">
                  <Icon aria-hidden="true" className="size-5 text-primary" />
                  <p className="mt-auto break-words font-display text-2xl leading-tight text-foreground sm:text-3xl">{value}</p>
                  <h3 className="mt-2 text-xs font-bold uppercase tracking-[.1em] text-primary">{label}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
                </CardContent>
              </Card>
            );
            return (
              <li key={label} className="reveal" style={{ "--reveal-delay": `${index * .035}s` } as React.CSSProperties}>
                {"href" in item && item.href ? <a href={item.href} target="_blank" rel="noreferrer" className="block h-full rounded-[1.75rem]">{content}<span className="sr-only"> Opens in a new tab.</span></a> : content}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
