import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { teachingCourses } from "@/lib/teaching";

export const dynamic = "force-static";

const routes = [
  ["", 1, "monthly"],
  ["/publications", 0.9, "monthly"],
  ["/assistant", 0.85, "monthly"],
  ["/projects", 0.8, "monthly"],
  ["/resources", 0.85, "monthly"],
  ["/datasets", 0.8, "monthly"],
  ["/software", 0.8, "monthly"],
  ["/patents", 0.6, "yearly"],
  ["/teaching", 0.8, "monthly"],
  ["/media", 0.7, "monthly"],
  ["/cv", 0.8, "monthly"],
  ["/contact", 0.6, "yearly"],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes.map(([path, priority, changeFrequency]) => ({
    url: absoluteUrl(path),
    priority,
    changeFrequency,
  })), ...teachingCourses.map((course) => ({ url: absoluteUrl(`/teaching/${course.slug}`), priority: .75, changeFrequency: "monthly" as const }))];
}
