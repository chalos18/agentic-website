/**
 * Cube Types and Constants
 * Core type definitions for Rubik's Cube state and moves
 */

/**
 * Face colors represented as hex values
 * Standard Rubik's Cube color scheme
 */
export enum CubeFace {
    WHITE = '#FFFFFF',    // U (Up)
    YELLOW = '#FFD700',   // D (Down)
    RED = '#FF0000',      // R (Right)
    ORANGE = '#FF8C00',   // L (Left)
    BLUE = '#0000FF',     // F (Front)
    GREEN = '#00AA00',    // B (Back)
}

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

/**
 * Individual cubie (small cube piece) representation
 */
export interface Cubie {
    id: number;
    position: [number, number, number];
    orientation: [number, number, number]; // Rotation angles in radians
    colors: {
        top?: string;
        bottom?: string;
        front?: string;
        back?: string;
        left?: string;
        right?: string;
    };
}

/**
 * Complete cube state
 */
export interface CubeStateData {
    cubies: Cubie[];
    moveHistory: MoveNotation[];
    isScrambled: boolean;
    isSolved: boolean;
}

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

/**
 * Playback state for algorithm runner
 */
export interface PlaybackState {
    currentMoveIndex: number;
    isPlaying: boolean;
    speed: number; // 0.5 to 2.0
    moves: MoveNotation[];
}
