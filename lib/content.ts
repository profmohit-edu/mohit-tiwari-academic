import awardsData from "@/data/awards.json";
import datasetsData from "@/data/datasets.json";
import patentsData from "@/data/patents.json";
import projectsData from "@/data/projects.json";
import publicationsData from "@/data/publications.json";
import softwareData from "@/data/software.json";
import teachingData from "@/data/teaching.json";
import videosData from "@/data/videos.json";
import type {
  Course,
  Dataset,
  Patent,
  Publication,
  ResearchProject,
  SoftwareProject,
} from "@/types/research";

export const publications = publicationsData as Publication[];
export const projects = projectsData as ResearchProject[];
export const datasets = datasetsData as Dataset[];
export const software = softwareData as SoftwareProject[];
export const patents = patentsData as Patent[];
export const courses = teachingData as Course[];
export const awards = awardsData;
export const videos = videosData;

export const featuredPublications = publications.filter((paper) => paper.featured);
export const publicationYears = [...new Set(publications.map((paper) => paper.year))].sort(
  (a, b) => b - a,
);

export const researchCounts = {
  publications: publications.length,
  projects: projects.length,
  datasets: datasets.length,
  software: software.length,
  patents: patents.length,
  courses: courses.length,
} as const;
