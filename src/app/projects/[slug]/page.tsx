import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllProjects().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.frontmatter.title ?? "Project" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { frontmatter, content } = project;

  return (
    <article className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-espresso mb-3">
          {frontmatter.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-2">
          {frontmatter.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full bg-sage/15 text-sage-dark text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
        <time className="text-sm text-espresso-light/70">
          {frontmatter.date}
        </time>
      </header>

      <div className="prose-warm">
        <MDXRemote source={content} />
      </div>

      {frontmatter.repo && (
        <a
          href={frontmatter.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 text-sage-dark font-medium hover:text-terracotta-dark hover:underline"
        >
          View on GitHub →
        </a>
      )}
    </article>
  );
}
