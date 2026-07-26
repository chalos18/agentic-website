import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PaintingImage from '@/components/Painting/PaintingImage';
import PaintingProcessFilmstrip from '@/components/Painting/PaintingProcessFilmstrip';
import PaintingMotif, { PaintingMotifVariant } from '@/components/motifs/PaintingMotif';
import { getAllPaintings, getPaintingBySlug, paintingAssetExists, paintingGivenToLabel } from '@/lib/content';

export function generateStaticParams() {
  return getAllPaintings().map(({ frontmatter }) => ({ slug: frontmatter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = getPaintingBySlug(slug);
  return { title: painting?.frontmatter.name ?? 'Painting' };
}

export default async function PaintingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = getPaintingBySlug(slug);
  if (!painting) notFound();

  const { frontmatter, content } = painting;
  const motif = frontmatter.motif as PaintingMotifVariant;
  const heroExists = paintingAssetExists(frontmatter.image);
  const processExists = frontmatter.process?.map((src) => paintingAssetExists(src)) ?? [];

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="relative mb-6">
        <PaintingImage
          src={frontmatter.image}
          exists={heroExists}
          alt={frontmatter.name}
          name={frontmatter.name}
          motif={motif}
          className="h-[60vh] min-h-[420px] max-h-[720px] w-full aspect-auto"
          fit="contain"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        <span className="absolute -bottom-3 -right-3 rotate-6 bg-cream border border-clay-line rounded-full p-2.5 shadow-warm-lg">
          <PaintingMotif variant={motif} className="w-10 h-10 text-terracotta-dark" />
        </span>
      </div>

      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-espresso mb-2">{frontmatter.name}</h1>
        <p className="text-sm text-espresso-light/80">
          <time>{frontmatter.date}</time> · {paintingGivenToLabel(frontmatter.givenTo)}
        </p>
      </header>

      <div className="prose-warm">
        <MDXRemote source={content} />
      </div>

      {frontmatter.process && frontmatter.process.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-espresso mb-4">Process</h2>
          <PaintingProcessFilmstrip
            images={frontmatter.process}
            existsFlags={processExists}
            name={frontmatter.name}
            motif={motif}
          />
        </section>
      )}
    </article>
  );
}
