"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./TransitionProvider.module.css";

interface TransitionContextType {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within TransitionProvider");
  return context;
}

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (href: string) => {
    // If we're already on that page, do nothing
    if (href === pathname) return; 
    
    setIsTransitioning(true);
    
    // Wait for the "shutter close" animation to finish (e.g. 700ms), then push route
    setTimeout(() => {
      router.push(href);
      
      // Let the new page render, then open the shutter!
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200); 
    }, 700); 
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      
      <AnimatePresence>
        {isTransitioning && (
          <motion.div className={styles.transitionOverlay}>
            <svg 
              className={styles.fullScreenSvg} 
              viewBox="0 0 1549 702" 
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* TOP LEFT HALF */}
              <motion.path 
                d="M0 0H1549C1549 0 1118.61 405.589 753.813 356.102C389.016 306.615 0 702 0 702V0Z" 
                fill="#E1918F"
                initial={{ x: "-100%", y: "-100%" }}
                animate={{ x: 0, y: 0 }}
                exit={{ x: "-100%", y: "-100%" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              />
              
              {/* BOTTOM RIGHT HALF */}
              <motion.path 
                d="M1549 702H0V681C0 681 426.5 287.544 788 335.551C1149.5 383.557 1535 0 1535 0H1549V702Z" 
                fill="#E1918F"
                initial={{ x: "100%", y: "100%" }}
                animate={{ x: 0, y: 0 }}
                exit={{ x: "100%", y: "100%" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
