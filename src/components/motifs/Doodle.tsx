import type { ReactNode } from 'react';

export type DoodleVariant = 'cube' | 'burger' | 'paintbrush' | 'bowl' | 'pan';

interface DoodleProps {
  variant: DoodleVariant;
  className?: string;
}

const PATHS: Record<DoodleVariant, ReactNode> = {
  cube: (
    <>
      {/* Outer isometric outline */}
      <path d="M24 6 L40 15 L40 33 L24 42 L8 33 L8 15 Z" />
      <path d="M8 15 L24 24 L40 15" />
      <path d="M24 24 L24 42" />
      {/* Top face 3x3 grid */}
      <path d="M13.33 12 L29.33 21" />
      <path d="M18.67 9 L34.67 18" />
      <path d="M29.33 9 L13.33 18" />
      <path d="M34.67 12 L18.67 21" />
      {/* Right face 3x3 grid */}
      <path d="M29.33 21 L29.33 39" />
      <path d="M34.67 18 L34.67 36" />
      <path d="M40 21 L24 30" />
      <path d="M40 27 L24 36" />
      {/* Left face 3x3 grid */}
      <path d="M18.67 21 L18.67 39" />
      <path d="M13.33 18 L13.33 36" />
      <path d="M8 21 L24 30" />
      <path d="M8 27 L24 36" />
    </>
  ),
  burger: (
    <>
      <path d="M7 21 C7 12 15 7 24 7 C33 7 41 12 41 21 Z" />
      <path d="M7 26 L41 26" />
      <path d="M7 31 L41 31" />
      <path d="M6 36 C6 40 9 41 14 41 L34 41 C39 41 42 40 42 36" />
    </>
  ),
  paintbrush: (
    <>
      <path d="M12 40 L26 26" />
      <path d="M24 24 L30 18" />
      <path d="M28 20 C25 13 29 7 36 7 C43 7 45 14 40 19 C36 23 31 22 28 20 Z" />
      <circle cx="11" cy="42" r="2" />
    </>
  ),
  bowl: (
    <>
      <path d="M8 20 C8 20 8 32 24 32 C40 32 40 20 40 20" />
      <path d="M6 20 L42 20" />
      <path d="M14 32 L18 40" />
      <path d="M34 32 L30 40" />
    </>
  ),
  pan: (
    <>
      <circle cx="20" cy="26" r="14" />
      <path d="M32 22 L44 14" />
      <path d="M30 17 L34 24" />
    </>
  ),
};

export default function Doodle({ variant, className = 'w-8 h-8' }: DoodleProps) {
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
