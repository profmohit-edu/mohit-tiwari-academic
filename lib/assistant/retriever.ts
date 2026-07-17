import type { AssistantDocument, AssistantFilters, RetrievalCandidate } from "@/types/assistant";

const stopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "his", "how", "in", "is", "it", "mohit", "number", "of", "on", "or", "prof", "professor", "that", "the", "their", "this", "tiwari", "to", "was", "were", "what", "which", "who", "with"]);
const conceptGroups = [
  ["ai", "artificial", "intelligence", "intelligent", "neural", "deep", "learning", "machine", "classification", "prediction"],
  ["cyber", "security", "secure", "attack", "vulnerability", "malware", "intrusion", "trust", "privacy"],
  ["software", "engineering", "code", "testing", "review", "requirements", "framework", "development"],
  ["blockchain", "ledger", "ethereum", "solidity", "contract", "contracts", "decentralized"],
  ["cloud", "edge", "fog", "distributed", "serverless", "computing"],
  ["iot", "internet", "things", "sensor", "smart", "connected", "cyberphysical"],
  ["dataset", "data", "benchmark", "corpus", "collection"],
  ["software", "repository", "github", "tool", "library", "package", "release"],
  ["publication", "paper", "article", "journal", "conference", "chapter", "book", "preprint"],
];

const stem = (token: string) => token.length > 5 ? token.replace(/(ies|ing|ed|es|s)$/i, (suffix) => suffix === "ies" ? "y" : "") : token;

export function tokenize(value: string) {
  return [...new Set(value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((token) => token && !stopWords.has(token)).map(stem))];
}

function expandSemantics(terms: string[]) {
  const expanded = new Set(terms);
  for (const group of conceptGroups) {
    if (group.some((term) => expanded.has(stem(term)))) group.forEach((term) => expanded.add(stem(term)));
  }
  return expanded;
}

const overlap = (left: Set<string>, right: Set<string>) => [...left].filter((term) => right.has(term));

function matchesFilters(document: AssistantDocument, filters: AssistantFilters) {
  return (filters.source === "All" || document.collections.includes(filters.source))
    && (filters.researchArea === "All" || document.researchAreas.includes(filters.researchArea))
    && (filters.year === null || document.year === filters.year)
    && (filters.publicationType === "All" || document.publicationType === filters.publicationType);
}

export function retrieveCandidates(query: string, documents: AssistantDocument[], filters: AssistantFilters): RetrievalCandidate[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = new Set(tokenize(query));
  const semanticQuery = expandSemantics([...queryTerms]);

  return documents.filter((document) => matchesFilters(document, filters)).map((document) => {
    const titleTerms = new Set(tokenize(document.title));
    const keywordTerms = new Set(tokenize(document.keywords.join(" ")));
    const areaTerms = new Set(tokenize(document.researchAreas.join(" ")));
    const contentTerms = new Set(tokenize(`${document.collections.join(" ")} ${document.content}`));
    const semanticDocument = expandSemantics([...titleTerms, ...keywordTerms, ...areaTerms]);
    const titleMatches = overlap(queryTerms, titleTerms);
    const keywordMatches = overlap(queryTerms, keywordTerms);
    const contentMatches = overlap(queryTerms, contentTerms);
    const semanticMatches = overlap(semanticQuery, semanticDocument);
    const phraseMatch = normalizedQuery.length > 3 && document.content.toLowerCase().includes(normalizedQuery) ? 1 : 0;
    const keywordScore = titleMatches.length * 3 + keywordMatches.length * 2 + contentMatches.length * .55 + phraseMatch * 4;
    const semanticScore = semanticMatches.length / Math.max(semanticQuery.size, 1) * 6;
    const fieldScore = (filters.source !== "All" ? 1 : 0) + (filters.researchArea !== "All" ? 1 : 0) + (filters.year !== null ? 1 : 0) + (filters.publicationType !== "All" ? 1 : 0);
    return { document, keywordScore, semanticScore, fieldScore, matchedTerms: [...new Set([...titleMatches, ...keywordMatches, ...semanticMatches])].slice(0, 12) };
  }).filter((candidate) => candidate.keywordScore > 0 || candidate.semanticScore > 0 || candidate.fieldScore > 0);
}
