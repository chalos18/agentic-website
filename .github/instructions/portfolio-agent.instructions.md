---
description: "Use when building portfolio features, styling decisions, architecture choices, or AI integration points. Guides toward industry-standard SPA design, latest tech stack, professional presentation, and strategic AI showcasing."
name: "Portfolio Agent Guidelines"
---

# Portfolio Agent Instructions

## Core Mission
Guide the engineer toward building a **professional, industry-standard SPA portfolio** that:
- Showcases cutting-edge engineering and AI skills
- Remains clean, concise, and focused on promotion
- Scales naturally into a multi-page blog platform
- Integrates AI meaningfully into the user's narrative and workflows

---

## Technology & Architecture

### Framework & Stack
- **Primary**: React 19 + Next.js (App Router) for SSR, optimal SEO, and built-in API capabilities
  - *Rationale*: Industry standard for portfolios; Next.js enables blog-as-first-class-feature with dynamic routes, incremental static regeneration, and seamless API integration
  - Next.js API routes double as backend showcase (complements Ana's strong backend experience)
- **TypeScript**: Mandatory—type safety demonstrates discipline and catches bugs at compile time
- **Styling**: 
  - **Tailwind CSS** + **CSS Modules** for component-scoped styles (scalable to many pages)
  - **CV/Hero sections**: Consider CSS Grid and custom properties for standout layouts
- **Animations**: 
  - **Framer Motion** for sophisticated, performant page transitions and micro-interactions
  - Pair with Intersection Observer for scroll-triggered animations (adds dynamism without gimmicks)
  - Industry-standard choice that impresses technically and visually

### Structure for Blog Expansion (Next.js App Router)
Directory layout:
```
app/
  page.tsx                 # Hero / landing
  layout.tsx               # Root layout
  portfolio/
    page.tsx               # Featured projects
    [slug]/page.tsx        # Project detail (case study)
  blog/
    page.tsx               # Blog index
    [slug]/page.tsx        # Article detail
  api/
    chat/route.ts          # AI chat endpoint
    content/route.ts       # Dynamic content generation
components/
  (shared)
  Portfolio/ProjectCard.tsx
  Blog/ArticleCard.tsx
  AI/ChatWidget.tsx
lib/
  content.ts               # MDX or JSON content loader
  ai-integration.ts        # Claude API, prompt templates
```
- Use **MDX** for blog posts (enables interactive components within articles)
- Content stored in `content/` folder or external headless CMS (optional)
- Reusable components in `components/` scale across portfolio, blog, and AI features

**Core AI Narrative**
Ana's resume shows **backend mastery** (Python, GCP, API design), **testing rigor** (Locust, performance frameworks), and **leadership** (mentoring, cross-functional coordination). AI integration must:
1. **Authentically showcase skills**: Not gimmicky—every AI feature solves a real problem
2. **Complement technical depth**: Chat answers questions *backed by real project data*, summaries highlight *genuine impact*
3. **Demonstrate full-stack capability**: Backend API routes + frontend UX + AI/LLM integration = complete value delivery

### Suggested AI Integration Points (Priority Order)

**Tier 1 (High Impact, Do First)**
1. **AI-Powered Project Chat** (Next.js API route + Claude API)
   - Visitors ask: "What challenges did you solve in performance testing?" → AI surfaces relevant experiences from portfolio
   - Showcases: API design, prompt engineering, RAG-style pattern
   - Example: `app/api/chat/route.ts` processes queries, searches project metadata, returns contextual answers

2. **Dynamic Skill Matching** (Next.js API + MDX metadata)
   - Blog post tagged with `#performance testing`, `#GCP`, `#Python`
   - Portfolio project linked to same tags
   - Visitors: "Show me all work related to GCP" → filtered view, recommending related content
   - Showcases: Data modeling, recommendation logic, full-stack thinking

**Tier 2 (Enhanced UX)**
3. **AI-Generated Project Summaries**
   - `app/api/content/route.ts` generates one-liner and technical bullet points from project detail
   - Reuse for blog SEO meta descriptions
   - Showcases: LLM integration, DevEx improvement

4. **Interactive Blog with AI Insights**
   - Blog posts include "Key Takeaway" sidebar generated from article content
   - Related article recommendations (ML-powered or rule-based)
   - Showcases: Content strategy, AI-assisted knowledge organization

**Tier 3 (Visuals & Polish)**
5. **AI-Generated Theme/Animations**
   - Optional: AI suggests accent colors, font pairings, or animation timing based on portfolio tone
   - Keep subtle—industry standard, not experimental

### Avoid (Anti-patterns)
- Do **not** use AI just to inflate feature count ("AI badge" without substance)
- Do **not** hide the fact it's AI-powered (transparency builds trust)
- Do **not** slow down the portfolio for AI features (all should enhance, never compromise performance
- Project descriptions emphasize technical depth and impact, not just features
- Skills section highlights both breadth and depth
- Case studies or featured project breakdowns show decision-making

---

**Narrative alignment**: Does this highlight Ana's backend skill, testing rigor, mentoring leadership, or AI capability?
2. **Expandability**: Can this pattern scale to blog, different project types, or future features?
3. **Best practices**: Use modern CSS (Grid, custom properties), React Server Components where appropriate, Static Generation for performance
4. **AI fit**: Is there a meaningful AI angle? (Dynamic recommendations, content generation, backend integration—yes. Decorative AI—no.)
5. **Performance**: Will this add unnecessary bundle size or slow page loads? (Critical for portfolio—perception of speed = quality)

### Strategic Integration
When working on portfolio features, ask:
- **Where can AI be legitimately part of the story?** (e.g., a project that used LLMs, built with agents, or analyzed with AI)
- **Can any portfolio interaction be enhanced with AI?** (e.g., an AI-powered chat that answers questions about projects, or dynamic content generation)
- **What AI skills are underrepresented in current portfolio?** Ensure bias toward highlighting AI/ML work

### Suggested AI Integration Points
1. **Interactive AI Chat**: Allow visitors to ask about projects, resume, or capabilities (e.g., Claude API or similar)
2. **AI-Generated Project Summaries**: Behind-the-scenes AI that creates concise project descriptions
3. **Dynamic Content Recommendations**: "If you're interested in X skill, check out these projects"
4. **AI-Powered Blog**: Ready the architecture for AI-assisted blog post writing, categorization, or recommendations
5. **Skill Assessment Tool**: Interactive assessments that showcase expertise (e.g., architecture decision frameworks)
6. **Resume Analysis**: Show how your skills match common job descriptions
7. **Portfolio Optimization Feedback**: Suggest improvements to portfolio sections (self-referential AI use—meta!)

---

## Engineering Decisions

### When Styling or Feature Work Arises

**Ask before implementing:**
1. Does this support the core narrative (promoting the engineer)?
2. Is this expandable? (Can this pattern scale to blog, different page types?)
3. Is this latest/best practice? (Avoid dated patterns; use modern CSS, state management, etc.)
4. Can AI enhance this? (Is there a meaningful place for AI without being gimmicky?)
5. Does it authentically showcase Ana's strengths (backend, testing, GCP, mentoring, AI)?
- [ ] Is it built with React/Next.js best practices and latest stable patterns?
- [ ] Can it scale to blog, multiple project types, and future AI features?
- [ ] Is it mobile-friendly and accessible (WCAG AA)?
- [ ] Does it have meaningful purpose? (No feature bloat; every addition is intentional)
- [ ] Is the AI integration genuine or just decoration?
- [ ] Can it be maintained and extended without refactoring what the code does

---

## Expansion to Blog

### Prerequisite Architecture
- Separate content structure (`/portfolio`, `/blog` routes)
- Metadata system for tagging, categorizing, searching
- Reusable page templates (featured project, article, case study)
- Content loader (JSON Schema, MDX, or headless CMS integration)

### When Planning New Features
- Ask: *Can portfolio pages use this same pattern?*
- Avoid hardcoding portfolio-specific logic; generalize early
- Consider pagination, filtering, and full-text search as future needs
