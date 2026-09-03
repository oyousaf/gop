"use client";

import { useState, useEffect, useRef, memo } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { PiMosqueFill } from "react-icons/pi";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";

/* ---------------------------------
   MOTION
---------------------------------- */
const springSnappy = {
  type: "spring",
  stiffness: 520,
  damping: 34,
};

const springSoft = {
  type: "spring",
  stiffness: 360,
  damping: 28,
};

const fadeUp = {
  hidden: {
    y: 6,
    opacity: 0,
  },

  show: {
    y: 0,
    opacity: 1,
  },
};

/* ---------------------------------
   NAV ITEM
---------------------------------- */
const NavItem = memo(function NavItem({ item }) {
  switch (item.type) {
    case "emoji":
      return <span className="leading-none">{item.label}</span>;

    case "icon":
      return <PiMosqueFill className="text-[1.4em]" />;

    case "image":
      return (
        <Image
          src={item.src}
          alt=""
          width={26}
          height={26}
          className="block h-auto w-auto"
          style={{ width: "auto", height: "auto" }}
        />
      );

    default:
      return <span>{item.label}</span>;
  }
});

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const reduceMotion = useReducedMotion();

  /* ---------------------------------
     SCROLL STATE
  ---------------------------------- */
  useEffect(() => {
    const handleWindowScroll = () => {
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
      });
    };

    handleWindowScroll();

    window.addEventListener("scroll", handleWindowScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  /* ---------------------------------
     LOCK BODY SCROLL
  ---------------------------------- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------------------------------
     ESC TO CLOSE
  ---------------------------------- */
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

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav
      aria-label="Main navigation"
      className={`
        fixed top-4 left-1/2 z-100 w-[calc(100%-2rem)]
        max-w-7xl -translate-x-1/2 rounded-2xl border
        border-white/10 shadow-xl shadow-black/10 transition-all duration-300
        ${scrolled ? "bg-[#9d8770]/75 backdrop-blur-xl" : "bg-[#9d8770]/90"}
      `}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-3">
        {/* ---------------------------------
            LOGO
        ---------------------------------- */}
        <button
          type="button"
          onClick={() => handleScroll("hero")}
          aria-label="Scroll to top"
          className="shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Site logo"
            width={180}
            height={90}
            priority
            sizes="180px"
            className="h-auto w-auto max-w-45"
          />
        </button>

        {/* ---------------------------------
            DESKTOP NAV
        ---------------------------------- */}
        <ul className="hidden items-center justify-center gap-2 md:flex">
          {navLinks.map((n) => (
            <motion.li
              key={n.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <motion.button
                type="button"
                onClick={() => handleScroll(n.href.slice(1))}
                aria-label={`Go to ${n.id} section`}
                whileHover={
                  !reduceMotion
                    ? {
                        y: -1,
                        transition: springSoft,
                      }
                    : undefined
                }
                className="group relative grid place-items-center rounded-full px-4 py-2 text-2xl font-medium text-white/80 transition-colors
                  hover:bg-white/12 hover:text-white"
              >
                <NavItem item={n} />

                <span
                  className="absolute bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white/80 opacity-0
                    scale-x-50 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100"
                />
              </motion.button>
            </motion.li>
          ))}
        </ul>

        {/* ---------------------------------
            DESKTOP SOCIALS
        ---------------------------------- */}
        <ul className="hidden items-center gap-2 md:flex">
          {socialLinks.map((s) => (
            <motion.li key={s.name}>
              <motion.a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                whileHover={
                  !reduceMotion
                    ? {
                        scale: 1.15,
                        transition: springSnappy,
                      }
                    : undefined
                }
                whileTap={
                  !reduceMotion
                    ? {
                        scale: 0.95,
                      }
                    : undefined
                }
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20
                  hover:shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
              >
                {s.icon}
              </motion.a>
            </motion.li>
          ))}
        </ul>

        {/* ---------------------------------
            MOBILE TOGGLE
        ---------------------------------- */}
        <button
          type="button"
          ref={toggleRef}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:hidden"
        >
          <AiOutlineMenu className="text-2xl text-white" />
        </button>
      </div>

      {/* ---------------------------------
          MOBILE MENU
      ---------------------------------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-99 bg-black/40"
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="fixed inset-0 z-100 flex flex-col"
            >
              <div
                className="relative mt-auto mx-2 mb-2 rounded-3xl border border-white/10 bg-[#9d8770]/95 px-6 pt-5
                backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
              >
                {/* Close */}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors
                    hover:bg-white/20"
                >
                  <AiOutlineClose className="text-xl text-white" />
                </button>

                {/* Handle */}
                <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/30" />

                {/* Links */}
                <div className="flex flex-col items-center gap-4">
                  {navLinks.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        handleScroll(n.href.slice(1));
                        setOpen(false);
                      }}
                      aria-label={`Go to ${n.id} section`}
                      className="grid w-full max-w-xs place-items-center rounded-xl px-4 py-3 text-center text-2xl font-medium
                        text-white/90 transition-colors hover:bg-white/10"
                    >
                      <NavItem item={n} />
                    </button>
                  ))}
                </div>

                {/* Socials */}
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
                          ? {
                              scale: 1.1,
                              transition: springSoft,
                            }
                          : undefined
                      }
                      className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition-colors
                        hover:bg-white/25"
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
