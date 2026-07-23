/**
 * CubeState: Core Rubik's Cube State Management
 * Handles all cube transformations and maintains immutable state
 */

import { MoveNotation } from '@/types/cube';

/**
 * Sticker representation: a 2D array for each face
 * Index: [0-8] representing positions on a 3x3 face
 * Value: color identifier (0-5 representing each face)
 */
type FaceStickers = number[][];

interface CubeStateInternal {
    faces: Record<string, FaceStickers>;
    moveHistory: MoveNotation[];
}

/**
 * CubeState class manages the state of a Rubik's Cube
 * Uses an immutable pattern - all methods return new instances
 */
export class CubeState {
    private faces: Record<string, FaceStickers>;
    private moveHistory: MoveNotation[];

    // Face indices for quick reference
    private static readonly FACES = {
        U: 'U', // Up (White)
        D: 'D', // Down (Yellow)
        R: 'R', // Right (Red)
        L: 'L', // Left (Orange)
        F: 'F', // Front (Blue)
        B: 'B', // Back (Green)
    };

    constructor(state?: CubeStateInternal) {
        if (state) {
            this.faces = this.deepCopyFaces(state.faces);
            this.moveHistory = [...state.moveHistory];
        } else {
            // Initialize solved cube
            this.faces = this.initializeSolvedCube();
            this.moveHistory = [];
        }
    }

