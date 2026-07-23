/**
 * useCube Hook
 * Manages cube state and provides move functionality
 */

'use client';

import { useState, useCallback } from 'react';
import { CubeState } from '@/services/CubeState';
import { MoveNotation } from '@/types/cube';

interface UseCubeReturn {
    cube: CubeState;
    applyMove: (move: MoveNotation) => void;
    applyMoves: (moves: MoveNotation[]) => void;
    scramble: (numMoves?: number) => void;
    reset: () => void;
    undo: () => void;
    isSolved: boolean;
    moveHistory: MoveNotation[];
}

export function useCube(initialScramble?: boolean): UseCubeReturn {
    const [cube, setCube] = useState<CubeState>(() => {
        const newCube = new CubeState();
        if (initialScramble) {
            return newCube.scramble();
        }
        return newCube;
    });

    const applyMove = useCallback((move: MoveNotation) => {
        setCube((prevCube) => prevCube.move(move));
    }, []);

    const applyMoves = useCallback((moves: MoveNotation[]) => {
        setCube((prevCube) => prevCube.moves(moves));
    }, []);

    const scramble = useCallback((numMoves: number = 20) => {
        setCube((prevCube) => prevCube.scramble(numMoves));
    }, []);

    const reset = useCallback(() => {
        setCube(new CubeState());
    }, []);

    const undo = useCallback(() => {
        setCube((prevCube) => prevCube.undo());
    }, []);

    const isSolved = cube.isSolved();
    const moveHistory = cube.getMoveHistory();

    return {
        cube,
        applyMove,
        applyMoves,
        scramble,
        reset,
        undo,
        isSolved,
        moveHistory,
    };
}
