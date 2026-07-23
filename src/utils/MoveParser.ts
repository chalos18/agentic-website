/**
 * MoveParser: Parses and validates cube move notation
 * Handles standard Rubik's cube notation (R, L, U, D, F, B, etc.)
 */

import { MoveNotation } from '@/types/cube';

/**
 * Parse a string of moves into an array of valid notations
 * Supports: "R U R' U'" or "R U R' U' " with flexible spacing
 */
export function parseMoveSequence(sequence: string): MoveNotation[] {
    const moves: MoveNotation[] = [];

    // Remove extra spaces and normalize
    const normalized = sequence.trim().replace(/\s+/g, ' ');
    const tokens = normalized.split(' ');

    for (const token of tokens) {
        if (token.length === 0) continue;

        const move = validateMove(token);
        if (move) {
            moves.push(move);
        } else {
            throw new Error(`Invalid move notation: "${token}"`);
        }
    }

    return moves;
}

/**
 * Validate and normalize a single move token
 * Returns the standardized MoveNotation or null if invalid
 */
export function validateMove(token: string): MoveNotation | null {
    // Remove any whitespace
    const clean = token.trim();

    // Valid base moves and their modifiers
    const validMoves = [
        'R', 'L', 'U', 'D', 'F', 'B',
        'x', 'y', 'z',        // Cube rotations
        'M', 'E', 'S',        // Middle slices
    ];

    // Extract base move (first character)
    const base = clean.charAt(0);

    if (!validMoves.includes(base)) {
        return null;
    }

    // Check modifiers (rest of the string)
    const modifier = clean.slice(1);

    if (modifier === '' || modifier === "'") {
        // R or R'
        if (modifier === "'") {
            return (base + "'") as MoveNotation;
        }
        return base as MoveNotation;
    } else if (modifier === '2') {
        // R2
        return (base + '2') as MoveNotation;
    } else {
        return null; // Invalid modifier
    }
}

/**
 * Convert a move to its inverse (e.g., R -> R', R' -> R)
 */
export function invertMove(move: MoveNotation): MoveNotation {
    if (move.endsWith("'")) {
        return move.slice(0, -1) as MoveNotation;
    }
    return (move + "'") as MoveNotation;
}

/**
 * Get opposite face move (for cube rotations)
 * e.g., R -> L, U -> D
 */
export function getOppositeFace(move: string): string {
    const opposites: Record<string, string> = {
        R: 'L',
        L: 'R',
        U: 'D',
        D: 'U',
        F: 'B',
        B: 'F',
        x: 'x',
        y: 'y',
        z: 'z',
        M: 'M',
        E: 'E',
        S: 'S',
    };

    return opposites[move] || move;
}

/**
 * Simplify a move sequence by combining consecutive moves
 * e.g., [R, R, R] -> [R'] or [R, R] -> [R2]
 */
export function simplifyMoveSequence(moves: MoveNotation[]): MoveNotation[] {
    if (moves.length === 0) return [];

    const simplified: MoveNotation[] = [];
    let i = 0;

    while (i < moves.length) {
        const current = moves[i];
        const baseMove = current.charAt(0);
        let count = 1;

        // Count consecutive same-base moves
        while (
            i + count < moves.length &&
            moves[i + count].charAt(0) === baseMove
        ) {
            const modifier = moves[i + count].slice(1);
            if (modifier === '2') {
                count += 2;
            } else if (modifier === "'") {
                count += 3;
            } else {
                count += 1;
            }
        }

        // Normalize to 0-3 rotations (4 rotations = 0)
        count = count % 4;

        if (count === 0) {
            // Skip (no rotation)
        } else if (count === 1) {
            simplified.push(baseMove as MoveNotation);
        } else if (count === 2) {
            simplified.push((baseMove + '2') as MoveNotation);
        } else if (count === 3) {
            simplified.push((baseMove + "'") as MoveNotation);
        }

        i += moves.slice(i).findIndex(
            (m) => m.charAt(0) !== baseMove || count === 0
        ) + 1;
        if (i - 1 >= moves.length) break;
    }

    return simplified;
}

/**
 * Check if two moves conflict (same base move applied consecutively)
 */
export function movesConflict(move1: MoveNotation, move2: MoveNotation): boolean {
    return move1.charAt(0) === move2.charAt(0);
}

/**
 * Format a move sequence for display
 * Groups into lines of 8 moves for readability
 */
export function formatMoveSequence(moves: MoveNotation[], perLine: number = 8): string {
    const lines: string[] = [];

    for (let i = 0; i < moves.length; i += perLine) {
        const chunk = moves.slice(i, i + perLine);
        lines.push(chunk.join(' '));
    }

    return lines.join('\n');
}
