/**
 * Rubik's Cube Interactive Trainer Page
 * Full interactive 3D cube with algorithm trainer
 */

'use client';

import { Suspense, useState } from 'react';
import CubeCanvas from '@/components/Cube/CubeCanvas';
import CubeControls from '@/components/Cube/CubeControls';
import MoveHistory from '@/components/Cube/MoveHistory';
import AlgorithmInput from '@/components/Algorithm/AlgorithmInput';
import AlgorithmPlayback from '@/components/Algorithm/AlgorithmPlayback';
import { useCube } from '@/hooks/useCube';
import { MoveNotation } from '@/types/cube';

type TabType = 'input' | 'playback';

export default function RubiksPage() {
    const { cube, applyMove, scramble, reset, undo, isSolved, moveHistory } = useCube(false);
    const [activeTab, setActiveTab] = useState<TabType>('input');
    const [parsedAlgorithm, setParsedAlgorithm] = useState<MoveNotation[]>([]);

    const handleAlgorithmParsed = (moves: MoveNotation[]) => {
        setParsedAlgorithm(moves);
        setActiveTab('playback');
    };

    const handleMoveFromAlgorithm = (move: MoveNotation) => {
        applyMove(move);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-4xl font-bold">Rubik&apos;s Cube Trainer</h1>
                    <p className="text-gray-400 mt-2">Interactive 3D solver and algorithm trainer</p>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 3D Cube Canvas - Main focus */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700 h-96 lg:h-[600px] mb-6">
                            <Suspense fallback={<div className="w-full h-full bg-gray-900 animate-pulse" />}>
                                <CubeCanvas cubeState={cube} />
                            </Suspense>
                        </div>

                        {/* Status and info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-400 text-sm uppercase tracking-wider">Status</p>
                                <p className="text-2xl font-bold mt-2">
                                    {isSolved ? (
                                        <span className="text-green-400">✓ Solved!</span>
                                    ) : (
                                        <span className="text-yellow-400">Solving...</span>
                                    )}
                                </p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <p className="text-gray-400 text-sm uppercase tracking-wider">Moves</p>
                                <p className="text-2xl font-bold mt-2 text-blue-400">{moveHistory.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Controls, Input & Playback */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cube Controls */}
                        <CubeControls
                            onScramble={() => scramble()}
                            onReset={() => reset()}
                            onUndo={() => undo()}
                            onMove={(move) => applyMove(move)}
                            canUndo={moveHistory.length > 0}
                        />

                        {/* Tabs for Algorithm Tools */}
                        <div className="space-y-4">
                            <div className="flex gap-2 border-b border-gray-700">
                                <button
                                    onClick={() => setActiveTab('input')}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'input'
                                        ? 'text-blue-400 border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    Input
                                </button>
                                <button
                                    onClick={() => setActiveTab('playback')}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'playback'
                                        ? 'text-blue-400 border-b-2 border-blue-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    Playback
                                </button>
                            </div>

                            {/* Algorithm Input Tab */}
                            {activeTab === 'input' && (
                                <AlgorithmInput
                                    onMovesParsed={handleAlgorithmParsed}
                                    placeholder="Enter algorithm notation..."
                                />
                            )}

                            {/* Algorithm Playback Tab */}
                            {activeTab === 'playback' && (
                                <AlgorithmPlayback
                                    moves={parsedAlgorithm}
                                    onMoveApplied={handleMoveFromAlgorithm}
                                />
                            )}
                        </div>

                        {/* Move History - Compact */}
                        <div className="max-h-64 overflow-hidden">
                            <MoveHistory moves={moveHistory} />
                        </div>
                    </div>
                </div>

                {/* Tutorial Section */}
                <section className="mt-16 py-8 border-t border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">How to Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-blue-400 mb-2">🎮 Interactive Cube</h3>
                            <p className="text-gray-400 text-sm">
                                Click and drag to rotate the cube. Use the control buttons to scramble, reset, or undo moves.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-blue-400 mb-2">⌨️ Algorithm Input</h3>
                            <p className="text-gray-400 text-sm">
                                Enter Rubik&apos;s cube notation (e.g., &quot;R U R&apos; U&apos;;&quot;) to input algorithms. Supports all standard moves.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-lg font-bold text-blue-400 mb-2">▶️ Playback Control</h3>
                            <p className="text-gray-400 text-sm">
                                Use playback controls to step through algorithms, adjust speed, and practice solving techniques.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
