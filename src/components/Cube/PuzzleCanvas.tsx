/**
 * PuzzleCanvas: the three.js stage the puzzle turns on.
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PuzzleMesh from './PuzzleMesh';
import type { TurnSpec, TwistyPuzzle } from '@/services/puzzles/TwistyPuzzle';

interface PuzzleCanvasProps {
    puzzle: TwistyPuzzle;
    turn: TurnSpec | null;
    duration: number;
    onTurnComplete: () => void;
}

export default function PuzzleCanvas({ puzzle, turn, duration, onTurnComplete }: PuzzleCanvasProps) {
    const distance = puzzle.def.cameraDistance;

    return (
        <Canvas
            className="w-full h-full"
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
            camera={{
                // Unit direction, above and to the right, so three faces read at once.
                position: [distance * 0.56, distance * 0.5, distance * 0.66],
                fov: 42,
                near: 0.1,
                far: 200,
            }}
        >

            <ambientLight intensity={0.85} />
            <hemisphereLight args={['#FBF3E6', '#3A2E28', 0.55]} />
            <directionalLight position={[6, 9, 7]} intensity={1.5} />
            <directionalLight position={[-7, -3, -5]} intensity={0.45} />

            <PuzzleMesh
                puzzle={puzzle}
                turn={turn}
                duration={duration}
                onTurnComplete={onTurnComplete}
            />

            <OrbitControls
                makeDefault
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.8}
                minDistance={distance * 0.55}
                maxDistance={distance * 2.2}
            />
        </Canvas>
    );
}
