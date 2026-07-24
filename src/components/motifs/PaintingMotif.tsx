import type { ReactNode } from 'react';

export type PaintingMotifVariant =
  | 'dragonball'
  | 'bully'
  | 'deathstar'
  | 'leagueoflegends'
  | 'lukeskywalker'
  | 'jojo';

interface PaintingMotifProps {
  variant: PaintingMotifVariant;
  className?: string;
}

const PATHS: Record<PaintingMotifVariant, ReactNode> = {
  dragonball: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M18 20 L18.5 20" />
      <path d="M22 16 L22.5 16" />
      <path d="M26 16 L26.5 16" />
      <path d="M30 20 L30.5 20" />
      <path d="M24 24 L24.5 24" />
    </>
  ),
  bully: (
    <>
      <path d="M10 22 C10 15 15 13 24 13 C33 13 38 15 38 22 L40 33 C40 37 37 38 35 36 L30 31 L18 31 L13 36 C11 38 8 37 8 33 Z" />
      <path d="M15 22 L15 26" />
      <path d="M13 24 L17 24" />
      <circle cx="29" cy="22" r="1.4" />
      <circle cx="33" cy="26" r="1.4" />
    </>
  ),
  deathstar: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 22 C12 24 15 24 20 21 C25 18 25 13 22 8" />
      <circle cx="20" cy="17" r="4" />
    </>
  ),
  leagueoflegends: (
    <>
      <path d="M10 10 L30 30" />
      <path d="M38 10 L18 30" />
      <path d="M24 26 C24 32 20 36 24 42 C28 36 24 32 24 26 Z" />
    </>
  ),
  lukeskywalker: (
    <>
      <path d="M24 4 L24 30" />
      <path d="M18 8 L18 4" />
      <path d="M30 8 L30 4" />
      <path d="M17 8 L31 8" />
      <path d="M20 30 C20 36 18 38 18 42" />
      <path d="M28 30 C28 36 30 38 30 42" />
    </>
  ),
  jojo: (
    <>
      <path d="M24 4 L24 16" />
      <path d="M24 32 L24 44" />
      <path d="M4 24 L16 24" />
      <path d="M32 24 L44 24" />
      <path d="M10 10 L18 18" />
      <path d="M30 30 L38 38" />
      <path d="M38 10 L30 18" />
      <path d="M18 30 L10 38" />
      <circle cx="24" cy="24" r="5" />
    </>
  ),
};

export default function PaintingMotif({ variant, className = 'w-8 h-8' }: PaintingMotifProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[variant]}
    </svg>
  );
}
