/**
 * AlgorithmPlayback Component
 * UI for playing back algorithm sequences
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { MoveNotation, Algorithm } from '@/types/cube';
import { PlaybackController, PlaybackStateData } from '@/services/PlaybackController';
import { formatMoveSequence } from '@/utils/MoveParser';

interface AlgorithmPlaybackProps {
    algorithm?: Algorithm;
    moves?: MoveNotation[];
    onMoveApplied?: (move: MoveNotation) => void;
}

export default function AlgorithmPlayback({
    algorithm,
    moves: initialMoves = [],
    onMoveApplied,
}: AlgorithmPlaybackProps) {
    const [playbackState, setPlaybackState] = useState<PlaybackStateData>({
        currentMoveIndex: 0,
        isPlaying: false,
        speed: 1.0,
        moves: initialMoves,
        isFinished: false,
    });

    const controllerRef = useRef<PlaybackController | null>(null);

    // Initialize controller
    useEffect(() => {
        const controller = new PlaybackController(initialMoves);
        controllerRef.current = controller;

        controller.onEnd(() => {
            setPlaybackState(controller.getState());
        });

        setPlaybackState(controller.getState());

        return () => {
            controller.destroy();
        };
    }, [initialMoves]);

    const controller = controllerRef.current;
    const progress = controller?.getProgress() ?? 0;

    const handlePlay = () => {
        if (!controller || playbackState.isPlaying) return;

        controller.play((move) => {
            if (move) onMoveApplied?.(move);
            setPlaybackState(controller.getState());
        });
        setPlaybackState(controller.getState());
    };

    const handlePause = () => {
        if (!controller) return;
        controller.pause();
        setPlaybackState(controller.getState());
    };

    const handleStop = () => {
        if (!controller) return;
        controller.stop();
        setPlaybackState(controller.getState());
    };

    const handleStepForward = () => {
        if (!controller) return;
        const move = controller.stepForward();
        if (move) onMoveApplied?.(move);
        setPlaybackState(controller.getState());
    };

    const handleStepBackward = () => {
        if (!controller) return;
        controller.stepBackward();
        setPlaybackState(controller.getState());
    };

    const handleSpeedChange = (newSpeed: number) => {
        if (!controller) return;
        controller.setSpeed(newSpeed);
        setPlaybackState(controller.getState());
    };

    const handleSeek = (index: number) => {
        if (!controller) return;
        controller.jumpToMove(index);
        setPlaybackState(controller.getState());
    };

    const buttonClass =
        'px-3 py-2 rounded-lg transition-all duration-200 border border-transparent active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="bg-cream-deep rounded-2xl p-6 border border-clay-line space-y-4">
            {/* Algorithm Info */}
            {algorithm && (
                <div className="mb-4 pb-4 border-b border-clay-line">
                    <h3 className="text-xl font-bold text-espresso mb-2">{algorithm.name}</h3>
                    <p className="text-espresso-light text-sm mb-3">{algorithm.description}</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-sage/15 text-sage-dark text-xs rounded-full">
                            {algorithm.stage.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-mustard/20 text-mustard-dark text-xs rounded-full">
                            Difficulty: {'⭐'.repeat(algorithm.difficulty)}
                        </span>
                    </div>
                </div>
            )}

            {/* Notation Display */}
            <div className="bg-cream rounded-lg p-3 border border-clay-line">
                <p className="text-espresso-light text-xs uppercase mb-2">Algorithm Notation</p>
                <code className="text-sage-dark font-mono text-sm break-all">
                    {playbackState.moves.length > 0
                        ? formatMoveSequence(playbackState.moves).split('\n').join(' | ')
                        : 'No moves'}
                </code>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-espresso-light">
                    <span>Move {playbackState.currentMoveIndex + 1} of {playbackState.moves.length}</span>
                    <span>{playbackState.isFinished ? '✓ Finished' : `${Math.round(progress)}%`}</span>
                </div>
                <div className="w-full bg-clay-line rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-terracotta to-mustard h-full transition-all duration-100"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-3">
                {/* Play/Pause/Stop */}
                <div className="flex gap-2">
                    <button
                        onClick={handlePlay}
                        disabled={playbackState.isFinished && playbackState.moves.length > 0}
                        className={`${buttonClass} flex-1 bg-sage hover:bg-sage-dark text-cream disabled:bg-clay-line disabled:text-espresso-light`}
                    >
                        ▶ Play
                    </button>
                    <button
                        onClick={handlePause}
                        disabled={!playbackState.isPlaying}
                        className={`${buttonClass} flex-1 bg-mustard hover:bg-mustard-dark text-espresso disabled:bg-clay-line disabled:text-espresso-light`}
                    >
                        ⏸ Pause
                    </button>
                    <button
                        onClick={handleStop}
                        className={`${buttonClass} flex-1 bg-terracotta hover:bg-terracotta-dark text-cream`}
                    >
                        ⏹ Stop
                    </button>
                </div>

                {/* Step Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={handleStepBackward}
                        disabled={playbackState.currentMoveIndex === 0}
                        className={`${buttonClass} flex-1 bg-clay-line hover:bg-espresso-light/30 text-espresso disabled:text-espresso-light/50`}
                    >
                        ⏪ Previous
                    </button>
                    <button
                        onClick={handleStepForward}
                        disabled={playbackState.isFinished}
                        className={`${buttonClass} flex-1 bg-clay-line hover:bg-espresso-light/30 text-espresso disabled:text-espresso-light/50`}
                    >
                        Next ⏩
                    </button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <label className="text-xs text-espresso-light uppercase">Speed: {playbackState.speed.toFixed(1)}x</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={playbackState.speed}
                        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                        className="w-full accent-terracotta"
                    />
                    <div className="flex justify-between text-xs text-espresso-light">
                        <span>0.5x</span>
                        <span>1x</span>
                        <span>2x</span>
                    </div>
                </div>

                {/* Seek Bar */}
                <div className="space-y-2">
                    <label className="text-xs text-espresso-light uppercase">Jump to Move</label>
                    <input
                        type="range"
                        min="0"
                        max={Math.max(0, playbackState.moves.length - 1)}
                        value={playbackState.currentMoveIndex}
                        onChange={(e) => handleSeek(parseInt(e.target.value))}
                        className="w-full accent-terracotta"
                    />
                </div>
            </div>

            {/* Current Move Highlight */}
            {playbackState.currentMoveIndex < playbackState.moves.length && (
                <div className="bg-terracotta/10 border border-terracotta rounded-lg p-3">
                    <p className="text-terracotta-dark text-center font-mono text-lg">
                        {playbackState.moves[playbackState.currentMoveIndex]}
                    </p>
                </div>
            )}
        </div>
    );
}
