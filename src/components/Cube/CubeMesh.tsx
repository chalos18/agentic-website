/**
 * CubeMesh Component
 * Renders a 3D Rubik's Cube using Three.js and React Three Fiber
 */

'use client';

import { useMemo } from 'react';
import { BoxGeometry, MeshStandardMaterial, Color } from 'three';
import { CubeState } from '@/services/CubeState';

interface CubeMeshProps {
    cubeState: CubeState;
    onMoveApplied?: (move: string) => void;
}

/**
 * Color mapping for cube faces
 */
const FACE_COLORS: Record<number, string> = {
    0: '#FFFFFF', // U (White)
    1: '#FFD700', // D (Yellow)
    2: '#FF0000', // R (Red)
    3: '#FF8C00', // L (Orange)
    4: '#0000FF', // F (Blue)
    5: '#00AA00', // B (Green)
    6: '#111111', // internal/hidden
};

/**
 * Cubie (small cube piece) component
 */
function Cubie({
    position,
    colors,
    index,
}: {
    position: [number, number, number];
    colors: number[];
    index: number;
}) {
    const geometry = useMemo(() => new BoxGeometry(0.95, 0.95, 0.95), []);
    const materials = useMemo(
        () =>
            colors.map((colorIndex) =>
                new MeshStandardMaterial({
                    color: new Color(FACE_COLORS[colorIndex] ?? FACE_COLORS[6]),
                    metalness: 0.1,
                    roughness: 0.7,
                }),
            ),
        [colors],
    );

    return <mesh position={position} geometry={geometry} material={materials} />;
}

function getStickerColor(
    faceKey: string,
    x: number,
    y: number,
    z: number,
    faces: Record<string, number[][]>,
) {
    const face = faces[faceKey];
    if (!face) return 6;

    switch (faceKey) {
        case 'U':
            return face[z === -1 ? 0 : z === 0 ? 1 : 2][x + 1];
        case 'D':
            return face[z === 1 ? 0 : z === 0 ? 1 : 2][x + 1];
        case 'F':
            return face[1 - y][x + 1];
        case 'B':
            return face[1 - y][1 - x];
        case 'R':
            return face[1 - y][1 - z];
        case 'L':
            return face[1 - y][z + 1];
        default:
            return 6;
    }
}

/**
 * Main Cube Mesh component
 */
export default function CubeMesh({ cubeState }: CubeMeshProps) {
    const faces = cubeState.getAllFaces();

    const positions: [number, number, number][] = [
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, 1, 1], [0, 1, 1], [1, 1, 1],
        [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [-1, 0, 0], [0, 0, 0], [1, 0, 0],
        [-1, 0, 1], [0, 0, 1], [1, 0, 1],
        [-1, -1, -1], [0, -1, -1], [1, -1, -1],
        [-1, -1, 0], [0, -1, 0], [1, -1, 0],
        [-1, -1, 1], [0, -1, 1], [1, -1, 1],
    ];

    const cubies = positions.map((pos, index) => {
        const [x, y, z] = pos;
        return {
            position: [x, y, z] as [number, number, number],
            colors: [
                x === 1 ? getStickerColor('R', x, y, z, faces) : 6,
                x === -1 ? getStickerColor('L', x, y, z, faces) : 6,
                y === 1 ? getStickerColor('U', x, y, z, faces) : 6,
                y === -1 ? getStickerColor('D', x, y, z, faces) : 6,
                z === 1 ? getStickerColor('F', x, y, z, faces) : 6,
                z === -1 ? getStickerColor('B', x, y, z, faces) : 6,
            ],
            index,
        };
    });

    return (
        <group>
            {cubies.map((cubie) => (
                <Cubie
                    key={`cubie-${cubie.index}`}
                    position={cubie.position}
                    colors={cubie.colors}
                    index={cubie.index}
                />
            ))}
        </group>
    );
}
