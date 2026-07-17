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

export interface AuthorIdentifier {
  name: string;
  orcid: string | null;
}

export interface Publication {
  id: string;
  title: string;
  year: number | null;
  publicationDate: string | null;
  type: PublicationType;
  sourceType: string;
  authors: string[];
  authorIdentifiers: AuthorIdentifier[];
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
  openAccess: "open" | "unknown";
  links: PublicationLinks;
  sources: string[];
}

export type CitationStyle = "APA" | "IEEE" | "MLA" | "Chicago";

export interface RelatedResearchItem {
  id: string;
  kind: "Publication" | "Dataset" | "Software" | "GitHub" | "Patent" | "Talk";
  title: string;
  href: string | null;
  external: boolean;
}

export interface RelatedResearch {
  publications: RelatedResearchItem[];
  datasets: RelatedResearchItem[];
  software: RelatedResearchItem[];
  repositories: RelatedResearchItem[];
  patents: RelatedResearchItem[];
  talks: RelatedResearchItem[];
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
  createdAt: string;
  updatedAt: string;
}

export interface AcademicHighlight {
  key: "publication" | "software" | "dataset" | "repository" | "activity";
  eyebrow: string;
  title: string;
  description: string;
  date: string | null;
  href: string;
  external: boolean;
}

export interface Metric {
  key: string;
  label: string;
  value: number | null;
  source: "ORCID" | "GitHub" | "OpenAlex" | "Manual";
  todo: string | null;
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
