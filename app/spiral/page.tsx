'use client';

import SpiralGallery from '../../components/SpiralGallery/SpiralGallery';

export default function SpiralDemo() {
  return (
    <main className="min-h-screen bg-[#0a0e27]">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0e27] to-[#16213e]">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-white mb-6">
            LogicLayer Labs
          </h1>
          <p className="text-2xl text-gray-400 mb-8">
            Scroll down to explore our services in 3D
          </p>
          <div className="animate-bounce">
            <svg
              className="w-8 h-8 mx-auto text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Spiral Gallery Section */}
      <SpiralGallery />

      {/* Footer */}
      <section className="h-screen flex items-center justify-center bg-[#1a0b2e]">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to build something amazing?
          </h2>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform">
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
