export type PublicationType =
  | "Journal Article"
  | "Conference Paper"
  | "Book"
  | "Book Chapter"
  | "Dataset"
  | "Software"
  | "Patent"
  | "Preprint"
  | "Other";

export interface PublicationLinks {
  doi: string | null;
  pdf: string | null;
  slides: string | null;
  video: string | null;
  github: string | null;
  dataset: string | null;
  publisher: string | null;
}

export interface Publication {
  id: string;
  title: string;
  year: number | null;
  publicationDate: string | null;
  type: PublicationType;
  sourceType: string;
  authors: string[];
  venue: string | null;
  publisher: string | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  doi: string | null;
  abstract: string | null;
  keywords: string[];
  researchAreas: string[];
  citation: string;
  bibtex: string | null;
  citationCount: number | null;
  links: PublicationLinks;
  sources: string[];
}

export type RepositoryCategory =
  | "Research Software"
  | "AI"
  | "Cyber Security"
  | "Teaching"
  | "Research Platforms"
  | "Utilities";

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  topics: string[];
  languages: Record<string, number>;
  primaryLanguage: string | null;
  stars: number;
  forks: number;
  license: string | null;
  readmeSummary: string | null;
  category: RepositoryCategory;
  archived: boolean;
  fork: boolean;
  updatedAt: string;
}

export interface Metric {
  key: string;
  label: string;
  value: number | null;
  source: "ORCID" | "GitHub" | "OpenAlex" | "Manual";
  todo: string | null;
}

export interface TeachingItem {
  code: string;
  title: string;
  term: string;
  level: string;
  description: string;
  topics: string[];
}

export interface PatentRecord {
  number: string;
  year: number | null;
  title: string;
  status: string;
  inventors: string[];
  url: string | null;
}

export interface Talk {
  title: string;
  event: string;
  year: number;
  videoUrl: string;
  description: string;
}
