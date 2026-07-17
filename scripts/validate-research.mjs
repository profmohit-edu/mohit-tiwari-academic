import { pathToFileURL } from "node:url";
import { syncConfig } from "./sync/config.mjs";
import { readJson, writeJson } from "./sync/shared.mjs";

const normalizeTitle = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normalizeAuthor = (author) => author.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const doiPattern = /^10\.\d{4,9}\/\S+$/i;

export async function validateResearch() {
  const publications = await readJson(syncConfig.paths.publications, []);
  const critical = [];
  const seenDois = new Map();
  const seenFingerprints = new Map();
  const missing = { authors: 0, venue: 0, publisher: 0, abstract: 0, keywords: 0, researchAreas: 0, doi: 0, authorOrcidIds: 0 };
  let invalidDois = 0;
  let duplicateDois = 0;
  let duplicateRecords = 0;
  let duplicateAuthors = 0;
  let invalidLinks = 0;
  let totalAuthors = 0;

  for (const publication of publications) {
    if (publication.doi) {
      if (!doiPattern.test(publication.doi)) { invalidDois += 1; critical.push(`${publication.id}: invalid DOI ${publication.doi}`); }
      const existing = seenDois.get(publication.doi.toLowerCase());
      if (existing) { duplicateDois += 1; critical.push(`${publication.id}: duplicate DOI also used by ${existing}`); }
      seenDois.set(publication.doi.toLowerCase(), publication.id);
    } else missing.doi += 1;

    const fingerprint = `${normalizeTitle(publication.title)}|${publication.year ?? ""}`;
    const existingFingerprint = seenFingerprints.get(fingerprint);
    if (existingFingerprint) { duplicateRecords += 1; critical.push(`${publication.id}: duplicate title/year also used by ${existingFingerprint}`); }
    seenFingerprints.set(fingerprint, publication.id);

    const normalizedAuthors = publication.authors.map(normalizeAuthor);
    totalAuthors += publication.authors.length;
    if (new Set(normalizedAuthors).size !== normalizedAuthors.length) { duplicateAuthors += 1; critical.push(`${publication.id}: duplicate author in author list`); }
    if (!publication.authors.length) missing.authors += 1;
    if (!publication.venue) missing.venue += 1;
    if (!publication.publisher) missing.publisher += 1;
    if (!publication.abstract) missing.abstract += 1;
    if (!publication.keywords.length) missing.keywords += 1;
    if (!publication.researchAreas.length) missing.researchAreas += 1;
    missing.authorOrcidIds += publication.authorIdentifiers.filter((author) => !author.orcid).length;

    for (const [key, value] of Object.entries(publication.links)) {
      if (!value) continue;
      try {
        const url = new URL(value);
        if (url.protocol !== "https:") throw new Error("HTTPS required");
      } catch {
        invalidLinks += 1;
        critical.push(`${publication.id}: invalid or insecure ${key} link`);
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    recordsChecked: publications.length,
    criticalIssueCount: critical.length,
    integrity: { invalidDois, duplicateDois, duplicateRecords, duplicateAuthors, invalidLinks },
    metadataCoverage: Object.fromEntries(Object.entries(missing).map(([field, count]) => {
      const total = field === "authorOrcidIds" ? totalAuthors : publications.length;
      return [field, { missing: count, total, coveragePercent: Number((((total - Math.min(count, total)) / Math.max(total, 1)) * 100).toFixed(1)) }];
    })),
    notes: [
      "External URLs are validated structurally as HTTPS during every check; provider availability is intentionally not treated as deterministic build state.",
      "Missing co-author ORCID identifiers are reported but never inferred.",
      "Open-access status is published only when an OpenAlex open-access location is available.",
    ],
  };
  await writeJson("data/synced/research-quality.json", report);
  if (critical.length) throw new Error(`Research validation failed:\n- ${critical.join("\n- ")}`);
  console.log(`Research validation passed: ${publications.length} records, ${critical.length} critical issues, ${invalidLinks} invalid links.`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  validateResearch().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
