"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import styles from "./HeroSection.module.css";
import { horses } from "../data/horses";
import HorseProfile from "./HorseProfile";
import AnimatedHorseLogo from "./AnimatedHorseLogo";

// Expand the horses array to create a fuller 3D scene
const galleryItems = [
  ...horses,
  ...horses.map(h => ({ ...h, id: h.id + "_copy1" })),
  ...horses.map(h => ({ ...h, id: h.id + "_copy2" })),
  ...horses.map(h => ({ ...h, id: h.id + "_copy3" }))
]; // Total 20 items

type ViewMode = 'sphere' | 'cylinder';

export default function HeroSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('sphere');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  // Scroll animation for modal
  const modalScrollY = useMotionValue(0);
  const smoothScrollY = useSpring(modalScrollY, { stiffness: 100, damping: 20, restDelta: 0.001 });
  
  // Transform values for scroll-linked expansion
  const wrapperPadding = useTransform(smoothScrollY, [0, 400], ["40px", "0px"]);
  const cardMaxWidth = useTransform(smoothScrollY, [0, 400], ["1200px", "4000px"]); // Use px for both to allow interpolation
  const cardHeight = useTransform(smoothScrollY, [0, 400], ["85vh", "100vh"]);
  const cardRadius = useTransform(smoothScrollY, [0, 400], ["16px", "0px"]);
  
  // Dragging logic for the 3D scene
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 100, mass: 1 };
  const springX = useSpring(dragX, springConfig);
  const springY = useSpring(dragY, springConfig);

  const rotateY = useTransform(springX, [-1000, 1000], [-360, 360], { clamp: false });
  const rotateX = useTransform(springY, [-1000, 1000], [45, -45], { clamp: false });

  // Auto-rotation when not dragging
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const autoRotate = (time: number) => {
      // Calculate delta time so rotation is consistent regardless of framerate
      const delta = time - lastTime;
      lastTime = time;
      
      // Rotate if not currently interacting
      if (!isDragging.current) {
        dragX.set(dragX.get() + (0.02 * delta));
      }
      animationFrameId = requestAnimationFrame(autoRotate);
    };
    
    animationFrameId = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dragX]);

  // Custom Drag Interaction (replaces Framer Motion drag to allow 3D clicking)
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const hasDragged = useRef(false); // To distinguish between a click and a drag

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    const deltaY = e.clientY - lastMouseY.current;
    
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      hasDragged.current = true; // User moved enough to count as a drag, not a click
    }
    
    dragX.set(dragX.get() + deltaX * 1.5); // Multiply for sensitivity
    dragY.set(dragY.get() + deltaY * 1.5);
    
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
  };
  const getCoordinates = (idx: number, total: number, mode: ViewMode) => {
    const radius = 800; // Radius of sphere/cylinder

    if (mode === 'cylinder') {
      const angle = (idx / total) * Math.PI * 2 * 2; // Wrap around twice
      const yOffset = (idx - total / 2) * 50; // Stagger them vertically
      return {
        x: Math.cos(angle) * radius,
        y: yOffset,
        z: Math.sin(angle) * radius,
        rotateY: -(angle * 180 / Math.PI) - 90
      };
    } else {
      // Sphere mode (Fibonacci sphere distribution)
      const phi = Math.acos(1 - 2 * (idx + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * idx;
      
      return {
        x: Math.cos(theta) * Math.sin(phi) * radius,
        y: Math.cos(phi) * radius,
        z: Math.sin(theta) * Math.sin(phi) * radius,
        rotateY: -(theta * 180 / Math.PI) - 90,
        rotateX: (phi * 180 / Math.PI) - 90 // Point towards center
      };
    }
  };

  return (
    <section 
      ref={containerRef} 
      className={styles.heroSection}
      style={{ zIndex: selectedItem ? 200 : 1, touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
        
      {/* 3D Scene - pointer-events: none allows clicking through the Z=0 plane */}
      <motion.div 
        className={styles.scene}
        style={{ rotateX, rotateY, pointerEvents: "none" }}
      >
          {galleryItems.map((item, idx) => {
            const coords = getCoordinates(idx, galleryItems.length, viewMode);
            
            return (
              <motion.div
                key={item.id}
                className={styles.card}
                style={{ pointerEvents: "auto" }} // Re-enable pointer events for cards
                animate={{
                  x: coords.x,
                  y: coords.y,
                  z: coords.z,
                  rotateY: coords.rotateY,
                  rotateX: coords.rotateX || 0,
                }}
                transition={{ type: "spring", stiffness: 40, damping: 20 }}
                onClick={(e) => {
                  if (!hasDragged.current) {
                    setSelectedItem(item);
                  }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className={styles.cardImage} 
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                
                {/* Overlay Content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <div className={styles.tags}>
                      <span className={styles.tag}>
                        {item.country} {item.category}
                      </span>
                      {idx % 3 === 0 && ( // Example conditional tag
                        <span className={`${styles.tag} ${styles.motivated}`}>MOTIVATED</span>
                      )}
                    </div>
                    <button className={styles.heartBtn}>
                      ♡
                    </button>
                  </div>
                  
                  <div className={styles.cardBottom}>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardNickname}>{item.nickname || `"${item.name.split(' ')[0]}"`}</p>
                    <p className={styles.cardDetails}>
                      {item.details || `${item.age} • ${item.gender}`}
                    </p>
                    
                    <div className={styles.cardFooter}>
                      <span className={styles.cardPrice}>{item.price}</span>
                      <button className={styles.openBtn}>
                        OPEN →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Animated Background Logo */}
        <AnimatedHorseLogo className={styles.animatedHorseLogo} />

        {/* View Toggle */}
        <div className={styles.controlsWrapper}>
          <span className={styles.controlsLabel}>Change the View :</span>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'sphere' ? styles.active : ''}`}
            onClick={() => setViewMode('sphere')}
          >
            sphere
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'cylinder' ? styles.active : ''}`}
            onClick={() => setViewMode('cylinder')}
          >
            cylinder
          </button>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div 
              className={styles.modalOverlay}
              onScroll={(e) => {
                modalScrollY.set(e.currentTarget.scrollTop);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.modalScrollArea}>
                <motion.div 
                  className={styles.modalCardWrapper}
                  style={{ padding: wrapperPadding }}
                >
                  <motion.div 
                    className={styles.modalContainer}
                    style={{ 
                      maxWidth: cardMaxWidth, 
                      height: cardHeight, 
                      borderRadius: cardRadius 
                    }}
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 20, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  >
                {/* Left Column: Image */}
                <div className={styles.modalImageContainer}>
                  <Image 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    fill 
                    className={styles.modalImageFull}
                    sizes="(max-width: 1200px) 100vw, 50vw"
                  />
                  <div className={styles.modalImageIcons}>
                    <button className={styles.iconBtn}>📸</button>
                    <button className={styles.iconBtn}>🎥</button>
                  </div>
                  <button className={`${styles.navArrowBtn} ${styles.left}`}>&lt;</button>
                  <button className={`${styles.navArrowBtn} ${styles.right}`}>&gt;</button>
                  <div className={styles.imageCounter}>01 / 01</div>
                </div>

                {/* Right Column: Details */}
                <div className={styles.modalDetailsContainer}>
                  <div className={styles.modalHeader}>
                    <span className={styles.headerPill}>MOTIVATED</span>
                    <div className={styles.headerActions}>
                      <button className={styles.circleBtn}>♡</button>
                      <button className={styles.circleBtn} onClick={() => setSelectedItem(null)}>✕</button>
                    </div>
                  </div>

                  <div className={styles.modalTitleSection}>
                    <div className={styles.modalCategory}>{selectedItem.country} {selectedItem.category}</div>
                    <h2 className={styles.modalTitle}>{selectedItem.name}</h2>
                    <p className={styles.modalNickname}>{selectedItem.nickname}</p>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.specsGrid}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Age</span>
                      <span className={styles.specValue}>{selectedItem.age || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Height</span>
                      <span className={styles.specValue}>{selectedItem.height || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Gender</span>
                      <span className={styles.specValue}>{selectedItem.gender || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Country</span>
                      <span className={styles.specValue}>{selectedItem.country || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Studbook</span>
                      <span className={styles.specValue}>{selectedItem.studbook || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Level</span>
                      <span className={styles.specValue}>{selectedItem.level || "N/A"}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Breeding</span>
                      <span className={styles.specValue}>{selectedItem.breeding || "N/A"}</span>
                    </div>
                  </div>

                  <div className={styles.modalFooter}>
                    <div className={styles.priceRow}>
                      <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Asking</span>
                        <span className={styles.priceValue}>{selectedItem.price}</span>
                      </div>
                      <button className={styles.profileBtn}>Scroll Down for More Details ↓</button>
                    </div>
                    
                    <div className={styles.hints}>
                      <div><span className={styles.hintBox}>←</span> <span className={styles.hintBox}>→</span> NAVIGATE</div>
                      <div><span className={styles.hintBox}>P</span> / <span className={styles.hintBox}>V</span> MEDIA</div>
                    </div>
                  </div>
                  </div>
                </motion.div>
              </motion.div>

                {/* Full Details Page Rendered Below */}
                <HorseProfile horse={selectedItem} />
                
              </div>
            </motion.div>
          )}
      </AnimatePresence>

    </section>
  );
}
