import Doodle from '@/components/motifs/Doodle';

export const metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">
      <Doodle variant="steam" className="w-12 h-12 text-mustard-dark mx-auto mb-4" />
      <h1 className="font-display text-4xl font-semibold text-espresso mb-4">Say hello</h1>
      <p className="text-espresso-light mb-8">
        The easiest way to reach me is LinkedIn — happy to hear from you.
      </p>
      <a
        href="https://www.linkedin.com/in/-ana-oliveira-/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-cream font-medium shadow-warm hover:bg-sage-dark transition-colors"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
        </svg>
        Connect on LinkedIn
      </a>
    </div>
  );
}
