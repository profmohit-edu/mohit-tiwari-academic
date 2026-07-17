import { pathToFileURL } from "node:url";
import { syncConfig } from "./sync/config.mjs";
import { readJson, unique, writeJson } from "./sync/shared.mjs";

const collections = ["Publications", "Projects", "Datasets", "Software", "GitHub", "Patents", "Teaching", "Metrics"];
const trim = (value, length = 1400) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, length);

function publicationCollections(publication) {
  return unique([
    "Publications",
    publication.type === "Dataset" && "Datasets",
    publication.type === "Software" && "Software",
    publication.type === "Patent" && "Patents",
  ]);
}

function repositoryAreas(repository) {
  const text = `${repository.name} ${repository.description ?? ""} ${repository.topics.join(" ")} ${repository.category}`.toLowerCase();
  const rules = [
    ["Artificial Intelligence", /\bai\b|artificial intelligence|neural|deep learning/],
    ["Cyber Security", /cyber|security|vulnerab|attack|zero trust/],
    ["Software Engineering", /software|framework|code|engineering/],
    ["Blockchain", /blockchain|ethereum|distributed ledger/],
    ["Smart Contracts", /smart contract|solidity/],
    ["Machine Learning", /machine learning|classification|prediction/],
    ["Cloud Computing", /cloud|edge|fog/],
    ["Internet of Things", /internet of things|\biot\b|smart city/],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([area]) => area);
}

export async function buildAssistantIndex() {
  const [publications, repositories, patents, teaching, metrics] = await Promise.all([
    readJson(syncConfig.paths.publications, []),
    readJson(syncConfig.paths.repositories, []),
    readJson(syncConfig.paths.manualPatents, []),
    readJson(syncConfig.paths.manualTeaching, []),
    readJson(syncConfig.paths.metrics, []),
  ]);

  const documents = [
    ...publications.map((publication) => ({
      id: `publication:${publication.id}`,
      collections: publicationCollections(publication),
      title: publication.title,
      summary: trim(publication.abstract ?? publication.citation, 700),
      content: trim([publication.title, publication.authors.join(" "), publication.abstract, publication.citation, publication.venue, publication.publisher, publication.doi, publication.citationCount !== null && `${publication.citationCount} citations cited`, publication.keywords.join(" "), publication.researchAreas.join(" "), publication.sources.join(" ")].filter(Boolean).join(" "), 2400),
      year: publication.year,
      publicationType: publication.type,
      researchAreas: publication.researchAreas,
      keywords: publication.keywords,
      url: publication.links.doi ?? publication.links.publisher ?? publication.links.dataset ?? publication.links.github,
      metadata: { doi: publication.doi, venue: publication.venue, publisher: publication.publisher, citations: publication.citationCount, openAccess: publication.openAccess, authors: publication.authors.join(", ") },
    })),
    ...repositories.map((repository) => ({
      id: `repository:${repository.id}`,
      collections: unique(["Projects", "GitHub", repository.category === "Research Software" && "Software", repository.category === "Teaching" && "Teaching"]),
      title: repository.name,
      summary: trim(repository.description ?? repository.readmeSummary ?? "Public GitHub repository.", 700),
      content: trim([repository.name, repository.description, repository.readmeSummary, repository.topics.join(" "), Object.keys(repository.languages).join(" "), repository.category, repository.license].filter(Boolean).join(" "), 2400),
      year: Number(repository.createdAt.slice(0, 4)),
      publicationType: null,
      researchAreas: repositoryAreas(repository),
      keywords: unique([...repository.topics, ...Object.keys(repository.languages), repository.category]),
      url: repository.url,
      metadata: { category: repository.category, language: repository.primaryLanguage, stars: repository.stars, forks: repository.forks, license: repository.license, updatedAt: repository.updatedAt },
    })),
    ...patents.map((patent) => ({
      id: `patent:${patent.number}`,
      collections: ["Patents"],
      title: patent.title,
      summary: trim(`${patent.status}. Inventors: ${patent.inventors.join(", ")}.`),
      content: trim([patent.title, patent.status, patent.inventors.join(" "), patent.number].join(" ")),
      year: patent.year,
      publicationType: "Patent",
      researchAreas: [],
      keywords: [],
      url: patent.url,
      metadata: { number: patent.number, status: patent.status, inventors: patent.inventors.join(", ") },
    })),
    ...teaching.map((course) => ({
      id: `teaching:${course.code}:${course.term}`,
      collections: ["Teaching"],
      title: `${course.code} — ${course.title}`,
      summary: trim(course.description),
      content: trim([course.code, course.title, course.term, course.level, course.description, course.topics.join(" ")].join(" ")),
      year: Number(course.term.match(/\b(20\d{2})\b/)?.[1]) || null,
      publicationType: null,
      researchAreas: [],
      keywords: course.topics,
      url: null,
      metadata: { code: course.code, term: course.term, level: course.level },
    })),
    ...metrics.map((metric) => ({
      id: `metric:${metric.key}`,
      collections: ["Metrics"],
      title: metric.label,
      summary: metric.value === null ? `A verified value is unavailable. ${metric.todo ?? ""}`.trim() : `${metric.label}: ${metric.value}. Source: ${metric.source}.`,
      content: `${metric.key} ${metric.label} ${metric.value ?? "unavailable"} ${metric.source} ${metric.todo ?? ""}`,
      year: null,
      publicationType: null,
      researchAreas: [],
      keywords: [metric.key, metric.label, metric.source],
      url: null,
      metadata: { value: metric.value, source: metric.source, status: metric.value === null ? "unavailable" : "verified" },
    })),
  ];

  const index = {
    generatedAt: new Date().toISOString(),
    documentCount: documents.length,
    collectionCounts: Object.fromEntries(collections.map((collection) => [collection, documents.filter((document) => document.collections.includes(collection)).length])),
    documents,
  };
  await writeJson(syncConfig.paths.assistantIndex, index);
  console.log(`Assistant index built: ${documents.length} local documents.`);
  return index;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  buildAssistantIndex().catch((error) => { console.error(error); process.exitCode = 1; });
}
