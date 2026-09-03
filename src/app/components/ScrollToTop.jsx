"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SHOW_AFTER_PX = 800;

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      setShowButton(window.scrollY > SHOW_AFTER_PX);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={scrollToTop}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }
          }
          transition={{
            duration: reduceMotion ? 0.15 : 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={
            reduceMotion
              ? undefined
              : { y: -2, scale: 1.04, transition: { duration: 0.18 } }
          }
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full
            border border-white/15 bg-[#bba58d]/95 text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md
            transition-colors duration-200 hover:bg-[#e7ccaf] hover:text-[#6c857d] focus-visible:outline-none focus-visible:ring-2
             focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#9d8770]"
        >
          <FaArrowUp aria-hidden="true" className="text-2xl" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
