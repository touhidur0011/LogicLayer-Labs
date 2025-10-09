'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Service data
const services = [
  {
    id: 0,
    title: 'Custom Development',
    category: 'Development',
    tagline: 'High-performing digital products',
    description: 'End-to-end product engineering with scalable architecture and meticulous craft.',
    color: '#10b981',
    items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
    icon: '💻'
  },
  {
    id: 1,
    title: 'Cloud & DevOps',
    category: 'Infrastructure',
    tagline: 'Reliability at planetary scale',
    description: 'Automation-first cloud journeys, robust observability, and elite SRE practices.',
    color: '#f97316',
    items: ['Performance Optimization', '24/7 Monitoring', 'Cloud Migration'],
    icon: '☁️'
  },
  {
    id: 2,
    title: 'AI & Data Solutions',
    category: 'AI/ML',
    tagline: 'Insightful, adaptive intelligence',
    description: 'Transformative machine intelligence infused with rich data storytelling and trust.',
    color: '#6366f1',
    items: ['NLP Solutions', 'Machine Learning Models', 'Data Analytics'],
    icon: '🤖'
  }
];

const discoveryOptions = [
  'Websites',
  'Installations',
  'XR / VR / AI',
  'Multiplayer',
  'Games'
];

type Service = (typeof services)[number];

