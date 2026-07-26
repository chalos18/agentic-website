/**
 * TwistyPuzzle: geometric state for any puzzle in `definitions.ts`.
 *
 * A piece knows where it is (`position`) and which way it is facing (`quat`).
 * A move rotates the selected pieces about an axis — exactly what the renderer
 * animates, which is why the visual turn and the logical turn can never drift
 * apart. Instances are immutable; every move returns a new puzzle.
 */

import {
  IDENTITY_QUAT,
  applyQuat,
  dot,
  interiorPoint,
  quatFromAxisAngle,
  quatMul,
  samePlane,
  splitPolytope,
  translatePolytope,
  boxPolytope,
  clipPolytope,
  length,
  sub,
} from "./geometry";
import type { Plane, Polytope, Quat, Vec3 } from "./geometry";
import { PUZZLES, type PuzzleDefinition, type PuzzleId } from "./definitions";

export interface PieceFace {
  /** Outward normal in the piece's own frame. */
  normal: Vec3;
  /** Ring of vertices, relative to the piece centre, wound CCW about `normal`. */
  points: Vec3[];
  /** Sticker colour, or `null` for an inner surface that shows plastic. */
  color: string | null;
}

/** Shape and home orientation — shared by every state of a given puzzle. */
export interface PieceShape {
  id: number;
  home: Vec3;
  faces: PieceFace[];
}

export interface PiecePlacement {
  position: Vec3;
  quat: Quat;
}

/** A move split into the parts the renderer needs to animate it. */
export interface TurnSpec {
  move: string;
  axis: Vec3;
  /** Total rotation in radians, signed. */
  angle: number;
  /** Ids of the pieces that travel. */
  pieceIds: number[];
}

const shapeCache = new Map<PuzzleId, PieceShape[]>();

function buildShapes(def: PuzzleDefinition): PieceShape[] {
  // Carve the solid out of oversized stock, then split it with every cut plane.
  let solid: Polytope | null = boxPolytope(6);
  for (const face of def.shell) {
    solid = solid && clipPolytope(solid, face.plane);
  }
  if (!solid) return [];

  let fragments: Polytope[] = [solid];
  for (const cut of def.cuts) {
    const next: Polytope[] = [];
    for (const fragment of fragments) {
      const [inside, outside] = splitPolytope(fragment, cut);
      if (inside) next.push(inside);
      if (outside) next.push(outside);
    }
    fragments = next;
  }

  const shapes: PieceShape[] = [];
  for (const fragment of fragments) {
    const centre = interiorPoint(fragment);
    const local = translatePolytope(fragment, [
      -centre[0],
      -centre[1],
      -centre[2],
    ]);

    const faces: PieceFace[] = local.map((face) => {
      const worldPlane: Plane = {
        n: face.plane.n,
        d: face.plane.d + dot(face.plane.n, centre),
      };
      const shell = def.shell.find((s) => samePlane(s.plane, worldPlane));
      return {
        normal: face.plane.n,
        points: face.points,
        color: shell ? shell.color : null,
      };
    });

    // Pieces buried inside the puzzle never show; skip them.
    if (!faces.some((f) => f.color)) continue;
    shapes.push({ id: shapes.length, home: centre, faces });
  }
  return shapes;
}

function getShapes(def: PuzzleDefinition): PieceShape[] {
  const cached = shapeCache.get(def.id);
  if (cached) return cached;
  const built = buildShapes(def);
  shapeCache.set(def.id, built);
  return built;
}

