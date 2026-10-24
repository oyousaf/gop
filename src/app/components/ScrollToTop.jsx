"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const SHOW_AFTER_PX = 800;

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

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

  // Smoothness follows html { scroll-behavior }, which honours reduced motion
  const scrollToTop = () => window.scrollTo({ top: 0 });

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      inert={!showButton}
      className={`fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10
        bg-[oklch(0.19_0.018_58/0.8)] text-white shadow-[0_12px_40px_-12px_oklch(0.1_0.02_58/0.5)] backdrop-blur-xl transition duration-500
        hover:bg-accent hover:text-accent-ink
        active:scale-95 md:bottom-8 md:right-8
        ${showButton ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"}`}
    >
      <FiArrowUp aria-hidden="true" className="text-xl" />
    </button>
  );
}
