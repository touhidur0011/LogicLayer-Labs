'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';
import * as THREE from 'three';
import { RoundedBox, Text } from '@react-three/drei';
import type { Service } from '../../data/services';

interface Card3DProps {
  service: Service;
  position: [number, number, number];
  rotation: number;
  isActive: boolean;
}

export default function Card3D({
  service,
  position,
  rotation,
  isActive,
}: Card3DProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);

  // Smooth scale animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isActive ? 1.2 : 0.9;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    // Glow effect for active card
    if (materialRef.current) {
      const targetEmissive = isActive ? 0.3 : 0;
      materialRef.current.emissiveIntensity =
        materialRef.current.emissiveIntensity * 0.9 + targetEmissive * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Card Background */}
      <RoundedBox
        ref={meshRef}
        args={[2, 3, 0.1]}
        radius={0.1}
        smoothness={4}
        rotation={[0, rotation, 0]}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={service.color}
          emissive={service.color}
          emissiveIntensity={0}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={isActive ? 1 : 0.7}
        />
      </RoundedBox>

      {/* Card Icon */}
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {service.icon}
      </Text>

      {/* Card Title */}
      <Text
        position={[0, 0.2, 0.06]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
        textAlign="center"
        font="/fonts/Inter-Bold.woff"
      >
        {service.title}
      </Text>

      {/* Card Category */}
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        opacity={0.8}
      >
        {service.category}
      </Text>

      {/* Glow Ring for Active Card */}
      {isActive && (
        <mesh rotation={[0, rotation, 0]} position={[0, 0, -0.1]}>
          <ringGeometry args={[1.2, 1.3, 64]} />
          <meshBasicMaterial color={service.color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
