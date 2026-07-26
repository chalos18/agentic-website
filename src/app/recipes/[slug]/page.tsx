import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Doodle from '@/components/motifs/Doodle';
import CommentSection from '@/components/Recipes/CommentSection';
import { getAllRecipes, getRecipeBySlug } from '@/lib/content';

export function generateStaticParams() {
  return getAllRecipes().map(({ frontmatter }) => ({ slug: frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  return { title: recipe?.frontmatter.title ?? 'Recipe' };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  const { frontmatter, content } = recipe;

  return (
    <article className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-8">
        <Doodle variant="burger" className="w-9 h-9 text-mustard-dark mb-3" />
        <h1 className="font-display text-4xl font-semibold text-espresso mb-2">{frontmatter.title}</h1>
        <time className="text-sm text-espresso-light/70">{frontmatter.date}</time>
        {frontmatter.requestedBy && (
          <p className="text-sm text-terracotta-dark mt-2">
            Requested by {frontmatter.requestedBy} — thanks for the tip!
          </p>
        )}
      </header>

      {frontmatter.image && (
        <div className="relative aspect-[4/3] w-full mb-8 rounded-2xl overflow-hidden">
          <Image src={frontmatter.image} alt={frontmatter.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      {frontmatter.ingredients && frontmatter.steps && (
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
            <h2 className="font-display text-lg font-semibold text-terracotta-dark mb-3">Ingredients</h2>
            <ul className="space-y-1.5 text-sm text-espresso">
              {frontmatter.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex gap-2">
                  <span className="text-sage-dark">•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-cream-deep border border-clay-line">
            <h2 className="font-display text-lg font-semibold text-terracotta-dark mb-3">Steps</h2>
            <ol className="space-y-2 text-sm text-espresso list-decimal list-inside">
              {frontmatter.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="prose-warm">
        <MDXRemote source={content} />
      </div>

      <CommentSection slug={frontmatter.slug} />
    </article>
  );
}
