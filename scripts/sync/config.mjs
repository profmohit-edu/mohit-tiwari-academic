import { resolve } from "node:path";

export const syncConfig = {
  orcidId: "0000-0003-1836-3451",
  githubUsername: "profmohit-edu",
  contactEmail: "mohit.t.bvcoe@gmail.com",
  userAgent: "mohit-tiwari-academic/1.0 (mailto:mohit.t.bvcoe@gmail.com)",
  maxSitePublications: Number(process.env.SYNC_PUBLICATION_LIMIT ?? 300),
  enrichmentLimit: Number(process.env.SYNC_ENRICH_LIMIT ?? 40),
  concurrency: Number(process.env.SYNC_CONCURRENCY ?? 3),
  paths: {
    publications: resolve("data/synced/publications.json"),
    orcidWorks: resolve("data/synced/orcid-works.json"),
    repositories: resolve("data/synced/github-repositories.json"),
    metrics: resolve("data/synced/metrics.json"),
    enrichmentCache: resolve("data/synced/enrichment-cache.json"),
    metadata: resolve("data/synced/sync-metadata.json"),
    assistantIndex: resolve("data/synced/assistant-index.json"),
    manualPatents: resolve("data/manual/patents.json"),
    manualTeaching: resolve("data/manual/teaching.json"),
    manualAcademicContributions: resolve("data/manual/academic-contributions.json"),
    manualStudentProjects: resolve("data/manual/student-projects.json"),
    manualTeachingMetrics: resolve("data/manual/teaching-metrics.json"),
  },
};
