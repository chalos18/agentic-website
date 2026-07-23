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
        'px-3 py-2 rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
            {/* Algorithm Info */}
            {algorithm && (
                <div className="mb-4 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-2">{algorithm.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{algorithm.description}</p>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-900 text-blue-100 text-xs rounded">
                            {algorithm.stage.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-yellow-900 text-yellow-100 text-xs rounded">
                            Difficulty: {'⭐'.repeat(algorithm.difficulty)}
                        </span>
                    </div>
                </div>
            )}

            {/* Notation Display */}
            <div className="bg-gray-900 rounded p-3">
                <p className="text-gray-500 text-xs uppercase mb-2">Algorithm Notation</p>
                <code className="text-green-400 font-mono text-sm break-all">
                    {playbackState.moves.length > 0
                        ? formatMoveSequence(playbackState.moves).split('\n').join(' | ')
                        : 'No moves'}
                </code>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Move {playbackState.currentMoveIndex + 1} of {playbackState.moves.length}</span>
                    <span>{playbackState.isFinished ? '✓ Finished' : `${Math.round(progress)}%`}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-100"
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
                        className={`${buttonClass} flex-1 bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-700`}
                    >
                        ▶ Play
                    </button>
                    <button
                        onClick={handlePause}
                        disabled={!playbackState.isPlaying}
                        className={`${buttonClass} flex-1 bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-gray-700`}
                    >
                        ⏸ Pause
                    </button>
                    <button
                        onClick={handleStop}
                        className={`${buttonClass} flex-1 bg-red-600 hover:bg-red-500 text-white`}
                    >
                        ⏹ Stop
                    </button>
                </div>

                {/* Step Controls */}
                <div className="flex gap-2">
                    <button
                        onClick={handleStepBackward}
                        disabled={playbackState.currentMoveIndex === 0}
                        className={`${buttonClass} flex-1 bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700`}
                    >
                        ⏪ Previous
                    </button>
                    <button
                        onClick={handleStepForward}
                        disabled={playbackState.isFinished}
                        className={`${buttonClass} flex-1 bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700`}
                    >
                        Next ⏩
                    </button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase">Speed: {playbackState.speed.toFixed(1)}x</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={playbackState.speed}
                        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0.5x</span>
                        <span>1x</span>
                        <span>2x</span>
                    </div>
                </div>

                {/* Seek Bar */}
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase">Jump to Move</label>
                    <input
                        type="range"
                        min="0"
                        max={Math.max(0, playbackState.moves.length - 1)}
                        value={playbackState.currentMoveIndex}
                        onChange={(e) => handleSeek(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Current Move Highlight */}
            {playbackState.currentMoveIndex < playbackState.moves.length && (
                <div className="bg-blue-900/30 border border-blue-500 rounded p-3">
                    <p className="text-blue-300 text-center font-mono text-lg">
                        {playbackState.moves[playbackState.currentMoveIndex]}
                    </p>
                </div>
            )}
        </div>
    );
}
