import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { navLinks, socialLinks } from "../utils/constants";
import { handleScroll } from "../utils/scroll";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  return (
    <nav className="max-w-7xl mx-auto fixed w-full bg-background text-2xl text-white p-3 z-50 border-b border-background shadow-md shadow-background">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold cursor-pointer">
          <button onClick={() => handleScroll("hero")}>
            <img
              src="/logo.png"
              alt="logo"
              className="w-[200px] h-auto object-contain"
            />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 flex-grow justify-center">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleScroll(item.href.slice(1))}
              className="text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105"
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
              href={item.href}
              className="text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <AiOutlineClose className="text-3xl text-white" />
          ) : (
            <AiOutlineMenu className="text-3xl text-white" />
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
            className="fixed top-0 left-0 w-full h-screen bg-background bg-opacity-90 z-40 flex flex-col items-center justify-center space-y-8"
          >
            <div className="absolute top-6 right-6 z-50" onClick={toggleMenu}>
              <AiOutlineClose className="text-3xl text-white" />
            </div>

            {/* Navigation Links for Mobile */}
            <div className="flex flex-col items-center space-y-6">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleScroll(item.href.slice(1));
                    toggleMenu();
                  }}
                  className="text-3xl uppercase text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Social Media Icons for Mobile */}
            <div className="flex justify-center space-x-6 mt-8 mb-20">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-3xl text-gray-200 hover:text-white cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105"
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
