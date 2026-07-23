/**
 * Algorithm Seed Data
 * Default algorithms for the database
 */

import { Algorithm, SolvingStage } from '@/types/cube';

export const ALGORITHM_SEEDS: Algorithm[] = [
    // Basic Moves
    {
        name: 'Sexy Move',
        stage: SolvingStage.PATTERN,
        pattern: 'R U R\' U\'',
        description: 'The most fundamental algorithm in cubing. Creates a cycle on the top layer.',
        notation: 'R U R\' U\'',
        difficulty: 1,
    },
    {
        name: 'Reverse Sexy Move',
        stage: SolvingStage.PATTERN,
        pattern: 'U R U\' R\'',
        description: 'Inverse of the sexy move.',
        notation: 'U R U\' R\'',
        difficulty: 1,
    },

    // F2L (First 2 Layers) - Basic
    {
        name: 'Insert F2L Pair',
        stage: SolvingStage.F2L,
        pattern: 'R U\' R\'',
        description: 'Basic pair insertion for F2L solving.',
        notation: 'R U\' R\'',
        difficulty: 2,
    },
    {
        name: 'F2L Pair Setup',
        stage: SolvingStage.F2L,
        pattern: 'R U R\'',
        description: 'Prepares a pair for insertion.',
        notation: 'R U R\'',
        difficulty: 2,
    },

    // OLL (Orient Last Layer)
    {
        name: 'OLL #21 - Headlights',
        stage: SolvingStage.OLL,
        pattern: 'R U2 R\' U\' R U2 L\' U R\' U\' L',
        description: 'The famous headlights OLL case with two oriented corners.',
        notation: 'R U2 R\' U\' R U2 L\' U R\' U\' L',
        difficulty: 3,
    },
    {
        name: 'OLL #1 - Dot to Dot',
        stage: SolvingStage.OLL,
        pattern: 'R U2 R\' U\' R U\' R\'',
        description: 'Converts a dot case to sune.',
        notation: 'R U2 R\' U\' R U\' R\'',
        difficulty: 2,
    },

    // PLL (Permute Last Layer)
    {
        name: 'T-Perm',
        stage: SolvingStage.PLL,
        pattern: 'R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'',
        description: 'One of the most common PLL algorithms. Cycles three corners.',
        notation: 'R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'',
        difficulty: 4,
    },
    {
        name: 'Y-Perm',
        stage: SolvingStage.PLL,
        pattern: 'F R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R F\'',
        description: 'Cycles three corner pieces on the last layer.',
        notation: 'F R U\' R\' U\' R U R\' F\' R U R\' U\' R\' F R F\'',
        difficulty: 4,
    },
    {
        name: 'U-Perm (right)',
        stage: SolvingStage.PLL,
        pattern: 'R U\' R U R U R U\' R\' U\' R2',
        description: 'Cycles the three edge pieces on top layer.',
        notation: 'R U\' R U R U R U\' R\' U\' R2',
        difficulty: 3,
    },
    {
        name: 'A-Perm (right)',
        stage: SolvingStage.PLL,
        pattern: 'R\' F R\' B2 R F\' R\' B2 R2',
        description: 'Swaps two adjacent corner pieces.',
        notation: 'R\' F R\' B2 R F\' R\' B2 R2',
        difficulty: 4,
    },

    // CFOP Layer by Layer
    {
        name: 'White Cross',
        stage: SolvingStage.CROSS,
        pattern: 'D R2 D L2 D\'',
        description: 'Example of solving the white cross.',
        notation: 'D R2 D L2 D\'',
        difficulty: 1,
    },
    {
        name: 'First Layer Corners',
        stage: SolvingStage.LAST_LAYER,
        pattern: 'R U R\' U R U R\'',
        description: 'Cycle of moving first layer corners into place.',
        notation: 'R U R\' U R U R\'',
        difficulty: 2,
    },

    // Advanced - Edge Orientation
    {
        name: 'Edge Flip',
        stage: SolvingStage.EDGE_ORIENTATION,
        pattern: 'F R U\' R\' U\' R U R\' F\'',
        description: 'Flips an edge piece without moving other edges.',
        notation: 'F R U\' R\' U\' R U R\' F\'',
        difficulty: 3,
    },

    // Advanced - Corner Orientation
    {
        name: 'Corner Twist',
        stage: SolvingStage.CORNER_ORIENTATION,
        pattern: 'R U R\' U R U2 R\'',
        description: 'Rotates a corner piece in place.',
        notation: 'R U R\' U R U2 R\'',
        difficulty: 3,
    },
];

/**
 * Get algorithms by solving stage
 */
export function getAlgorithmsByStage(stage: SolvingStage): Algorithm[] {
    return ALGORITHM_SEEDS.filter((algo) => algo.stage === stage);
}

/**
 * Get algorithms by difficulty
 */
export function getAlgorithmsByDifficulty(difficulty: number): Algorithm[] {
    return ALGORITHM_SEEDS.filter((algo) => algo.difficulty === difficulty);
}

/**
 * Search algorithms by name or pattern
 */
export function searchAlgorithms(query: string): Algorithm[] {
    const lower = query.toLowerCase();
    return ALGORITHM_SEEDS.filter(
        (algo) =>
            algo.name.toLowerCase().includes(lower) ||
            algo.pattern.toLowerCase().includes(lower) ||
            algo.description.toLowerCase().includes(lower)
    );
}
