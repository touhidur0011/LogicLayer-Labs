'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import Card3D from './Card3D';
import type { Service } from '../../data/services';

interface SpiralSceneProps {
  scrollProgress: number;
  activeCardIndex: number;
  services: Service[];
}

export default function SpiralScene({
  scrollProgress,
  activeCardIndex,
  services,
}: SpiralSceneProps) {
  const groupRef = useRef<Group>(null);

  // Calculate spiral positions for all cards
  const cardPositions = useMemo(() => {
    const positions: Array<{ x: number; y: number; z: number; rotation: number }> = [];
    const totalCards = services.length;
    const radiusBase = 3;
    const radiusGrowth = 0.3;
    const verticalSpacing = 2.5;
    const numberOfTurns = 1.5;

    for (let i = 0; i < totalCards; i++) {
      const angle = (i / totalCards) * Math.PI * 2 * numberOfTurns;
      const radius = radiusBase + i * radiusGrowth;

      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = -i * verticalSpacing;

      positions.push({
        x,
        y,
        z,
        rotation: angle,
      });
    }

    return positions;
  }, [services.length]);

  // Animate spiral rotation based on scroll
  useFrame(() => {
    if (groupRef.current) {
      // Rotate entire spiral group based on scroll progress
      const targetRotation = scrollProgress * Math.PI * 2 * 1.5;
      groupRef.current.rotation.y = targetRotation;

      // Move camera up/down through the spiral
      const targetY = scrollProgress * (services.length - 1) * 2.5;
      groupRef.current.position.y = targetY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} />

      {/* Directional Light */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Point Lights for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#00fff5" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ff00ff" />

      {/* Render 3D Cards */}
      {services.map((service, index) => (
        <Card3D
          key={service.id}
          service={service}
          position={[
            cardPositions[index].x,
            cardPositions[index].y,
            cardPositions[index].z,
          ]}
          rotation={cardPositions[index].rotation}
          isActive={index === activeCardIndex}
          scale={index === activeCardIndex ? 1.2 : 0.9}
        />
      ))}

      {/* Particle Effect (optional) */}
      {/* Add particle system here for extra visual appeal */}
    </group>
  );
}
