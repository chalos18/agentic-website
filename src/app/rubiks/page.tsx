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
import Doodle from '@/components/motifs/Doodle';
import { useCube } from '@/hooks/useCube';
import { MoveNotation } from '@/types/cube';

type TabType = 'input' | 'playback';

export default function RubiksPage() {
    const { cube, applyMove, scramble, reset, undo, moveHistory, status } = useCube(false);
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
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <header className="border-b border-clay-line bg-cream-deep/60 backdrop-blur sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3">
                    <Doodle variant="cube" className="w-9 h-9 text-terracotta hidden sm:block" />
                    <div>
                        <h1 className="font-display text-4xl font-semibold text-espresso">Rubik&apos;s Cube Trainer</h1>
                        <p className="text-espresso-light mt-1">Interactive 3D solver and algorithm trainer</p>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* 3D Cube Canvas - Main focus */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-espresso to-espresso-light rounded-2xl overflow-hidden shadow-warm-lg border border-espresso h-96 lg:h-[600px] mb-6">
                            <Suspense fallback={<div className="w-full h-full bg-espresso animate-pulse" />}>
                                <CubeCanvas cubeState={cube} />
                            </Suspense>
                        </div>

                        {/* Status and info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-cream-deep rounded-2xl p-4 border border-clay-line">
                                <p className="text-espresso-light text-sm uppercase tracking-wider">Status</p>
                                <p className="text-2xl font-bold mt-2">
                                    {status === 'solved' ? (
                                        <span className="text-sage-dark">✓ Solved!</span>
                                    ) : status === 'scrambling' ? (
                                        <span className="text-terracotta-dark">Scrambling...</span>
                                    ) : (
                                        <span className="text-mustard-dark">Solving...</span>
                                    )}
                                </p>
                            </div>
                            <div className="bg-cream-deep rounded-2xl p-4 border border-clay-line">
                                <p className="text-espresso-light text-sm uppercase tracking-wider">Moves</p>
                                <p className="text-2xl font-bold mt-2 text-terracotta-dark">{moveHistory.length}</p>
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
                            <div className="flex gap-2 border-b border-clay-line">
                                <button
                                    onClick={() => setActiveTab('input')}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'input'
                                        ? 'text-terracotta-dark border-b-2 border-terracotta'
                                        : 'text-espresso-light hover:text-espresso'
                                        }`}
                                >
                                    Input
                                </button>
                                <button
                                    onClick={() => setActiveTab('playback')}
                                    className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === 'playback'
                                        ? 'text-terracotta-dark border-b-2 border-terracotta'
                                        : 'text-espresso-light hover:text-espresso'
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
                <section className="mt-16 py-8 border-t border-clay-line">
                    <h2 className="font-display text-2xl font-semibold text-espresso mb-6">How to Use</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
                            <h3 className="text-lg font-bold text-terracotta-dark mb-2">🎮 Interactive Cube</h3>
                            <p className="text-espresso-light text-sm">
                                Click and drag to rotate the cube. Use the control buttons to scramble, reset, or undo moves.
                            </p>
                        </div>
                        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
                            <h3 className="text-lg font-bold text-terracotta-dark mb-2">⌨️ Algorithm Input</h3>
                            <p className="text-espresso-light text-sm">
                                Enter Rubik&apos;s cube notation (e.g., &quot;R U R&apos; U&apos;;&quot;) to input algorithms. Supports all standard moves.
                            </p>
                        </div>
                        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
                            <h3 className="text-lg font-bold text-terracotta-dark mb-2">▶️ Playback Control</h3>
                            <p className="text-espresso-light text-sm">
                                Use playback controls to step through algorithms, adjust speed, and practice solving techniques.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
