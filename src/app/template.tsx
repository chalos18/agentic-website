'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative">
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
