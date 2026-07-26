/**
 * PuzzleControls: scramble/reset/undo, turn speed, and a move pad built from
 * whatever moves the selected puzzle happens to define.
 */

'use client';

import { useEffect } from 'react';
import type { PuzzleDefinition } from '@/services/puzzles/definitions';

interface PuzzleControlsProps {
    definition: PuzzleDefinition;
    onMove: (_move: string) => void;
    onScramble: () => void;
    onReset: () => void;
    onUndo: () => void;
    canUndo: boolean;
    speed: number;
    onSpeedChange: (_speed: number) => void;
}

const SPEEDS = [
    { label: 'Slow', value: 0.5 },
    { label: 'Normal', value: 1 },
    { label: 'Fast', value: 2 },
];

export default function PuzzleControls({
    definition,
    onMove,
    onScramble,
    onReset,
    onUndo,
    canUndo,
    speed,
    onSpeedChange,
}: PuzzleControlsProps) {
    // Typing the notation is how cubers actually think; shift gives the inverse.
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

            const single = Object.keys(definition.moves).filter((name) => name.length === 1);
            // Prefer the uppercase move, so `u` on a pyraminx turns the layer rather
            // than the tip; tips stay a click away on the pad.
            const base =
                single.find((name) => name === event.key.toUpperCase()) ??
                single.find((name) => name.toLowerCase() === event.key.toLowerCase());
            if (!base) return;

            event.preventDefault();
            onMove(event.shiftKey ? `${base}'` : base);
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [definition, onMove]);

    const buttonBase =
        'rounded-xl font-semibold transition-colors active:scale-95 disabled:cursor-not-allowed';

    return (
        <div className="bg-cream-deep rounded-2xl p-5 sm:p-6 border border-clay-line space-y-5">
            <div className="grid grid-cols-3 gap-2">
                <button onClick={onScramble} className={`${buttonBase} px-3 py-2.5 bg-terracotta hover:bg-terracotta-dark text-cream`}>
                    Scramble
                </button>
                <button onClick={onReset} className={`${buttonBase} px-3 py-2.5 bg-sage hover:bg-sage-dark text-cream`}>
                    Reset
                </button>
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className={`${buttonBase} px-3 py-2.5 ${canUndo
                        ? 'bg-mustard hover:bg-mustard-dark text-espresso'
                        : 'bg-clay-line/60 text-espresso-light/50'
                        }`}
                >
                    Undo
                </button>
            </div>

            <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-wide text-espresso-light/80">Turn speed</span>
                <div className="flex rounded-lg border border-clay-line overflow-hidden">
                    {SPEEDS.map(({ label, value }) => (
                        <button
                            key={label}
                            onClick={() => onSpeedChange(value)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${speed === value
                                ? 'bg-terracotta text-cream'
                                : 'bg-cream text-espresso-light hover:text-terracotta-dark'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {definition.moveGroups.map((group) => (
                <div key={group.label} className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-espresso-light/80">{group.label}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {group.moves.map((move) => (
                            <MoveKey
                                key={move}
                                move={move}
                                hasDouble={definition.moves[move]?.order === 4}
                                onMove={onMove}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <p className="text-xs text-espresso-light border-t border-clay-line pt-4">
                Drag the puzzle to look around it. Press a notation key to turn that face,
                or hold shift for the reverse.
            </p>
        </div>
    );
}

function MoveKey({
    move,
    hasDouble,
    onMove,
}: {
    move: string;
    hasDouble: boolean;
    onMove: (_move: string) => void;
}) {
    return (
        <div className="rounded-lg border border-clay-line bg-cream overflow-hidden">
            <button
                onClick={() => onMove(move)}
                className="w-full py-2 font-mono text-sm font-semibold text-espresso hover:bg-terracotta hover:text-cream transition-colors"
                aria-label={`Turn ${move} clockwise`}
            >
                {move}
            </button>
            <div className="flex border-t border-clay-line">
                <button
                    onClick={() => onMove(`${move}'`)}
                    className="flex-1 py-1 font-mono text-xs text-espresso-light hover:bg-sage hover:text-cream transition-colors"
                    aria-label={`Turn ${move} anticlockwise`}
                >
                    {move}&apos;
                </button>
                {hasDouble && (
                    <button
                        onClick={() => onMove(`${move}2`)}
                        className="flex-1 py-1 font-mono text-xs text-espresso-light border-l border-clay-line hover:bg-sage hover:text-cream transition-colors"
                        aria-label={`Turn ${move} half a turn`}
                    >
                        {move}2
                    </button>
                )}
            </div>
        </div>
    );
}
