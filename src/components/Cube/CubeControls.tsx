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
        'w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ' +
        'border border-gray-600 hover:border-gray-500 active:scale-95';

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Controls</h2>

            <button
                onClick={onScramble}
                className={`${buttonClass} bg-purple-600 hover:bg-purple-500 text-white`}
            >
                🔀 Scramble
            </button>

            <button
                onClick={onReset}
                className={`${buttonClass} bg-blue-600 hover:bg-blue-500 text-white`}
            >
                ↻ Reset
            </button>

            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`${buttonClass} ${canUndo
                    ? 'bg-gray-600 hover:bg-gray-500 text-white'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                ↶ Undo
            </button>

            <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center">
                    💡 Tip: Click and drag to rotate the cube
                </p>
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-3">
                <p className="text-sm text-gray-300 font-semibold">Manual Layer Moves</p>
                <div className="grid grid-cols-3 gap-2">
                    {['U', "U'", 'D', "D'", 'L', "L'", 'R', "R'", 'F', "F'", 'B', "B'"].map((move) => (
                        <button
                            key={move}
                            onClick={() => onMove?.(move as MoveNotation)}
                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                            {move}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
