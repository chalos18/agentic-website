# Architecture

Technical reference for how `agentic-website` is put together. For setup/usage see `README.md`; for Claude-specific working guidance see `CLAUDE.md`.

## Path alias

`@/*` maps to `src/*` (see `tsconfig.json`).

## Routing (Next.js App Router, `src/app/`)

- `layout.tsx` — root layout; wraps every page in `Header` + `Footer`, applies the `display`/`body` font variables from `src/lib/fonts.ts`. Note: `src/app/index.tsx` is a near-duplicate of `layout.tsx` left over from earlier restructuring and is not part of the App Router convention (Next only picks up `layout.tsx`) — treat it as dead code rather than a second source of truth.
- `template.tsx` — client component wrapping every route in a Framer Motion page-transition (fade/slide content + a small motif "stamp" animation keyed by route, see `motifFor()`).
- `page.tsx` — landing page (hero, skills, featured projects, latest posts), reading real content via `src/lib/content.ts`.
- `about/` — static bio page. There is no `contact/` route or nav link — the LinkedIn link (in the footer, and on the about page) is the only contact path.
- `blog/`, `blog/[slug]/` — blog index (search only) and post detail for non-recipe posts, reading MDX frontmatter/body from `content/posts/*.mdx` via `src/lib/content.ts` (`getAllBlogPosts`/`getPostBySlug`) and rendering the body with `next-mdx-remote/rsc`.
- `recipes/`, `recipes/[slug]/`, `recipes/requests/` — same `content/posts/*.mdx` collection, filtered to `category: "recipe"` (`getAllRecipes`/`getRecipeBySlug`). The index adds search + a `mealType` filter (`breakfast`/`lunch`/`dinner`/`dessert`/`snack`); the detail page adds an optional hero `image`, the `ingredients`/`steps` card layout, a "requested by" credit when frontmatter sets `requestedBy`, and a comment thread (`components/Recipes/CommentSection.tsx`, backed by `api/comments`). `recipes/requests` is a public, login-free board (`components/Recipes/RequestBoard.tsx`) where anyone can submit a recipe to request; entries are marked `quoted`/`dismissed` via `api/recipe-requests/[id]` (`PATCH`), gated by a `RECIPE_ADMIN_KEY` passphrase check server-side rather than any auth system — see "Data model" below for the persistence caveat.
- `projects/`, `projects/[slug]/` — same pattern for project case studies, backed by `content/projects/*.mdx`. Frontmatter supports an optional `category: "work" | "personal"`; the projects index groups entries into a "Completed Work Projects" section and a "Personal Projects" section (undefined `category` defaults to personal). The homepage's "Featured Projects" section independently picks specific slugs (`FEATURED_SLUGS` in `src/app/page.tsx`) regardless of category.
- `rubiks/` — the twisty puzzle trainer page (client component); picks one of nine puzzles and drives it
- `api/ai/chat/route.ts` — stubbed AI chat endpoint (returns a canned response; real Claude API integration is planned per `.github/instructions/portfolio-agent.instructions.md` but not yet implemented)
- `api/algorithms/route.ts` — `GET /api/algorithms`, supports `?stage=`, `?difficulty=`, `?q=` query params, reads from static seed data (no DB yet)

MDX is enabled via `@next/mdx` (`next.config.ts`, `pageExtensions` includes `md`/`mdx`) for any `.mdx` files placed directly under `src/app`; content under `content/posts/` and `content/projects/` is separate and read at request time via `src/lib/content.ts` (`fs` + `gray-matter` for frontmatter, `next-mdx-remote/rsc` to render the body) rather than through the `@next/mdx` webpack pipeline.

## Twisty puzzle trainer (`src/{services/puzzles,components/Cube,components/Algorithm,hooks,utils,types/cube.ts}`)

This is the most substantial feature in the codebase. It covers nine puzzles —
2x2, 3x3, 4x4, 5x5, pyraminx, skewb, megaminx, mastermorphix, ivy cube — from one
geometric engine. Ivy Cube reuses the Skewb's corner-axis geometry (same body
diagonals, but the turn only grabs the tip and only goes 180°) rather than
introducing a new mechanism — deliberately, since most other shapes sold as
distinct "cube types" (Fisher, Windmill, Bump/Mirror, Void, Axis, Pyramorphix,
Ghost) are cosmetic shape-mods of the 3x3/2x2 mechanisms already modeled here,
not mechanically new puzzles. Square-1 (irregular non-uniform layer cuts, a
180°-flip middle slice), Redi Cube/Curvy Copter (edge-turning, not axis-turning),
and Rubik's Clock (dial-based, not a layer-turning puzzle at all) don't fit this
engine's plane-cut-and-threshold model without a real rework, so they were left
out rather than forced in.

