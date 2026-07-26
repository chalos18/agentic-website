/**
 * PuzzleMesh: draws a TwistyPuzzle and turns its layers.
 *
 * Pieces are split into the ones a move grabs and the ones it leaves behind. The
 * grabbed pieces sit in a group parked at the origin, so swinging that group's
 * quaternion about the move axis *is* the layer turn — no per-piece bookkeeping,
 * and it works the same for a 5x5 slice, a pyraminx tip and a megaminx face.
 */

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferGeometry, Float32BufferAttribute, Group, MeshStandardMaterial, Vector3 } from 'three';
import type { PieceShape, TurnSpec, TwistyPuzzle } from '@/services/puzzles/TwistyPuzzle';
import type { Vec3 } from '@/services/puzzles/geometry';

interface PuzzleMeshProps {
    puzzle: TwistyPuzzle;
    /** The turn in flight, or `null` when the puzzle is at rest. */
    turn: TurnSpec | null;
    /** Seconds a full turn takes. `0` snaps straight to the end. */
    duration: number;
    onTurnComplete: () => void;
}

/** How far a sticker is pulled in from the piece edge, leaving a plastic gap. */
const STICKER_INSET = 0.86;
/** How far a sticker floats above the piece surface. */
const STICKER_LIFT = 0.012;

const BODY_MATERIAL = new MeshStandardMaterial({
    color: '#241D1A',
    roughness: 0.62,
    metalness: 0.05,
});

const stickerMaterials = new Map<string, MeshStandardMaterial>();
function stickerMaterial(color: string): MeshStandardMaterial {
    let material = stickerMaterials.get(color);
    if (!material) {
        material = new MeshStandardMaterial({ color, roughness: 0.34, metalness: 0.04 });
        stickerMaterials.set(color, material);
    }
    return material;
}

/** Fan-triangulate a convex ring, optionally shrunk toward its centre and lifted along its normal. */
function ringTriangles(points: Vec3[], normal: Vec3, inset: number, lift: number): number[] {
    const n = points.length;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (const p of points) {
        cx += p[0];
        cy += p[1];
        cz += p[2];
    }
    cx /= n;
    cy /= n;
    cz /= n;

    const shaped = points.map<Vec3>((p) => [
        cx + (p[0] - cx) * inset + normal[0] * lift,
        cy + (p[1] - cy) * inset + normal[1] * lift,
        cz + (p[2] - cz) * inset + normal[2] * lift,
    ]);

    const out: number[] = [];
    for (let i = 1; i < n - 1; i++) {
        out.push(...shaped[0], ...shaped[i], ...shaped[i + 1]);
    }
    return out;
}

function geometryFrom(vertices: number[]): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    return geometry;
}

interface PieceGeometry {
    body: BufferGeometry;
    stickers: { geometry: BufferGeometry; color: string }[];
}

function buildGeometries(shapes: PieceShape[]): PieceGeometry[] {
    return shapes.map((shape) => ({
        body: geometryFrom(
            shape.faces.flatMap((face) => ringTriangles(face.points, face.normal, 1, 0)),
        ),
        stickers: shape.faces
            .filter((face) => face.color)
            .map((face) => ({
                color: face.color as string,
                geometry: geometryFrom(
                    ringTriangles(face.points, face.normal, STICKER_INSET, STICKER_LIFT),
                ),
            })),
    }));
}

function Piece({ geometry }: { geometry: PieceGeometry }) {
    return (
        <>
            <mesh geometry={geometry.body} material={BODY_MATERIAL} castShadow receiveShadow />
            {geometry.stickers.map((sticker, i) => (
                <mesh key={i} geometry={sticker.geometry} material={stickerMaterial(sticker.color)} />
            ))}
        </>
    );
}

/**
 * Ease-out with a small overshoot, so a layer lands with the click of a real
 * puzzle rather than gliding to a stop.
 */
function easeTurn(t: number): number {
    const c1 = 0.9;
    const p = t - 1;
    return 1 + (c1 + 1) * p * p * p + c1 * p * p;
}

export default function PuzzleMesh({ puzzle, turn, duration, onTurnComplete }: PuzzleMeshProps) {
    const geometries = useMemo(() => buildGeometries(puzzle.shapes), [puzzle.shapes]);
    const turningRef = useRef<Group>(null);
    const elapsedRef = useRef(0);
    const axisRef = useRef(new Vector3());
    const finishedRef = useRef(false);

    const turningIds = useMemo(() => new Set(turn?.pieceIds ?? []), [turn]);

    useEffect(() => {
        elapsedRef.current = 0;
        finishedRef.current = false;
        turningRef.current?.quaternion.set(0, 0, 0, 1);
    }, [turn]);

    useFrame((_, delta) => {
        const group = turningRef.current;
        if (!turn || !group) return;

        elapsedRef.current += delta;
        const t = duration > 0 ? Math.min(1, elapsedRef.current / duration) : 1;
        axisRef.current.set(turn.axis[0], turn.axis[1], turn.axis[2]);
        group.quaternion.setFromAxisAngle(axisRef.current, turn.angle * easeTurn(t));

        if (t >= 1 && !finishedRef.current) {
            finishedRef.current = true;
            onTurnComplete();
        }
    });

    return (
        <group>
            <group>
                {puzzle.placements.map((placement, i) =>
                    turningIds.has(i) ? null : (
                        <group key={i} position={[...placement.position] as [number, number, number]} quaternion={[...placement.quat] as [number, number, number, number]}>
                            <Piece geometry={geometries[i]} />
                        </group>
                    ),
                )}
            </group>

            <group ref={turningRef}>
                {puzzle.placements.map((placement, i) =>
                    turningIds.has(i) ? (
                        <group key={i} position={[...placement.position] as [number, number, number]} quaternion={[...placement.quat] as [number, number, number, number]}>
                            <Piece geometry={geometries[i]} />
                        </group>
                    ) : null,
                )}
            </group>
        </group>
    );
}
