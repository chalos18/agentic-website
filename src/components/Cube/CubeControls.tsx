/**
 * CubeControls Component
 * UI controls for cube manipulation
 */

'use client';

import { MoveNotation } from '@/types/cube';

interface CubeControlsProps {
    onScramble: () => void;
    onReset: () => void;
    onUndo: () => void;
    onMove?: (move: MoveNotation) => void;
    canUndo: boolean;
}

export default function CubeControls({
    onScramble,
    onReset,
    onUndo,
    onMove,
    canUndo,
}: CubeControlsProps) {
    const buttonClass =
        'w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 ' +
        'border border-transparent active:scale-95';

    return (
        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line space-y-4">
            <h2 className="text-lg font-bold text-espresso mb-4">Controls</h2>

            <button
                onClick={onScramble}
                className={`${buttonClass} bg-terracotta hover:bg-terracotta-dark text-cream`}
            >
                🔀 Scramble
            </button>

            <button
                onClick={onReset}
                className={`${buttonClass} bg-sage hover:bg-sage-dark text-cream`}
            >
                ↻ Reset
            </button>

            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`${buttonClass} ${canUndo
                    ? 'bg-mustard hover:bg-mustard-dark text-espresso'
                    : 'bg-clay-line text-espresso-light/50 cursor-not-allowed'
                    }`}
            >
                ↶ Undo
            </button>

            <div className="pt-4 border-t border-clay-line">
                <p className="text-xs text-espresso-light text-center">
                    💡 Tip: Click and drag to rotate the cube
                </p>
            </div>

            <div className="pt-4 border-t border-clay-line space-y-3">
                <p className="text-sm text-espresso font-semibold">Manual Layer Moves</p>
                <div className="grid grid-cols-4 gap-2">
                    {['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"].map((move) => (
                        <button
                            key={move}
                            onClick={() => onMove?.(move as MoveNotation)}
                            className="px-3 py-2 bg-cream border border-clay-line hover:border-terracotta hover:text-terracotta-dark text-espresso rounded-lg text-sm transition-colors"
                        >
                            {move}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
