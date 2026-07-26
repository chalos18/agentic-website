'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import type { MealType, PostFrontmatter } from '@/lib/content';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'];

export default function RecipeList({ posts }: { posts: { frontmatter: PostFrontmatter }[] }) {
  const [query, setQuery] = useState('');
  const [meal, setMeal] = useState<MealType | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(({ frontmatter }) => {
      if (meal !== 'all' && frontmatter.mealType !== meal) return false;
      if (!q) return true;
      return [frontmatter.title, frontmatter.excerpt, ...(frontmatter.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [posts, query, meal]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes…"
          className="flex-1 p-3 bg-cream-deep text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
        />
        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value as MealType | 'all')}
          className="p-3 bg-cream-deep text-espresso text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none"
        >
          <option value="all">All meals</option>
          {MEAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type[0].toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-espresso-light mb-6">
        Got a recipe to recommend?{' '}
        <Link href="/recipes/requests" className="text-terracotta-dark hover:underline font-medium">
          Add it to the public request board →
        </Link>
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map(({ frontmatter }) => (
          <RecipeCard key={frontmatter.slug} frontmatter={frontmatter} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-espresso-light/70">No recipes match your filters.</p>}
    </div>
  );
}
