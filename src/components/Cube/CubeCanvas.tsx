/**
 * CubeCanvas Component
 * Wraps the 3D cube in a React Three Fiber canvas with proper setup
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Lights } from '@react-three/drei';
import CubeMesh from './CubeMesh';
import { CubeState } from '@/services/CubeState';

interface CubeCanvasProps {
    cubeState: CubeState;
    onMoveApplied?: (move: string) => void;
}

export default function CubeCanvas({ cubeState, onMoveApplied }: CubeCanvasProps) {
    return (
        <Canvas
            className="w-full h-full"
            gl={{
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true,
            }}
            dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        >
            {/* Lighting setup */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={0.8} />
            <directionalLight position={[-10, -10, -10]} intensity={0.3} />
            <pointLight position={[0, 0, 5]} intensity={0.4} />

            {/* Camera */}
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 5]}
                fov={75}
                near={0.1}
                far={1000}
            />

            {/* Cube mesh */}
            <CubeMesh cubeState={cubeState} onMoveApplied={onMoveApplied} />

            {/* Orbit controls for mouse interaction */}
            <OrbitControls
                enableDamping={true}
                dampingFactor={0.05}
                autoRotate={false}
                autoRotateSpeed={4}
                maxDistance={15}
                minDistance={2}
            />
        </Canvas>
    );
}
