"use client";

import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        className="fixed z-40 text-3xl md:text-xl bottom-8 right-8 bg-[#bba58d] hover:text-[#6c857d] hover:bg-[#e7ccaf] transition duration-200 cursor-pointer p-3 rounded-full shadow-lg"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTop;
