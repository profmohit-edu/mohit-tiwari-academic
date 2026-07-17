import { generateDeterministicAnswer } from "@/lib/assistant/generator";
import { rankCandidates } from "@/lib/assistant/ranker";
import { retrieveCandidates } from "@/lib/assistant/retriever";
import type { AssistantDocument, AssistantFilters, GeneratedAnswer, RetrievalResponse } from "@/types/assistant";

export function searchLocalResearch(question: string, documents: AssistantDocument[], filters: AssistantFilters, limit = 8): RetrievalResponse {
  const candidates = retrieveCandidates(question, documents, filters);
  return { results: rankCandidates(question, candidates, filters, limit), totalMatches: candidates.length };
}

export function answerFromLocalResearch(question: string, documents: AssistantDocument[], filters: AssistantFilters): GeneratedAnswer {
  return generateDeterministicAnswer(question, searchLocalResearch(question, documents, filters));
}
