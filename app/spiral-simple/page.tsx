'use client';

import { useCallback, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Service data
const services = [
  {
    id: 0,
    title: 'Custom Development',
    color: '#10b981',
    items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
    icon: '💻'
  },
  {
    id: 1,
    title: 'Cloud & DevOps',
    color: '#f97316',
    items: ['Performance Optimization', '24/7 Monitoring', 'Cloud Migration'],
    icon: '☁️'
  },
  {
    id: 2,
    title: 'AI & Data Solutions',
    color: '#6366f1',
    items: ['NLP Solutions', 'Machine Learning Models', 'Data Analytics'],
    icon: '🤖'
  }
];

type Card3DProps = {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  index: number;
  onClick: (index: number) => void;
};

function Card3D({ position, color, isActive, index, onClick }: Card3DProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  // active card rotates a bit faster
  useFrame(() => {
    if (meshRef.current) {
      const speed = isActive ? 0.02 : 0.01;
      meshRef.current.rotation.y += speed;
      // subtle bob for activeness
      if (isActive) {
        meshRef.current.position.y = position[1] + Math.sin(Date.now() / 400) * 0.08;
      }
    }
  });

  const s = isActive ? 1.5 : 1;

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[s, s, s]}
      onClick={() => onClick(index)}
      // allow pointer events — helpful for clicks
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 3, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

type SpiralSceneProps = {
  activeIndex: number;
  onCardClick: (index: number) => void;
};

function SpiralScene({ activeIndex, onCardClick }: SpiralSceneProps) {
  const cards = services.map((service, i) => {
    const angle = (i / services.length) * Math.PI * 2;
    const radius = 4;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = -i * 2;

    return (
      <Card3D
        key={service.id}
        position={[x, y, z]}
        color={service.color}
        isActive={i === activeIndex}
        index={i}
        onClick={onCardClick}
      />
    );
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1} position={[5, 5, 5]} />
      {cards}
    </group>
  );
}

// Main Page Component
export default function SimpleSpiralPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollRange = Math.max(1, scrollHeight - clientHeight);
    const progress = scrollTop / scrollRange;
    const nextIndex = Math.round(progress * (services.length - 1));

    setActiveIndex((prev) => {
      if (prev === nextIndex) return prev;
      if (nextIndex < 0) return 0;
      if (nextIndex >= services.length) return services.length - 1;
      return nextIndex;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-auto bg-gray-900"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">LogicLayer Labs</h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">Scroll down to explore services</p>
          <div className="animate-bounce text-cyan-400 text-4xl">↓</div>
        </div>
      </section>

      {/* Spiral Section */}
      <section className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* 3D Canvas */}
          <div className="absolute inset-0 bg-gray-900 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true }}>
              <SpiralScene activeIndex={activeIndex} onCardClick={(i) => setActiveIndex(i)} />
            </Canvas>
          </div>

          {/* Heading */}
          <div className="absolute top-10 md:top-20 left-1/2 -translate-x-1/2 z-10 text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">What We Build</h2>
          </div>

          {/* Card Info Overlay */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-10 md:bottom-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 md:px-6"
          >
            <div
              className="backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${services[activeIndex].color}20, ${services[activeIndex].color}10)`,
                borderColor: services[activeIndex].color,
              }}
            >
              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="text-5xl w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${services[activeIndex].color}30`,
                    border: `2px solid ${services[activeIndex].color}`,
                  }}
                >
                  {services[activeIndex].icon}
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {services[activeIndex].title}
                </h3>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {services[activeIndex].items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: services[activeIndex].color }}
                    >
                      <span className="text-sm">✓</span>
                    </div>
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {services.map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-12 rounded-full transition-all"
                  style={{
                    background: i === activeIndex ? services[activeIndex].color : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to build something amazing?
          </h2>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
