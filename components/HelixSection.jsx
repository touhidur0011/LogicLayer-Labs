'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import styles from '../styles/HelixSection.module.css'

const logos = [
  { icon: 'fa-python', position: 'left', index: 0 },
  { icon: 'fa-react', position: 'left', index: 1 },
  { icon: 'fa-angular', position: 'left', index: 2 },
  { icon: 'fa-docker', position: 'left', index: 3 },
  { icon: 'fa-node-js', position: 'left', index: 4 },
  { icon: 'fa-vuejs', position: 'left', index: 5 },
  { icon: 'fa-microsoft', position: 'right', index: 0 },
  { icon: 'fa-google', position: 'right', index: 1 },
  { icon: 'fa-github', position: 'right', index: 2 },
  { icon: 'fa-slack', position: 'right', index: 3 },
  { icon: 'fa-figma', position: 'right', index: 4 },
  { icon: 'fa-git-alt', position: 'right', index: 5 },
]

export default function HelixSection() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const particleCanvasRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  // Smooth mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 100 })
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 100 })
  
  // Spring-based rotation
  const rotation = useMotionValue(0)
  const velocity = useRef(0)
  const targetRotation = useRef(0)

  // Parallax values
  const rotateY = useTransform(smoothMouseX, [-500, 500], [20, -20])
  const rotateX = useTransform(smoothMouseY, [-500, 500], [-15, 15])

  useEffect(() => {
    // Intersection Observer for scroll reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        mouseX.set(e.clientX - rect.left - rect.width / 2)
        mouseY.set(e.clientY - rect.top - rect.height / 2)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    // Create stars
    const starsBg = document.getElementById('starsBg')
    if (starsBg) {
      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 3 + 's'
        star.style.animationDuration = (Math.random() * 2 + 2) + 's'
        starsBg.appendChild(star)
      }
    }

    // Particle system
    const particleCanvas = particleCanvasRef.current
    const ctx = particleCanvas?.getContext('2d')
    
    if (particleCanvas && ctx) {
      particleCanvas.width = window.innerWidth
      particleCanvas.height = window.innerHeight

      const particles = []
      const particleCount = 50

      class Particle {
        constructor() {
          this.reset()
        }

        reset() {
          this.x = Math.random() * particleCanvas.width
          this.y = Math.random() * particleCanvas.height
          this.size = Math.random() * 2 + 1
          this.speedX = (Math.random() - 0.5) * 0.5
          this.speedY = (Math.random() - 0.5) * 0.5
          this.opacity = Math.random() * 0.5 + 0.2
          this.color = Math.random() > 0.5 ? 'rgba(0, 255, 245,' : 'rgba(255, 0, 153,'
        }

        update() {
          this.x += this.speedX
          this.y += this.speedY

          if (this.x < 0 || this.x > particleCanvas.width || 
              this.y < 0 || this.y > particleCanvas.height) {
            this.reset()
          }
        }

        draw() {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fillStyle = this.color + this.opacity + ')'
          ctx.fill()
          ctx.shadowBlur = 10
          ctx.shadowColor = this.color + '0.8)'
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      let animationId
      function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)
        particles.forEach(particle => {
          particle.update()
          particle.draw()
        })
        animationId = requestAnimationFrame(animateParticles)
      }

      animateParticles()

      const handleResize = () => {
        particleCanvas.width = window.innerWidth
        particleCanvas.height = window.innerHeight
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  useEffect(() => {
    // DNA Helix Animation
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    
    if (!canvas || !ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const config = {
      radius: 200,
      height: 400,
      turns: 2,
      speed: 0.012,
      springConstant: 0.05,
      friction: 0.8,
    }

    let hue = 0
    let animationId

    const calculatePosition = (index, total, time, isLeft, mouseInfluence = { x: 0, y: 0 }) => {
      const progress = index / total
      const angle = progress * Math.PI * 2 * config.turns + time
      const x = Math.cos(angle) * config.radius * (isLeft ? 1 : -1) + mouseInfluence.x * 0.1
      const y = progress * config.height - config.height / 2 + mouseInfluence.y * 0.1
      const z = Math.sin(angle) * config.radius

      return { x, y, z, angle }
    }

    const drawConnections = () => {
      const time = rotation.get()
      const mouseInfluence = { 
        x: smoothMouseX.get() * 0.3, 
        y: smoothMouseY.get() * 0.3 
      }

      // Draw connection lines
      for (let i = 0; i < 6; i++) {
        const leftPos = calculatePosition(i, 6, time, true, mouseInfluence)
        const rightPos = calculatePosition(i, 6, time, false, mouseInfluence)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Gradient line
        const gradient = ctx.createLinearGradient(
          centerX + leftPos.x, centerY + leftPos.y,
          centerX + rightPos.x, centerY + rightPos.y
        )
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`)
        gradient.addColorStop(0.5, `hsl(${hue + 60}, 100%, 60%)`)
        gradient.addColorStop(1, `hsl(${hue + 120}, 100%, 50%)`)

        ctx.beginPath()
        ctx.moveTo(centerX + leftPos.x, centerY + leftPos.y)
        ctx.lineTo(centerX + rightPos.x, centerY + rightPos.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.shadowBlur = 15
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`
        ctx.stroke()
      }

      hue = (hue + 0.5) % 360
    }

    const updateLogos = () => {
      const time = rotation.get()
      const mouseInfluence = { 
        x: smoothMouseX.get() * 0.3, 
        y: smoothMouseY.get() * 0.3 
      }

      logos.forEach((logo) => {
        const isLeft = logo.position === 'left'
        const index = logo.index
        const pos = calculatePosition(index, 6, time, isLeft, mouseInfluence)

        const logoElement = document.querySelector(
          `.helix-logo.${logo.position}-strand[data-index="${index}"]`
        )

        if (logoElement) {
          const scale = 1 + (pos.z / config.radius) * 0.3
          const opacity = 0.4 + (pos.z / config.radius + 1) * 0.3

          logoElement.style.transform = `
            translate(-50%, -50%)
            translate(${pos.x}px, ${pos.y}px)
            scale(${scale})
            translateZ(${pos.z}px)
          `
          logoElement.style.opacity = opacity
          logoElement.style.zIndex = Math.round(pos.z + 100)
        }
      })
    }

    const animate = () => {
      // Spring physics
      velocity.current += (targetRotation.current - rotation.get()) * config.springConstant
      velocity.current *= config.friction
      rotation.set(rotation.get() + velocity.current)

      // Auto-rotate
      targetRotation.current += config.speed

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawConnections()
      updateLogos()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [rotation, smoothMouseX, smoothMouseY])

  return (
    <motion.div
      ref={containerRef}
      className={styles.helixSection}
      id="resources"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 1 }}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Stars Background */}
      <div className={styles.starsBg} id="starsBg"></div>

      {/* Particle Canvas */}
      <canvas ref={particleCanvasRef} className={styles.particleCanvas}></canvas>

      {/* Holographic Grid */}
      <div className={styles.holographicGrid}></div>

      {/* Scan Lines */}
      <div className={styles.scanLines}></div>

      {/* Center Content */}
      <motion.div 
        className={styles.centerContent}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 50, opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className={styles.glitchText}>
          <h1 data-text="Seamless integrations with your entire tech stack">
            Seamless integrations with your entire tech stack
          </h1>
        </div>
        <motion.a
          href="#"
          className={styles.ctaButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.buttonText}>See all integrations</span>
          <span className={styles.buttonGlow}></span>
          <span className={styles.buttonParticles}></span>
        </motion.a>
      </motion.div>

      {/* DNA Helix Container */}
      <div className={styles.helixContainer}>
        <canvas ref={canvasRef} className={styles.helixCanvas}></canvas>

        {/* Energy Pulses */}
        <div className={`${styles.energyPulse} ${styles.pulse1}`}></div>
        <div className={`${styles.energyPulse} ${styles.pulse2}`}></div>
        <div className={`${styles.energyPulse} ${styles.pulse3}`}></div>

        {/* Logo Elements */}
        {logos.map((logo, idx) => (
          <motion.div
            key={idx}
            className={`${styles.helixLogo} ${styles[logo.position + 'Strand']}`}
            data-index={logo.index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.5 + idx * 0.1,
              duration: 0.6,
              type: 'spring',
              stiffness: 200,
            }}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.6 },
            }}
            whileTap={{
              scale: 0.9,
              transition: { type: 'spring', stiffness: 400, damping: 10 },
            }}
          >
            <div className={styles.logoGlow}></div>
            <i className={`fa-brands ${logo.icon}`}></i>
            <div className={styles.logoRing}></div>
          </motion.div>
        ))}

        {/* Data Streams */}
        <div className={`${styles.dataStream} ${styles.stream1}`}></div>
        <div className={`${styles.dataStream} ${styles.stream2}`}></div>
        <div className={`${styles.dataStream} ${styles.stream3}`}></div>
      </div>

      {/* Floating Orbs */}
      <div className={`${styles.floatingOrb} ${styles.orb1}`}></div>
      <div className={`${styles.floatingOrb} ${styles.orb2}`}></div>
      <div className={`${styles.floatingOrb} ${styles.orb3}`}></div>
    </motion.div>
  )
}
