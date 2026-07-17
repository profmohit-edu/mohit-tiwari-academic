import { pathToFileURL } from "node:url";
import { syncConfig } from "./config.mjs";
import {
  fetchJson,
  normalizeDoi,
  readJson,
  rebuildMetrics,
  runPool,
  stripMarkup,
  unique,
  updateSyncMetadata,
  writeJson,
} from "./shared.mjs";

const ORCID_TYPE_MAP = {
  "journal-article": "Journal Article",
  "conference-paper": "Conference Paper",
  "conference-abstract": "Conference Paper",
  "conference-poster": "Conference Paper",
  book: "Book",
  "book-chapter": "Book Chapter",
  dataset: "Dataset",
  software: "Software",
  patent: "Patent",
  preprint: "Preprint",
};

const CROSSREF_TYPE_MAP = {
  "journal-article": "Journal Article",
  proceedings: "Conference Paper",
  "proceedings-article": "Conference Paper",
  book: "Book",
  monograph: "Book",
  "book-chapter": "Book Chapter",
  dataset: "Dataset",
  "posted-content": "Preprint",
};

const sourcePriority = ["Crossref", "Scopus", "Web of Science", "DataCite", "Mohit Tiwari"];

function chooseSummary(summaries) {
  return [...summaries].sort((left, right) => {
    const leftSource = left.source?.["source-name"]?.value ?? "";
    const rightSource = right.source?.["source-name"]?.value ?? "";
    const leftScore = sourcePriority.findIndex((source) => leftSource.includes(source));
    const rightScore = sourcePriority.findIndex((source) => rightSource.includes(source));
    return (leftScore < 0 ? 99 : leftScore) - (rightScore < 0 ? 99 : rightScore);
  })[0];
}

function normalizeDate(date) {
  const year = date?.year?.value;
  if (!year) return null;
  const month = date?.month?.value?.padStart(2, "0") ?? "01";
  const day = date?.day?.value?.padStart(2, "0") ?? "01";
  return `${year}-${month}-${day}`;
}

function normalizeOrcidWork(group) {
  const summary = chooseSummary(group["work-summary"] ?? []);
  const externalIds = summary?.["external-ids"]?.["external-id"] ?? [];
  const doi = normalizeDoi(externalIds.find((identifier) => identifier["external-id-type"]?.toLowerCase() === "doi")?.["external-id-value"]);
  const title = stripMarkup(summary?.title?.title?.value) ?? "Untitled work";
  const publicationDate = normalizeDate(summary?.["publication-date"]);
  const sourceType = summary?.type ?? "other";
  let type = ORCID_TYPE_MAP[sourceType] ?? "Other";
  if (type === "Other" && /\bdataset\b|benchmark data/i.test(title)) type = "Dataset";
  return {
    id: doi ? `doi:${doi}` : `orcid:${summary?.["put-code"]}`,
    putCode: summary?.["put-code"] ?? null,
    title,
    year: publicationDate ? Number(publicationDate.slice(0, 4)) : null,
    publicationDate,
    type,
    sourceType,
    venue: stripMarkup(summary?.["journal-title"]?.value),
    doi,
    url: summary?.url?.value ?? (doi ? `https://doi.org/${doi}` : null),
    sourceName: summary?.source?.["source-name"]?.value ?? null,
    orcidPath: summary?.path ?? null,
  };
}

function workKey(work) {
  return work.doi ?? `${work.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}|${work.year ?? ""}`;
}

function datePartsToIso(parts) {
  const values = parts?.[0];
  if (!values?.[0]) return null;
  return `${values[0]}-${String(values[1] ?? 1).padStart(2, "0")}-${String(values[2] ?? 1).padStart(2, "0")}`;
}

function normalizeCrossref(payload) {
  const work = payload?.message;
  if (!work) return null;
  return {
    title: stripMarkup(work.title?.[0]),
    authors: (work.author ?? []).map((author) => [author.given, author.family].filter(Boolean).join(" ")).filter(Boolean),
    venue: stripMarkup(work["container-title"]?.[0]),
    publisher: stripMarkup(work.publisher),
    volume: work.volume ?? null,
    issue: work.issue ?? null,
    pages: work.page ?? null,
    publicationDate: datePartsToIso(work.published?.["date-parts"] ?? work.issued?.["date-parts"]),
    type: CROSSREF_TYPE_MAP[work.type] ?? null,
    abstract: stripMarkup(work.abstract),
    keywords: unique(work.subject ?? []),
    pdf: work.link?.find((link) => link["content-type"] === "application/pdf")?.URL ?? null,
    publisherUrl: work.URL ?? null,
  };
}

