/**
 * useCube Hook
 * Manages cube state and provides move functionality
 */

'use client';

import { useState, useCallback } from 'react';
import { CubeState } from '@/services/CubeState';
import { MoveNotation } from '@/types/cube';

type CubeStatus = 'solved' | 'scrambling' | 'solving';

interface UseCubeReturn {
    cube: CubeState;
    applyMove: (move: MoveNotation) => void;
    applyMoves: (moves: MoveNotation[]) => void;
    scramble: (numMoves?: number) => void;
    reset: () => void;
    undo: () => void;
    isSolved: boolean;
    moveHistory: MoveNotation[];
    status: CubeStatus;
}

export function useCube(initialScramble?: boolean): UseCubeReturn {
    const [cube, setCube] = useState<CubeState>(() => {
        const newCube = new CubeState();
        if (initialScramble) {
            return newCube.scramble();
        }
        return newCube;
    });
    // Moves before this index in the cube's history belong to the scramble,
    // not the solve — they're excluded from the displayed move count/history.
    const [scrambleBaseline, setScrambleBaseline] = useState(
        initialScramble ? cube.getMoveHistory().length : 0
    );

    const applyMove = useCallback((move: MoveNotation) => {
        setCube((prevCube) => prevCube.move(move));
    }, []);

    const applyMoves = useCallback((moves: MoveNotation[]) => {
        setCube((prevCube) => prevCube.moves(moves));
    }, []);

    const scramble = useCallback((numMoves: number = 20) => {
        const scrambled = cube.scramble(numMoves);
        setCube(scrambled);
        setScrambleBaseline(scrambled.getMoveHistory().length);
    }, [cube]);

    const reset = useCallback(() => {
        setCube(new CubeState());
        setScrambleBaseline(0);
    }, []);

    const undo = useCallback(() => {
        setCube((prevCube) => prevCube.undo());
    }, []);

    const isSolved = cube.isSolved();
    const moveHistory = cube.getMoveHistory().slice(scrambleBaseline);
    const status: CubeStatus = isSolved ? 'solved' : moveHistory.length === 0 ? 'scrambling' : 'solving';

    return {
        cube,
        applyMove,
        applyMoves,
        scramble,
        reset,
        undo,
        isSolved,
        moveHistory,
        status,
    };
}
