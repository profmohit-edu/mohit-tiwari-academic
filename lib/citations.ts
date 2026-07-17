import type { CitationStyle, Publication } from "@/types/research";

const compact = (values: Array<string | number | null | undefined>) => values.filter((value) => value !== null && value !== undefined && value !== "").join(", ");

const splitName = (name: string) => {
  const parts = name.replace(/^Prof\.\s*/i, "").trim().split(/\s+/);
  return { family: parts.at(-1) ?? name, given: parts.slice(0, -1) };
};

const initials = (names: string[]) => names.map((name) => `${name.charAt(0).toUpperCase()}.`).join(" ");

const apaAuthors = (authors: string[]) => authors.map((name) => {
  const { family, given } = splitName(name);
  return `${family}, ${initials(given)}`;
}).join(", ");

const ieeeAuthors = (authors: string[]) => authors.map((name) => {
  const { family, given } = splitName(name);
  return `${initials(given)} ${family}`.trim();
}).join(", ");

const mlaAuthors = (authors: string[]) => {
  if (!authors.length) return "Mohit Tiwari";
  const first = splitName(authors[0]);
  if (authors.length === 1) return `${first.family}, ${first.given.join(" ")}`;
  return `${first.family}, ${first.given.join(" ")}, et al.`;
};

const locator = (publication: Publication) => compact([
  publication.venue,
  publication.volume && `vol. ${publication.volume}`,
  publication.issue && `no. ${publication.issue}`,
  publication.pages && `pp. ${publication.pages}`,
]);

export function formatCitation(publication: Publication, style: CitationStyle) {
  const year = publication.year ?? "n.d.";
  const doi = publication.doi ? `https://doi.org/${publication.doi}` : "";
  const venue = locator(publication);
  if (style === "APA") return `${apaAuthors(publication.authors) || "Tiwari, M."} (${year}). ${publication.title}. ${venue}${venue ? "." : ""}${doi ? ` ${doi}` : ""}`.trim();
  if (style === "IEEE") return `${ieeeAuthors(publication.authors) || "M. Tiwari"}, “${publication.title},” ${venue}${venue ? ", " : ""}${year}.${doi ? ` doi: ${publication.doi}.` : ""}`.trim();
  if (style === "MLA") return `${mlaAuthors(publication.authors)} “${publication.title}.” ${venue}${venue ? ", " : ""}${year}.${doi ? ` ${doi}.` : ""}`.trim();
  return `${apaAuthors(publication.authors) || "Tiwari, Mohit"}. “${publication.title}.” ${venue}${venue ? " (" : ""}${venue ? year : ""}${venue ? ")." : `${year}.`}${doi ? ` ${doi}.` : ""}`.trim();
}

export function createRis(publication: Publication) {
  const type = publication.type === "Journal Article" ? "JOUR" : publication.type === "Conference Paper" ? "CPAPER" : publication.type === "Book" ? "BOOK" : publication.type === "Book Chapter" ? "CHAP" : publication.type === "Dataset" ? "DATA" : publication.type === "Software" ? "COMP" : "GEN";
  return [
    `TY  - ${type}`,
    `TI  - ${publication.title}`,
    ...publication.authors.map((author) => `AU  - ${author}`),
    publication.year ? `PY  - ${publication.year}` : null,
    publication.publicationDate ? `DA  - ${publication.publicationDate.replaceAll("-", "/")}` : null,
    publication.venue ? `T2  - ${publication.venue}` : null,
    publication.publisher ? `PB  - ${publication.publisher}` : null,
    publication.volume ? `VL  - ${publication.volume}` : null,
    publication.issue ? `IS  - ${publication.issue}` : null,
    publication.pages ? `SP  - ${publication.pages.split("-")[0]}` : null,
    publication.pages?.includes("-") ? `EP  - ${publication.pages.split("-").at(-1)}` : null,
    publication.doi ? `DO  - ${publication.doi}` : null,
    publication.abstract ? `AB  - ${publication.abstract}` : null,
    ...publication.keywords.map((keyword) => `KW  - ${keyword}`),
    publication.links.doi ? `UR  - ${publication.links.doi}` : null,
    "ER  - ",
  ].filter(Boolean).join("\r\n");
}
