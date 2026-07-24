# Ana Oliveira — Portfolio

Ana Oliveira's professional portfolio site: a bio/skills homepage, a blog, project case studies, and an interactive 3D Rubik's Cube trainer with an algorithm library. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 with hot reload.

Other scripts:

- `npm run build` — production build
- `npm start` — run the production build (run `npm run build` first)
- `npm run lint` — check code style with ESLint
- `npm run lint:fix` — auto-fix what ESLint can

There is no test runner configured in this repo.

## What's here

- **Home** (`/`) — bio, skills (rendered as an interactive letter-scatter "soup bowl" — move your mouse over it), featured projects, and latest blog posts.
- **About** (`/about`) — longer bio.
- **Blog** (`/blog`) — posts written in MDX, including recipe-style posts with an ingredients/steps layout.
- **Projects** (`/projects`) — case studies, split into "Completed Work Projects" and "Personal Projects".
- **Rubik's Cube trainer** (`/rubiks`) — a fully interactive 3D cube (click-and-drag to rotate) with:
  - Manual move buttons (standard notation: `U`, `U'`, `D`, `D'`, `L`, `L'`, `R`, `R'`, `F`, `F'`, `B`, `B'`)
  - Scramble / reset / undo
  - A move counter that only counts moves made while solving (scrambling doesn't count against you)
  - Algorithm notation input (e.g. `R U R' U'`) and a library of seeded CFOP-stage algorithms with step-through playback

## Adding content

Blog posts and project case studies are plain MDX files with YAML frontmatter — no CMS or database.

- **Blog post**: add a `.mdx` file under `content/posts/`. Required frontmatter: `title`, `slug`, `date`, `author`, `excerpt`. Set `category: "recipe"` plus `ingredients`/`steps` arrays to get the recipe card layout.
- **Project**: add a `.mdx` file under `content/projects/`. Required frontmatter: `title`, `slug`, `date`, `tech` (array), `summary`. Set `category: "work"` to have it grouped under "Completed Work Projects" on `/projects`; omit it (or set `"personal"`) for personal projects.

See existing files in `content/posts/` and `content/projects/` for examples.

## Learn more

- `ARCHITECTURE.md` — how the codebase is structured (routing, the Rubik's Cube trainer internals, styling/design system, content model).
- `CLAUDE.md` — guidance for Claude Code when working in this repo.
