# Mohit Tiwari Academic Research Portal

Production academic website for **Mohit Tiwari**, Assistant Professor in the Department of Computer Science & Engineering at Bharati Vidyapeeth's College of Engineering, New Delhi.

The portal is a static-first Next.js application. Academic records are synchronized from authoritative public sources and kept separate from React presentation components.

## Source architecture

```text
app/                         Static routes and route metadata
components/                  Shared layout, domain, interaction, and UI components
data/profile.json            Verified identity and researcher-profile configuration
data/manual/                 Verified teaching, contribution, project, patent, and talk records
data/synced/                 Generated ORCID, Crossref, OpenAlex, GitHub, and metric data
lib/content.ts               Typed content selectors and derived collections
lib/citations.ts             APA, IEEE, MLA, Chicago, BibTeX, and RIS utilities
lib/related-research.ts      Cross-output research relationship inference
lib/assistant/               Local retrieval, ranking, and grounded response generation
lib/metadata.ts              Route metadata factory
lib/navigation.ts            Site information architecture
lib/site.ts                  Identity, canonical URL, and deployment configuration
scripts/sync/                Reusable synchronization pipeline
scripts/build-assistant-index.mjs  Local knowledge-index builder
server/assistant-api.mjs     Optional streaming OpenAI gateway
types/assistant.ts           Assistant corpus, search, and response contracts
types/teaching.ts            Course, resource, contribution, project, and metric models
types/research.ts            Publication, repository, metric, and academic data models
```

React components never contain imported publication or repository records. They consume normalized files in `data/synced/`, allowing the data pipeline to evolve independently of the interface.

## Synchronization

### ORCID, Crossref, and OpenAlex

```bash
npm run sync-orcid
```

The ORCID importer reads public works for `0000-0003-1836-3451`, selects the best source inside each ORCID group, deduplicates DOI and normalized title/year manifestations, and stores the complete normalized record in `data/synced/orcid-works.json`.

The newest site records are enriched by DOI through Crossref and OpenAlex. Enrichment is cached in `data/synced/enrichment-cache.json`, so subsequent runs continue from the existing cache instead of repeating completed requests.

Normalized records retain author identifiers when providers expose them, conservative open-access status, citation counts with source attribution, publication types, abstracts, keywords, research-area assignments, and export metadata. The interface derives related publications, datasets, software, repositories, patents, and talks without hardcoding relationships in React.

Useful controls:

```bash
SYNC_PUBLICATION_LIMIT=300  # Number of recent normalized works exposed to the site
SYNC_ENRICH_LIMIT=40        # Maximum new DOI enrichments per run; use 0 for all
SYNC_CONCURRENCY=3          # Concurrent external requests
SYNC_REFRESH_ENRICHMENT=1   # Refresh cached DOI metadata
```

### GitHub

```bash
npm run sync-github
```

The GitHub importer reads public repositories for `profmohit-edu`, including topics, descriptions, language byte counts, stars, forks, licenses, homepages, README summaries, and update timestamps. Repositories are classified as Research Software, AI, Cyber Security, Teaching, Research Platforms, or Utilities.

Set `GITHUB_TOKEN` to increase API limits. The importer only requests public repositories.

### All sources

```bash
npm run sync-all
```

The scheduled GitHub Actions workflow in `.github/workflows/sync.yml` runs the complete synchronization every Monday and commits changed generated records. The normal deployment workflow remains compatible with GitHub Pages.

## Manual information

Only verified records should be added to `data/manual/`:

- `teaching.json` — courses, plans, schedules, assessments, activities, FAQs, and resource links
- `academic-contributions.json` — verified service, supervision, session-chair, editorial, and reviewer work
- `student-projects.json` — mentored projects, technologies, repositories, reports, and presentations
- `teaching-metrics.json` — verified student and lecture-hour totals; unknown values remain explicit TODOs
- `patents.json` — confirmed patent identifiers and status
- `talks.json` — confirmed event and recording URLs

The teaching portal derives filters, analytics, downloads, category coverage, and statically generated `/teaching/[slug]` detail pages directly from these files. Missing course materials or administrative appointments are rendered as unavailable instead of being inferred.

Researcher profiles without verified URLs remain `null` with an explicit TODO in `data/profile.json`; the public interface hides them until configured.

## Development and validation

```bash
npm install
npm run dev
```

Run the complete quality pipeline with:

```bash
npm run check
```

Individual commands:

```bash
npm run validate:content
npm run validate:research
npm run lint
npm run typecheck
npm run build
```

`validate:research` checks DOI syntax, DOI and title/year duplicates, duplicate authors, HTTPS links, required author identifiers, and missing metadata. It writes the non-destructive coverage report to `data/synced/research-quality.json` and fails on integrity errors.

The production static export is written to `out/`.

## AI Research Assistant

The `/assistant` route searches only synchronized and manually verified portal data. Its knowledge index covers publications, projects, datasets, software, GitHub repositories, patents, teaching records, and metrics. The browser downloads the index only after a question is submitted, keeping the initial page lightweight.

The assistant is split into independent layers:

- `lib/assistant/retriever.ts` applies source, research-area, year, and publication-type filters, then scores exact terms and domain-aware semantic concepts.
- `lib/assistant/ranker.ts` combines lexical, semantic, field, authority, and query-intent signals.
- `lib/assistant/generator.ts` creates deterministic, source-linked answers and explicitly reports unavailable evidence.
- `components/assistant/` provides the streaming chat, filters, recent questions, suggested prompts, copy action, and conversation controls.
- `server/assistant-api.mjs` optionally sends only the retrieved local evidence to OpenAI and streams the grounded result over server-sent events.

Rebuild the local knowledge index after changing synchronized or manual records:

```bash
npm run build:assistant-index
```

`npm run sync-all` also rebuilds the index automatically.

### Optional GPT responses

Local deterministic retrieval is the default and requires no external service. To enable GPT-assisted synthesis, keep the API key on a trusted server and run the optional gateway:

```bash
cp .env.example .env.local
export OPENAI_API_KEY="your-server-side-key"
export OPENAI_MODEL="gpt-5.6-terra"
export ASSISTANT_ALLOWED_ORIGIN="http://localhost:3000"
npm run assistant:server
```

Expose the gateway to the frontend at build time:

```bash
NEXT_PUBLIC_ASSISTANT_API_URL="http://127.0.0.1:8787/assistant" npm run dev
```

For GitHub Pages, deploy the gateway separately over HTTPS, set `ASSISTANT_ALLOWED_ORIGIN` to the production Pages origin, and provide its `/assistant` endpoint as `NEXT_PUBLIC_ASSISTANT_API_URL` during the static build. Never put `OPENAI_API_KEY` in a `NEXT_PUBLIC_*` variable. If the endpoint is absent or unavailable, the interface automatically uses deterministic local retrieval.

## GitHub Pages deployment

The deployment workflow applies `NEXT_PUBLIC_BASE_PATH` from the repository name, runs validation, linting, type checking, and the production build, then uploads `out/` through the official Pages actions. Select **GitHub Actions** as the Pages source in repository settings.

Canonical URLs are configured for:

`https://profmohit-edu.github.io/mohit-tiwari-academic`
