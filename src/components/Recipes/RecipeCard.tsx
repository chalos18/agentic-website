import Link from 'next/link';
import Image from 'next/image';
import type { PostFrontmatter } from '@/lib/content';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  dessert: 'Dessert',
  snack: 'Snack',
};

export default function RecipeCard({ frontmatter }: { frontmatter: PostFrontmatter }) {
  return (
    <article className="rounded-2xl bg-cream-deep border border-clay-line overflow-hidden">
      {frontmatter.image ? (
        <div className="relative aspect-[4/3] w-full">
          <Image src={frontmatter.image} alt={frontmatter.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="font-display text-xl font-semibold">
            <Link href={`/recipes/${frontmatter.slug}`} className="text-espresso hover:text-terracotta-dark">
              {frontmatter.title}
            </Link>
          </h2>
          {frontmatter.mealType && (
            <span className="px-2 py-0.5 rounded-full bg-mustard/20 text-mustard-dark text-xs font-semibold">
              {MEAL_LABELS[frontmatter.mealType] ?? frontmatter.mealType}
            </span>
          )}
        </div>
        <p className="text-espresso-light text-sm mb-2">{frontmatter.excerpt}</p>
        <time className="text-xs text-espresso-light/70">{frontmatter.date}</time>
      </div>
    </article>
  );
}