/** Split `R2` / `BL'` into its base move and how many quarter (or fifth) turns it is. */
export function parsePuzzleMove(
  move: string,
  def: PuzzleDefinition
): { base: string; turns: number } | null {
  const match = /^(.*?)(['2])?$/.exec(move);
  if (!match) return null;
  const base = match[1];
  if (!def.moves[base]) return null;
  return { base, turns: match[2] === "'" ? -1 : match[2] === "2" ? 2 : 1 };
}

/**
 * Tokenize a whitespace-separated move string and validate every token against
 * `def`'s own move set (the same check `TwistyPuzzle.turnSpec` applies), so
 * accepted notation can never drift from what the puzzle actually understands.
 */
export function parseMoveSequence(
  sequence: string,
  def: PuzzleDefinition
): string[] {
  const tokens = sequence.trim().split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (!parsePuzzleMove(token, def)) {
      throw new Error(`Invalid move notation: "${token}"`);
    }
  }
  return tokens;
}

export class TwistyPuzzle {
  readonly def: PuzzleDefinition;
  readonly shapes: PieceShape[];
  readonly placements: readonly PiecePlacement[];
  readonly history: readonly string[];

  private constructor(
    def: PuzzleDefinition,
    shapes: PieceShape[],
    placements: readonly PiecePlacement[],
    history: readonly string[]
  ) {
    this.def = def;
    this.shapes = shapes;
    this.placements = placements;
    this.history = history;
  }

  static create(id: PuzzleId): TwistyPuzzle {
    const def = PUZZLES[id];
    const shapes = getShapes(def);
    return new TwistyPuzzle(
      def,
      shapes,
      shapes.map((s) => ({ position: s.home, quat: IDENTITY_QUAT })),
      []
    );
  }

  reset(): TwistyPuzzle {
    return TwistyPuzzle.create(this.def.id);
  }

  /** The axis, angle and pieces a move affects — everything needed to animate it. */
  turnSpec(move: string): TurnSpec | null {
    const parsed = parsePuzzleMove(move, this.def);
    if (!parsed) return null;
    const { axis, threshold, ceiling, order } = this.def.moves[parsed.base];
    const pieceIds: number[] = [];
    this.placements.forEach((placement, i) => {
      const along = dot(axis, placement.position);
      if (along > threshold + 1e-4 && along < (ceiling ?? Infinity) + 1e-4)
        pieceIds.push(i);
    });
    // Positive turns are clockwise seen from outside the face, which is a
    // negative rotation under the right-hand rule.
    return {
      move,
      axis,
      angle: (-2 * Math.PI * parsed.turns) / order,
      pieceIds,
    };
  }

  applyMove(move: string, record = true): TwistyPuzzle {
    const spec = this.turnSpec(move);
    if (!spec) return this;

    const rotation = quatFromAxisAngle(spec.axis, spec.angle);
    const moving = new Set(spec.pieceIds);
    const placements = this.placements.map((placement, i) =>
      moving.has(i)
        ? {
            position: applyQuat(rotation, placement.position),
            quat: quatMul(rotation, placement.quat),
          }
        : placement
    );

    return new TwistyPuzzle(
      this.def,
      this.shapes,
      placements,
      record ? [...this.history, move] : this.history
    );
  }

  applyMoves(moves: string[], record = true): TwistyPuzzle {
    return moves.reduce<TwistyPuzzle>(
      (puzzle, move) => puzzle.applyMove(move, record),
      this
    );
  }

  undo(): TwistyPuzzle {
    const last = this.history[this.history.length - 1];
    if (!last) return this;
    return new TwistyPuzzle(
      this.def,
      this.shapes,
      this.applyMove(invertPuzzleMove(last), false).placements,
      this.history.slice(0, -1)
    );
  }

  /** A random scramble that never immediately repeats an axis. */
  scrambleSequence(count = this.def.scrambleLength): string[] {
    const pool = this.def.scrambleMoves;
    const suffixes = [
      "",
      "'",
      ...(this.def.moves[pool[0]].order === 4 ? ["2"] : []),
    ];
    const moves: string[] = [];
    let previous = "";
    while (moves.length < count) {
      const base = pool[Math.floor(Math.random() * pool.length)];
      if (base === previous) continue;
      previous = base;
      moves.push(base + suffixes[Math.floor(Math.random() * suffixes.length)]);
    }
    return moves;
  }

  isSolved(): boolean {
    // A face is solved when every sticker pointing its way shares a colour.
    const byNormal = new Map<string, string>();
    for (let i = 0; i < this.shapes.length; i++) {
      const { quat } = this.placements[i];
      for (const face of this.shapes[i].faces) {
        if (!face.color) continue;
        const world = applyQuat(quat, face.normal);
        const key = `${Math.round(world[0] * 100)},${Math.round(world[1] * 100)},${Math.round(world[2] * 100)}`;
        const seen = byNormal.get(key);
        if (seen === undefined) byNormal.set(key, face.color);
        else if (seen !== face.color) return false;
      }
    }
    return true;
  }

  /** Distance from home, as a 0–1 fraction of pieces still misplaced. */
  disorder(): number {
    let moved = 0;
    for (let i = 0; i < this.shapes.length; i++) {
      if (length(sub(this.placements[i].position, this.shapes[i].home)) > 1e-3)
        moved++;
    }
    return this.shapes.length ? moved / this.shapes.length : 0;
  }
}

export function invertPuzzleMove(move: string): string {
  if (move.endsWith("2")) return move;
  if (move.endsWith("'")) return move.slice(0, -1);
  return `${move}'`;
}