function restoreAbstract(invertedIndex) {
  if (!invertedIndex) return null;
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) words[position] = word;
  }
  return words.filter(Boolean).join(" ") || null;
}

function normalizeOpenAlex(work) {
  if (!work) return null;
  return {
    title: stripMarkup(work.title),
    authors: (work.authorships ?? []).map((authorship) => authorship.author?.display_name).filter(Boolean),
    venue: work.primary_location?.source?.display_name ?? null,
    publisher: work.primary_location?.source?.host_organization_name ?? null,
    publicationDate: work.publication_date ?? null,
    abstract: restoreAbstract(work.abstract_inverted_index),
    keywords: unique([
      ...(work.keywords ?? []).map((keyword) => keyword.display_name),
      ...(work.topics ?? []).map((topic) => topic.display_name),
    ]),
    citationCount: Number.isFinite(work.cited_by_count) ? work.cited_by_count : null,
    pdf: work.best_oa_location?.pdf_url ?? null,
    publisherUrl: work.primary_location?.landing_page_url ?? work.doi ?? null,
  };
}

async function enrichDoi(doi) {
  const encoded = encodeURIComponent(doi);
  const [crossrefResult, openAlexResult] = await Promise.allSettled([
    fetchJson(`https://api.crossref.org/works/${encoded}?mailto=${encodeURIComponent(syncConfig.contactEmail)}`, { allow404: true }),
    fetchJson(`https://api.openalex.org/works/https://doi.org/${encoded}?mailto=${encodeURIComponent(syncConfig.contactEmail)}`, { allow404: true }),
  ]);
  return {
    crossref: crossrefResult.status === "fulfilled" ? normalizeCrossref(crossrefResult.value) : null,
    openAlex: openAlexResult.status === "fulfilled" ? normalizeOpenAlex(openAlexResult.value) : null,
    enrichedAt: new Date().toISOString(),
  };
}

function inferResearchAreas(publication) {
  const text = `${publication.title} ${publication.abstract ?? ""} ${publication.keywords.join(" ")}`.toLowerCase();
  const rules = [
    ["Artificial Intelligence", /artificial intelligence|neural|deep learning|intelligent system|codebert/],
    ["Cyber Security", /cyber|security|intrusion|zero trust|attack|vulnerab|malware|fraud/],
    ["Software Engineering", /software|code review|requirements|engineering framework/],
    ["Blockchain", /blockchain|bitcoin|distributed ledger/],
    ["Smart Contracts", /smart contract|solidity|ethereum/],
    ["Machine Learning", /machine learning|classification|prediction|learning model/],
    ["Cloud Computing", /cloud|edge|fog computing/],
    ["Internet of Things", /internet of things|\biot\b|cyber-physical|smart city|wearable/],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([area]) => area);
}

function createCitation(publication) {
  const authors = publication.authors.length ? publication.authors.join(", ") : "Mohit Tiwari";
  return `${authors} (${publication.year ?? "n.d."}). ${publication.title}.${publication.venue ? ` ${publication.venue}.` : ""}${publication.doi ? ` https://doi.org/${publication.doi}` : ""}`;
}

function createBibtex(publication) {
  if (!publication.doi && !publication.title) return null;
  const key = `tiwari${publication.year ?? "nd"}${publication.title.split(/\s+/).find((word) => word.length > 4)?.replace(/[^a-z0-9]/gi, "")?.toLowerCase() ?? "work"}`;
  const entryType = publication.type === "Journal Article" ? "article" : publication.type === "Conference Paper" ? "inproceedings" : publication.type === "Book Chapter" ? "incollection" : publication.type === "Book" ? "book" : "misc";
  const fields = [
    ["title", publication.title],
    ["author", publication.authors.join(" and ")],
    ["year", publication.year],
    [entryType === "article" ? "journal" : "booktitle", publication.venue],
    ["publisher", publication.publisher],
    ["volume", publication.volume],
    ["number", publication.issue],
    ["pages", publication.pages],
    ["doi", publication.doi],
  ].filter(([, value]) => value !== null && value !== "" && value !== undefined);
  return `@${entryType}{${key},\n${fields.map(([field, value]) => `  ${field} = {${String(value).replace(/[{}]/g, "")}}`).join(",\n")}\n}`;
}

