/**
 * Twisty Puzzle Trainer
 * Seven puzzles, one engine: pick a shape, scramble it, and turn its layers.
 */

"use client";

import { Suspense, useState, type ReactNode } from "react";
import PuzzleCanvas from "@/components/Cube/PuzzleCanvas";
import PuzzleControls from "@/components/Cube/PuzzleControls";
import MoveHistory from "@/components/Cube/MoveHistory";
import AlgorithmInput from "@/components/Algorithm/AlgorithmInput";
import PuzzleGlyph from "@/components/motifs/PuzzleGlyph";
import { usePuzzle } from "@/hooks/usePuzzle";
import {
  PUZZLES,
  PUZZLE_ORDER,
  type PuzzleId,
} from "@/services/puzzles/definitions";

export default function RubiksPage() {
  const [puzzleId, setPuzzleId] = useState<PuzzleId>("3x3");
  const definition = PUZZLES[puzzleId];
  const {
    puzzle,
    turn,
    duration,
    completeTurn,
    applyMove,
    enqueue,
    undo,
    scramble,
    reset,
    pending,
    speed,
    setSpeed,
    solveMoves,
    status,
  } = usePuzzle(puzzleId);

  const runAlgorithm = (moves: string[]) => enqueue(moves);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-clay-line bg-cream-deep/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-espresso">
            Twisty Puzzle Trainer
          </h1>
          <p className="text-espresso-light mt-1 max-w-2xl">
            Nine puzzles carved from one geometry engine. Every turn you ask for
            rotates real pieces around a real axis, not a repainted grid.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <nav aria-label="Choose a puzzle" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {PUZZLE_ORDER.map((id) => {
              const isActive = id === puzzleId;
              return (
                <li key={id}>
                  <button
                    onClick={() => setPuzzleId(id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-terracotta bg-terracotta text-cream"
                        : "border-clay-line bg-cream-deep text-espresso-light hover:border-terracotta-light hover:text-terracotta-dark"
                    }`}
                  >
                    <PuzzleGlyph puzzle={id} className="w-5 h-5" />
                    {PUZZLES[id].label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="relative bg-gradient-to-br from-espresso to-espresso-light rounded-2xl overflow-hidden shadow-warm-lg h-[22rem] sm:h-[30rem] lg:h-[34rem]">
              <Suspense
                fallback={
                  <div className="w-full h-full bg-espresso animate-pulse" />
                }
              >
                <PuzzleCanvas
                  key={puzzleId}
                  puzzle={puzzle}
                  turn={turn}
                  duration={duration}
                  onTurnComplete={completeTurn}
                />
              </Suspense>
              {pending > 0 && (
                <p className="absolute bottom-3 right-4 text-xs font-mono text-cream/70">
                  {pending} queued
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Stat label="State">
                {status === "solved" ? (
                  <span className="text-sage-dark">Solved</span>
                ) : status === "scrambled" ? (
                  <span className="text-terracotta-dark">Scrambled</span>
                ) : (
                  <span className="text-mustard-dark">In progress</span>
                )}
              </Stat>
              <Stat label="Your moves">
                <span className="text-terracotta-dark">
                  {solveMoves.length}
                </span>
              </Stat>
              <Stat label="Pieces">
                <span className="text-espresso">{puzzle.shapes.length}</span>
              </Stat>
            </div>

            <section className="bg-cream-deep rounded-2xl p-6 border border-clay-line">
              <h2 className="font-display text-xl font-semibold text-espresso mb-2">
                {definition.label}
              </h2>
              <p className="text-espresso-light">{definition.blurb}</p>
              <a
                href={definition.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sage-dark font-medium hover:text-terracotta-dark hover:underline"
              >
                Read a beginner method for the {definition.label} →
              </a>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PuzzleControls
              definition={definition}
              onMove={applyMove}
              onScramble={scramble}
              onReset={reset}
              onUndo={undo}
              canUndo={puzzle.history.length > 0}
              speed={speed}
              onSpeedChange={setSpeed}
            />

            <AlgorithmInput
              onMovesParsed={runAlgorithm}
              placeholder="R U R' U' — paste an algorithm to watch it run"
              puzzleId={puzzleId}
            />

            <MoveHistory moves={solveMoves} />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-cream-deep rounded-2xl p-4 border border-clay-line">
      <p className="text-espresso-light text-xs uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl font-bold mt-1.5">{children}</p>
    </div>
  );
}
