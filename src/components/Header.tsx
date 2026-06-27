"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import TransitionLink from "./TransitionLink";
import styles from "./Header.module.css";

export default function Header() {
  const { scrollY } = useScroll();
  
  // Make header background slightly opaque on scroll
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(252, 250, 248, 0)", "rgba(252, 250, 248, 0.9)"]
  );
  
  const headerBorder = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.05)"]
  );

  return (
    <motion.header 
      className={styles.header}
      style={{ backgroundColor: headerBg, borderBottomColor: headerBorder }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <TransitionLink href="/" className={styles.logoLink}>
          <Image
            src="/Bridl-2023-logo.png"
            alt="Bridl Logo"
            width={120}
            height={40}
            className={styles.logo}
            priority
          />
        </TransitionLink>

        {/* Navigation */}
        <nav className={styles.nav}>
          <TransitionLink href="/exclusive" className={styles.navLink}>
            EXCLUSIVE
          </TransitionLink>
          <TransitionLink href="/marketplace" className={styles.navLink}>
            MARKETPLACE
          </TransitionLink>
          <TransitionLink href="/services" className={styles.navLink}>
            SERVICES
          </TransitionLink>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.3-4.3"></path>
            </svg>
          </button>
          
          <div className={styles.locale}>
            EN <span className={styles.slash}>/</span> €
          </div>
          
          <button className={styles.menuBtn} aria-label="Menu">
            <div className={styles.menuIcon}>
              <span className={styles.line}></span>
              <span className={styles.line}></span>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
