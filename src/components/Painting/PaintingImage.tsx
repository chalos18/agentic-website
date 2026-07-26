import Image from 'next/image';
import PaintingMotif, { PaintingMotifVariant } from '@/components/motifs/PaintingMotif';

interface PaintingImageProps {
  src?: string;
  exists: boolean;
  alt: string;
  name: string;
  motif: PaintingMotifVariant;
  className?: string;
  fit?: 'cover' | 'contain';
  sizes?: string;
}

const PLACEHOLDER_GRADIENTS = [
  'from-terracotta-light/50 via-cream-deep to-sage-light/40',
  'from-sage-light/50 via-cream-deep to-mustard-light/40',
  'from-mustard-light/50 via-cream-deep to-terracotta-light/40',
];

// Deterministic pick so the same painting always renders the same placeholder look.
function gradientFor(name: string): string {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}

export default function PaintingImage({
  src,
  exists,
  alt,
  name,
  motif,
  className = 'aspect-[4/3]',
  fit = 'cover',
  sizes = '(max-width: 768px) 100vw, 33vw',
}: PaintingImageProps) {
  if (exists && src) {
    // Full paintings vary wildly in aspect ratio (square, portrait, landscape),
    // so `contain` keeps the whole canvas visible instead of cropping into it.
    const isContain = fit === 'contain';
    return (
      <div
        className={`relative overflow-hidden rounded-xl ${isContain ? 'bg-cream-deep' : ''} ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={isContain ? 'object-contain' : 'object-cover'}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientFor(name)} border border-clay-line flex items-center justify-center ${className}`}
    >
      <PaintingMotif variant={motif} className="w-1/2 h-1/2 text-espresso/20" />
      <span className="absolute bottom-2 left-2 right-2 font-display text-sm text-espresso/70 truncate">{name}</span>
    </div>
  );
}
