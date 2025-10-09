'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}

export default function TestPage() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <h1 className="absolute top-10 left-10 text-white text-4xl z-10">
        Three.js Test Page
      </h1>
      
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <RotatingCube />
      </Canvas>
    </div>
  );
}
