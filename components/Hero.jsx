'use client'

import { motion } from 'framer-motion'
import styles from '../styles/Hero.module.css'

export default function Hero() {
  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    }),
  }

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        {/* Left Side Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <motion.span
              className={styles.titleLine}
              custom={0}
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              Innovative
            </motion.span>
            <motion.span
              className={styles.titleLine}
              custom={1}
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              solutions.
            </motion.span>
            <motion.span
              className={styles.titleLine}
              custom={2}
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              Smart development.
            </motion.span>
          </h1>

          <motion.p
            className={styles.heroDescription}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Building powerful software solutions should be seamless & efficient. So, we made it that way. 
            Explore cutting-edge web automation, custom development, and scalable solutions – crafted with 
            precision by expert developers who understand your vision.
          </motion.p>

          <motion.div
            className={styles.emailForm}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <input
              type="email"
              placeholder="Enter your email ..."
              className={styles.emailInput}
            />
            <motion.button
              className={styles.btnStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START EXPLORING
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side - Visual */}
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className={styles.backgroundShapes}>
            <motion.div
              className={`${styles.shape} ${styles.shapeYellow}`}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            ></motion.div>
            <motion.div
              className={`${styles.shape} ${styles.shapeBlue}`}
              animate={{
                rotate: -360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
            ></motion.div>
            <motion.div
              className={`${styles.shape} ${styles.shapePink}`}
              animate={{
                rotate: 360,
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            ></motion.div>
          </div>

          <div className={styles.profileImage}>
            <div className={styles.softwareVisual}>
              <div className={styles.codeWindow}>
                <div className={styles.windowHeader}>
                  <div className={styles.windowDots}>
                    <span className={styles.dotRed}></span>
                    <span className={styles.dotYellow}></span>
                    <span className={styles.dotGreen}></span>
                  </div>
                </div>
                <div className={styles.codeContent}>
                  <motion.div
                    className={styles.codeLine}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.5, duration: 1 }}
                  >
                    <span className={styles.codeKeyword}>function</span>{' '}
                    <span className={styles.codeName}>innovate</span>() {'{'}
                  </motion.div>
                  <motion.div
                    className={styles.codeLine}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.7, duration: 1 }}
                  >
                    {'  '}
                    <span className={styles.codeKeyword}>return</span> success;
                  </motion.div>
                  <motion.div
                    className={styles.codeLine}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.9, duration: 1 }}
                  >
                    {'}'}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
