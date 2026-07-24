import Doodle from '@/components/motifs/Doodle';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-clay-line bg-cream-deep/60">
      <div className="container mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-espresso-light">
          <Doodle variant="cherry" className="w-5 h-5 text-terracotta" />
          <span>One cube turn and one burger at a time.</span>
        </div>

        <a
          href="https://www.linkedin.com/in/-ana-oliveira-/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-dark hover:text-terracotta-dark transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
          </svg>
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
