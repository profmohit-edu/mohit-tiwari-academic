import type { AssistantFilters, RankedResult, RetrievalCandidate } from "@/types/assistant";

export function rankCandidates(query: string, candidates: RetrievalCandidate[], filters: AssistantFilters, limit = 8): RankedResult[] {
  const lowered = query.toLowerCase();
  const recencyIntent = /\blatest\b|\bnewest\b|\brecent\b/.test(lowered);
  const citationIntent = /most cited|citations?|impact/.test(lowered);
  const currentYear = new Date().getFullYear();
  const weights = filters.mode === "semantic" ? { keyword: .2, semantic: .72 } : filters.mode === "keyword" ? { keyword: .9, semantic: .05 } : { keyword: .56, semantic: .38 };

  return candidates.map((candidate) => {
    const year = candidate.document.year ?? 0;
    const recency = year ? Math.max(0, 1 - (currentYear - year) / 25) : 0;
    const citations = typeof candidate.document.metadata.citations === "number" ? candidate.document.metadata.citations : 0;
    const authority = candidate.document.collections.includes("Publications") ? .25 : candidate.document.collections.includes("Metrics") ? .2 : .1;
    const score = candidate.keywordScore * weights.keyword + candidate.semanticScore * weights.semantic + candidate.fieldScore * .4 + authority + recency * (recencyIntent ? 2.4 : .18) + (citationIntent ? Math.log10(citations + 1) * 1.4 : 0);
    return { ...candidate, score };
  }).sort((left, right) => {
    if (citationIntent) {
      const rightCitations = typeof right.document.metadata.citations === "number" ? right.document.metadata.citations : -1;
      const leftCitations = typeof left.document.metadata.citations === "number" ? left.document.metadata.citations : -1;
      if (rightCitations !== leftCitations) return rightCitations - leftCitations;
    }
    if (recencyIntent && (right.document.year ?? 0) !== (left.document.year ?? 0)) return (right.document.year ?? 0) - (left.document.year ?? 0);
    return right.score - left.score || left.document.title.localeCompare(right.document.title);
  }).slice(0, limit);
}
