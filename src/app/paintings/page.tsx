import Doodle from '@/components/motifs/Doodle';
import PaintingCard from '@/components/Painting/PaintingCard';
import { getAllPaintings } from '@/lib/content';

export const metadata = { title: 'Paintings' };

export default function PaintingsPage() {
  const paintings = getAllPaintings();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="font-display text-4xl font-semibold text-espresso mb-2 flex items-center gap-3">
        <Doodle variant="paintbrush" className="w-8 h-8 text-terracotta" />
        Paintings
      </h1>
      <p className="text-espresso-light mb-10 max-w-xl">
        A scrapbook of paintings I&apos;ve made over the years — who they went to, and for a few, how they came together.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {paintings.map(({ frontmatter }, index) => (
          <PaintingCard key={frontmatter.slug} frontmatter={frontmatter} index={index} />
        ))}
      </div>
    </div>
  );
}
