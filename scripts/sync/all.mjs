import { syncGithub } from "./github.mjs";
import { syncOrcid } from "./orcid.mjs";
import { validateResearch } from "../validate-research.mjs";
import { buildAssistantIndex } from "../build-assistant-index.mjs";

try {
  await syncOrcid();
  await syncGithub();
  await buildAssistantIndex();
  await validateResearch();
  console.log("All synchronization tasks completed successfully.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
