import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const readJson = async (path) => JSON.parse(await readFile(resolve(path), "utf8"));
const failures = [];
const requireFields = (record, fields, location) => {
  for (const field of fields) if (record[field] === undefined || record[field] === "") failures.push(`${location}: missing ${field}`);
};
const validateHttps = (value, location) => {
  if (value === null) return;
  try {
    if (new URL(value).protocol !== "https:") failures.push(`${location}: HTTPS is required`);
  } catch {
    failures.push(`${location}: invalid URL`);
  }
};

const profile = await readJson("data/profile.json");
requireFields(profile, ["name", "initials", "designation", "department", "institution", "location", "email", "orcidId", "githubUsername", "introduction", "researchAreas", "profiles"], "profile");
for (const [key, value] of Object.entries(profile.profiles)) {
  requireFields(value, ["label", "id", "url", "todo"], `profile.profiles.${key}`);
  validateHttps(value.url, `profile.profiles.${key}.url`);
  if (value.url === null && !value.todo) failures.push(`profile.profiles.${key}: an unconfigured profile requires a TODO`);
}

const publications = await readJson("data/synced/publications.json");
if (!Array.isArray(publications) || publications.length === 0) failures.push("publications: run npm run sync-orcid before building");
const publicationIds = new Set();
publications.forEach((publication, index) => {
  requireFields(publication, ["id", "title", "type", "sourceType", "authors", "keywords", "researchAreas", "citation", "links", "sources"], `publications[${index}]`);
  if (publicationIds.has(publication.id)) failures.push(`publications: duplicate id ${publication.id}`);
  publicationIds.add(publication.id);
  for (const [key, value] of Object.entries(publication.links ?? {})) validateHttps(value, `publications[${index}].links.${key}`);
});

const repositories = await readJson("data/synced/github-repositories.json");
if (!Array.isArray(repositories) || repositories.length === 0) failures.push("repositories: run npm run sync-github before building");
repositories.forEach((repository, index) => {
  requireFields(repository, ["id", "name", "fullName", "url", "topics", "languages", "stars", "forks", "category", "updatedAt"], `repositories[${index}]`);
  validateHttps(repository.url, `repositories[${index}].url`);
  validateHttps(repository.homepage, `repositories[${index}].homepage`);
});

const metrics = await readJson("data/synced/metrics.json");
const expectedMetrics = ["publications", "citations", "hIndex", "i10Index", "patents", "datasets", "software", "projects", "researchReviews", "studentsGuided", "invitedTalks", "conferencePapers"];
for (const key of expectedMetrics) if (!metrics.some((metric) => metric.key === key)) failures.push(`metrics: missing ${key}`);
for (const metric of metrics) if (metric.value === null && !metric.todo) failures.push(`metrics.${metric.key}: a null value requires a TODO`);

for (const path of ["data/manual/teaching.json", "data/manual/patents.json", "data/manual/talks.json"]) {
  if (!Array.isArray(await readJson(path))) failures.push(`${path}: expected an array`);
}

if (failures.length > 0) {
  console.error(`Content validation failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Content validation passed: ${publications.length} publications, ${repositories.length} repositories, ${metrics.length} metrics.`);
