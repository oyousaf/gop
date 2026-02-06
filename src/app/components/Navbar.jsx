"use client";

import { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { PiMosqueFill } from "react-icons/pi";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

/* ------------------------------
   MOTION
------------------------------ */
const springSnappy = { type: "spring", stiffness: 520, damping: 34 };
const springSoft = { type: "spring", stiffness: 360, damping: 28 };
const fadeUp = { hidden: { y: 6, opacity: 0 }, show: { y: 0, opacity: 1 } };

/* ------------------------------
   NAV ITEM RENDERER (KEY FIX)
------------------------------ */
function NavItem({ item }) {
  switch (item.type) {
    case "emoji":
      return <span className="leading-none">{item.label}</span>;

    case "icon":
      return <PiMosqueFill className="text-[1.4em]" />;

    case "image":
      return (
        <Image src={item.src} alt="" width={26} height={26} className="block" />
      );

    default:
      return <span>{item.label}</span>;
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

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
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[100]
        w-[calc(100%-2rem)] max-w-7xl rounded-2xl
        border border-white/10 shadow-xl shadow-black/10
        transition-all duration-300
        ${scrolled ? "bg-[#9d8770]/75 backdrop-blur-xl" : "bg-[#9d8770]/90"}
      `}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
        {/* Logo */}
        <button onClick={() => handleScroll("hero")} aria-label="Scroll to top">
          <Image
            src="/logo.png"
            alt="Site logo"
            width={180}
            height={90}
            priority
          />
        </button>

        {/* ---------------- DESKTOP NAV ---------------- */}
        <ul className="hidden md:flex justify-center items-center gap-2">
          {navLinks.map((n) => (
            <motion.li
              key={n.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <motion.button
                onClick={() => handleScroll(n.href.slice(1))}
                whileHover={
                  !reduceMotion ? { y: -1, transition: springSoft } : undefined
                }
                className="group relative px-4 py-2 rounded-full text-2xl font-medium text-white/80 hover:text-white
                  hover:bg-white/12 transition-colors grid place-items-center"
              >
                <NavItem item={n} />
                <span
                  className="absolute left-1/2 bottom-[2px] h-[2px] w-5 -translate-x-1/2 rounded-full bg-white/80
                    opacity-0 scale-x-50 transition-all duration-200 group-hover:opacity-100 group-hover:scale-x-100"
                />
              </motion.button>
            </motion.li>
          ))}
        </ul>

        {/* ---------------- DESKTOP SOCIALS ---------------- */}
        <ul className="hidden md:flex items-center gap-2">
          {socialLinks.map((s) => (
            <motion.li key={s.name}>
              <motion.a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                whileHover={
                  !reduceMotion
                    ? { scale: 1.15, transition: springSnappy }
                    : undefined
                }
                whileTap={!reduceMotion ? { scale: 0.95 } : undefined}
                className="grid place-items-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white
                  hover:shadow-[0_4px_12px_rgba(255,255,255,0.25)] transition-colors"
              >
                {s.icon}
              </motion.a>
            </motion.li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          ref={toggleRef}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden ml-auto grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20"
        >
          <AiOutlineMenu className="text-2xl text-white" />
        </button>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[99]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-[100] flex flex-col"
            >
              <div
                className="relative mx-2 mb-2 mt-auto rounded-3xl bg-[#9d8770]/95 backdrop-blur-xl
                 border border-white/10 px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
              >
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-4 top-4 grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <AiOutlineClose className="text-xl text-white" />
                </button>

                <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/30" />

                <div className="flex flex-col items-center gap-4">
                  {navLinks.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        handleScroll(n.href.slice(1));
                        setOpen(false);
                      }}
                      className="w-full max-w-xs rounded-xl px-4 py-3  text-center text-2xl font-medium
                        text-white/90 hover:bg-white/10 grid place-items-center"
                    >
                      <NavItem item={n} />
                    </button>
                  ))}
                </div>

                <div className="mt-16 flex justify-center gap-4">
                  {socialLinks.map((s) => (
                    <motion.a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      whileHover={
                        !reduceMotion
                          ? { scale: 1.1, transition: springSoft }
                          : undefined
                      }
                      className="grid place-items-center h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 text-white"
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
