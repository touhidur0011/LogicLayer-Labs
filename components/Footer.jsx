'use client'

import { motion } from 'framer-motion'
import styles from '../styles/Footer.module.css'

export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Integrations', 'Pricing', 'Security'],
    },
    {
      title: 'Solutions',
      links: ['Enterprise', 'Startups', 'Agencies', 'Freelancers'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Blog', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API', 'Support', 'Community'],
    },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}></div>
              <span>LOGICLAYER LABS</span>
            </div>
            <p className={styles.brandDescription}>
              Building the future of software development with innovative solutions and smart technology.
            </p>
            <div className={styles.socialLinks}>
              <motion.a
                href="#"
                className={styles.socialLink}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-brands fa-twitter"></i>
              </motion.a>
              <motion.a
                href="#"
                className={styles.socialLink}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-brands fa-linkedin"></i>
              </motion.a>
              <motion.a
                href="#"
                className={styles.socialLink}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-brands fa-github"></i>
              </motion.a>
              <motion.a
                href="#"
                className={styles.socialLink}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fa-brands fa-youtube"></i>
              </motion.a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            {footerSections.map((section, idx) => (
              <div key={idx} className={styles.footerSection}>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
                <ul className={styles.linkList}>
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 LogicLayer Labs. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
