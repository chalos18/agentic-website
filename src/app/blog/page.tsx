import Link from 'next/link';
import Doodle from '@/components/motifs/Doodle';
import { getAllPosts } from '@/lib/content';

export const metadata = { title: 'Blog' };

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-8 flex items-center gap-3">
        <Doodle variant="burger" className="w-8 h-8 text-sage-dark" />
        Blog & Recipes
      </h1>

      <div className="space-y-5">
        {posts.map(({ frontmatter }) => (
          <article key={frontmatter.slug} className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-xl font-semibold">
                <Link href={`/blog/${frontmatter.slug}`} className="text-espresso hover:text-terracotta-dark">
                  {frontmatter.title}
                </Link>
              </h2>
              {frontmatter.category === 'recipe' && (
                <span className="px-2 py-0.5 rounded-full bg-mustard/20 text-mustard-dark text-xs font-semibold">
                  recipe
                </span>
              )}
            </div>
            <p className="text-espresso-light text-sm mb-2">{frontmatter.excerpt}</p>
            <time className="text-xs text-espresso-light/70">{frontmatter.date}</time>
          </article>
        ))}
      </div>
    </div>
  )
}
