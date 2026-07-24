'use client';

import { useCallback, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';

interface SkillsBowlProps {
  skills: string[];
}

interface Letter {
  id: string;
  char: string;
  baseXPct: number;
  baseYPct: number;
  rotation: number;
  color: string;
}

const LETTER_COLORS = ['text-terracotta-dark', 'text-sage-dark', 'text-mustard-dark', 'text-espresso'];

// Golden-angle spiral gives each skill's letter-cluster an even, non-overlapping
// anchor point around the bowl without relying on non-deterministic randomness
// (which would cause a server/client hydration mismatch).
const MIN_RADIUS = 9;
const MAX_RADIUS = 42;

function buildLetters(skills: string[]): Letter[] {
  const letters: Letter[] = [];
  const goldenAngle = 137.508;
  const radiusStep = skills.length > 1 ? (MAX_RADIUS - MIN_RADIUS) / (skills.length - 1) : 0;

  skills.forEach((skill, skillIndex) => {
    const angle = (skillIndex * goldenAngle * Math.PI) / 180;
    const radius = MIN_RADIUS + skillIndex * radiusStep;
    const cx = 50 + Math.cos(angle) * radius * 0.85;
    const cy = 50 + Math.sin(angle) * radius * 0.48;

    const chars = skill.split('').filter((char) => char !== ' ');
    chars.forEach((char, charIndex) => {
      const spread = (charIndex - (chars.length - 1) / 2) * 3.3;
      const wave = Math.sin(charIndex * 1.4 + skillIndex) * 2;
      letters.push({
        id: `${skillIndex}-${charIndex}`,
        char,
        baseXPct: Math.min(91, Math.max(9, cx + spread)),
        baseYPct: Math.min(80, Math.max(24, cy + wave)),
        rotation: Math.round(Math.sin(charIndex * 2 + skillIndex) * 14),
        color: LETTER_COLORS[(skillIndex + charIndex) % LETTER_COLORS.length],
      });
    });
  });

  return letters;
}

const RADIUS_PX = 110;
const MAX_PUSH_PX = 46;

export default function SkillsBowl({ skills }: SkillsBowlProps) {
  const letters = useMemo(() => buildLetters(skills), [skills]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setMouse({ x: offsetX, y: offsetY });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setMouse(null);
  }, []);

  const width = containerRef.current?.clientWidth ?? 0;
  const height = containerRef.current?.clientHeight ?? 0;

  return (
    <div className="relative w-full select-none">
      <span className="sr-only">Skills: {skills.join(', ')}</span>

      {/* Width-driven with a height cap (not a fixed height) so aspect-[5/3]
          never forces the box wider than its container on narrow screens.
          The SVG uses preserveAspectRatio="none" so it always fills this box
          exactly, keeping letter positions (0-100%) aligned with the bowl
          artwork even when the max-height clamp bends the ratio. */}
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[5/3] max-h-72 sm:max-h-96"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          viewBox="0 0 200 120"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full text-clay-line"
          aria-hidden="true"
        >
          <path d="M40 30 C36 22 42 16 38 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M100 26 C96 18 102 12 98 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M160 30 C156 22 162 16 158 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <ellipse cx="100" cy="66" rx="92" ry="40" fill="#FBF3E6" stroke="currentColor" strokeWidth="2.5" />
          <ellipse cx="100" cy="58" rx="80" ry="27" fill="#F3E2C7" stroke="none" />
          <path d="M14 60 C14 96 186 96 186 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 42 L16 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M172 42 L184 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>

        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          {letters.map((letter) => {
            let dxPx = 0;
            let dyPx = 0;

            if (mouse && width && height) {
              const letterX = (letter.baseXPct / 100) * width;
              const letterY = (letter.baseYPct / 100) * height;
              const distX = letterX - mouse.x;
              const distY = letterY - mouse.y;
              const dist = Math.sqrt(distX * distX + distY * distY) || 0.001;

              if (dist < RADIUS_PX) {
                const push = ((RADIUS_PX - dist) / RADIUS_PX) * MAX_PUSH_PX;
                dxPx = (distX / dist) * push;
                dyPx = (distY / dist) * push;
              }
            }

            return (
              <span
                key={letter.id}
                className={`absolute font-display font-bold text-base sm:text-lg pointer-events-none transition-transform duration-300 ease-out ${letter.color}`}
                style={{
                  left: `${letter.baseXPct}%`,
                  top: `${letter.baseYPct}%`,
                  transform: `translate(calc(-50% + ${dxPx}px), calc(-50% + ${dyPx}px)) rotate(${letter.rotation}deg)`,
                }}
              >
                {letter.char}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
