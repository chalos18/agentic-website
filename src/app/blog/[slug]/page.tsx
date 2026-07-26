import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllBlogPosts, getPostBySlug } from '@/lib/content';

export function generateStaticParams() {
  return getAllBlogPosts().map(({ frontmatter }) => ({ slug: frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post?.frontmatter.title ?? 'Post' };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.frontmatter.category === 'recipe') notFound();

  const { frontmatter, content } = post;

  return (
    <article className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-espresso mb-2">{frontmatter.title}</h1>
        <time className="text-sm text-espresso-light/70">{frontmatter.date}</time>
      </header>

      <div className="prose-warm">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
