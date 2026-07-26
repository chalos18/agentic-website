'use client';

import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { LETTER_SIZE, clampToField, layOutSoup } from './soupLayout';

interface SkillsBowlProps {
    skills: string[];
}

const VIEW = { w: 260, h: 162 };
const BROTH = { cx: 130, cy: 74, rx: 106, ry: 34 };

/** How far the cursor reaches, and how hard it stirs, in SVG user units. */
const STIR_RADIUS = 46;
const STIR_PUSH = 13;
const STIR_SWIRL = 10;

const SKILL_COLORS = ['#A34E31', '#64785D', '#C68B27', '#3A2E28', '#C1603E'];

export default function SkillsBowl({ skills }: SkillsBowlProps) {
    const letters = useMemo(() => layOutSoup(skills), [skills]);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const [stir, setStir] = useState<{ x: number; y: number } | null>(null);

    const handlePointerMove = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        // The SVG keeps its viewBox aspect, so one scale factor covers both axes.
        const scale = VIEW.w / rect.width;
        const x = (event.clientX - rect.left) * scale;
        const y = (event.clientY - rect.top) * scale;

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => setStir({ x, y }));
    }, []);

    const handlePointerLeave = useCallback(() => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        setStir(null);
    }, []);

    return (
        <div className="w-full">
            <p className="sr-only">Skills floating in the soup: {skills.join(', ')}.</p>

            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
                className="w-full h-auto max-w-3xl mx-auto"
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id="soup-broth" cx="42%" cy="34%" r="78%">
                        <stop offset="0%" stopColor="#F7DFAB" />
                        <stop offset="70%" stopColor="#EDCD8E" />
                        <stop offset="100%" stopColor="#DFB870" />
                    </radialGradient>
                    <linearGradient id="soup-glaze" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFCF4" />
                        <stop offset="100%" stopColor="#F1E3CB" />
                    </linearGradient>
                </defs>

                <ellipse cx="130" cy="158" rx="78" ry="4" fill="#3A2E28" opacity="0.09" />

                <g stroke="#C9B392" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75">
                    <path d="M98 34 C90 26 102 18 94 8" />
                    <path d="M130 30 C122 22 134 14 126 4" />
                    <path d="M162 34 C154 26 166 18 158 8" />
                </g>

                {/* Bowl: outer wall, pedestal foot, then the rim it all hangs from. */}
                <path
                    d="M14 74 C14 122 66 148 130 148 C194 148 246 122 246 74"
                    fill="url(#soup-glaze)"
                    stroke="#CBB48F"
                    strokeWidth="2.5"
                />
                <path
                    d="M104 146 L104 155 C104 159.5 156 159.5 156 155 L156 146"
                    fill="url(#soup-glaze)"
                    stroke="#CBB48F"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                {/* The one piece of decoration: a terracotta band, like a diner bowl. */}
                <path
                    d="M18.5 92 C27 113 73 130 130 130 C187 130 233 113 241.5 92"
                    fill="none"
                    stroke="#C1603E"
                    strokeWidth="3"
                    opacity="0.32"
                />
                <ellipse cx="130" cy="74" rx="116" ry="38" fill="url(#soup-glaze)" stroke="#CBB48F" strokeWidth="2.5" />
                <ellipse
                    cx={BROTH.cx}
                    cy={BROTH.cy}
                    rx={BROTH.rx}
                    ry={BROTH.ry}
                    fill="url(#soup-broth)"
                    stroke="#CBB48F"
                    strokeWidth="1.5"
                />
                {/* Surface sheen, so the broth reads as liquid rather than a flat disc. */}
                <path
                    d="M66 54 C80 45 110 42 138 45"
                    fill="none"
                    stroke="#FFFDF6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.45"
                />

                <g fill="#7C9473" opacity="0.55">
                    <ellipse cx="48" cy="88" rx="3.2" ry="1.8" transform="rotate(-24 48 88)" />
                    <ellipse cx="212" cy="60" rx="3.2" ry="1.8" transform="rotate(18 212 60)" />
                    <ellipse cx="130" cy="102" rx="3.2" ry="1.8" transform="rotate(-8 130 102)" />
                </g>

                <g className="font-display" fontWeight="700" fontSize={LETTER_SIZE} textAnchor="middle">
                    {letters.map((letter, i) => {
                        let dx = 0;
                        let dy = 0;

                        if (stir) {
                            const offX = letter.x - stir.x;
                            const offY = letter.y - stir.y;
                            const dist = Math.hypot(offX, offY) || 0.001;
                            if (dist < STIR_RADIUS) {
                                const force = 1 - dist / STIR_RADIUS;
                                // Push away from the spoon and carry the letter around
                                // it — the swirl is what reads as stirring.
                                const [px, py] = clampToField(
                                    letter.x + (offX / dist) * force * STIR_PUSH - (offY / dist) * force * STIR_SWIRL,
                                    letter.y + (offY / dist) * force * STIR_PUSH + (offX / dist) * force * STIR_SWIRL,
                                );
                                dx = px - letter.x;
                                dy = py - letter.y;
                            }
                        }

                        return (
                            <g
                                key={letter.id}
                                style={{
                                    transform: `translate(${dx}px, ${dy}px)`,
                                    transition: 'transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1)',
                                }}
                            >
                                <g
                                    className="soup-bob"
                                    style={{ animationDelay: `${(i % 12) * 0.42 + letter.skillIndex * 0.2}s` }}
                                >
                                    <text
                                        x={letter.x}
                                        y={letter.y}
                                        dominantBaseline="central"
                                        fill={SKILL_COLORS[letter.skillIndex % SKILL_COLORS.length]}
                                        transform={`rotate(${letter.rotation.toFixed(1)} ${letter.x.toFixed(2)} ${letter.y.toFixed(2)})`}
                                    >
                                        {letter.char}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}
