/**
 * AlgorithmInput Component
 * UI for entering and validating cube move sequences
 */

'use client';

import { useState } from 'react';
import { MoveNotation } from '@/types/cube';
import { parseMoveSequence } from '@/utils/MoveParser';
import { PUZZLES, type PuzzleId } from '@/services/puzzles/definitions';

interface AlgorithmInputProps {
    onMovesParsed?: (_moves: MoveNotation[]) => void;
    onError?: (_error: string) => void;
    placeholder?: string;
    puzzleId?: PuzzleId;
}

// Curated per-shape examples — a 3x3 T-Perm means nothing on a 2x2 (no fixed
// centres, no F2L) and needs wide-move notation to make sense on a 4x4/5x5.
const EXAMPLES_BY_PUZZLE: Partial<Record<PuzzleId, { name: string; moves: string }[]>> = {
    '2x2': [
        { name: 'Sexy Move', moves: "R U R' U'" },
        { name: 'Ortega OLL (all corners)', moves: "R U R' U R U2 R'" },
        { name: 'Ortega PLL (swap adjacent)', moves: "R U' R U R U R U' R' U' R2" },
    ],
    '3x3': [
        { name: 'Sexy Move', moves: "R U R' U'" },
        { name: 'T-Perm', moves: "R U R' U' R' F R2 U' R' U' R U R' F'" },
        { name: 'Cross', moves: "D' R2 D L2 D'" },
    ],
    '4x4': [
        { name: 'Sexy Move', moves: "R U R' U'" },
        { name: 'OLL Parity', moves: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'" },
        { name: 'PLL Parity (edge swap)', moves: "Rw2 Uw2 Rw2 Uw2" },
    ],
    '5x5': [
        { name: 'Sexy Move', moves: "R U R' U'" },
        { name: 'Centre Building Helper', moves: "Rw U Rw' U Rw U2 Rw'" },
        { name: '3x3 Reduction T-Perm', moves: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    ],
    pyraminx: [
        { name: 'Sledgehammer', moves: "R' L R L'" },
        { name: 'Last Layer (3 edges CCW)', moves: "R U R' U R U R'" },
        { name: 'Last Layer (3 edges CW)', moves: "R U' R' U' R U' R'" },
    ],
    skewb: [
        { name: 'Down Down Up Up', moves: "L R' L' R" },
        { name: 'Corner Cycle', moves: "R L' R' L" },
    ],
    megaminx: [
        { name: 'Star Case', moves: "F U R U' R' F'" },
        { name: 'Edge Flip', moves: "F R U R' U' F'" },
        { name: '3x3 T-Perm (edge cycle)', moves: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    ],
    mastermorphix: [
        { name: 'Sexy Move', moves: "R U R' U'" },
        { name: 'T-Perm', moves: "R U R' U' R' F R2 U' R' U' R U R' F'" },
        { name: 'Cross', moves: "D' R2 D L2 D'" },
    ],
    ivy: [
        { name: 'Corner Commutator', moves: "R L' R' L" },
        { name: 'Centre Swap', moves: "L' U U L" },
    ],
};

export default function AlgorithmInput({
    onMovesParsed,
    onError,
    placeholder = 'Enter moves (e.g., R U R\' U\')',
    puzzleId = '3x3',
}: AlgorithmInputProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [parsedMoves, setParsedMoves] = useState<MoveNotation[]>([]);

    const handleInputChange = (value: string) => {
        setInput(value);
        setError(null);
    };

    const handleParse = () => {
        if (!input.trim()) {
            setError('Please enter at least one move');
            onError?.('Please enter at least one move');
            return;
        }

        try {
            const moves = parseMoveSequence(input);
            setParsedMoves(moves);
            setError(null);
            onMovesParsed?.(moves);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid move notation';
            setError(message);
            onError?.(message);
        }
    };

    const handleClear = () => {
        setInput('');
        setParsedMoves([]);
        setError(null);
    };

    const handlePasteExample = (moves: string) => {
        setInput(moves);
    };

    const examples = EXAMPLES_BY_PUZZLE[puzzleId] ?? EXAMPLES_BY_PUZZLE['3x3']!;

    return (
        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line space-y-4">
            <h3 className="text-lg font-bold text-espresso">Algorithm Input</h3>

            {/* Input Area */}
            <div className="space-y-2">
                <label className="text-sm text-espresso-light">Enter Moves</label>
                <textarea
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-3 bg-cream text-espresso font-mono text-sm rounded-lg border border-clay-line focus:border-terracotta focus:outline-none resize-none h-24"
                />
                <p className="text-xs text-espresso-light">
                    Separate moves with spaces. Use single quotes for inverse (e.g., R&apos;)
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-terracotta/10 border border-terracotta rounded-lg p-3">
                    <p className="text-terracotta-dark text-sm">⚠️ {error}</p>
                </div>
            )}

            {/* Parsed Moves Display */}
            {parsedMoves.length > 0 && (
                <div className="bg-sage/10 border border-sage rounded-lg p-3">
                    <p className="text-sage-dark text-sm mb-2">✓ {parsedMoves.length} moves parsed:</p>
                    <code className="text-sage-dark font-mono text-xs break-all">
                        {parsedMoves.join(' ')}
                    </code>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleParse}
                    className="flex-1 px-4 py-2 bg-terracotta hover:bg-terracotta-dark text-cream rounded-lg font-semibold transition-all active:scale-95"
                >
                    Parse
                </button>
                <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-2 bg-clay-line hover:bg-espresso-light/30 text-espresso rounded-lg font-semibold transition-all active:scale-95"
                >
                    Clear
                </button>
            </div>

            {/* Examples */}
            <div className="space-y-2">
                <p className="text-xs text-espresso-light uppercase">Quick Examples</p>
                <div className="grid grid-cols-1 gap-2">
                    {examples.map((example) => (
                        <button
                            key={example.name}
                            onClick={() => handlePasteExample(example.moves)}
                            className="text-left px-3 py-2 bg-cream border border-clay-line hover:border-terracotta rounded-lg text-sm text-espresso transition-colors"
                        >
                            <span className="font-semibold text-terracotta-dark">{example.name}:</span>{' '}
                            <code className="text-xs">{example.moves}</code>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-cream rounded-lg p-3 space-y-1 border border-clay-line">
                <p className="text-xs text-espresso font-semibold">TIPS:</p>
                <ul className="text-xs text-espresso-light space-y-1 list-disc list-inside">
                    <li>{Object.keys(PUZZLES[puzzleId].moves).join(', ')} for this puzzle&apos;s moves</li>
                    <li>Add apostrophe (e.g. R&apos;) for inverse rotations</li>
                    <li>Add 2 (e.g. R2) for double turns</li>
                </ul>
            </div>
        </div>
    );
}
