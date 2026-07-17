import type { PatentRecord, Publication, RelatedResearch, RelatedResearchItem, Repository, Talk } from "@/types/research";

const tokens = (value: string) => new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3));
const overlap = (left: Iterable<string>, right: Iterable<string>) => {
  const rightSet = new Set(right);
  return [...left].filter((value) => rightSet.has(value)).length;
};

const publicationScore = (source: Publication, candidate: Publication) =>
  overlap(source.researchAreas, candidate.researchAreas) * 6
  + overlap(source.keywords.map((keyword) => keyword.toLowerCase()), candidate.keywords.map((keyword) => keyword.toLowerCase())) * 3
  + overlap(tokens(source.title), tokens(candidate.title));

const publicationItem = (publication: Publication, kind: RelatedResearchItem["kind"] = "Publication"): RelatedResearchItem => ({
  id: publication.id,
  kind,
  title: publication.title,
  href: publication.links.doi ?? publication.links.publisher,
  external: Boolean(publication.links.doi ?? publication.links.publisher),
});

export function findRelatedResearch(
  source: Publication,
  publications: Publication[],
  repositories: Repository[],
  patents: PatentRecord[],
  talks: Talk[],
): RelatedResearch {
  const ranked = publications
    .filter((candidate) => candidate.id !== source.id)
    .map((candidate) => ({ candidate, score: publicationScore(source, candidate) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || (right.candidate.year ?? 0) - (left.candidate.year ?? 0));
  const relatedOutputs = (type: Publication["type"], kind: RelatedResearchItem["kind"]) => ranked.filter(({ candidate }) => candidate.type === type).slice(0, 2).map(({ candidate }) => publicationItem(candidate, kind));
  const sourceTokens = tokens(`${source.title} ${source.keywords.join(" ")} ${source.researchAreas.join(" ")}`);
  const relatedRepositories = repositories
    .map((repository) => ({ repository, score: overlap(sourceTokens, tokens(`${repository.name} ${repository.description ?? ""} ${repository.topics.join(" ")} ${repository.category}`)) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map(({ repository }) => ({ id: String(repository.id), kind: "GitHub" as const, title: repository.name, href: repository.url, external: true }));
  const relatedPatents = patents.filter((patent) => overlap(sourceTokens, tokens(patent.title)) > 0).slice(0, 2).map((patent) => ({ id: patent.number, kind: "Patent" as const, title: patent.title, href: patent.url, external: Boolean(patent.url) }));
  const relatedTalks = talks.filter((talk) => overlap(sourceTokens, tokens(`${talk.title} ${talk.description}`)) > 0).slice(0, 2).map((talk) => ({ id: `${talk.title}-${talk.year}`, kind: "Talk" as const, title: talk.title, href: talk.videoUrl || null, external: Boolean(talk.videoUrl) }));
  return {
    publications: ranked.filter(({ candidate }) => !["Dataset", "Software", "Patent"].includes(candidate.type)).slice(0, 3).map(({ candidate }) => publicationItem(candidate)),
    datasets: relatedOutputs("Dataset", "Dataset"),
    software: relatedOutputs("Software", "Software"),
    repositories: relatedRepositories,
    patents: relatedPatents,
    talks: relatedTalks,
  };
}
