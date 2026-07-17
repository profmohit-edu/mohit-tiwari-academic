import { pathToFileURL } from "node:url";
import { syncConfig } from "./config.mjs";
import { fetchJson, fetchText, rebuildMetrics, runPool, stripMarkup, updateSyncMetadata, writeJson } from "./shared.mjs";

const categories = [
  ["AI", /\bai\b|artificial intelligence|machine learning|deep learning|neural|codebert/],
  ["Teaching", /teaching|education|training|course|campus|mentor|session|learning/],
  ["Research Software", /research software|benchmark|framework|reproducib|explorer|dataset/],
  ["Cyber Security", /cyber|security|vulnerab|smart contract|blockchain|ethereum|solidity|vpn|attack/],
  ["Research Platforms", /research|academic|scholarly|portfolio|platform/],
];

function categorize(repository) {
  const text = `${repository.name} ${repository.description ?? ""} ${(repository.topics ?? []).join(" ")}`.replace(/[-_]/g, " ").toLowerCase();
  return categories.find(([, pattern]) => pattern.test(text))?.[0] ?? "Utilities";
}

function summarizeReadme(markdown) {
  if (!markdown) return null;
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").replace(/[>*_`|]/g, "").trim())
    .filter((line) => line.length > 45 && !line.includes("shields.io"))[0];
  return stripMarkup(cleaned)?.slice(0, 360) ?? null;
}

async function fetchRepositories() {
  const repositories = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson(`https://api.github.com/users/${syncConfig.githubUsername}/repos?per_page=100&sort=updated&page=${page}`, { accept: "application/vnd.github+json" });
    repositories.push(...batch);
    if (batch.length < 100) break;
  }
  return repositories;
}

export async function syncGithub() {
  console.log(`Fetching public GitHub repositories for ${syncConfig.githubUsername}…`);
  const rawRepositories = await fetchRepositories();
  const repositories = await runPool(rawRepositories, syncConfig.concurrency, async (repository, index) => {
    const [languages, readme] = await Promise.all([
      fetchJson(repository.languages_url, { accept: "application/vnd.github+json", allow404: true }),
      fetchText(`https://api.github.com/repos/${repository.full_name}/readme`, { accept: "application/vnd.github.raw+json", allow404: true }),
    ]);
    console.log(`  ${index + 1}/${rawRepositories.length} ${repository.full_name}`);
    const normalized = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: stripMarkup(repository.description),
      url: repository.html_url,
      homepage: repository.homepage || null,
      topics: repository.topics ?? [],
      languages: languages ?? {},
      primaryLanguage: repository.language ?? null,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      license: repository.license?.spdx_id ?? null,
      readmeSummary: summarizeReadme(readme),
      category: "Utilities",
      archived: repository.archived,
      fork: repository.fork,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
    };
    normalized.category = categorize(normalized);
    return normalized;
  });
  repositories.sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
  await writeJson(syncConfig.paths.repositories, repositories);
  await rebuildMetrics();
  await updateSyncMetadata("github", {
    username: syncConfig.githubUsername,
    repositoryCount: repositories.length,
    categoryCounts: Object.fromEntries([...new Set(repositories.map((repository) => repository.category))].map((category) => [category, repositories.filter((repository) => repository.category === category).length])),
  });
  console.log(`GitHub synchronization complete: ${repositories.length} repositories.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncGithub().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
