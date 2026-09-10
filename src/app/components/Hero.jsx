"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FaArrowDown } from "react-icons/fa";
import { handleScroll } from "../utils/scroll";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center px-4 text-white overflow-hidden"
    >
      <Image
        src="/images/hero-bg.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 z-10 bg-black/45" />

      <div
        className="relative z-20 w-full max-w-3xl 2xl:max-w-4xl rounded-2xl border border-white/15 bg-white/10 p-6 text-center
          shadow-lg backdrop-blur-md md:p-10"
        style={{ contain: "paint" }}
      >
        <span className="inline-block rounded-full border border-accent/40 bg-accent/15 px-4 py-1 text-xs font-semibold
          uppercase tracking-[0.2em] text-accent">
          حدائق الجنة
        </span>

        <h1
          dir="rtl"
          className="mt-6 font-arabic text-4xl font-bold leading-tight tracking-tight text-shadow-lg md:text-6xl"
        >
          إحياء الأمة بعلم الدين المقدس
        </h1>

        <p className="mt-4 text-xl text-white/90 md:text-2xl">
          Reviving the Ummah through Sacred Islamic Knowledge
        </p>

        <motion.button
          type="button"
          onClick={() => handleScroll("welcome")}
          aria-label="Scroll to Welcome section"
          initial={false}
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.2, ease: "easeInOut", repeat: Infinity }
          }
          className="mt-10 inline-flex justify-center text-white/90 transition-colors hover:text-accent
            focus-visible:outline-none"
        >
          <FaArrowDown aria-hidden="true" size={32} />
        </motion.button>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden md:block bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.35)_100%)]"
      />
    </section>
  );
}
