import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const readJson = async (path) => JSON.parse(await readFile(resolve(path), "utf8"));
const failures = [];
const requireFields = (record, fields, location) => {
  for (const field of fields) if (record[field] === undefined || record[field] === "") failures.push(`${location}: missing ${field}`);
};
const validateHttps = (value, location) => {
  if (value === null) return;
  try {
    if (new URL(value).protocol !== "https:") failures.push(`${location}: HTTPS is required`);
  } catch {
    failures.push(`${location}: invalid URL`);
  }
};

const profile = await readJson("data/profile.json");
requireFields(profile, ["name", "initials", "designation", "department", "institution", "location", "email", "orcidId", "githubUsername", "introduction", "researchAreas", "academicService", "professionalMemberships", "profiles"], "profile");
for (const [key, value] of Object.entries(profile.profiles)) {
  requireFields(value, ["label", "id", "url", "todo"], `profile.profiles.${key}`);
  validateHttps(value.url, `profile.profiles.${key}.url`);
  if (value.url === null && !value.todo) failures.push(`profile.profiles.${key}: an unconfigured profile requires a TODO`);
}
for (const [key, value] of Object.entries(profile.academicService)) {
  if (value === null && !profile.academicService[`${key}Todo`]) failures.push(`profile.academicService.${key}: a null value requires a TODO`);
}
for (const [index, membership] of profile.professionalMemberships.entries()) {
  requireFields(membership, ["label", "detail", "profileKey"], `profile.professionalMemberships[${index}]`);
  if (membership.profileKey && !profile.profiles[membership.profileKey]) failures.push(`profile.professionalMemberships[${index}]: unknown profileKey`);
}

const publications = await readJson("data/synced/publications.json");
if (!Array.isArray(publications) || publications.length === 0) failures.push("publications: run npm run sync-orcid before building");
const publicationIds = new Set();
publications.forEach((publication, index) => {
  requireFields(publication, ["id", "title", "type", "sourceType", "authors", "authorIdentifiers", "keywords", "researchAreas", "citation", "citationCount", "openAccess", "links", "sources"], `publications[${index}]`);
  if (publicationIds.has(publication.id)) failures.push(`publications: duplicate id ${publication.id}`);
  publicationIds.add(publication.id);
  for (const [key, value] of Object.entries(publication.links ?? {})) validateHttps(value, `publications[${index}].links.${key}`);
});

const repositories = await readJson("data/synced/github-repositories.json");
if (!Array.isArray(repositories) || repositories.length === 0) failures.push("repositories: run npm run sync-github before building");
repositories.forEach((repository, index) => {
  requireFields(repository, ["id", "name", "fullName", "url", "topics", "languages", "stars", "forks", "category", "createdAt", "updatedAt"], `repositories[${index}]`);
  validateHttps(repository.url, `repositories[${index}].url`);
  validateHttps(repository.homepage, `repositories[${index}].homepage`);
});

const metrics = await readJson("data/synced/metrics.json");
const expectedMetrics = ["publications", "citations", "hIndex", "i10Index", "patents", "datasets", "software", "projects", "researchReviews", "studentsGuided", "invitedTalks", "conferencePapers"];
for (const key of expectedMetrics) if (!metrics.some((metric) => metric.key === key)) failures.push(`metrics: missing ${key}`);
for (const metric of metrics) if (metric.value === null && !metric.todo) failures.push(`metrics.${metric.key}: a null value requires a TODO`);

const assistantIndex = await readJson("data/synced/assistant-index.json");
const assistantCollections = new Set(["Publications", "Projects", "Datasets", "Software", "GitHub", "Patents", "Teaching", "Metrics"]);
const assistantIds = new Set();
if (!Array.isArray(assistantIndex.documents)) failures.push("assistant-index: documents must be an array");
if (assistantIndex.documentCount !== assistantIndex.documents?.length) failures.push("assistant-index: documentCount does not match documents length");
for (const [index, document] of (assistantIndex.documents ?? []).entries()) {
  requireFields(document, ["id", "collections", "title", "summary", "content", "researchAreas", "keywords", "url", "metadata"], `assistant-index.documents[${index}]`);
  if (assistantIds.has(document.id)) failures.push(`assistant-index: duplicate id ${document.id}`);
  assistantIds.add(document.id);
  if (!Array.isArray(document.collections) || document.collections.length === 0) failures.push(`assistant-index.documents[${index}]: at least one collection is required`);
  for (const collection of document.collections ?? []) {
    if (!assistantCollections.has(collection)) failures.push(`assistant-index.documents[${index}]: unknown collection ${collection}`);
  }
  validateHttps(document.url, `assistant-index.documents[${index}].url`);
}
const assistantCounts = assistantIndex.collectionCounts ?? {};
if ((assistantCounts.Publications ?? 0) < publications.length) failures.push("assistant-index: not all publications are searchable");
if ((assistantCounts.GitHub ?? 0) < repositories.length) failures.push("assistant-index: not all GitHub repositories are searchable");

