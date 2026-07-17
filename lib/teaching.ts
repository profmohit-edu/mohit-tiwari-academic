import academicContributionsData from "@/data/manual/academic-contributions.json";
import studentProjectsData from "@/data/manual/student-projects.json";
import teachingData from "@/data/manual/teaching.json";
import teachingMetricsData from "@/data/manual/teaching-metrics.json";
import profileData from "@/data/profile.json";
import type { AcademicContribution, AcademicContributionCategory, CourseCategory, StudentProject, StudentProjectCategory, TeachingCourse, TeachingMetric, TeachingResource } from "@/types/teaching";

export const courseCategories: CourseCategory[] = ["Undergraduate", "Postgraduate", "Workshop", "Faculty Development Program"];
export const projectCategories: StudentProjectCategory[] = ["B.Tech", "MBA", "BCA", "Hackathon", "Industry Collaboration"];
export const contributionCategories: AcademicContributionCategory[] = ["NBA Responsibilities", "Incubation Cell", "Department Committees", "Research Supervision", "Session Chair Roles", "Editorial Activities", "Reviewer Activities"];

export const teachingCourses = teachingData as unknown as TeachingCourse[];
export const academicContributions = academicContributionsData as AcademicContribution[];
export const studentProjects = studentProjectsData as StudentProject[];
export const teachingMetrics = teachingMetricsData as TeachingMetric[];
export const professionalMemberships = profileData.professionalMemberships;

export const teachingResources = teachingCourses.flatMap((course) => course.resources.map((resource): TeachingResource & { courseId: string; courseSlug: string; courseTitle: string } => ({ ...resource, courseId: course.id, courseSlug: course.slug, courseTitle: course.title })));
export const teachingYears = [...new Set([...teachingCourses.map((course) => course.academicYear), ...studentProjects.map((project) => project.academicYear)].filter((year): year is string => Boolean(year)))].sort().reverse();
export const teachingProgrammes = [...new Set(teachingCourses.map((course) => course.programme))].sort();
export const teachingSemesters = [...new Set(teachingCourses.map((course) => course.semester).filter((semester): semester is string => Boolean(semester)))].sort();
export const teachingTopics = [...new Set(teachingCourses.flatMap((course) => course.topics))].sort();

export const getTeachingCourse = (slug: string) => teachingCourses.find((course) => course.slug === slug);
