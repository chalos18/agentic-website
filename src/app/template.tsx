'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Doodle, { DoodleVariant } from '@/components/motifs/Doodle';

function motifFor(pathname: string): { variant: DoodleVariant; color: string } {
  if (pathname.startsWith('/rubiks')) return { variant: 'cube', color: 'text-terracotta' };
  if (pathname.startsWith('/blog')) return { variant: 'whisk', color: 'text-sage-dark' };
  if (pathname.startsWith('/projects')) return { variant: 'bowl', color: 'text-terracotta' };
  if (pathname.startsWith('/about')) return { variant: 'cherry', color: 'text-mustard-dark' };
  if (pathname.startsWith('/contact')) return { variant: 'steam', color: 'text-sage-dark' };
  return { variant: 'steam', color: 'text-terracotta' };
}

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { variant, color } = motifFor(pathname);

  return (
    <div className="relative">
      <motion.div
        key={`${pathname}-stamp`}
        className={`pointer-events-none absolute -top-2 left-4 z-10 ${color}`}
        initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 0.85], rotate: [-18, 4, 0, 0] }}
        transition={{ duration: 1.1, times: [0, 0.3, 0.55, 1], ease: 'easeOut' }}
      >
        <Doodle variant={variant} className="w-10 h-10" />
      </motion.div>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
