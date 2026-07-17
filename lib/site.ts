import profile from "@/data/profile.json";

export const siteConfig = {
  name: profile.name,
  shortName: profile.initials,
  designation: profile.designation,
  department: profile.department,
  institution: profile.institution,
  title: "Assistant Professor · Researcher · Educator",
  description: "Academic research portal of Mohit Tiwari, Assistant Professor at Bharati Vidyapeeth's College of Engineering, New Delhi, working across artificial intelligence, cyber security, software engineering, blockchain, and connected systems.",
  introduction: profile.introduction,
  researchAreas: profile.researchAreas,
  email: profile.email,
  location: profile.location,
  url: "https://profmohit-edu.github.io/mohit-tiwari-academic",
  orcidId: profile.orcidId,
  githubUsername: profile.githubUsername,
  profiles: profile.profiles,
} as const;

export const configuredProfiles = Object.values(siteConfig.profiles).filter(
  (profile): profile is typeof profile & { url: string } => Boolean(profile.url),
);

export const absoluteUrl = (path = "") => {
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${siteConfig.url}${normalizedPath}`;
};

export const withBasePath = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/^\/+|\/+$/g, "");
  return `${base ? `/${base}` : ""}${path.startsWith("/") ? path : `/${path}`}`;
};
