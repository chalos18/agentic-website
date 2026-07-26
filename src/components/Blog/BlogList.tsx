'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Doodle from '@/components/motifs/Doodle';
import type { PostFrontmatter } from '@/lib/content';

export default function BlogList({ posts }: { posts: { frontmatter: PostFrontmatter }[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(({ frontmatter }) =>
      [frontmatter.title, frontmatter.excerpt, ...(frontmatter.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [posts, query]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-8 flex items-center gap-3">
        <Doodle variant="burger" className="w-8 h-8 text-sage-dark" />
        Blog
      </h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts…"
        className="w-full mb-6 p-3 bg-cream-deep text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
      />

      <div className="space-y-5">
        {filtered.map(({ frontmatter }) => (
          <article key={frontmatter.slug} className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
            <h2 className="font-display text-xl font-semibold mb-1">
              <Link href={`/blog/${frontmatter.slug}`} className="text-espresso hover:text-terracotta-dark">
                {frontmatter.title}
              </Link>
            </h2>
            <p className="text-espresso-light text-sm mb-2">{frontmatter.excerpt}</p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-espresso-light/70">{frontmatter.date}</time>
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {frontmatter.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-sage/15 text-sage-dark text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="text-sm text-espresso-light/70">No posts match your search.</p>}
      </div>
    </div>
  );
}
