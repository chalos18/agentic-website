'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/motifs/Logo';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
  { href: '/rubiks', label: "Rubik's" },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-clay-line">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 transition-transform group-hover:-rotate-6" />
          <span className="font-display text-lg font-semibold text-espresso">Ana Oliveira</span>
        </Link>

        <nav>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`pb-0.5 border-b-2 transition-colors ${
                      isActive
                        ? 'border-terracotta text-terracotta-dark'
                        : 'border-transparent text-espresso-light hover:text-terracotta hover:border-terracotta-light'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
