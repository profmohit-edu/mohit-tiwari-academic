import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { syncConfig } from "./config.mjs";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function request(url, { accept = "application/json", allow404 = false } = {}) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, {
        headers: {
          Accept: accept,
          "User-Agent": syncConfig.userAgent,
          ...(process.env.GITHUB_TOKEN && url.includes("api.github.com")
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        signal: controller.signal,
      });

      if (allow404 && response.status === 404) return null;
      if ((response.status === 429 || response.status >= 500) && attempt < 3) {
        await sleep(750 * 2 ** attempt);
        continue;
      }
      if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new Error(`Request retries exhausted for ${url}`);
}

export async function fetchJson(url, options) {
  const response = await request(url, options);
  return response ? response.json() : null;
}

export async function fetchText(url, options) {
  const response = await request(url, options);
  return response ? response.text() : null;
}

export async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

export async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

export function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function stripMarkup(value) {
  if (!value) return null;
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim() || null;
}

export function normalizeDoi(value) {
  if (!value) return null;
  return decodeURIComponent(value)
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .trim()
    .toLowerCase() || null;
}

function metric(key, label, value, source, todo = null) {
  return { key, label, value, source, todo };
}

export async function rebuildMetrics() {
  const [works, publications, repositories, manualPatents] = await Promise.all([
    readJson(syncConfig.paths.orcidWorks, []),
    readJson(syncConfig.paths.publications, []),
    readJson(syncConfig.paths.repositories, []),
    readJson(syncConfig.paths.manualPatents, []),
  ]);
  const scholarlyTypes = new Set(["Journal Article", "Conference Paper", "Book", "Book Chapter", "Preprint"]);
  const publicationCount = works.filter((work) => scholarlyTypes.has(work.type)).length;
  const patents = works.filter((work) => work.type === "Patent").length + manualPatents.length;
  const datasets = works.filter((work) => work.type === "Dataset").length;
  const orcidSoftware = works.filter((work) => work.type === "Software").length;
  const repositorySoftware = repositories.filter((repository) => repository.category === "Research Software").length;
  const conferencePapers = works.filter((work) => work.type === "Conference Paper").length;
  const citedPublications = publications.filter((publication) => publication.citationCount !== null);
  const completeCitationCoverage = publications.length > 0 && citedPublications.length === publications.length;
  const citationValues = citedPublications.map((publication) => publication.citationCount).sort((a, b) => b - a);
  const citations = completeCitationCoverage ? citationValues.reduce((sum, count) => sum + count, 0) : null;
  const hIndex = completeCitationCoverage ? citationValues.filter((count, index) => count >= index + 1).length : null;
  const i10Index = completeCitationCoverage ? citationValues.filter((count) => count >= 10).length : null;

  await writeJson(syncConfig.paths.metrics, [
    metric("publications", "Publications", publicationCount, "ORCID"),
    metric("citations", "Citations", citations, "OpenAlex", completeCitationCoverage ? null : "TODO: complete OpenAlex enrichment before publishing this metric"),
    metric("hIndex", "h-index", hIndex, "OpenAlex", completeCitationCoverage ? null : "TODO: complete OpenAlex enrichment before publishing this metric"),
    metric("i10Index", "i10-index", i10Index, "OpenAlex", completeCitationCoverage ? null : "TODO: complete OpenAlex enrichment before publishing this metric"),
    metric("patents", "Patents", patents, "ORCID"),
    metric("datasets", "Datasets", datasets, "ORCID"),
    metric("software", "Software", Math.max(orcidSoftware, repositorySoftware), "GitHub"),
    metric("projects", "Projects", repositories.filter((repository) => !repository.archived && !repository.fork).length, "GitHub"),
    metric("researchReviews", "Research Reviews", null, "Manual", "TODO: add a verified research-review count"),
    metric("studentsGuided", "Students Guided", null, "Manual", "TODO: add a verified students-guided count"),
    metric("invitedTalks", "Invited Talks", null, "Manual", "TODO: add a verified invited-talk count"),
    metric("conferencePapers", "Conference Papers", conferencePapers, "ORCID"),
  ]);
}

export async function updateSyncMetadata(section, metadata) {
  const current = await readJson(syncConfig.paths.metadata, { orcid: null, github: null });
  current[section] = { ...metadata, synchronizedAt: new Date().toISOString() };
  await writeJson(syncConfig.paths.metadata, current);
}
