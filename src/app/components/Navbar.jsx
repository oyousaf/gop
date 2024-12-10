import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  return (
    <nav className="fixed w-full bg-background text-white text-2xl p-3 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => handleScroll("hero")}
          aria-label="Scroll to Hero Section"
          className="text-3xl font-bold cursor-pointer"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={100}
            className="object-contain"
          />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleScroll(item.href.slice(1))}
              className="hover:text-white text-gray-200 transition-transform duration-300 ease-in-out hover:scale-110"
              aria-label={`Navigate to ${item.name}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="hidden md:flex space-x-6">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-gray-200 transition-transform duration-300 ease-in-out hover:scale-110"
              aria-label={`Follow us on ${item.name}`}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? null : (
            <AiOutlineMenu
              className="text-5xl text-white"
              aria-label="Open Menu"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-background bg-opacity-90 z-40 flex flex-col justify-between"
          >
            <div className="absolute top-6 right-6 z-50" onClick={toggleMenu}>
              <AiOutlineClose className="text-5xl text-white" />
            </div>

            {/* Navigation Links for Mobile */}
            <div className="flex flex-col items-center space-y-6 mt-auto mb-auto">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleScroll(item.href.slice(1));
                    toggleMenu();
                  }}
                  className="text-3xl uppercase text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Social Media Icons at Bottom */}
            <div className="flex justify-center space-x-6 mb-20">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-3xl text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-110"
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
