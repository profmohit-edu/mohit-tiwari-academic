import profileData from "@/data/profile.json";
import patentsData from "@/data/manual/patents.json";
import talksData from "@/data/manual/talks.json";
import teachingData from "@/data/manual/teaching.json";
import repositoriesData from "@/data/synced/github-repositories.json";
import metricsData from "@/data/synced/metrics.json";
import publicationsData from "@/data/synced/publications.json";
import syncMetadataData from "@/data/synced/sync-metadata.json";
import type { Metric, PatentRecord, Publication, Repository, Talk, TeachingItem } from "@/types/research";

export const profile = profileData;
export const publications = publicationsData as Publication[];
export const repositories = repositoriesData as unknown as Repository[];
export const metrics = metricsData as Metric[];
export const courses = teachingData as TeachingItem[];
export const manualPatents = patentsData as PatentRecord[];
export const talks = talksData as Talk[];
export const syncMetadata = syncMetadataData;

export const featuredPublications = publications
  .filter((publication) => publication.type !== "Other")
  .slice(0, 3);
export const publicationYears = [...new Set(publications.map((publication) => publication.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
export const datasets = publications.filter((publication) => publication.type === "Dataset");
export const softwareOutputs = publications.filter((publication) => publication.type === "Software");
export const orcidPatents = publications.filter((publication) => publication.type === "Patent");
export const patents = [...orcidPatents, ...manualPatents];
export const researchSoftware = repositories.filter((repository) => repository.category === "Research Software");
export const publicMetrics = metrics.filter((metric) => metric.value !== null);

export const researchCounts = {
  publications: metrics.find((metric) => metric.key === "publications")?.value ?? publications.length,
  projects: repositories.filter((repository) => !repository.archived && !repository.fork).length,
  datasets: datasets.length,
  software: Math.max(softwareOutputs.length, researchSoftware.length),
  patents: patents.length,
  courses: courses.length,
} as const;
