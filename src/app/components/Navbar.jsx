"use client";

import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  return (
    <nav
      className="max-w-7xl mx-auto fixed w-full bg-background text-2xl text-white p-3 z-[100] border-b border-background shadow-md shadow-background"
      aria-label="Main navigation"
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="font-bold cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => handleScroll("hero")}
            aria-label="Scroll to top"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
          >
            <Image
              src="/logo.png"
              alt="Site logo"
              width={200}
              height={100}
              priority
            />
          </button>
        </motion.div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex space-x-8 flex-grow justify-center">
          {navLinks.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleScroll(item.href.slice(1))}
                aria-label={`Go to ${item.name}`}
                className="text-gray-200 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Social Icons */}
        <ul className="hidden md:flex space-x-6 items-center">
          {socialLinks.map((item) => (
            <li key={item.name}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${item.name}`}
                className="text-gray-200 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
              >
                {item.icon}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded z-[101]"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <AiOutlineClose className="text-5xl text-white" />
          ) : (
            <AiOutlineMenu className="text-5xl text-white" />
          )}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-background bg-opacity-90 z-[100] flex flex-col justify-between"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col items-center space-y-6 mt-auto mb-auto">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleScroll(item.href.slice(1));
                    toggleMenu();
                  }}
                  aria-label={`Navigate to ${item.name}`}
                  className="text-3xl uppercase text-gray-200 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-6 mb-20">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.name}`}
                  className="text-3xl text-gray-200 hover:text-white transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
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
