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
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "700px",
      }}
    >
      {/* Background image – preload is handled by next/image + priority */}
      <Image
        src="/images/hero-bg.webp"
        alt="Hero background with Islamic theme"
        fill
        priority
        placeholder="empty" // no blur delay
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 backdrop-blur-sm" />

      {/* Hero Content */}
      <div
        className="relative z-20 px-4 text-center max-w-3xl bg-white/10 rounded-xl p-6 shadow-md backdrop-blur-md"
        style={{
          contain: "paint",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          إحياء الأمة بعلم الدين المقدس
        </h1>

        {/* LCP-optimised paragraph */}
        <p className="mt-4 text-xl md:text-2xl text-white/90">
          <span className="sr-only">Reviving the Ummah</span>
          <span aria-hidden="true">
            Reviving the Ummah through Sacred Islamic Knowledge
          </span>
        </p>

        {/* Animate only CTA */}
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
