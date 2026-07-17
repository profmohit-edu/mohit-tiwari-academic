import type { PublicationType } from "@/types/research";

export type AssistantSource = "Publications" | "Projects" | "Datasets" | "Software" | "GitHub" | "Patents" | "Teaching" | "Metrics";
export type SearchMode = "hybrid" | "semantic" | "keyword";

export interface AssistantDocument {
  id: string;
  collections: AssistantSource[];
  title: string;
  summary: string;
  content: string;
  year: number | null;
  publicationType: PublicationType | null;
  researchAreas: string[];
  keywords: string[];
  url: string | null;
  metadata: Record<string, string | number | boolean | null>;
}

export interface AssistantIndex {
  generatedAt: string;
  documentCount: number;
  collectionCounts: Record<AssistantSource, number>;
  documents: AssistantDocument[];
}

export interface AssistantFilters {
  mode: SearchMode;
  source: AssistantSource | "All";
  researchArea: string | "All";
  year: number | null;
  publicationType: PublicationType | "All";
}

export interface RetrievalCandidate {
  document: AssistantDocument;
  keywordScore: number;
  semanticScore: number;
  fieldScore: number;
  matchedTerms: string[];
}

export interface RankedResult extends RetrievalCandidate {
  score: number;
}

export interface RetrievalResponse {
  results: RankedResult[];
  totalMatches: number;
}

export interface AssistantSourceReference {
  id: string;
  label: string;
  title: string;
  collections: AssistantSource[];
  year: number | null;
  url: string | null;
}

export interface GeneratedAnswer {
  text: string;
  sources: AssistantSourceReference[];
}
