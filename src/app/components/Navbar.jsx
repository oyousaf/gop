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

const item = {
  hidden: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const backdrop = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const panel = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.04 },
  },
  exit: { opacity: 0 },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();

  /* ------------------------------
     SCROLL STATE
  ------------------------------ */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------------
     LOCK BODY SCROLL
  ------------------------------ */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ------------------------------
     ESC TO CLOSE
  ------------------------------ */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-[100] text-white text-2xl
      border-b border-white/10 shadow-md
      transition-colors duration-300
      ${scrolled ? "bg-[#9d8770]/90 backdrop-blur-md" : "bg-[#9d8770]"}`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => handleScroll("hero")}
          aria-label="Scroll to top"
          className="focus:outline-none"
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
          animate={reduceMotion ? false : "show"}
          className="hidden md:flex justify-center items-center space-x-2"
        >
          {navLinks.map((n) => (
            <motion.li key={n.id} variants={item}>
              <motion.button
                onClick={() => handleScroll(n.href.slice(1))}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -1, scale: 1.04, transition: fastSpring }
                }
                className="py-2 px-4 text-neutral-200 hover:text-white transition-colors focus:outline-none"
              >
                {n.name}
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>

        {/* Desktop Socials */}
        <motion.ul
          variants={desktopList}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? false : "show"}
          className="hidden md:flex items-center space-x-4 justify-end"
        >
          {socialLinks.map((s) => (
            <motion.li key={s.name} variants={item}>
              <motion.a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -1, scale: 1.05, transition: fastSpring }
                }
                className="text-neutral-200 hover:text-white focus:outline-none"
              >
                {s.icon}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Toggle */}
        <motion.button
          ref={toggleRef}
          onClick={() => setOpen(true)}
          whileTap={!reduceMotion ? { scale: 0.9 } : undefined}
          aria-expanded={open}
          aria-label="Open menu"
          className="md:hidden text-white focus:outline-none justify-self-end"
        >
          <AiOutlineMenu className="text-4xl" />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              variants={backdrop}
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
              variants={panel}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 h-[100dvh] bg-[#9d8770]/95 backdrop-blur-sm
              z-[100] flex flex-col items-center pt-28 pb-16 focus:outline-none"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="absolute top-5 right-5 p-2 rounded-full bg-black/30 text-white focus:outline-none"
              >
                <AiOutlineClose className="text-3xl" />
              </button>

              <div className="flex flex-1 flex-col justify-center items-center space-y-6">
                {navLinks.map((n) => (
                  <motion.button
                    key={n.id}
                    variants={item}
                    onClick={() => {
                      handleScroll(n.href.slice(1));
                      setOpen(false);
                    }}
                    className="text-3xl uppercase text-neutral-200 hover:text-white focus:outline-none"
                  >
                    {n.name}
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center space-x-6 mt-12">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.name}
                    variants={item}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-3xl text-neutral-200 hover:text-white focus:outline-none"
                  >
                    {s.icon}
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