const teachingCourses = await readJson("data/manual/teaching.json");
const courseCategories = new Set(["Undergraduate", "Postgraduate", "Workshop", "Faculty Development Program"]);
const resourceTypes = new Set(["Lecture Slides", "Syllabus", "Reading List", "Assignment", "Lab Manual", "Tutorial", "Question Bank", "Reference Book", "Video"]);
const teachingIds = new Set();
const teachingSlugs = new Set();
for (const [index, course] of teachingCourses.entries()) {
  requireFields(course, ["id", "slug", "category", "title", "code", "institution", "semester", "academicYear", "programme", "domain", "overview", "learningOutcomes", "topics", "weeklyTeachingPlan", "lectureSchedule", "resources", "assessmentPattern", "classActivities", "projectIdeas", "faqs", "googleClassroomUrl", "courseWebsiteUrl", "sourceUrls", "verificationNote"], `teaching[${index}]`);
  if (teachingIds.has(course.id)) failures.push(`teaching: duplicate id ${course.id}`);
  if (teachingSlugs.has(course.slug)) failures.push(`teaching: duplicate slug ${course.slug}`);
  teachingIds.add(course.id);
  teachingSlugs.add(course.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.slug)) failures.push(`teaching[${index}]: invalid slug`);
  if (!courseCategories.has(course.category)) failures.push(`teaching[${index}]: invalid category ${course.category}`);
  if (!Array.isArray(course.sourceUrls) || course.sourceUrls.length === 0) failures.push(`teaching[${index}]: at least one verification source is required`);
  for (const [sourceIndex, url] of (course.sourceUrls ?? []).entries()) validateHttps(url, `teaching[${index}].sourceUrls[${sourceIndex}]`);
  validateHttps(course.googleClassroomUrl, `teaching[${index}].googleClassroomUrl`);
  validateHttps(course.courseWebsiteUrl, `teaching[${index}].courseWebsiteUrl`);
  for (const [resourceIndex, resource] of (course.resources ?? []).entries()) {
    requireFields(resource, ["id", "title", "type", "description", "topic", "week", "url"], `teaching[${index}].resources[${resourceIndex}]`);
    if (!resourceTypes.has(resource.type)) failures.push(`teaching[${index}].resources[${resourceIndex}]: invalid type ${resource.type}`);
    validateHttps(resource.url, `teaching[${index}].resources[${resourceIndex}].url`);
  }
}

const academicContributions = await readJson("data/manual/academic-contributions.json");
const contributionCategories = new Set(["NBA Responsibilities", "Incubation Cell", "Department Committees", "Research Supervision", "Session Chair Roles", "Editorial Activities", "Reviewer Activities"]);
for (const [index, contribution] of academicContributions.entries()) {
  requireFields(contribution, ["id", "category", "title", "organization", "period", "description", "sourceUrl"], `academicContributions[${index}]`);
  if (!contributionCategories.has(contribution.category)) failures.push(`academicContributions[${index}]: invalid category ${contribution.category}`);
  validateHttps(contribution.sourceUrl, `academicContributions[${index}].sourceUrl`);
}

const studentProjects = await readJson("data/manual/student-projects.json");
const projectCategories = new Set(["B.Tech", "MBA", "BCA", "Hackathon", "Industry Collaboration"]);
for (const [index, project] of studentProjects.entries()) {
  requireFields(project, ["id", "title", "category", "academicYear", "programme", "abstract", "technologies", "githubUrl", "reportUrl", "presentationUrl", "sourceUrl"], `studentProjects[${index}]`);
  if (!projectCategories.has(project.category)) failures.push(`studentProjects[${index}]: invalid category ${project.category}`);
  for (const key of ["githubUrl", "reportUrl", "presentationUrl", "sourceUrl"]) validateHttps(project[key], `studentProjects[${index}].${key}`);
}

const teachingMetrics = await readJson("data/manual/teaching-metrics.json");
for (const [index, metric] of teachingMetrics.entries()) {
  requireFields(metric, ["key", "label", "value", "unit", "todo"], `teachingMetrics[${index}]`);
  if (metric.value === null && !metric.todo) failures.push(`teachingMetrics[${index}]: a null value requires a TODO`);
}
const minimumTeachingDocuments = teachingCourses.length + academicContributions.length + studentProjects.length + teachingMetrics.length;
if ((assistantCounts.Teaching ?? 0) < minimumTeachingDocuments) failures.push("assistant-index: not all teaching records are searchable");

for (const path of ["data/manual/patents.json", "data/manual/talks.json"]) {
  if (!Array.isArray(await readJson(path))) failures.push(`${path}: expected an array`);
}

if (failures.length > 0) {
  console.error(`Content validation failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Content validation passed: ${publications.length} publications, ${repositories.length} repositories, ${metrics.length} metrics, ${teachingCourses.length} courses, ${assistantIndex.documentCount} assistant records.`);
