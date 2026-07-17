import type { GeneratedAnswer, RetrievalResponse } from "@/types/assistant";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

export function generateDeterministicAnswer(question: string, retrieval: RetrievalResponse): GeneratedAnswer {
  if (!retrieval.results.length) {
    return { text: "I could not find this information in the synchronized local research records. Try a broader keyword, remove a filter, or ask about publications, projects, datasets, software, patents, teaching, GitHub, or verified metrics.", sources: [] };
  }

  const lowered = question.toLowerCase();
  const sources = retrieval.results.slice(0, 6).map(({ document }, index) => ({ id: document.id, label: `S${index + 1}`, title: document.title, collections: document.collections, year: document.year, url: document.url }));
  const first = retrieval.results[0].document;

  if (/most cited|citation impact/.test(lowered)) {
    const citations = first.metadata.citations;
    if (typeof citations !== "number") return { text: "A verifiable citation count is unavailable in the local records for the retrieved publications.", sources: [] };
    return { text: `The highest verifiable result in the local OpenAlex-enriched records is “${first.title}” with ${citations} citations. [S1]`, sources: sources.slice(0, 1) };
  }

  if (/how many|number of|count of/.test(lowered) && first.collections.includes("Metrics")) {
    return { text: `${clean(first.summary)} [S1]`, sources: sources.slice(0, 1) };
  }

  if (/latest|newest|most recent/.test(lowered)) {
    const detail = clean(first.summary).slice(0, 420);
    return { text: `The newest relevant local record is “${first.title}”${first.year ? ` (${first.year})` : ""}. ${detail} [S1]`, sources: sources.slice(0, 1) };
  }

  const lead = retrieval.totalMatches === 1 ? "I found one relevant local record." : `I found ${retrieval.totalMatches} relevant local records. The strongest matches are:`;
  const items = retrieval.results.slice(0, 5).map(({ document }, index) => {
    const detail = clean(document.summary).slice(0, 320) || "No additional description is available.";
    return `${index + 1}. ${document.title}${document.year ? ` (${document.year})` : ""} — ${detail} [S${index + 1}]`;
  });
  return { text: `${lead}\n\n${items.join("\n\n")}\n\nThis answer uses only the synchronized local research index.`, sources };
}
