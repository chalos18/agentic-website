import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type MealType = "breakfast" | "lunch" | "dinner" | "dessert" | "snack";

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  author: string;
  excerpt: string;
  category?: string;
  ingredients?: string[];
  steps?: string[];
  mealType?: MealType;
  image?: string;
  tags?: string[];
  /** Set when this recipe was written in response to a public request — see `data/recipe-requests.json`. */
  requestedBy?: string;
}

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  date: string;
  tech: string[];
  summary: string;
  category?: "work" | "personal";
}

export interface PaintingFrontmatter {
  name: string;
  slug: string;
  date: string;
  givenTo: string;
  motif: string;
  image?: string;
  process?: string[];
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const PAINTINGS_DIR = path.join(process.cwd(), "content", "paintings");

function readMdxDir(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

// gray-matter (via js-yaml) parses unquoted frontmatter dates (e.g. `date: 2026-04-27`)
// into Date objects rather than strings, so normalize them back to ISO date strings.
function normalizeDate(date: unknown): string {
  return date instanceof Date ? date.toISOString().slice(0, 10) : String(date);
}

export function getAllPosts(): {
  frontmatter: PostFrontmatter;
  content: string;
}[] {
  return readMdxDir(POSTS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const frontmatter = {
        ...data,
        date: normalizeDate(data.date),
      } as PostFrontmatter;
      return { frontmatter, content };
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  return getAllPosts().find((post) => post.frontmatter.slug === slug) ?? null;
}

// "Blog post" and "recipe" are one concept — a post, filtered by its `category`
// frontmatter — wearing four function names for callers' convenience.
function getPostsByCategory(isRecipe: boolean) {
  return getAllPosts().filter(
    (post) => (post.frontmatter.category === "recipe") === isRecipe
  );
}

export function getAllBlogPosts() {
  return getPostsByCategory(false);
}

export function getAllRecipes() {
  return getPostsByCategory(true);
}

export function getRecipeBySlug(slug: string) {
  return getAllRecipes().find((post) => post.frontmatter.slug === slug) ?? null;
}

export function getAllProjects(): {
  frontmatter: ProjectFrontmatter;
  content: string;
}[] {
  return readMdxDir(PROJECTS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const frontmatter = {
        ...data,
        date: normalizeDate(data.date),
      } as ProjectFrontmatter;
      return { frontmatter, content };
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getProjectBySlug(slug: string) {
  return (
    getAllProjects().find((project) => project.frontmatter.slug === slug) ??
    null
  );
}

export function getAllPaintings(): {
  frontmatter: PaintingFrontmatter;
  content: string;
}[] {
  return readMdxDir(PAINTINGS_DIR)
    .map((file) => {
      const raw = fs.readFileSync(path.join(PAINTINGS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const frontmatter = {
        ...data,
        date: normalizeDate(data.date),
      } as PaintingFrontmatter;
      return { frontmatter, content };
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getPaintingBySlug(slug: string) {
  return (
    getAllPaintings().find((painting) => painting.frontmatter.slug === slug) ??
    null
  );
}

// Sample painting content can reference photos that haven't been added yet;
// this lets the UI render an artistic placeholder instead of a broken image.
export function paintingAssetExists(relativePath?: string): boolean {
  if (!relativePath) return false;
  return fs.existsSync(path.join(process.cwd(), "public", relativePath));
}

export function paintingGivenToLabel(givenTo: string): string {
  return givenTo === "Kept" ? "Kept by the artist" : `Given to ${givenTo}`;
}