Mastermorphix looks tetrahedral but is mechanically a genuine 3x3 shape-mod —
same six face axes, two layer cuts, order-4 turns as `nxnDefinition(3, ...)`
(`mastermorphixDefinition` in `definitions.ts` builds on it directly), just
bounded by a tetrahedral `shell` (four planes through alternating cube corners)
instead of a cube's six. That mismatch between the cube's own grid lines and
the tetrahedron's faces is exactly why pieces change size and outline as they
turn — a former cube corner can end up filling a whole tip, a former cube edge
can end up as an oddly-angled sliver on a face. It is *not* built on the
Pyraminx mechanism (different axes, different turn order), a common
misconception this codebase's first attempt also made.

**Why geometric and not facelet-based.** An earlier `CubeState` stored six 3x3
sticker grids. That model can compute a move but cannot *show* one: there is no
piece to rotate, only colours to repaint. Pieces are now real convex solids with
a position and an orientation, so a move is a rotation — the same rotation the
renderer animates. It also generalises: a tetrahedron and a dodecahedron are
described the same way a cube is.

Layering, bottom up:

- `services/puzzles/geometry.ts` — vector/quaternion maths plus convex-polytope
  clipping. `splitPolytope` is the primitive everything else rests on.
- `services/puzzles/definitions.ts` — each puzzle as a `shell` (outward faces
  with sticker colours), `cuts` (planes that carve it into pieces), and `moves`
  (twist axis + selection threshold + turn order). `PUZZLES` is the registry.
- `services/puzzles/TwistyPuzzle.ts` — carves the solid into pieces once per
  puzzle (cached), then holds immutable state: every move returns a new
  instance. `turnSpec(move)` returns the axis, angle and affected piece ids —
  the same object the renderer animates, so visual and logical state cannot
  drift apart. Also owns `scrambleSequence`, `undo` and `isSolved` (a face is
  solved when every sticker facing its way shares a colour).
- `services/AlgorithmSeeds.ts` — static list of ~14 seeded algorithms
  (CFOP/Fridrich stages) plus `getAlgorithmsByStage`/`getAlgorithmsByDifficulty`/
  `searchAlgorithms` helpers; backs `api/algorithms`.
- `utils/MoveParser.ts` — parses/validates/normalizes move-sequence strings
  into `MoveNotation[]`; also has `invertMove`, `simplifyMoveSequence`,
  `formatMoveSequence`. `validateMove`/`parseMoveSequence` take an optional
  list of that puzzle's own move names (`Object.keys(PUZZLES[id].moves)`) to
  validate against — a Skewb only has U/R/L/B, a Megaminx has twelve named
  faces, so a fixed cube-shaped regex can't cover every puzzle. Falls back to
  a 3x3-shaped regex (plus `Rw`/`2Rw` wide-turn forms) when no list is given.
- `components/Algorithm/AlgorithmInput.tsx` — shown for every puzzle (not just
  the NxN cubes), takes a `puzzleId` prop, and looks up its "Quick Examples"
  from a per-puzzle map — a 3x3 T-Perm means nothing on a 2x2 (no fixed
  centres) or a Pyraminx (different axes entirely), and 4x4/5x5 need wide-move
  notation instead.
- `hooks/usePuzzle.ts` — puzzle state plus a move queue. A queued move is not
  applied until its turn has finished animating, which is what keeps the queue
  serialised; scrambles bypass the queue and land instantly. Tracks a
  `solveBaseline` so the displayed move count excludes the scramble.
- `hooks/useAlgorithms.ts` — fetches/filters `/api/algorithms` client-side.
- `components/Cube/` — `PuzzleCanvas` (Canvas, lights, camera, `OrbitControls`)
  → `PuzzleMesh` (geometry + the turn animation) → `PuzzleControls` (scramble/
  reset/undo, turn speed, and a move pad generated from the puzzle's own
  `moveGroups`, plus notation keyboard shortcuts), `MoveHistory`.
- `components/Algorithm/` — `AlgorithmInput` (parses typed notation),
  `AlgorithmLibrary` (browses seeded algorithms).

`PuzzleMesh` animates a turn by parenting the affected pieces to a group at the
origin and swinging that group's quaternion about the move axis; on completion
the move is committed to state and the group resets. `types/cube.ts` still holds
the 3x3 `MoveNotation` union and the `Algorithm`/`SolvingStage` types used by the
algorithm side; the puzzle engine itself takes plain move strings.

3D rendering uses `@react-three/fiber` + `@react-three/drei` + `three`;
components under `Cube/` and hooks under `hooks/` are client components
(`'use client'`).

## Styling

Tailwind CSS (`tailwind.config.js` scans `src/**/*.{js,ts,jsx,tsx,md,mdx}` and `content/**/*.{md,mdx}`) plus global styles in `src/components/ui/globals.css`. No MUI/`@emotion` — those were removed; Tailwind (+ CSS Modules where scoped styles help) is the only styling system.

