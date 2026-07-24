/**
 * AlgorithmInput Component
 * UI for entering and validating cube move sequences
 */

'use client';

import { useState } from 'react';
import { MoveNotation } from '@/types/cube';
import { parseMoveSequence, validateMove } from '@/utils/MoveParser';

interface AlgorithmInputProps {
    onMovesParsed?: (moves: MoveNotation[]) => void;
    onError?: (error: string) => void;
    placeholder?: string;
}

export default function AlgorithmInput({
    onMovesParsed,
    onError,
    placeholder = 'Enter moves (e.g., R U R\' U\')',
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

    const examples = [
        { name: 'Sexy Move', moves: 'R U R\' U\'' },
        { name: 'T-Perm', moves: 'R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'' },
        { name: 'Cross', moves: 'D\' R2 D L2 D\'' },
    ];

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
                    <li>R, L, U, D, F, B for standard moves</li>
                    <li>Add apostrophe (R&apos;) for inverse rotations</li>
                    <li>Add 2 (R2) for double turns</li>
                    <li>x, y, z for whole cube rotations</li>
                    <li>M, E, S for middle layer moves</li>
                </ul>
            </div>
        </div>
    );
}
