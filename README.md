# Mohit Tiwari Academic Research Portal

Production academic website for **Mohit Tiwari**, Assistant Professor in the Department of Computer Science & Engineering at Bharati Vidyapeeth's College of Engineering, New Delhi.

The portal is a static-first Next.js application. Academic records are synchronized from authoritative public sources and kept separate from React presentation components.

## Source architecture

```text
app/                         Static routes and route metadata
components/                  Shared layout, domain, interaction, and UI components
data/profile.json            Verified identity and researcher-profile configuration
data/manual/                 Explicitly maintained teaching, patent, and talk records
data/synced/                 Generated ORCID, Crossref, OpenAlex, GitHub, and metric data
lib/content.ts               Typed content selectors and derived collections
lib/metadata.ts              Route metadata factory
lib/navigation.ts            Site information architecture
lib/site.ts                  Identity, canonical URL, and deployment configuration
scripts/sync/                Reusable synchronization pipeline
types/research.ts            Publication, repository, metric, and academic data models
```

React components never contain imported publication or repository records. They consume normalized files in `data/synced/`, allowing the data pipeline to evolve independently of the interface.

## Synchronization

### ORCID, Crossref, and OpenAlex

```bash
npm run sync-orcid
```

The ORCID importer reads public works for `0000-0003-1836-3451`, selects the best source inside each ORCID group, deduplicates by DOI or normalized title/year, and stores the complete normalized record in `data/synced/orcid-works.json`.

The newest site records are enriched by DOI through Crossref and OpenAlex. Enrichment is cached in `data/synced/enrichment-cache.json`, so subsequent runs continue from the existing cache instead of repeating completed requests.

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

- `teaching.json` — confirmed courses and terms
- `patents.json` — confirmed patent identifiers and status
- `talks.json` — confirmed event and recording URLs

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
npm run lint
npm run typecheck
npm run build
```

The production static export is written to `out/`.

## GitHub Pages deployment

The deployment workflow applies `NEXT_PUBLIC_BASE_PATH` from the repository name, runs validation, linting, type checking, and the production build, then uploads `out/` through the official Pages actions. Select **GitHub Actions** as the Pages source in repository settings.

Canonical URLs are configured for:

`https://profmohit-edu.github.io/mohit-tiwari-academic`
