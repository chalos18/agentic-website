import Link from 'next/link';
import Doodle from '@/components/motifs/Doodle';
import { getAllProjects, ProjectFrontmatter } from '@/lib/content';

export const metadata = { title: 'Projects' };

function ProjectList({ projects }: { projects: { frontmatter: ProjectFrontmatter }[] }) {
  return (
    <div className="space-y-5">
      {projects.map(({ frontmatter }) => (
        <article key={frontmatter.slug} className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
          <h2 className="font-display text-xl font-semibold mb-1">
            <Link href={`/projects/${frontmatter.slug}`} className="text-espresso hover:text-terracotta-dark">
              {frontmatter.title}
            </Link>
          </h2>
          <p className="text-espresso-light text-sm mb-3">{frontmatter.summary}</p>
          <div className="flex flex-wrap gap-2">
            {frontmatter.tech.map((tech) => (
              <span key={tech} className="px-2 py-0.5 rounded-full bg-sage/15 text-sage-dark text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const projects = getAllProjects();
  const workProjects = projects.filter((p) => p.frontmatter.category === 'work');
  const personalProjects = projects.filter((p) => p.frontmatter.category !== 'work');

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-8 flex items-center gap-3">
        <Doodle variant="bowl" className="w-8 h-8 text-terracotta" />
        Projects
      </h1>

      {workProjects.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold text-espresso mb-4">Completed Work Projects</h2>
          <ProjectList projects={workProjects} />
        </section>
      )}

      {personalProjects.length > 0 && (
        <section>
          <h2 className="font-display text-xl font-semibold text-espresso mb-4">Personal Projects</h2>
          <ProjectList projects={personalProjects} />
        </section>
      )}
    </div>
  )
}
