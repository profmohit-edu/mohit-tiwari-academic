import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const collections = [
  { file: "publications.json", key: "title", required: ["year", "title", "authors", "venue", "type", "featured", "doi", "abstract"], urls: ["doi"] },
  { file: "projects.json", key: "title", required: ["title", "description", "tags", "status", "link", "period"], urls: ["link"] },
  { file: "datasets.json", key: "name", required: ["name", "description", "size", "license", "records", "version", "link"], urls: ["link"] },
  { file: "software.json", key: "name", required: ["name", "description", "language", "stars", "link", "license"], urls: ["link"] },
  { file: "patents.json", key: "number", required: ["number", "year", "title", "status", "inventors"], urls: [] },
  { file: "teaching.json", key: "code", required: ["code", "title", "term", "level", "description", "topics"], urls: [] },
  { file: "videos.json", key: "id", required: ["title", "event", "year", "id", "description"], urls: [] },
];

const failures = [];

for (const collection of collections) {
  const path = resolve(process.cwd(), "data", collection.file);
  const records = JSON.parse(await readFile(path, "utf8"));
  const identifiers = new Set();

  if (!Array.isArray(records) || records.length === 0) {
    failures.push(`${collection.file}: expected a non-empty array`);
    continue;
  }

  records.forEach((record, index) => {
    for (const field of collection.required) {
      if (record[field] === undefined || record[field] === null || record[field] === "") {
        failures.push(`${collection.file}[${index}]: missing ${field}`);
      }
    }

    const identifier = record[collection.key];
    if (identifiers.has(identifier)) failures.push(`${collection.file}: duplicate ${collection.key} "${identifier}"`);
    identifiers.add(identifier);

    for (const field of collection.urls) {
      try {
        const url = new URL(record[field]);
        if (url.protocol !== "https:") failures.push(`${collection.file}[${index}].${field}: HTTPS is required`);
      } catch {
        failures.push(`${collection.file}[${index}].${field}: invalid URL`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error(`Content validation failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Content validation passed for ${collections.length} collections.`);
