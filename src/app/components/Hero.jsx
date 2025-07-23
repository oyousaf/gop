"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";
import { handleScroll } from "../utils/scroll";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-white p-2 overflow-hidden"
    >
      {/* Optimised Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Hero background with Islamic theme"
        fill
        priority
        placeholder="blur"
        blurDataURL="/fallback.webp"
        className="object-cover"
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-10" />

      {/* Hero Content */}
      <div className="relative z-20 px-4 text-center max-w-3xl bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-md">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md"
        >
          إحياء الأمة بعلم الدين المقدس
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-4 text-lg md:text-2xl text-white/90"
        >
          Reviving the Ummah with sacred knowledge of the Deen
        </motion.p>

        <button
          onClick={() => handleScroll("welcome")}
          aria-label="Scroll to Welcome section"
          className="text-white hover:text-white/80 transition duration-300 mt-10 animate-bounce"
        >
          <FaArrowDown size={40} />
        </button>
      </div>
    </section>
  );
}
