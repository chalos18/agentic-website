# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is, for Claude's purposes

`agentic-website` is Ana Oliveira's personal portfolio (Next.js App Router SPA): a bio/skills homepage, blog, project case studies, and an interactive Rubik's Cube trainer. It emphasizes backend/testing/AI expertise (Python, Vue, Node.js, GCP/AWS, Terraform, LLM integration and evaluation, mentoring) and is designed to scale into a multi-page blog and richer AI features without rework.

When asked to work on this repo: prefer extending the existing content model (`content/posts/*.mdx`, `content/projects/*.mdx` read via `src/lib/content.ts`) and component patterns over introducing new architecture, unless the task specifically calls for it. Read `ARCHITECTURE.md` before making structural changes — it's the source of truth for how routing, the cube trainer, the design system, and the content pipeline fit together; don't re-derive or duplicate that information here.

## Commands

- `npm run dev` — start the dev server (Next.js, hot reload)
- `npm run build` — production build
- `npm start` — run the production build
- `npm run lint` / `npm run lint:fix` — ESLint (flat config in `eslint.config.js`, extends `next/core-web-vitals`)

There is no test runner configured in this repo (no Jest/Vitest, no `*.test.*`/`*.spec.*` files, no `test` script). `src/services/IMPLEMENTATION_GUIDE.ts` references `npm test -- CubeState.test.ts` as an aspirational example only — don't assume that command works.

Docker is not used in this repo; run the app with `npm run dev` (see `README.md`).

## Architecture

See `ARCHITECTURE.md` for the full breakdown (routing, the Rubik's Cube trainer internals, styling/design system, content model, API routes, and known dead/legacy artifacts like `dist/` and `getting-started.md`).

## Standards

### Documentation
Keep documentation (README, CLAUDE.md, ARCHITECTURE.md, code comments) brief, concise, clear, and made for ease of understanding. Prefer the shortest explanation that removes ambiguity over an exhaustive one.

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
- **Narrative alignment**: content and feature choices should reinforce Ana's backend, fullstack, AI/LLM, and mentoring strengths — keep project write-ups focused on technology and personal contribution, not business/product framing.
