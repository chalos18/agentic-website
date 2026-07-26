import type { PuzzleId } from '@/services/puzzles/definitions';

interface PuzzleGlyphProps {
    puzzle: PuzzleId;
    className?: string;
}

/** Face-on outline of each puzzle, showing how its front face is cut. */
export default function PuzzleGlyph({ puzzle, className = 'w-5 h-5' }: PuzzleGlyphProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {glyph(puzzle)}
        </svg>
    );
}

function grid(n: number) {
    const lines = [];
    for (let i = 1; i < n; i++) {
        const t = 3 + (18 / n) * i;
        lines.push(<path key={`v${i}`} d={`M${t} 3 L${t} 21`} />, <path key={`h${i}`} d={`M3 ${t} L21 ${t}`} />);
    }
    return (
        <>
            <rect x="3" y="3" width="18" height="18" rx="2.5" />
            {lines}
        </>
    );
}

function glyph(puzzle: PuzzleId) {
    switch (puzzle) {
        case '2x2':
            return grid(2);
        case '3x3':
            return grid(3);
        case '4x4':
            return grid(4);
        case '5x5':
            return grid(5);
        case 'pyraminx':
            return (
                <>
                    <path d="M12 3 L21.5 20 L2.5 20 Z" />
                    <path d="M8.8 14.3 L15.2 14.3" />
                    <path d="M5.7 20 L12 8.7 L18.3 20" />
                </>
            );
        case 'skewb':
            return (
                <>
                    <rect x="3" y="3" width="18" height="18" rx="2.5" />
                    <path d="M12 3 L21 12 L12 21 L3 12 Z" />
                </>
            );
        case 'megaminx':
            return (
                <>
                    <path d="M12 2.5 L21.5 9.4 L17.9 20.6 L6.1 20.6 L2.5 9.4 Z" />
                    <path d="M12 8 L16.4 11.2 L14.7 16.4 L9.3 16.4 L7.6 11.2 Z" />
                </>
            );
        case 'mastermorphix':
            // A tetrahedron cut by a cube's grid rather than a pyraminx's own axes —
            // the off-centre lines are what make its pieces morph shape each turn.
            return (
                <>
                    <path d="M12 3 L21.5 20 L2.5 20 Z" />
                    <path d="M9.5 11.5 L16.5 10.3" />
                    <path d="M6.7 15.8 L18.4 14.2" />
                    <path d="M10.6 20 L13.2 10.6" />
                </>
            );
        case 'ivy':
            // A cube face split into two arc-shaped corner pieces plus a leaf-shaped
            // centre — the Ivy Cube's actual piece layout, distinct from Skewb's.
            return (
                <>
                    <rect x="3" y="3" width="18" height="18" rx="2.5" />
                    <path d="M3 8 A9 9 0 0 0 8 3" />
                    <path d="M21 16 A9 9 0 0 0 16 21" />
                    <path d="M12 7.5 C14.5 9 15 11 15 12 C15 13 14.5 15 12 16.5 C9.5 15 9 13 9 12 C9 11 9.5 9 12 7.5 Z" />
                </>
            );
    }
}
