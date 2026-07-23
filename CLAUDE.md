# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Ana Oliveira's professional portfolio (Next.js App Router SPA) with blog capabilities and an interactive Rubik's Cube trainer. Emphasizes backend/testing/AI expertise showcase (Python, GCP, performance testing, mentoring) and is designed to scale into a multi-page blog without rework.

## Commands

- `npm run dev` — start the dev server (Next.js, hot reload)
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` / `npm run lint:fix` — ESLint (flat config in `eslint.config.js`, extends `next/core-web-vitals`)

There is no test runner configured in this repo (no Jest/Vitest, no `*.test.*`/`*.spec.*` files, no `test` script). `src/services/IMPLEMENTATION_GUIDE.ts` references `npm test -- CubeState.test.ts` as an aspirational example only — don't assume that command works.

Docker is not used in this repo; run the app with `npm run dev` (see `README.md`).

## Architecture

### Path alias
`@/*` maps to `src/*` (see `tsconfig.json`).

### Routing (Next.js App Router, `src/app/`)
- `layout.tsx` — root layout; wraps every page in `Header` + `Footer`. Note: `src/app/index.tsx` is a near-duplicate of `layout.tsx` left over from earlier restructuring and is not part of the App Router convention (Next only picks up `layout.tsx`) — treat it as dead code rather than a second source of truth.
- `page.tsx` — landing page (hero, skills, featured projects, latest posts). Currently has a duplicated "Featured Projects" section — a known rough edge, not intentional.
- `blog/`, `blog/[slug]/` — blog index and post detail (currently static placeholders, not yet wired to `content/posts/*.mdx`)
- `projects/`, `projects/[slug]/` — same pattern for project case studies, backed by `content/projects/*.mdx`
- `rubiks/` — the Rubik's Cube trainer page (client component)
- `api/ai/chat/route.ts` — stubbed AI chat endpoint (returns a canned response; real Claude API integration is planned per `.github/instructions/portfolio-agent.instructions.md` but not yet implemented)
- `api/algorithms/route.ts` — `GET /api/algorithms`, supports `?stage=`, `?difficulty=`, `?q=` query params, reads from static seed data (no DB yet)

MDX is enabled via `@next/mdx` (`next.config.ts`, `pageExtensions` includes `md`/`mdx`); content lives under `content/posts/` and `content/projects/`.

### Rubik's Cube trainer (`src/{components/Cube,components/Algorithm,services,hooks,utils,types/cube.ts}`)
This is the most substantial feature in the codebase. Layering:

- `types/cube.ts` — shared types/enums: `MoveNotation`, `SolvingStage`, `Algorithm`, `CubeStateData`, `PlaybackState`
- `services/CubeState.ts` — immutable cube-state engine. Every move (`move`, `moves`, `scramble`, `undo`, `reset`) returns a *new* `CubeState` instance; internal representation is a `Record<face, 3x3 number[][]>`. `undo()` replays full history from scratch rather than storing inverse states.
- `services/PlaybackController.ts` — imperative class driving algorithm playback (play/pause/step/speed) via `setInterval`; not a React hook itself, consumed by one.
- `services/AlgorithmSeeds.ts` — static list of ~14 seeded algorithms (CFOP/Fridrich stages) plus `getAlgorithmsByStage`/`getAlgorithmsByDifficulty`/`searchAlgorithms` helpers; backs `api/algorithms`.
- `services/IMPLEMENTATION_GUIDE.ts` — not executable logic, a documentation-as-code file describing the whole feature's architecture, usage examples, and a "Next Steps" roadmap (DB integration, auth, solver AI). Read this first when extending the cube trainer.
- `utils/MoveParser.ts` — parses/validates/normalizes standard cube notation strings (e.g. `"R U R' U'"`) into `MoveNotation[]`; also has `invertMove`, `simplifyMoveSequence`, `formatMoveSequence`.
- `hooks/useCube.ts` — React state wrapper around `CubeState` (`cube`, `applyMove`, `scramble`, `reset`, `undo`, `isSolved`, `moveHistory`).
- `hooks/useAlgorithms.ts` — fetches/filters `/api/algorithms` client-side.
- `components/Cube/` — `CubeCanvas` (React Three Fiber `<Canvas>` setup: lights, camera, `OrbitControls`) → `CubeMesh` (Three.js rendering of individual cubies) → `CubeControls`, `MoveHistory`.
- `components/Algorithm/` — `AlgorithmInput` (parses typed notation), `AlgorithmPlayback` (drives `PlaybackController`), `AlgorithmLibrary` (browses seeded algorithms).

3D rendering uses `@react-three/fiber` + `@react-three/drei` + `three`; components under `Cube/` and hooks under `hooks/` are client components (`'use client'`).

### Styling
Tailwind CSS (`tailwind.config.js` scans `src/**/*.{js,ts,jsx,tsx,md,mdx}` and `content/**/*.{md,mdx}`) plus global styles in `src/components/ui/globals.css`. The Rubik's trainer page uses a distinct dark theme (`bg-gray-900`/`gray-800`/`gray-700`, blue/green/red accents) versus the lighter default site theme — keep that separation intentional, not a leak between the two.

## Standards

### Documentation
Keep documentation (README, CLAUDE.md, code comments) brief, concise, clear, and made for ease of understanding. Prefer the shortest explanation that removes ambiguity over an exhaustive one.

### Code comments
- Comments should not duplicate the code.
- Good comments do not excuse unclear code — if the code needs a comment to be understood, first consider whether it can be made clearer instead.
- If you can't write a clear comment, there may be a problem with the code.
- Comments should dispel confusion, not cause it.
- Explain unidiomatic code in comments.
- Provide links to the original source of copied code.
- Include links to external references where they will be most helpful.
- Add comments when fixing bugs (explain the "why" behind the fix).
- Use comments to mark incomplete implementations (e.g. `TODO`).

### Tests
Structure tests using Given/When/Then, with a short comment noting what each part does. Skip the ceremony for small, self-explanatory tests — a clear test name is enough on its own; don't force the pattern when it doesn't add clarity.

### Workflow
Always run linting and tests after making code changes, and fix any issues before considering the work complete.

## Project conventions (from `.github/instructions/portfolio-agent.instructions.md`)

An existing Copilot-style agent definition (`.github/agents/portfolio-agent.agent.md`) captures the intended direction for this repo; treat it as living design guidance:

- **Stack**: React 19 + Next.js App Router, TypeScript mandatory, Tailwind CSS (+ CSS Modules where scoped styles help), Framer Motion for animation — prefer these over introducing new competing libraries.
- **AI integration must be substantive, not decorative**: every AI feature (chat, summaries, recommendations) should be backed by real project/content data and add genuine value — avoid "AI badge" features. The chat endpoint (`api/ai/chat`) is a placeholder for a future Claude API + RAG-style integration over portfolio/blog content, not a generic chatbot.
- **Everything should stay blog/case-study-expandable**: avoid hardcoding portfolio-specific logic in ways that can't generalize to blog posts and project case studies (shared tagging/metadata, shared page templates).
- **Narrative alignment**: content and feature choices should reinforce Ana's backend, testing/performance, GCP, and mentoring strengths.