function secureUrl(value) {
  if (!value) return null;
  return value.replace(/^http:\/\//i, "https://");
}

function mergePublication(work, enrichment) {
  const crossref = enrichment?.crossref;
  const openAlex = enrichment?.openAlex;
  const publicationDate = crossref?.publicationDate ?? openAlex?.publicationDate ?? work.publicationDate;
  const publication = {
    id: work.id,
    title: crossref?.title ?? openAlex?.title ?? work.title,
    year: publicationDate ? Number(publicationDate.slice(0, 4)) : work.year,
    publicationDate,
    type: crossref?.type ?? work.type,
    sourceType: work.sourceType,
    authors: crossref?.authors?.length ? crossref.authors : openAlex?.authors?.length ? openAlex.authors : [],
    venue: crossref?.venue ?? openAlex?.venue ?? work.venue,
    publisher: crossref?.publisher ?? openAlex?.publisher ?? null,
    volume: crossref?.volume ?? null,
    issue: crossref?.issue ?? null,
    pages: crossref?.pages ?? null,
    doi: work.doi,
    abstract: crossref?.abstract ?? openAlex?.abstract ?? null,
    keywords: unique([...(crossref?.keywords ?? []), ...(openAlex?.keywords ?? [])]).slice(0, 20),
    researchAreas: [],
    citation: "",
    bibtex: null,
    citationCount: openAlex?.citationCount ?? null,
    links: {
      doi: work.doi ? `https://doi.org/${work.doi}` : null,
      pdf: secureUrl(crossref?.pdf ?? openAlex?.pdf),
      slides: null,
      video: null,
      github: null,
      dataset: work.type === "Dataset" ? secureUrl(work.url) : null,
      publisher: secureUrl(crossref?.publisherUrl ?? openAlex?.publisherUrl ?? work.url),
    },
    sources: unique(["ORCID", crossref && "Crossref", openAlex && "OpenAlex"]),
  };
  publication.researchAreas = inferResearchAreas(publication);
  publication.citation = createCitation(publication);
  publication.bibtex = createBibtex(publication);
  return publication;
}

export async function syncOrcid() {
  console.log(`Fetching public ORCID works for ${syncConfig.orcidId}…`);
  const payload = await fetchJson(`https://pub.orcid.org/v3.0/${syncConfig.orcidId}/works`, { accept: "application/vnd.orcid+json" });
  const deduplicated = new Map();
  for (const group of payload.group ?? []) {
    const work = normalizeOrcidWork(group);
    const key = workKey(work);
    const existing = deduplicated.get(key);
    if (!existing || (!existing.doi && work.doi)) deduplicated.set(key, work);
  }
  const works = [...deduplicated.values()].sort((left, right) => (right.year ?? 0) - (left.year ?? 0) || left.title.localeCompare(right.title));
  await writeJson(syncConfig.paths.orcidWorks, works);

  const siteWorks = works.slice(0, syncConfig.maxSitePublications);
  const cache = await readJson(syncConfig.paths.enrichmentCache, {});
  const refresh = process.env.SYNC_REFRESH_ENRICHMENT === "1";
  const missing = siteWorks.filter((work) => work.doi && (refresh || !cache[work.doi]));
  const selected = syncConfig.enrichmentLimit === 0 ? missing : missing.slice(0, syncConfig.enrichmentLimit);
  if (selected.length) {
    console.log(`Enriching ${selected.length} DOI records with Crossref and OpenAlex…`);
    await runPool(selected, syncConfig.concurrency, async (work, index) => {
      cache[work.doi] = await enrichDoi(work.doi);
      console.log(`  ${index + 1}/${selected.length} ${work.doi}`);
    });
    await writeJson(syncConfig.paths.enrichmentCache, cache);
  }

  const publications = siteWorks.map((work) => mergePublication(work, work.doi ? cache[work.doi] : null));
  await writeJson(syncConfig.paths.publications, publications);
  await rebuildMetrics();
  await updateSyncMetadata("orcid", {
    orcidId: syncConfig.orcidId,
    rawGroupCount: payload.group?.length ?? 0,
    deduplicatedWorkCount: works.length,
    sitePublicationCount: publications.length,
    enrichedPublicationCount: publications.filter((publication) => publication.sources.includes("Crossref") || publication.sources.includes("OpenAlex")).length,
  });
  console.log(`ORCID synchronization complete: ${works.length} unique works, ${publications.length} published to the site.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncOrcid().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
