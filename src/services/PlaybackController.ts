/**
 * PlaybackController: Manages algorithm playback state and timing
 * Handles play, pause, step forward/backward, speed adjustment
 */

import { MoveNotation } from '@/types/cube';

export interface PlaybackStateData {
    currentMoveIndex: number;
    isPlaying: boolean;
    speed: number; // 0.5 to 2.0 (multiplier for animation duration)
    moves: MoveNotation[];
    isFinished: boolean;
}

export class PlaybackController {
    private moves: MoveNotation[];
    private currentMoveIndex: number = 0;
    private isPlaying: boolean = false;
    private speed: number = 1.0;
    private playbackInterval: ReturnType<typeof setInterval> | null = null;
    private onMoveChange: ((move: MoveNotation | null) => void) | null = null;
    private onPlaybackEnd: (() => void) | null = null;

    constructor(moves: MoveNotation[] = []) {
        this.moves = [...moves];
    }

    /**
     * Set the moves sequence
     */
    setMoves(moves: MoveNotation[]): void {
        this.moves = [...moves];
        this.stop();
    }

    /**
     * Play the sequence from current position
     */
    play(onMoveChange: (move: MoveNotation | null) => void): void {
        if (this.isPlaying) return;
        if (this.currentMoveIndex >= this.moves.length) {
            this.currentMoveIndex = 0;
        }

        this.isPlaying = true;
        this.onMoveChange = onMoveChange;

        // Animation duration depends on speed (base 500ms)
        const baseDuration = 500;
        const interval = baseDuration / this.speed;

        this.playbackInterval = setInterval(() => {
            if (this.currentMoveIndex < this.moves.length) {
                const currentMove = this.moves[this.currentMoveIndex];
                this.onMoveChange?.(currentMove);
                this.currentMoveIndex++;
            } else {
                this.stop();
                this.onPlaybackEnd?.();
            }
        }, interval);
    }

    /**
     * Pause playback
     */
    pause(): void {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        this.isPlaying = false;
    }

    /**
     * Stop and reset to beginning
     */
    stop(): void {
        this.pause();
        this.currentMoveIndex = 0;
    }

    /**
     * Step to next move
     */
    stepForward(): MoveNotation | null {
        if (this.isPlaying) this.pause();

        if (this.currentMoveIndex < this.moves.length) {
            const move = this.moves[this.currentMoveIndex];
            this.currentMoveIndex++;
            return move;
        }
        return null;
    }

    /**
     * Step to previous move
     */
    stepBackward(): MoveNotation | null {
        if (this.isPlaying) this.pause();

        if (this.currentMoveIndex > 0) {
            this.currentMoveIndex--;
            return this.moves[this.currentMoveIndex];
        }
        return null;
    }

    /**
     * Jump to specific move index
     */
    jumpToMove(index: number): void {
        if (index >= 0 && index <= this.moves.length) {
            this.currentMoveIndex = index;
            if (!this.isPlaying) {
                this.onMoveChange?.(index < this.moves.length ? this.moves[index] : null);
            }
        }
    }

    /**
     * Set playback speed (0.5 to 2.0)
     */
    setSpeed(speed: number): void {
        const clamped = Math.max(0.5, Math.min(2.0, speed));
        this.speed = clamped;

        // If playing, restart with new speed
        if (this.isPlaying && this.playbackInterval) {
            this.pause();
            this.play(this.onMoveChange!);
        }
    }

    /**
     * Get current state
     */
    getState(): PlaybackStateData {
        return {
            currentMoveIndex: this.currentMoveIndex,
            isPlaying: this.isPlaying,
            speed: this.speed,
            moves: [...this.moves],
            isFinished: this.currentMoveIndex >= this.moves.length,
        };
    }

    /**
     * Set callback for when playback ends
     */
    onEnd(callback: () => void): void {
        this.onPlaybackEnd = callback;
    }

    /**
     * Get current move
     */
    getCurrentMove(): MoveNotation | null {
        if (this.currentMoveIndex < this.moves.length) {
            return this.moves[this.currentMoveIndex];
        }
        return null;
    }

    /**
     * Get progress as percentage
     */
    getProgress(): number {
        if (this.moves.length === 0) return 0;
        return (this.currentMoveIndex / this.moves.length) * 100;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        this.stop();
        this.onMoveChange = null;
        this.onPlaybackEnd = null;
    }
}
