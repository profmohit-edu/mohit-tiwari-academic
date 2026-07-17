import { syncGithub } from "./github.mjs";
import { syncOrcid } from "./orcid.mjs";

try {
  await syncOrcid();
  await syncGithub();
  console.log("All synchronization tasks completed successfully.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
