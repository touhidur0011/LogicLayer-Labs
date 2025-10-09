'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('product')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'product', label: 'Product' },
    { id: 'services', label: 'Solutions' },
    { id: 'company', label: 'Company' },
    { id: 'resources', label: 'Resources' },
    { id: 'pricing', label: 'Pricing' },
  ]

  useEffect(() => {
    // Particle canvas animation
    const canvas = document.getElementById('particleCanvas')
    const ctx = canvas?.getContext('2d')
    
    if (!canvas || !ctx) return

    canvas.width = window.innerWidth
    canvas.height = 100

    const particles = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      })
    }

    let animationId
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <nav className={styles.navbar}>
      <canvas className={styles.particleCanvas} id="particleCanvas"></canvas>
      
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
          <span>LOGICLAYER LABS</span>
        </div>

        <ul className={styles.navMenu}>
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.a
                href={`#${item.id}`}
                className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                onClick={() => setActiveSection(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.a>
            </li>
          ))}
        </ul>

        <div className={styles.navButtons}>
          <motion.button 
            className={styles.btnSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.button>
          <motion.button 
            className={styles.btnPrimary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </div>

        <button
          className={styles.mobileMenuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={styles.mobileMenu}
        initial={{ height: 0 }}
        animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileNavButtons}>
          <button className={styles.btnSecondary}>Contact</button>
          <button className={styles.btnPrimary}>Login</button>
        </div>
      </motion.div>
    </nav>
  )
}
