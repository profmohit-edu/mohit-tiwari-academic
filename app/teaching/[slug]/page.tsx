import type { Metadata } from "next";
import { BookOpenCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/teaching/course-detail";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { createPageMetadata } from "@/lib/metadata";
import { getTeachingCourse, teachingCourses } from "@/lib/teaching";

export const dynamicParams = false;
export const generateStaticParams = () => teachingCourses.map((course) => ({ slug: course.slug }));

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => { const course = getTeachingCourse(slug); return course ? createPageMetadata({ title: course.title, description: course.overview, path: `/teaching/${course.slug}` }) : {}; });
}

export default async function TeachingCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const course = getTeachingCourse((await params).slug);
  if (!course) notFound();
  return <PageShell><PageHero eyebrow={`${course.category}${course.code ? ` · ${course.code}` : ""}`} title={course.title} description={[course.programme, course.institution, course.academicYear].filter(Boolean).join(" · ")} icon={BookOpenCheck} /><ContentSection><CourseDetail course={course} /></ContentSection></PageShell>;
}
