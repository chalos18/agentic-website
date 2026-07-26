/**
 * Cube Types and Constants
 * Core type definitions for Rubik's Cube state and moves
 */

/**
 * Move notation for Rubik's Cube
 * Standard ROUX/Fridrich notation
 */
export type MoveNotation =
    | 'R' | "R'" | 'R2'
    | 'L' | "L'" | 'L2'
    | 'U' | "U'" | 'U2'
    | 'D' | "D'" | 'D2'
    | 'F' | "F'" | 'F2'
    | 'B' | "B'" | 'B2'
    | 'x' | "x'" | 'x2'   // Cube rotations
    | 'y' | "y'" | 'y2'
    | 'z' | "z'" | 'z2'
    | 'M' | "M'" | 'M2'   // Middle slices
    | 'E' | "E'" | 'E2'
    | 'S' | "S'" | 'S2';

/**
 * Solving stages/methods
 */
/* eslint-disable no-unused-vars -- base rule can't see cross-file enum member usage (e.g. AlgorithmSeeds.ts) */
export enum SolvingStage {
    CROSS = 'cross',
    F2L = 'f2l',
    OLL = 'oll',
    PLL = 'pll',
    LAST_LAYER = 'last_layer',
    EDGE_ORIENTATION = 'edge_orientation',
    CORNER_ORIENTATION = 'corner_orientation',
    PATTERN = 'pattern',
}
/* eslint-enable no-unused-vars */

/**
 * Algorithm record in database
 */
export interface Algorithm {
    id?: string;
    name: string;
    stage: SolvingStage;
    pattern: string;
    description: string;
    notation: string; // e.g., "R U R' U'"
    difficulty: 1 | 2 | 3 | 4 | 5;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
