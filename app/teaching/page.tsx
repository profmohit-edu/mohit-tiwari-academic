import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContentSection, PageShell } from "@/components/page-shell";
import { TeachingPortal } from "@/components/teaching/teaching-portal";
import { createPageMetadata } from "@/lib/metadata";
import { academicContributions, contributionCategories, courseCategories, professionalMemberships, projectCategories, studentProjects, teachingCourses, teachingMetrics, teachingResources } from "@/lib/teaching";

export const metadata: Metadata = createPageMetadata({ title: "Teaching Portfolio", description: "Courses, teaching resources, student projects, mentorship, academic contributions, and verified teaching analytics for Mohit Tiwari at BVCOE New Delhi.", path: "/teaching" });

export default function TeachingPage() {
  return <PageShell><PageHero eyebrow="Teaching & mentorship" title="Academic teaching portfolio" description="Verified courses, active-learning practice, student mentorship, academic service, and teaching resources—organized for transparent discovery and future growth." icon={GraduationCap} /><ContentSection><TeachingPortal courses={teachingCourses} resources={teachingResources} contributions={academicContributions} projects={studentProjects} metrics={teachingMetrics} memberships={professionalMemberships} courseCategories={courseCategories} projectCategories={projectCategories} contributionCategories={contributionCategories} /></ContentSection></PageShell>;
}
