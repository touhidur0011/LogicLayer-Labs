'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../../data/services';

interface CardDetailsProps {
  service: Service;
  isActive: boolean;
}

export default function CardDetails({ service, isActive }: CardDetailsProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 max-w-2xl w-full px-6"
      >
        {/* Card Container */}
        <div
          className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 relative overflow-hidden"
          style={{
            background: service.bgGradient,
            borderColor: service.borderColor,
          }}
        >
          {/* Glow Effect */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-20 blur-xl"
            style={{ background: service.color }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="text-5xl flex items-center justify-center w-16 h-16 rounded-2xl"
                style={{
                  background: `${service.color}20`,
                  border: `2px solid ${service.color}`,
                }}
              >
                {service.icon}
              </div>

              <div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {service.title}
                </h3>
                <p
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ color: service.color }}
                >
                  {service.category}
                </p>
              </div>

              {/* Plus Icon */}
              <button
                className="ml-auto w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: service.color,
                  boxShadow: `0 0 20px ${service.color}60`,
                }}
              >
                <span className="text-white text-2xl font-bold">+</span>
              </button>
            </div>

            {/* Service Items */}
            <div className="space-y-3">
              {service.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="flex items-center gap-3 text-white"
                >
                  {/* Checkmark */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: service.color }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <span className="text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-12 rounded-full transition-all duration-300"
              style={{
                background:
                  i === parseInt(service.id.split('-')[1] || '0')
                    ? service.color
                    : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
