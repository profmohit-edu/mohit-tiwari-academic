# Academic Research Portal

A static-first, multi-page academic research portal built with Next.js 15, React 19, TypeScript, Tailwind CSS, and a deliberately small client runtime.

## What the portal includes

- Searchable and filterable publication library
- Applied research project portfolio with repository links
- Unified research resource hub for datasets, software, and patents
- Teaching, media, CV, and contact pages
- Light and dark themes with system preference support
- Per-route metadata, canonical URLs, Open Graph metadata, JSON-LD, robots, and sitemap
- Accessible navigation, skip links, semantic landmarks, visible focus states, and reduced-motion support
- Static export and GitHub Pages deployment workflow

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
npm run lint
npm run typecheck
npm run build
```

Run every gate together with:

```bash
npm run check
```

The production site is exported to `out/`.

## Architecture

```text
app/                 Routes, route metadata, sitemap, and robots
components/          Shared layout, navigation, domain, and UI components
data/                Domain-separated, versionable research content
lib/content.ts       Typed content access and derived collections
lib/metadata.ts      Shared route metadata factory
lib/navigation.ts    Primary, secondary, and footer information architecture
lib/site.ts          Identity, deployment URL, and base-path utilities
types/research.ts    Shared research domain types
public/              Static CV, icons, social image, and web manifest
```

Route files are kept presentation-focused. Content is imported through `lib/content.ts`, shared domain cards live in `components/`, and site-wide configuration is centralized in `lib/`.

## Updating content

Research records are organized by domain in `data/*.json`. Keep dates and numeric fields consistent with their existing shapes; TypeScript domain interfaces are defined in `types/research.ts`.

`npm run validate:content` checks required fields, unique identifiers, and secure external URLs before a deployment build.

Update identity, production URL, contact details, and profile links in `lib/site.ts`. Replace the placeholder CV at `public/aarya-mehta-cv.pdf` and social image at `public/og-image.svg` before publishing a real profile.

## GitHub Pages

Push to `main`, then select **GitHub Actions** as the Pages source in repository settings. The workflow runs all quality gates, applies the repository base path, exports the site, and deploys `out/`.
