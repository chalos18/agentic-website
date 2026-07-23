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
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-white">Algorithm Input</h3>

            {/* Input Area */}
            <div className="space-y-2">
                <label className="text-sm text-gray-300">Enter Moves</label>
                <textarea
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full p-3 bg-gray-900 text-gray-100 font-mono text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none h-24"
                />
                <p className="text-xs text-gray-500">
                    Separate moves with spaces. Use single quotes for inverse (e.g., R&apos;)
                </p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-900/30 border border-red-500 rounded p-3">
                    <p className="text-red-300 text-sm">⚠️ {error}</p>
                </div>
            )}

            {/* Parsed Moves Display */}
            {parsedMoves.length > 0 && (
                <div className="bg-green-900/20 border border-green-600 rounded p-3">
                    <p className="text-green-300 text-sm mb-2">✓ {parsedMoves.length} moves parsed:</p>
                    <code className="text-green-400 font-mono text-xs break-all">
                        {parsedMoves.join(' ')}
                    </code>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleParse}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                    Parse
                </button>
                <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold transition-all active:scale-95"
                >
                    Clear
                </button>
            </div>

            {/* Examples */}
            <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase">Quick Examples</p>
                <div className="grid grid-cols-1 gap-2">
                    {examples.map((example) => (
                        <button
                            key={example.name}
                            onClick={() => handlePasteExample(example.moves)}
                            className="text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-200 transition-colors"
                        >
                            <span className="font-semibold text-blue-300">{example.name}:</span>{' '}
                            <code className="text-xs">{example.moves}</code>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900 rounded p-3 space-y-1">
                <p className="text-xs text-gray-400 font-semibold">TIPS:</p>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
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
