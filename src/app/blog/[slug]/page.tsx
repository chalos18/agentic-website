import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Doodle from '@/components/motifs/Doodle';
import { getAllPosts, getPostBySlug } from '@/lib/content';

export function generateStaticParams() {
  return getAllPosts().map(({ frontmatter }) => ({ slug: frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post?.frontmatter.title ?? 'Post' };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const isRecipe = frontmatter.category === 'recipe';

  return (
    <article className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-8">
        {isRecipe && <Doodle variant="burger" className="w-9 h-9 text-mustard-dark mb-3" />}
        <h1 className="font-display text-4xl font-semibold text-espresso mb-2">{frontmatter.title}</h1>
        <time className="text-sm text-espresso-light/70">{frontmatter.date}</time>
      </header>

      {isRecipe && frontmatter.ingredients && frontmatter.steps && (
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
    </article>
  )
}
