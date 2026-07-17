export type CourseCategory = "Undergraduate" | "Postgraduate" | "Workshop" | "Faculty Development Program";
export type TeachingResourceType = "Lecture Slides" | "Syllabus" | "Reading List" | "Assignment" | "Lab Manual" | "Tutorial" | "Question Bank" | "Reference Book" | "Video";
export type StudentProjectCategory = "B.Tech" | "MBA" | "BCA" | "Hackathon" | "Industry Collaboration";
export type AcademicContributionCategory = "NBA Responsibilities" | "Incubation Cell" | "Department Committees" | "Research Supervision" | "Session Chair Roles" | "Editorial Activities" | "Reviewer Activities";

export interface TeachingResource {
  id: string;
  title: string;
  type: TeachingResourceType;
  description: string | null;
  topic: string | null;
  week: number | null;
  url: string;
}

export interface WeeklyTeachingPlanItem {
  week: number;
  topic: string;
  learningFocus: string;
  activity: string | null;
  resources: string[];
}

export interface LectureScheduleItem {
  date: string;
  topic: string;
  format: string;
  status: "Scheduled" | "Completed" | "Rescheduled";
}

export interface AssessmentItem {
  component: string;
  weight: number | null;
  description: string;
}

export interface CourseFaq {
  question: string;
  answer: string;
}

export interface TeachingCourse {
  id: string;
  slug: string;
  category: CourseCategory;
  title: string;
  code: string | null;
  institution: string;
  semester: string | null;
  academicYear: string | null;
  programme: string;
  domain: string;
  overview: string;
  learningOutcomes: string[];
  topics: string[];
  weeklyTeachingPlan: WeeklyTeachingPlanItem[];
  lectureSchedule: LectureScheduleItem[];
  resources: TeachingResource[];
  assessmentPattern: AssessmentItem[];
  classActivities: string[];
  projectIdeas: string[];
  faqs: CourseFaq[];
  googleClassroomUrl: string | null;
  courseWebsiteUrl: string | null;
  sourceUrls: string[];
  verificationNote: string;
}

export interface AcademicContribution {
  id: string;
  category: AcademicContributionCategory;
  title: string;
  organization: string;
  period: string;
  description: string;
  sourceUrl: string;
}

export interface StudentProject {
  id: string;
  title: string;
  category: StudentProjectCategory;
  academicYear: string;
  programme: string | null;
  abstract: string;
  technologies: string[];
  githubUrl: string | null;
  reportUrl: string | null;
  presentationUrl: string | null;
  sourceUrl: string;
}

export interface TeachingMetric {
  key: "studentsTaught" | "lectureHours";
  label: string;
  value: number | null;
  unit: string;
  todo: string | null;
}
