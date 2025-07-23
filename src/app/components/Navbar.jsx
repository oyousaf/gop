"use client";

import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] text-white text-2xl border-b border-white/10 shadow-md transition duration-300 ${
        hasScrolled ? "bg-[#9d8770]/90 backdrop-blur-md" : "bg-[#9d8770]"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => handleScroll("hero")}
          aria-label="Scroll to top"
          className="hover:opacity-90 transition"
        >
          <Image
            src="/logo.png"
            alt="Site logo"
            width={200}
            height={100}
            priority
            draggable={false}
            className="pointer-events-none select-none"
          />
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-2">
          {navLinks.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleScroll(item.href.slice(1))}
                aria-label={`Go to ${item.name}`}
                className="py-2 px-4 text-neutral-200 hover:text-white transition duration-300 ease-in-out hover:scale-110"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Socials & Hamburger */}
        <div className="flex items-center space-x-4">
          <ul className="hidden md:flex items-center space-x-4">
            {socialLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.name}`}
                  className="text-neutral-200 hover:text-white transition duration-300 ease-in-out hover:scale-110"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden z-[101] text-white"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <AiOutlineClose className="text-4xl" />
            ) : (
              <AiOutlineMenu className="text-4xl" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-sm z-[100] flex flex-col justify-center items-center"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col items-center space-y-6">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleScroll(item.href.slice(1));
                    toggleMenu();
                  }}
                  aria-label={`Navigate to ${item.name}`}
                  className="text-3xl uppercase text-neutral-200 hover:text-white transition duration-300 ease-in-out hover:scale-110"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-6 mt-12">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.name}`}
                  className="text-3xl text-neutral-200 hover:text-white transition duration-300 ease-in-out hover:scale-110"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
