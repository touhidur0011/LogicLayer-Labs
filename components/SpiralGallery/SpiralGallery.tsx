'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpiralScene from './SpiralScene';
import CardDetails from './CardDetails';
import { services } from '../../data/services';

gsap.registerPlugin(ScrollTrigger);

export default function SpiralGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: '.canvas-wrapper',
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          // Calculate active card based on scroll progress
          const cardIndex = Math.round(progress * (services.length - 1));
          setActiveCardIndex(cardIndex);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${services.length * 100}vh` }}
    >
      {/* Fixed Canvas Container */}
      <div className="canvas-wrapper sticky top-0 left-0 w-full h-screen overflow-hidden bg-gradient-to-b from-[#0a0e27] via-[#16213e] to-[#1a0b2e]">
        {/* Heading */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            What We Build
          </h2>
          <p className="text-xl text-gray-400">
            Comprehensive Software Solutions for Modern Businesses
          </p>
        </div>

        {/* Three.js Canvas */}
        <Canvas
          className="w-full h-full"
          gl={{ antialias: true, alpha: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          <SpiralScene
            scrollProgress={scrollProgress}
            activeCardIndex={activeCardIndex}
            services={services}
          />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>

        {/* Card Details Overlay */}
        <CardDetails
          service={services[activeCardIndex]}
          isActive={true}
        />
      </div>
    </section>
  );
}