Design system: a warm kitchen identity, one light theme (no dark mode).
- Colors are custom Tailwind tokens defined in `tailwind.config.js`: `cream`/`cream-deep` (backgrounds), `espresso`/`espresso-light` (text), `terracotta`, `sage`, `mustard` (accents, each with `-light`/`-dark`), `clay-line` (borders).
- Type: `display` (Fraunces, serif headings) + `sans` (Karla, body) via `next/font/google` in `src/lib/fonts.ts`, exposed as CSS variables and applied in `layout.tsx`.
- Motifs: hand-drawn line-icon components in `src/components/motifs/` —
  `Doodle.tsx` (variants: `cube`, `bowl`, `pan`, `fork`, `skewer`, `cake`,
  `burger`, `paintbrush`) for scattered decorative accents; `Logo.tsx` for the
  header/favicon mark, noodles draped over a fork (mirrored as static markup in
  `src/app/icon.svg` — keep the two in sync); `PuzzleGlyph.tsx` for the trainer's
  puzzle picker, showing each puzzle's face-on cut pattern.
- `src/components/custom/SkillsBowl.tsx` + `soupLayout.ts` — the homepage's
  interactive "alphabet soup" skills visual. `layOutSoup` places each skill as a
  gently curved run of letters inside the broth ellipse by seeded rejection
  sampling (seeded, not `Math.random()`, to avoid SSR/hydration mismatches),
  keeping the roomiest fit of many candidates so words spread evenly rather than
  clump. Letters are `<text>` inside the SVG, so they scale with the artwork and
  can never escape the bowl at any viewport size. Pointer movement stirs them —
  a push away from the cursor plus a tangential swirl, clamped back inside the
  broth — over a slow ambient bob (`.soup-bob` in `globals.css`, silenced by the
  global reduced-motion rule).
- Motion: Framer Motion, used in `src/app/template.tsx` for route transitions only — no other page-transition or animation library.

The puzzle trainer page shares the same warm light theme as the rest of the site — the 3D canvas viewport itself keeps a dark espresso-toned backdrop for cube contrast, but the surrounding page chrome (controls, panels, guide links) uses the same cream/terracotta/sage system as everywhere else.

## Content model

- `src/lib/content.ts` is the single read path for both content types (`getAllPosts`/`getPostBySlug`, `getAllProjects`/`getProjectBySlug`, `getAllPaintings`/`getPaintingBySlug`), backed by `fs.readdirSync` over `content/posts/`, `content/projects/`, `content/paintings/` — there is no database or CMS for this static content.
- `PostFrontmatter` / `ProjectFrontmatter` / `PaintingFrontmatter` (same file) are the frontmatter schemas; all are intentionally small and flat so new fields can be added without a migration. `getAllBlogPosts`/`getAllRecipes`/`getRecipeBySlug` split the one `content/posts/` collection by `frontmatter.category === 'recipe'` rather than using two directories — blog posts and recipes share the same schema (`mealType`, `image`, `tags`, `requestedBy` are recipe/blog-oriented additions on top of the original fields) and moving one from `/blog` to `/recipes` is a one-line frontmatter change, not a file move.
- Dates in frontmatter are normalized in `content.ts` (`normalizeDate`) because `gray-matter`/`js-yaml` parses unquoted YAML dates into `Date` objects rather than strings.

## Recipe requests, comments, and anonymous names (no login)

Static MDX content can't hold visitor-submitted data, so this one slice of the
site has a small server-side data layer bolted on:

- `data/comments.json`, `data/recipe-requests.json` — flat JSON files, read and
  written only from API routes via `src/lib/jsonStore.ts`. **Caveat:** this app
  has no database configured; JSON-on-disk is fine for a low-traffic personal
  server with a persistent filesystem, but on a serverless host with an
  ephemeral/read-only filesystem (e.g. Vercel) these writes won't survive
  across deploys or separate function instances. Swap `jsonStore.ts` for a real
  DB/KV client if the site moves to that kind of host — it's the only module
  that would need to change.
- `api/comments` (`GET ?slug=`, `POST`) and `api/recipe-requests` (`GET`,
  `POST`) + `api/recipe-requests/[id]` (`PATCH`) are the only write paths.
  Browsing, commenting, and submitting a request all require no login by
  design. The `PATCH` (marking a request `quoted` or `dismissed`) is the one
  admin-only action, gated by a plain passphrase (`RECIPE_ADMIN_KEY` env var,
  checked server-side) rather than a real auth system — deliberately minimal
  since it's the only action that needs Ana-only access.
- `src/lib/anonName.ts` — generates a stable, cooking-themed display name
  (`"Saucy Whisk"`, `"Zesty Ladle"`, …) per browser, from a random id stored in
  a cookie on first use. No accounts: the same visitor keeps the same name
  across visits, and 26 adjectives × 30 nouns (780 combinations) is well past
  what a personal site's handful of regulars will exhaust.
- Workflow: a visitor submits a recipe request on `/recipes/requests` (public,
  visible to everyone). When Ana writes that recipe up, she sets
  `requestedBy` in the post's frontmatter to credit the submitter, and marks
  the original request `quoted` (still shown, tagged "posted!") or removes it
  via `dismissed` (hidden) from the board.

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
- No test runner is configured (no Jest/Vitest, no `*.test.*`/`*.spec.*` files, no `test` script).
- No Docker; the app runs directly via `npm run dev`/`npm start`.
