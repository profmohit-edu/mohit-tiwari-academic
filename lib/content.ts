import profileData from "@/data/profile.json";
import patentsData from "@/data/manual/patents.json";
import talksData from "@/data/manual/talks.json";
import repositoriesData from "@/data/synced/github-repositories.json";
import metricsData from "@/data/synced/metrics.json";
import publicationsData from "@/data/synced/publications.json";
import syncMetadataData from "@/data/synced/sync-metadata.json";
import type { AcademicHighlight, Metric, PatentRecord, Publication, Repository, Talk } from "@/types/research";
import { teachingCourses } from "@/lib/teaching";

export const profile = profileData;
export const publications = publicationsData as Publication[];
export const repositories = repositoriesData as unknown as Repository[];
export const metrics = metricsData as Metric[];
export const courses = teachingCourses;
export const manualPatents = patentsData as PatentRecord[];
export const talks = talksData as Talk[];
export const syncMetadata = syncMetadataData;

const byPublicationDate = (left: Publication, right: Publication) => {
  const leftTime = left.publicationDate ? new Date(left.publicationDate).getTime() : (left.year ?? 0) * 31_536_000_000;
  const rightTime = right.publicationDate ? new Date(right.publicationDate).getTime() : (right.year ?? 0) * 31_536_000_000;
  return rightTime - leftTime;
};

export const featuredPublications = [...publications]
  .filter((publication) => publication.type !== "Other")
  .sort(byPublicationDate)
  .slice(0, 3);
export const publicationYears = [...new Set(publications.map((publication) => publication.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
export const datasets = publications.filter((publication) => publication.type === "Dataset");
export const softwareOutputs = publications.filter((publication) => publication.type === "Software");
export const orcidPatents = publications.filter((publication) => publication.type === "Patent");
export const patents = [...orcidPatents, ...manualPatents];
export const researchSoftware = repositories.filter((repository) => repository.category === "Research Software");
export const publicMetrics = metrics.filter((metric) => metric.value !== null);

const newestPublication = [...publications].sort(byPublicationDate)[0];
const newestSoftware = [...softwareOutputs].sort(byPublicationDate)[0];
const newestDataset = [...datasets].sort(byPublicationDate)[0];
const newestRepository = [...repositories].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())[0];
const latestRepositoryActivity = [...repositories].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0];

const publicationHighlight = (
  key: AcademicHighlight["key"],
  eyebrow: string,
  publication: Publication | undefined,
  fallback: string,
): AcademicHighlight => ({
  key,
  eyebrow,
  title: publication?.title ?? fallback,
  description: publication ? [publication.type, publication.venue, publication.year].filter(Boolean).join(" · ") : "No verified record is currently available.",
  date: publication?.publicationDate ?? (publication?.year ? `${publication.year}-01-01` : null),
  href: publication ? `/publications#${encodeURIComponent(publication.id)}` : "/publications",
  external: false,
});

export const academicHighlights: AcademicHighlight[] = [
  publicationHighlight("publication", "Most recent publication", newestPublication, "Publication record pending"),
  publicationHighlight("software", "Newest software", newestSoftware, "Software record pending"),
  publicationHighlight("dataset", "Newest dataset", newestDataset, "Dataset record pending"),
  {
    key: "repository",
    eyebrow: "Newest GitHub repository",
    title: newestRepository?.name ?? "Repository record pending",
    description: newestRepository ? newestRepository.description ?? newestRepository.readmeSummary ?? newestRepository.category : "No synchronized repository is currently available.",
    date: newestRepository?.createdAt ?? null,
    href: newestRepository?.url ?? "/projects",
    external: Boolean(newestRepository),
  },
  {
    key: "activity",
    eyebrow: "Latest research activity",
    title: latestRepositoryActivity ? `${latestRepositoryActivity.name} updated` : newestPublication?.title ?? "Activity record pending",
    description: latestRepositoryActivity ? `${latestRepositoryActivity.category} · ${latestRepositoryActivity.primaryLanguage ?? "Research repository"}` : "No synchronized activity is currently available.",
    date: latestRepositoryActivity?.updatedAt ?? newestPublication?.publicationDate ?? null,
    href: latestRepositoryActivity?.url ?? "/publications",
    external: Boolean(latestRepositoryActivity),
  },
];

export const researchCounts = {
  publications: metrics.find((metric) => metric.key === "publications")?.value ?? publications.length,
  projects: repositories.filter((repository) => !repository.archived && !repository.fork).length,
  datasets: datasets.length,
  software: Math.max(softwareOutputs.length, researchSoftware.length),
  patents: patents.length,
  courses: courses.length,
} as const;
