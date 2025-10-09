'use client'

import { motion } from 'framer-motion'
import styles from '../styles/SeamlessIntegration.module.css'

export default function SeamlessIntegration() {
  const techLogos = [
    { name: 'Python', icon: 'fa-python', color: '#3776AB' },
    { name: 'Windows', icon: 'fa-windows', color: '#0078D4' },
    { name: 'Android', icon: 'fa-android', color: '#3DDC84' },
    { name: 'Chrome', icon: 'fa-chrome', color: '#4285F4' },
    { name: 'AWS', icon: 'fa-aws', color: '#FF9900' },
    { name: 'Figma', icon: 'fa-figma', color: '#F24E1E' },
    { name: 'GitLab', icon: 'fa-gitlab', color: '#FC6D26' },
    { name: 'Go', icon: 'fa-golang', color: '#00ADD8' },
    { name: 'Vue.js', icon: 'fa-vuejs', color: '#42B883' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className={styles.seamlessSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.logoGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {techLogos.map((tech, index) => (
            <motion.div
              key={index}
              className={styles.logoCard}
              variants={itemVariants}
              whileHover={{ scale: 1.1, y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className={`fa-brands ${tech.icon} ${styles.logoIcon}`} style={{ color: tech.color }}></i>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className={styles.title}>
            Seamless integrations with your entire tech stack
          </h2>
          <motion.a
            href="#"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See all integrations
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
