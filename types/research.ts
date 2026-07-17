export type PublicationType = "Conference" | "Journal";

export interface Publication {
  year: number;
  title: string;
  authors: string;
  venue: string;
  type: PublicationType;
  featured: boolean;
  doi: string;
  abstract: string;
}

export interface ResearchProject {
  title: string;
  description: string;
  tags: string[];
  status: string;
  link: string;
  period: string;
}

export interface Dataset {
  name: string;
  description: string;
  size: string;
  license: string;
  records: string;
  version: string;
  link: string;
}

export interface SoftwareProject {
  name: string;
  description: string;
  language: string;
  stars: string;
  link: string;
  license: string;
}

export interface Course {
  code: string;
  title: string;
  term: string;
  level: string;
  description: string;
  topics: string[];
}

export interface Patent {
  number: string;
  year: number;
  title: string;
  status: string;
  inventors: string;
}
