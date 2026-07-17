export const siteConfig = {
  name: "Dr. Aarya Mehta",
  shortName: "AM",
  title: "AI Researcher · Educator · Builder",
  description: "Academic portfolio of Dr. Aarya Mehta, researching trustworthy machine learning, human-centered AI, and computational sustainability.",
  email: "aarya.mehta@research.example",
  location: "Bengaluru, India",
  url: "https://aaryamehta.github.io/research-portfolio",
  github: "https://github.com/aaryamehta",
  scholar: "https://scholar.google.com",
  linkedin: "https://www.linkedin.com",
  youtube: "https://www.youtube.com"
} as const;

export const absoluteUrl = (path = "") => {
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${siteConfig.url}${normalizedPath}`;
};

export const withBasePath = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/^\/+|\/+$/g, "");
  return `${base ? `/${base}` : ""}${path.startsWith("/") ? path : `/${path}`}`;
};