// Particle Spiral Component
function ParticleSpiral({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const particleData = useMemo(() => {
    const count = 3200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const baseAngles = new Float32Array(count);
    const baseRadii = new Float32Array(count);
    const heights = new Float32Array(count);
    const turns = 11;
    const height = 20;

    for (let i = 0; i < count; i++) {
      const progress = i / count;
      const angle = progress * Math.PI * turns;
      const radius = 1.1 + Math.pow(progress, 0.65) * 5.8;
      const y = progress * height - height / 2;
      const index = i * 3;

      positions[index] = Math.cos(angle) * radius;
      positions[index + 1] = y;
      positions[index + 2] = Math.sin(angle) * radius;

      baseAngles[i] = angle;
      baseRadii[i] = radius;
      heights[i] = y;

      const color = new THREE.Color();
      color.setHSL(0.62 - progress * 0.18, 0.85, 0.55 - progress * 0.1);
      colors[index] = color.r;
      colors[index + 1] = color.g;
      colors[index + 2] = color.b;
    }

    return { count, positions, colors, baseAngles, baseRadii, heights };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const time = state.clock.getElapsedTime();
    const { count, baseAngles, baseRadii, heights } = particleData;
    const positionAttribute = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const array = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const height = heights[i];
      const temporalSwirl = Math.sin(time * 0.7 + height * 0.28) * 0.5;
      const baseAngle = baseAngles[i] + temporalSwirl + scrollProgress * Math.PI * 1.6;
      const breathing = Math.sin(time * 1.4 + baseAngles[i] * 1.5) * 0.24;
      const radius = baseRadii[i] + breathing;

      array[idx] = Math.cos(baseAngle) * radius;
      array[idx + 1] = height + Math.sin(time * 1.8 + baseAngles[i]) * 0.12;
      array[idx + 2] = Math.sin(baseAngle) * radius;
    }

    positionAttribute.needsUpdate = true;

    const targetX = Math.sin(scrollProgress * Math.PI) * 0.4;
    points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, scrollProgress * Math.PI * 1.4, 0.08);
    points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, targetX, 0.08);
  });

  return (
    <Points ref={pointsRef} positions={particleData.positions} colors={particleData.colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// 3D Service Cards in Spiral
function ServiceCards({ scrollProgress, activeIndex }: { scrollProgress: number; activeIndex: number }) {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(() => {
    if (groupRef.current) {
      const targetRotation = scrollProgress * Math.PI * 1.2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.08);
    }
  });

  return (
    <group ref={groupRef}>
      {services.map((service, i) => {
        const ratio = i / services.length;
        const baseAngle = ratio * Math.PI * 2;
        const radius = 4.3;
        const height = (i - (services.length - 1) / 2) * 4;
        const x = Math.cos(baseAngle) * radius;
        const z = Math.sin(baseAngle) * radius;
        const isActive = i === activeIndex;

        return (
          <group key={service.id} position={[x, height, z]} rotation={[0, -baseAngle + Math.PI, 0]}>
            <mesh scale={[2.3, 3.1, 1]} position={[0, 0, -0.01]}>
              <planeGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#090f28"
                emissive={service.color}
                emissiveIntensity={0.16}
                metalness={0.35}
                roughness={0.45}
                transparent
                opacity={isActive ? 0.9 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh scale={[2.15, 2.9, 1]} position={[0, 0, 0]}>
              <planeGeometry args={[1, 1]} />
              <meshStandardMaterial
                color="#0f1736"
                metalness={0.12}
                roughness={0.6}
                transparent
                opacity={isActive ? 0.95 : 0.55}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Html
              transform
              distanceFactor={1.15}
              zIndexRange={[0, 0]}
              className="pointer-events-none"
            >
              <motion.div
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0.25,
                  scale: isActive ? 1 : 0.82,
                  filter: isActive ? 'blur(0px)' : 'blur(2px)'
                }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="relative w-64 md:w-72 rounded-[28px] border border-white/10 overflow-hidden backdrop-blur-2xl"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${service.color}28, transparent 60%), rgba(10,16,43,0.85)`,
                  boxShadow: `0 0 60px ${service.color}25`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30" />
                <div className="relative p-6 flex flex-col gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden>{service.icon}</span>
                    <div>
                      <p className="text-xs tracking-[0.3em] uppercase text-white/60">{service.category}</p>
                      <h3 className="text-2xl font-semibold">{service.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{service.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10"
                        style={{ color: service.color }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Main Scene
function SpiralScene({ scrollProgress, activeIndex }: { scrollProgress: number; activeIndex: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 12, 14]} intensity={0.6} color="#5ee7ff" />
      <spotLight
        position={[-6, 18, 8]}
        angle={0.45}
        penumbra={1}
        intensity={0.8}
        color="#a855f7"
        distance={40}
        castShadow
      />
      <fog attach="fog" args={[ '#050816', 10, 32 ]} />

      <ParticleSpiral scrollProgress={scrollProgress} />
      <ServiceCards scrollProgress={scrollProgress} activeIndex={activeIndex} />
    </>
  );
}

// Card Details Overlay
function CardOverlay({ service, isActive }: { service: Service; isActive: boolean }) {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
  className="absolute bottom-10 md:bottom-16 left-1/2 md:left-[58%] -translate-x-1/2 md:translate-x-0 z-20 w-full max-w-3xl px-4 md:px-6"
      >
        <div
          className="backdrop-blur-2xl rounded-3xl p-8 md:p-10 border-2 shadow-2xl"
          style={{
            background: `radial-gradient(circle at top left, ${service.color}30, transparent 70%), 
                         radial-gradient(circle at bottom right, ${service.color}20, transparent 70%), 
                         rgba(10, 14, 39, 0.8)`,
            borderColor: service.color,
            boxShadow: `0 0 60px ${service.color}40`,
          }}
        >
          {/* Icon + Title */}
          <div className="flex items-center gap-6 mb-8">
            <div
              className="text-6xl w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: `${service.color}40`,
                border: `3px solid ${service.color}`,
                boxShadow: `0 0 30px ${service.color}60`,
              }}
            >
              {service.icon}
            </div>
            
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {service.title}
              </h3>
              <p
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: service.color }}
              >
                {service.category}
              </p>
              <p className="text-base md:text-lg text-white/70 mt-3 max-w-xl">
                {service.tagline}
              </p>
            </div>
          </div>

          <p className="text-white/60 leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-3 text-white bg-white/5 rounded-xl p-4 backdrop-blur-sm"
                style={{ borderLeft: `3px solid ${service.color}` }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: service.color }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 flex justify-center gap-3">
          {services.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === service.id ? '48px' : '32px',
                background: i === service.id 
                  ? `linear-gradient(90deg, ${service.color}, ${service.color}80)` 
                  : 'rgba(255,255,255,0.2)',
                boxShadow: i === service.id ? `0 0 20px ${service.color}` : 'none',
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function DiscoveryPanel({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="hidden lg:flex flex-col gap-6 text-left text-white/70 pointer-events-none select-none">
      <div>
        <p className="text-xs tracking-[0.5em] uppercase text-white/50">What are you looking for?</p>
      </div>
      <ul className="space-y-3">
        {discoveryOptions.map((option, idx) => {
          const isHighlighted = idx === activeIndex % discoveryOptions.length;
          return (
            <motion.li
              key={option}
              animate={{
                color: isHighlighted ? '#ffffff' : 'rgba(226,232,255,0.45)',
                x: isHighlighted ? 12 : 0,
                opacity: isHighlighted ? 1 : 0.5
              }}
              className="text-lg font-medium tracking-wide"
            >
              <span className="text-white/40 mr-3">→</span>
              {option}
            </motion.li>
          );
        })}
      </ul>
      <div className="pt-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full text-xs uppercase tracking-[0.3em] text-white/60">
          Ask us anything
          <span className="text-lg">⋯</span>
        </div>
      </div>
    </div>
  );
}

function NeonActionBar() {
  return (
    <div className="hidden md:flex items-center gap-6 px-6 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-white/80">
      <button className="text-sm uppercase tracking-[0.4em] text-white/70">Work</button>
      <div className="h-8 w-px bg-white/20" />
      <button className="text-sm uppercase tracking-[0.4em] text-white">Contact</button>
    </div>
  );
}

// Main Page
export default function ActiveTheorySpiral() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
      
      setScrollProgress(progress);
      
      // Calculate active card
      const index = Math.round(progress * (services.length - 1));
      setActiveIndex(Math.max(0, Math.min(services.length - 1, index)));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen overflow-y-auto bg-gradient-to-b from-[#0a0e27] via-[#16213e] to-[#0a0e27]"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
            style={{ textShadow: '0 0 60px rgba(0, 255, 245, 0.5)' }}
          >
            LogicLayer Labs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-cyan-300 mb-12"
          >
            Scroll to explore our spiral universe
          </motion.p>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-cyan-400 text-5xl"
          >
            ↓
          </motion.div>
        </div>
      </section>

      {/* Spiral Section */}
      <section className="relative" style={{ height: '400vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Canvas Background */}
          <div className="absolute inset-0 z-0">
            <Canvas
              dpr={[1, 1.8]}
              camera={{ position: [0, 0, 13], fov: 55 }}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
              <SpiralScene scrollProgress={scrollProgress} activeIndex={activeIndex} />
            </Canvas>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-10 text-center"
          >
            <h2
              className="text-5xl md:text-6xl font-bold text-white"
              style={{ textShadow: '0 0 40px rgba(0, 255, 245, 0.6)' }}
            >
              What We Build
            </h2>
          </motion.div>

          <div className="absolute top-12 right-12 z-10">
            <NeonActionBar />
          </div>

          <div className="absolute top-1/2 left-10 -translate-y-1/2 z-10">
            <DiscoveryPanel activeIndex={activeIndex} />
          </div>

          {/* Card Overlay */}
          <CardOverlay service={services[activeIndex]} isActive={true} />

          {/* Scroll Progress Indicator */}
          <div className="absolute top-1/2 right-8 -translate-y-1/2 z-10">
            <div className="w-1 h-48 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-cyan-400 to-blue-500"
                style={{ height: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0e27] to-black">
        <div className="text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to build something amazing?
          </h2>
          <button
            className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xl font-semibold hover:scale-110 transition-transform shadow-lg"
            style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)' }}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