    /**
     * Create a solved cube (each face uniform color)
     */
    private initializeSolvedCube(): Record<string, FaceStickers> {
        const faceIndices = { U: 0, D: 1, R: 2, L: 3, F: 4, B: 5 };
        const faces: Record<string, FaceStickers> = {};

        Object.entries(CubeState.FACES).forEach(([key, face]) => {
            const color = faceIndices[key as keyof typeof faceIndices];
            faces[face] = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => color));
        });

        return faces;
    }

    /**
     * Deep copy faces structure
     */
    private deepCopyFaces(faces: Record<string, FaceStickers>): Record<string, FaceStickers> {
        const copy: Record<string, FaceStickers> = {};
        Object.entries(faces).forEach(([key, face]) => {
            if (face.length === 9 && !Array.isArray(face[0])) {
                const flat = face as unknown as number[];
                copy[key] = [
                    [flat[0], flat[1], flat[2]],
                    [flat[3], flat[4], flat[5]],
                    [flat[6], flat[7], flat[8]],
                ];
            } else {
                copy[key] = face.map(row => [...row]);
            }
        });
        return copy;
    }

    /**
     * Rotate a face clockwise (90 degrees)
     * @param face - The face to rotate
     * @param times - Number of 90-degree rotations (1-3)
     */
    private rotateFace(face: FaceStickers, times: number = 1): FaceStickers {
        let result = face.map(row => [...row]);

        for (let t = 0; t < times % 4; t++) {
            const temp = result.map(row => [...row]);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    result[i][j] = temp[2 - j][i];
                }
            }
        }

        return result;
    }

    /**
     * Apply a basic move to the cube
     * Implements the core rotation logic for R, L, U, D, F, B moves
     */
    private applyMove(move: string): CubeState {
        const newState = new CubeState({
            faces: this.faces,
            moveHistory: this.moveHistory,
        });

        const moveMap: Record<string, () => void> = {
            R: () => newState.moveR(),
            L: () => newState.moveL(),
            U: () => newState.moveU(),
            D: () => newState.moveD(),
            F: () => newState.moveF(),
            B: () => newState.moveB(),
        };

        const baseMove = move.charAt(0);
        if (moveMap[baseMove]) {
            moveMap[baseMove]();
        }

        return newState;
    }

    // Individual move implementations
    private moveR(): void {
        this.faces.R = this.rotateFace(this.faces.R);
        const temp = [
            this.faces.F[0][2],
            this.faces.F[1][2],
            this.faces.F[2][2],
        ];

        this.faces.F[0][2] = this.faces.D[0][2];
        this.faces.F[1][2] = this.faces.D[1][2];
        this.faces.F[2][2] = this.faces.D[2][2];

        this.faces.D[0][2] = this.faces.B[2][0];
        this.faces.D[1][2] = this.faces.B[1][0];
        this.faces.D[2][2] = this.faces.B[0][0];

        this.faces.B[0][0] = this.faces.U[2][2];
        this.faces.B[1][0] = this.faces.U[1][2];
        this.faces.B[2][0] = this.faces.U[0][2];

        this.faces.U[0][2] = temp[0];
        this.faces.U[1][2] = temp[1];
        this.faces.U[2][2] = temp[2];
    }

    private moveL(): void {
        this.faces.L = this.rotateFace(this.faces.L);
        const temp = [
            this.faces.F[0][0],
            this.faces.F[1][0],
            this.faces.F[2][0],
        ];

        this.faces.F[0][0] = this.faces.U[0][0];
        this.faces.F[1][0] = this.faces.U[1][0];
        this.faces.F[2][0] = this.faces.U[2][0];

        this.faces.U[0][0] = this.faces.B[2][2];
        this.faces.U[1][0] = this.faces.B[1][2];
        this.faces.U[2][0] = this.faces.B[0][2];

        this.faces.B[0][2] = this.faces.D[2][0];
        this.faces.B[1][2] = this.faces.D[1][0];
        this.faces.B[2][2] = this.faces.D[0][0];

        this.faces.D[0][0] = temp[0];
        this.faces.D[1][0] = temp[1];
        this.faces.D[2][0] = temp[2];
    }

    private moveU(): void {
        this.faces.U = this.rotateFace(this.faces.U);
        const temp = [...this.faces.F[0]];

        this.faces.F[0] = this.faces.R[0];
        this.faces.R[0] = this.faces.B[0];
        this.faces.B[0] = this.faces.L[0];
        this.faces.L[0] = temp;
    }

    private moveD(): void {
        this.faces.D = this.rotateFace(this.faces.D);
        const temp = [...this.faces.F[2]];

        this.faces.F[2] = this.faces.L[2];
        this.faces.L[2] = this.faces.B[2];
        this.faces.B[2] = this.faces.R[2];
        this.faces.R[2] = temp;
    }

    private moveF(): void {
        this.faces.F = this.rotateFace(this.faces.F);
        const temp = [
            this.faces.U[2][0],
            this.faces.U[2][1],
            this.faces.U[2][2],
        ];

        this.faces.U[2][0] = this.faces.L[2][2];
        this.faces.U[2][1] = this.faces.L[1][2];
        this.faces.U[2][2] = this.faces.L[0][2];

        this.faces.L[0][2] = this.faces.D[0][0];
        this.faces.L[1][2] = this.faces.D[0][1];
        this.faces.L[2][2] = this.faces.D[0][2];

        this.faces.D[0][0] = this.faces.R[2][0];
        this.faces.D[0][1] = this.faces.R[1][0];
        this.faces.D[0][2] = this.faces.R[0][0];

        this.faces.R[0][0] = temp[0];
        this.faces.R[1][0] = temp[1];
        this.faces.R[2][0] = temp[2];
    }

    private moveB(): void {
        this.faces.B = this.rotateFace(this.faces.B);
        const temp = [
            this.faces.U[0][0],
            this.faces.U[0][1],
            this.faces.U[0][2],
        ];

        this.faces.U[0][0] = this.faces.R[0][2];
        this.faces.U[0][1] = this.faces.R[1][2];
        this.faces.U[0][2] = this.faces.R[2][2];

        this.faces.R[0][2] = this.faces.D[2][2];
        this.faces.R[1][2] = this.faces.D[2][1];
        this.faces.R[2][2] = this.faces.D[2][0];

        this.faces.D[2][0] = this.faces.L[0][0];
        this.faces.D[2][1] = this.faces.L[1][0];
        this.faces.D[2][2] = this.faces.L[2][0];

        this.faces.L[0][0] = temp[2];
        this.faces.L[1][0] = temp[1];
        this.faces.L[2][0] = temp[0];
    }

    /**
     * Execute a move notation (e.g., "R", "R'", "R2")
     */
    public move(notation: MoveNotation): CubeState {
        let times = 1;
        let moveChar = notation.charAt(0);

        if (notation.endsWith("'")) {
            times = 3; // Inverse = 3 clockwise rotations
        } else if (notation.endsWith('2')) {
            times = 2;
        }

        let result = this;
        for (let i = 0; i < times; i++) {
            result = result.applyMove(moveChar);
        }

        result.moveHistory = [...this.moveHistory, notation];
        return result;
    }

    /**
     * Apply a sequence of moves
     */
    public moves(notations: MoveNotation[]): CubeState {
        let result = this;
        for (const notation of notations) {
            result = result.move(notation);
        }
        return result;
    }

    /**
     * Scramble the cube with random moves
     */
    public scramble(numMoves: number = 20): CubeState {
        const moveChars = ['R', 'L', 'U', 'D', 'F', 'B'];
        const modifiers = ['', "'", '2'];
        const moves: MoveNotation[] = [];

        let lastFace = '';
        for (let i = 0; i < numMoves; i++) {
            let move: MoveNotation | null = null;
            let attempts = 0;

            while (!move && attempts < 12) {
                const face = moveChars[Math.floor(Math.random() * moveChars.length)];
                const previousMove = moves[moves.length - 1];

                if (face === lastFace) {
                    attempts += 1;
                    continue;
                }

                if (previousMove && previousMove.charAt(0) === face) {
                    attempts += 1;
                    continue;
                }

                const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
                move = `${face}${modifier}` as MoveNotation;
            }

            if (!move) {
                move = 'R' as MoveNotation;
            }

            moves.push(move);
            lastFace = move.charAt(0);
        }

        return this.moves(moves);
    }

    /**
     * Check if cube is in solved state
     */
    public isSolved(): boolean {
        for (const face of Object.values(this.faces)) {
            const firstColor = face[0][0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (face[i][j] !== firstColor) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Reset to solved state
     */
    public reset(): CubeState {
        return new CubeState();
    }

    /**
     * Undo last move
     */
    public undo(): CubeState {
        if (this.moveHistory.length === 0) return this;

        const newHistory = this.moveHistory.slice(0, -1);
        let result = new CubeState();

        for (const move of newHistory) {
            result = result.move(move);
        }

        return result;
    }

    /**
     * Get current state data
     */
    public getState(): CubeStateInternal {
        return {
            faces: this.deepCopyFaces(this.faces),
            moveHistory: [...this.moveHistory],
        };
    }

    /**
     * Get all moves in history
     */
    public getMoveHistory(): MoveNotation[] {
        return [...this.moveHistory];
    }

    /**
     * Get face by name
     */
    public getFace(faceName: keyof typeof CubeState.FACES): FaceStickers {
        return this.faces[CubeState.FACES[faceName]].map(row => [...row]);
    }

    /**
     * Get all faces
     */
    public getAllFaces(): Record<string, FaceStickers> {
        return this.deepCopyFaces(this.faces);
    }
}
