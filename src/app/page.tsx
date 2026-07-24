import Link from 'next/link';
import Doodle from '@/components/motifs/Doodle';
import { getAllPosts, getAllProjects } from '@/lib/content';

const skills = [
  'Python',
  'LLM Evaluation Frameworks',
  'Locust',
  'PostgreSQL',
  'Google Cloud Platform',
  'Azure',
  'AWS',
  'Terraform',
  'CI/CD',
  'API Development',
  'Mentoring',
  'Behavioural Interviewing',
];

const FEATURED_SLUGS = ['performance-testing-framework', 'gcp-migration'];

export default function Home() {
  const projects = getAllProjects().filter((p) => FEATURED_SLUGS.includes(p.frontmatter.slug));
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="relative text-center mb-20 max-w-2xl mx-auto">
        <Doodle variant="steam" className="hidden sm:block absolute -top-6 -left-10 w-14 h-14 text-mustard-dark rotate-[-8deg]" />
        <Doodle variant="cube" className="hidden sm:block absolute -top-4 -right-10 w-14 h-14 text-terracotta rotate-6" />
        <h1 className="font-display text-5xl font-semibold text-espresso mb-3">Ana Oliveira</h1>
        <p className="text-xl text-terracotta-dark font-medium mb-6">Associate Software Engineer</p>
        <p className="text-lg text-espresso-light leading-relaxed">
          Passionate learner with a background in mentoring, leading, and teaching.
          Software engineer with strong Python and backend expertise, specializing in
          performance testing, GCP, and AI integrations.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-full bg-terracotta text-cream font-medium shadow-warm hover:bg-terracotta-dark transition-colors"
          >
            Read the blog
          </Link>
          <Link
            href="/rubiks"
            className="px-5 py-2.5 rounded-full border-2 border-sage text-sage-dark font-medium hover:bg-sage/10 transition-colors"
          >
            Try the cube trainer
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-2xl font-semibold text-espresso mb-6 flex items-center gap-2">
          <Doodle variant="whisk" className="w-6 h-6 text-sage-dark" />
          Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 rounded-full bg-cream-deep border border-clay-line text-espresso text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-2xl font-semibold text-espresso mb-6 flex items-center gap-2">
          <Doodle variant="bowl" className="w-6 h-6 text-terracotta" />
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map(({ frontmatter }) => (
            <div key={frontmatter.slug} className="p-6 rounded-2xl bg-cream-deep border border-clay-line shadow-warm">
              <h3 className="font-display text-xl font-semibold text-espresso mb-2">{frontmatter.title}</h3>
              <p className="text-espresso-light mb-4">{frontmatter.summary}</p>
              <Link href={`/projects/${frontmatter.slug}`} className="text-sage-dark font-medium hover:text-terracotta-dark hover:underline">
                View project →
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/projects" className="text-sm text-espresso-light hover:text-terracotta-dark hover:underline">
            See all projects →
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-espresso mb-6 flex items-center gap-2">
          <Doodle variant="steam" className="w-6 h-6 text-mustard-dark" />
          Latest Posts
        </h2>
        <div className="space-y-4">
          {latestPosts.map(({ frontmatter }) => (
            <article key={frontmatter.slug} className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
              <h3 className="font-display text-lg font-semibold mb-1">
                <Link href={`/blog/${frontmatter.slug}`} className="text-espresso hover:text-terracotta-dark">
                  {frontmatter.title}
                </Link>
              </h3>
              <p className="text-espresso-light text-sm mb-2">{frontmatter.excerpt}</p>
              <time className="text-xs text-espresso-light/70">{frontmatter.date}</time>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
