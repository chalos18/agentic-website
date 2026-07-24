# Architecture

Technical reference for how `agentic-website` is put together. For setup/usage see `README.md`; for Claude-specific working guidance see `CLAUDE.md`.

## Path alias

`@/*` maps to `src/*` (see `tsconfig.json`).

## Routing (Next.js App Router, `src/app/`)

- `layout.tsx` — root layout; wraps every page in `Header` + `Footer`, applies the `display`/`body` font variables from `src/lib/fonts.ts`. Note: `src/app/index.tsx` is a near-duplicate of `layout.tsx` left over from earlier restructuring and is not part of the App Router convention (Next only picks up `layout.tsx`) — treat it as dead code rather than a second source of truth.
- `template.tsx` — client component wrapping every route in a Framer Motion page-transition (fade/slide content + a small motif "stamp" animation keyed by route, see `motifFor()`).
- `page.tsx` — landing page (hero, skills, featured projects, latest posts), reading real content via `src/lib/content.ts`.
- `about/` — static bio page. There is no `contact/` route or nav link — the LinkedIn link (in the footer, and on the about page) is the only contact path.
- `blog/`, `blog/[slug]/` — blog index and post detail, reading MDX frontmatter/body from `content/posts/*.mdx` via `src/lib/content.ts` and rendering the body with `next-mdx-remote/rsc`. Posts with `category: "recipe"` in frontmatter (plus `ingredients`/`steps` arrays) get an ingredients/steps card layout on the detail page.
- `projects/`, `projects/[slug]/` — same pattern for project case studies, backed by `content/projects/*.mdx`. Frontmatter supports an optional `category: "work" | "personal"`; the projects index groups entries into a "Completed Work Projects" section and a "Personal Projects" section (undefined `category` defaults to personal). The homepage's "Featured Projects" section independently picks specific slugs (`FEATURED_SLUGS` in `src/app/page.tsx`) regardless of category.
- `rubiks/` — the Rubik's Cube trainer page (client component)
- `api/ai/chat/route.ts` — stubbed AI chat endpoint (returns a canned response; real Claude API integration is planned per `.github/instructions/portfolio-agent.instructions.md` but not yet implemented)
- `api/algorithms/route.ts` — `GET /api/algorithms`, supports `?stage=`, `?difficulty=`, `?q=` query params, reads from static seed data (no DB yet)

MDX is enabled via `@next/mdx` (`next.config.ts`, `pageExtensions` includes `md`/`mdx`) for any `.mdx` files placed directly under `src/app`; content under `content/posts/` and `content/projects/` is separate and read at request time via `src/lib/content.ts` (`fs` + `gray-matter` for frontmatter, `next-mdx-remote/rsc` to render the body) rather than through the `@next/mdx` webpack pipeline.

## Rubik's Cube trainer (`src/{components/Cube,components/Algorithm,services,hooks,utils,types/cube.ts}`)

This is the most substantial feature in the codebase. Layering:

- `types/cube.ts` — shared types/enums: `MoveNotation`, `SolvingStage`, `Algorithm`, `CubeStateData`, `PlaybackState`
- `services/CubeState.ts` — immutable cube-state engine. Every move (`move`, `moves`, `scramble`, `undo`, `reset`) returns a *new* `CubeState` instance; internal representation is a `Record<face, 3x3 number[][]>`. `undo()` replays full history from scratch rather than storing inverse states. `scramble()` appends its moves onto the existing internal `moveHistory` the same way manual moves do — the UI layer, not `CubeState`, is responsible for treating scramble moves differently.
- `services/PlaybackController.ts` — imperative class driving algorithm playback (play/pause/step/speed) via `setInterval`; not a React hook itself, consumed by one.
- `services/AlgorithmSeeds.ts` — static list of ~14 seeded algorithms (CFOP/Fridrich stages) plus `getAlgorithmsByStage`/`getAlgorithmsByDifficulty`/`searchAlgorithms` helpers; backs `api/algorithms`.
- `services/IMPLEMENTATION_GUIDE.ts` — not executable logic, a documentation-as-code file describing the whole feature's architecture, usage examples, and a "Next Steps" roadmap (DB integration, auth, solver AI). Read this first when extending the cube trainer.
- `utils/MoveParser.ts` — parses/validates/normalizes standard cube notation strings (e.g. `"R U R' U'"`) into `MoveNotation[]`; also has `invertMove`, `simplifyMoveSequence`, `formatMoveSequence`.
- `hooks/useCube.ts` — React state wrapper around `CubeState` (`cube`, `applyMove`, `scramble`, `reset`, `undo`, `isSolved`, `moveHistory`, `status`). It tracks a `scrambleBaseline` (the move-history length right after the last scramble) so the exposed `moveHistory`/move count only reflect moves made while solving — scrambling itself always reads as 0 moves. `status` is derived (`'solved' | 'scrambling' | 'solving'`) from `isSolved` and whether any solving moves have been made yet.
- `hooks/useAlgorithms.ts` — fetches/filters `/api/algorithms` client-side.
- `components/Cube/` — `CubeCanvas` (React Three Fiber `<Canvas>` setup: lights, camera, `OrbitControls`) → `CubeMesh` (Three.js rendering of individual cubies) → `CubeControls` (scramble/reset/undo buttons plus a 4-column manual move grid — `U U' D D'` / `L L' R R'` / `F F' B B'`, so each face's clockwise/counter-clockwise pair sits side by side), `MoveHistory`.
- `components/Algorithm/` — `AlgorithmInput` (parses typed notation), `AlgorithmPlayback` (drives `PlaybackController`), `AlgorithmLibrary` (browses seeded algorithms).

3D rendering uses `@react-three/fiber` + `@react-three/drei` + `three`; components under `Cube/` and hooks under `hooks/` are client components (`'use client'`).

## Styling

Tailwind CSS (`tailwind.config.js` scans `src/**/*.{js,ts,jsx,tsx,md,mdx}` and `content/**/*.{md,mdx}`) plus global styles in `src/components/ui/globals.css`. No MUI/`@emotion` — those were removed; Tailwind (+ CSS Modules where scoped styles help) is the only styling system.

Design system: a warm "kitchen + cube" identity, one light theme (no dark mode).
- Colors are custom Tailwind tokens defined in `tailwind.config.js`: `cream`/`cream-deep` (backgrounds), `espresso`/`espresso-light` (text), `terracotta`, `sage`, `mustard` (accents, each with `-light`/`-dark`), `clay-line` (borders).
- Type: `display` (Fraunces, serif headings) + `sans` (Karla, body) via `next/font/google` in `src/lib/fonts.ts`, exposed as CSS variables and applied in `layout.tsx`.
- Motifs: hand-drawn line-icon components in `src/components/motifs/` — `Doodle.tsx` (variants: `cube` (drawn with visible 3x3 grid lines on each face, matching the Rubik's Cube branding), `burger`, `paintbrush`, `bowl`, `pan`) for scattered decorative accents, `Logo.tsx` for the header/favicon mark (also mirrored as static markup in `src/app/icon.svg`).
- `src/components/custom/SkillsBowl.tsx` — the homepage's interactive "alphabet soup" skills visual. Skill strings are broken into individual letters and laid out around an SVG soup-bowl using a deterministic golden-angle spiral (not `Math.random()`, to avoid SSR/hydration mismatches). On `mousemove` over the container, letters within a pixel radius of the cursor are pushed away (a CSS `transform: translate()` offset computed from cursor distance) and spring back via a CSS transition when the cursor moves away or leaves.
- Motion: Framer Motion, used in `src/app/template.tsx` for route transitions only — no other page-transition or animation library.

The Rubik's Cube trainer page shares the same warm light theme as the rest of the site — the 3D canvas viewport itself keeps a dark espresso-toned backdrop for cube contrast, but the surrounding page chrome (controls, panels, tutorial section) uses the same cream/terracotta/sage system as everywhere else.

## Content model

- `src/lib/content.ts` is the single read path for both content types (`getAllPosts`/`getPostBySlug`, `getAllProjects`/`getProjectBySlug`), backed by `fs.readdirSync` over `content/posts/` and `content/projects/` — there is no database or CMS.
- `PostFrontmatter` / `ProjectFrontmatter` (same file) are the frontmatter schemas; both are intentionally small and flat so new fields (like the project `category` field) can be added without a migration.
- Dates in frontmatter are normalized in `content.ts` (`normalizeDate`) because `gray-matter`/`js-yaml` parses unquoted YAML dates into `Date` objects rather than strings.

## API routes

- `api/algorithms` — real logic, reads from the static `AlgorithmSeeds` module (no external calls, no DB).
- `api/ai/chat` — intentionally a stub (`{ reply: 'This is a stubbed AI response' }`); see `.github/instructions/portfolio-agent.instructions.md` for the intended RAG-over-portfolio-content design before building this out.

## Legacy / dead artifacts

These predate the current Next.js app (from an earlier Create React App + Express bootstrap) and are not part of the running application — don't treat them as a second source of truth:
- `dist/` — a compiled Express server (`dist/index.js`) and a stray compiled copy of the chat API route. Unused; the app runs via `next dev`/`next start`, not this.
- `getting-started.md` — Create React App boilerplate docs. Superseded by `README.md`.
- `src/app/index.tsx` — see the Routing section above.

## Tooling

- Linting: ESLint flat config (`eslint.config.js`), extends `next/core-web-vitals`.
- No test runner is configured (no Jest/Vitest, no `*.test.*`/`*.spec.*` files, no `test` script). `src/services/IMPLEMENTATION_GUIDE.ts` references `npm test -- CubeState.test.ts` as an aspirational example only.
- No Docker; the app runs directly via `npm run dev`/`npm start`.
