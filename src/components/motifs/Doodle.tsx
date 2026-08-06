import type { ReactNode } from "react";

export type DoodleVariant =
  | "cube"
  | "bowl"
  | "pan"
  | "fork"
  | "skewer"
  | "cake"
  | "burger"
  | "paintbrush"
  | "pin";

interface DoodleProps {
  variant: DoodleVariant;
  className?: string;
}

const PATHS: Record<DoodleVariant, ReactNode> = {
  cube: (
    <>
      {/* Isometric shell */}
      <path d="M24 6 L40 15 L40 33 L24 42 L8 33 L8 15 Z" />
      <path d="M8 15 L24 24 L40 15" />
      <path d="M24 24 L24 42" />
      {/* One cut line per direction — a full 3x3 grid turns to mush at 24px. */}
      <path d="M13.3 12 L29.3 21" />
      <path d="M34.7 12 L18.7 21" />
      <path d="M29.3 21 L29.3 39" />
      <path d="M18.7 21 L18.7 39" />
      <path d="M40 21 L24 30" />
      <path d="M8 21 L24 30" />
    </>
  ),
  bowl: (
    <>
      {/* Rim, the body hanging off it, then a pedestal foot. */}
      <ellipse cx="24" cy="21" rx="16" ry="5" />
      <path d="M8 21 C8 33 15 39 24 39 C33 39 40 33 40 21" />
      <path d="M17 38.5 L17 41 C17 42.6 31 42.6 31 41 L31 38.5" />
      <path d="M19 13 C16.5 10 20 8 18 5" />
      <path d="M29 13 C26.5 10 30 8 28 5" />
    </>
  ),
  pan: (
    <>
      {/* Skillet from three-quarters: rim, well, riveted handle. */}
      <ellipse cx="19" cy="29" rx="13" ry="8.5" />
      <ellipse cx="19" cy="29" rx="8.5" ry="5" />
      <path d="M31.4 26.3 C36 24 39.5 20.5 42 16" />
      <path d="M29.8 24 L33 27" />
      <path d="M14 17 C11.5 13.5 15 11 13 7.5" />
      <path d="M24 16 C21.5 12.5 25 10 23 6.5" />
    </>
  ),
  fork: (
    <>
      <path d="M16 6 L16 17" />
      <path d="M24 6 L24 17" />
      <path d="M32 6 L32 17" />
      {/* Both shoulders sweep down into a single handle. */}
      <path d="M14 17 C14 22 21 23 22 27 L22 42" />
      <path d="M34 17 C34 22 27 23 26 27 L26 42" />
    </>
  ),
  skewer: (
    <>
      <path d="M6 42 L42 6" />
      <circle cx="16.1" cy="31.9" r="4.2" />
      <path d="M24 19.5 L28.5 24 L24 28.5 L19.5 24 Z" />
      <circle cx="31.9" cy="16.1" r="4.2" />
    </>
  ),
  cake: (
    <>
      <path d="M6 41 L42 41" />
      <path d="M12 41 L12 23" />
      <path d="M36 41 L36 23" />
      <ellipse cx="24" cy="23" rx="12" ry="4" />
      <path d="M12 31 C12 27.5 36 27.5 36 31" />
      <path d="M24 21 L24 13" />
      <path d="M24 13 C21.5 10.5 24 8 24 6.5 C24 8 26.5 10.5 24 13 Z" />
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
  pin: (
    <>
      {/* Rounded map-pin body with a hollow center, tapering to a point. */}
      <path d="M24 6 C33 6 40 13 40 22 C40 33 24 44 24 44 C24 44 8 33 8 22 C8 13 15 6 24 6 Z" />
      <circle cx="24" cy="21" r="6" />
    </>
  ),
};

export default function Doodle({
  variant,
  className = "w-8 h-8",
}: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[variant]}
    </svg>
  );
}
