'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import PaintingImage from '@/components/Painting/PaintingImage';
import { PaintingMotifVariant } from '@/components/motifs/PaintingMotif';

interface PaintingProcessFilmstripProps {
  images: string[];
  existsFlags: boolean[];
  name: string;
  motif: PaintingMotifVariant;
}

function stageLabel(src: string, index: number): string {
  const filename = src.split('/').pop() ?? '';
  const withoutExt = filename.replace(/\.[a-z0-9]+$/i, '');
  const label = withoutExt.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ');
  return label ? label.replace(/\b\w/g, (c) => c.toUpperCase()) : `Stage ${index + 1}`;
}

export default function PaintingProcessFilmstrip({ images, existsFlags, name, motif }: PaintingProcessFilmstripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    scrollerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div ref={scrollerRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth">
        {images.map((src, i) => (
          <div key={src} className="snap-center shrink-0 w-56">
            <PaintingImage
              src={src}
              exists={existsFlags[i]}
              name={stageLabel(src, i)}
              alt={`${name} process — ${stageLabel(src, i)}`}
              motif={motif}
              className="aspect-square"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => scrollBy(-264)}
          className="w-8 h-8 rounded-full border border-clay-line bg-cream-deep text-espresso hover:bg-terracotta-light/20 transition-colors"
          aria-label="Scroll process left"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollBy(264)}
          className="w-8 h-8 rounded-full border border-clay-line bg-cream-deep text-espresso hover:bg-terracotta-light/20 transition-colors"
          aria-label="Scroll process right"
        >
          ›
        </button>
      </div>
    </motion.div>
  );
}
