import Link from 'next/link';
import PaintingImage from '@/components/Painting/PaintingImage';
import PaintingMotif, { PaintingMotifVariant } from '@/components/motifs/PaintingMotif';
import { paintingAssetExists, paintingGivenToLabel, PaintingFrontmatter } from '@/lib/content';

interface PaintingCardProps {
  frontmatter: PaintingFrontmatter;
  index: number;
}

const ROTATIONS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-3', '-rotate-3', 'rotate-1'] as const;

export default function PaintingCard({ frontmatter, index }: PaintingCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const aspect = index % 3 === 0 ? 'aspect-square' : 'aspect-[3/4]';
  const motif = frontmatter.motif as PaintingMotifVariant;

  return (
    <Link
      href={`/paintings/${frontmatter.slug}`}
      className={`relative block bg-cream-deep border border-clay-line rounded-2xl p-3 shadow-warm ${rotation} hover:rotate-0 transition-transform`}
    >
      {index % 2 === 0 ? (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-12 -rotate-3 bg-mustard/70 shadow-warm rounded-sm" aria-hidden="true" />
      ) : (
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-terracotta shadow-warm" aria-hidden="true" />
      )}

      <PaintingImage
        src={frontmatter.image}
        exists={paintingAssetExists(frontmatter.image)}
        alt={frontmatter.name}
        name={frontmatter.name}
        motif={motif}
        className={aspect}
      />

      <div className="mt-3">
        <h3 className="font-display text-lg font-semibold text-espresso">{frontmatter.name}</h3>
        <p className="text-sm text-espresso-light/80">
          <time>{frontmatter.date}</time> · {paintingGivenToLabel(frontmatter.givenTo)}
        </p>
      </div>

      <span className="absolute -bottom-2 -right-2 rotate-6 bg-cream border border-clay-line rounded-full p-1.5 shadow-warm">
        <PaintingMotif variant={motif} className="w-6 h-6 text-terracotta-dark" />
      </span>
    </Link>
  );
}
