interface LogoProps {
  className?: string;
}

/**
 * Signature mark: the cube trainer (terracotta outline) anchors the mark, with
 * a curl of steam (mustard, kitchen/blog side) and a brushstroke-and-dot
 * (sage, paintings) both resting on its top face — the site's three content
 * pillars in one glyph. Keep this in sync with `src/app/icon.svg`.
 */
export default function Logo({ className = 'w-9 h-9' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22 26 C18 20 22 16 20 10"
        stroke="#E3A73B"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path
        d="M28 13 C32 10.5 36 11.5 37.5 15"
        stroke="#7C9473"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx="38.5" cy="16.5" r="1.8" fill="#7C9473" />
      <path
        d="M10 18 L24 25 L38 18"
        stroke="#C1603E"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 8 L40 16 L40 32 L24 40 L8 32 L8 16 Z"
        stroke="#C1603E"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 25 L24 40"
        stroke="#C1603E"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
