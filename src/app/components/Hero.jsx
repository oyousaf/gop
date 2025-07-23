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
      style={{ contentVisibility: "auto", containIntrinsicSize: "700px" }}
    >
      {/* Optimised Background Image */}
      <Image
        src="/images/hero-bg.webp"
        alt="Hero background with Islamic theme"
        fill
        priority
        placeholder="blur"
        blurDataURL="/fallback.webp"
        className="object-cover"
      />

      {/* Light overlay only (no blur for perf) */}
      <div className="absolute inset-0 bg-black/40 z-10 backdrop-blur-md" />

      {/* Hero Content - NO animation on LCP */}
      <div className="relative z-20 px-4 text-center max-w-3xl bg-white/20 rounded-xl p-6 shadow-lg backdrop-blur-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-md">
          إحياء الأمة بعلم الدين المقدس
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-white/90">
          Reviving the Ummah with sacred knowledge of the Deen
        </p>

        {/* Animate only the CTA */}
        <motion.button
          onClick={() => handleScroll("welcome")}
          aria-label="Scroll to Welcome section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-white hover:text-white/80 transition duration-300 mt-10 animate-bounce"
        >
          <FaArrowDown size={40} />
        </motion.button>
      </div>
    </section>
  );
}
