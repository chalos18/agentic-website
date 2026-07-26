/**
 * usePuzzle: puzzle state plus a queue that plays moves one animated turn at a time.
 *
 * Nothing applies a move to the puzzle until its turn has finished animating, so
 * what you see on screen is always the state the trainer is reasoning about.
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TwistyPuzzle, invertPuzzleMove, type TurnSpec } from '@/services/puzzles/TwistyPuzzle';
import type { PuzzleId } from '@/services/puzzles/definitions';

/** Queue entry. `@undo` resolves against the history at the moment it is played. */
type QueuedMove = string;
const UNDO = '@undo';

export type PuzzleStatus = 'solved' | 'scrambled' | 'solving';

interface ActiveTurn {
    spec: TurnSpec;
    isUndo: boolean;
}

const BASE_TURN_SECONDS = 0.26;

export function usePuzzle(id: PuzzleId) {
    const [puzzle, setPuzzle] = useState(() => TwistyPuzzle.create(id));
    const [turn, setTurn] = useState<ActiveTurn | null>(null);
    const [speed, setSpeed] = useState(1);
    const [pending, setPending] = useState(0);
    // Scramble moves are the puzzle's starting position, not part of your solve.
    const [solveBaseline, setSolveBaseline] = useState(0);
    const queueRef = useRef<QueuedMove[]>([]);
    // Mirrors `turn` so completeTurn can read it without re-creating the callback
    // on every turn — PuzzleMesh calls it from inside a render loop.
    const turnRef = useRef<ActiveTurn | null>(null);
    turnRef.current = turn;

    const reducedMotion = usePrefersReducedMotion();
    const duration = reducedMotion ? 0 : BASE_TURN_SECONDS / speed;

    useEffect(() => {
        queueRef.current = [];
        setPending(0);
        setTurn(null);
        setSolveBaseline(0);
        setPuzzle(TwistyPuzzle.create(id));
    }, [id]);

    // Pull the next move off the queue whenever the puzzle is at rest.
    useEffect(() => {
        if (turn || queueRef.current.length === 0) return;

        const next = queueRef.current.shift() as QueuedMove;
        setPending(queueRef.current.length);

        if (next === UNDO) {
            const last = puzzle.history[puzzle.history.length - 1];
            const spec = last ? puzzle.turnSpec(invertPuzzleMove(last)) : null;
            if (spec) setTurn({ spec, isUndo: true });
            return;
        }

        const spec = puzzle.turnSpec(next);
        if (spec) setTurn({ spec, isUndo: false });
    }, [turn, puzzle, pending]);

    const completeTurn = useCallback(() => {
        const active = turnRef.current;
        if (!active) return;
        turnRef.current = null;
        setPuzzle((current) => (active.isUndo ? current.undo() : current.applyMove(active.spec.move)));
        setTurn(null);
    }, []);

    const enqueue = useCallback((moves: QueuedMove[]) => {
        queueRef.current.push(...moves);
        setPending(queueRef.current.length);
    }, []);

    const applyMove = useCallback((move: string) => enqueue([move]), [enqueue]);
    const undo = useCallback(() => enqueue([UNDO]), [enqueue]);

    const clearQueue = useCallback(() => {
        queueRef.current = [];
        setPending(0);
    }, []);

    /** Scrambles land instantly — watching twenty animated turns isn't practice. */
    const scramble = useCallback(() => {
        clearQueue();
        turnRef.current = null;
        setTurn(null);
        const fresh = TwistyPuzzle.create(id);
        const scrambled = fresh.applyMoves(fresh.scrambleSequence());
        setSolveBaseline(scrambled.history.length);
        setPuzzle(scrambled);
    }, [clearQueue, id]);

    const reset = useCallback(() => {
        clearQueue();
        turnRef.current = null;
        setTurn(null);
        setSolveBaseline(0);
        setPuzzle(TwistyPuzzle.create(id));
    }, [clearQueue, id]);

    const solveMoves = useMemo(
        () => puzzle.history.slice(solveBaseline),
        [puzzle, solveBaseline],
    );

    const isSolved = useMemo(() => puzzle.isSolved(), [puzzle]);
    const status: PuzzleStatus = isSolved ? 'solved' : solveMoves.length === 0 ? 'scrambled' : 'solving';

    return {
        puzzle,
        turn: turn?.spec ?? null,
        duration,
        completeTurn,
        applyMove,
        enqueue,
        undo,
        scramble,
        reset,
        clearQueue,
        pending,
        speed,
        setSpeed,
        solveMoves,
        isSolved,
        status,
        canUndo: puzzle.history.length > 0,
    };
}

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(query.matches);
        const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
        query.addEventListener('change', listener);
        return () => query.removeEventListener('change', listener);
    }, []);

    return reduced;
}
