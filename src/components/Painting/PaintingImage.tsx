import Image from 'next/image';
import PaintingMotif, { PaintingMotifVariant } from '@/components/motifs/PaintingMotif';

interface PaintingImageProps {
  src?: string;
  exists: boolean;
  alt: string;
  name: string;
  motif: PaintingMotifVariant;
  className?: string;
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

export default function PaintingImage({ src, exists, alt, name, motif, className = 'aspect-[4/3]' }: PaintingImageProps) {
  if (exists && src) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
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
