"use client";

import { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* ------------------------------
   MOTION CONFIG
------------------------------ */
const fastSpring = {
  type: "spring",
  stiffness: 420,
  damping: 26,
};

const desktopList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const desktopItem = {
  hidden: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const desktopSocialItem = {
  hidden: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const mobileBackdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const mobilePanel = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.04 },
  },
  exit: { opacity: 0 },
};

const mobileItem = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 24 && last <= 24) setHasScrolled(true);
      if (y < 8 && last >= 8) setHasScrolled(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-[100] text-white text-2xl border-b border-white/10 shadow-md transition-all duration-300 ${
        hasScrolled ? "bg-[#9d8770]/90 backdrop-blur-md" : "bg-[#9d8770]"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => handleScroll("hero")}
          className="hover:opacity-90 transition focus:outline-none"
          aria-label="Scroll to top"
        >
          <Image
            src="/logo.png"
            alt="Site logo"
            width={180}
            height={90}
            priority
            draggable={false}
          />
        </button>

        {/* Desktop Nav */}
        <motion.ul
          variants={desktopList}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion || !mounted ? false : "show"}
          className="hidden md:flex justify-center items-center space-x-2"
        >
          {navLinks.map((item) => (
            <motion.li key={item.id} variants={desktopItem}>
              <motion.button
                onClick={() => handleScroll(item.href.slice(1))}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -1, scale: 1.04, transition: fastSpring }
                }
                className="py-2 px-4 text-neutral-200 hover:text-white transition-colors duration-150 focus:outline-none"
              >
                {item.name}
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>

        {/* Desktop Socials */}
        <motion.ul
          variants={desktopList}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion || !mounted ? false : "show"}
          className="hidden md:flex items-center space-x-4 justify-end"
        >
          {socialLinks.map((item) => (
            <motion.li
              key={item.name}
              variants={desktopSocialItem}
              className="flex items-center"
            >
              <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${item.name}`}
                className="text-neutral-200 hover:text-white transition-colors duration-150 focus:outline-none inline-flex items-center"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -1, scale: 1.05, transition: fastSpring }
                }
                style={{
                  willChange: "transform",
                  transformOrigin: "50% 50%",
                }}
              >
                <span className="inline-flex items-center justify-center leading-none">
                  {item.icon}
                </span>
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Toggle */}
        <motion.button
          ref={toggleRef}
          whileTap={!reduceMotion ? { scale: 0.9 } : undefined}
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none justify-self-end"
          aria-expanded={isMenuOpen}
          aria-label="Open menu"
        >
          <AiOutlineMenu className="text-4xl" />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              variants={mobileBackdrop}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-black/40 z-[99]"
              aria-hidden
            />

            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              variants={mobilePanel}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 bg-[#9d8770]/95 backdrop-blur-sm z-[100] flex flex-col justify-center items-center focus:outline-none"
            >
              <button
                onClick={toggleMenu}
                aria-label="Close menu"
                className="absolute top-5 right-5 z-[110] p-2 rounded-full bg-black/30 text-white focus:outline-none"
              >
                <AiOutlineClose className="text-3xl" />
              </button>

              <div className="flex flex-col items-center space-y-6">
                {navLinks.map((item) => (
                  <motion.button
                    key={item.id}
                    variants={mobileItem}
                    onClick={() => {
                      handleScroll(item.href.slice(1));
                      toggleMenu();
                    }}
                    className="text-3xl uppercase text-neutral-200 hover:text-white transition-colors duration-150 focus:outline-none"
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center space-x-6 mt-12">
                {socialLinks.map((item) => (
                  <motion.a
                    key={item.name}
                    variants={mobileItem}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-3xl text-neutral-200 hover:text-white transition-colors duration-150 focus:outline-none"
                    aria-label={`Visit our ${item.name}`}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
