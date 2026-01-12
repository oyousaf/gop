"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
        className="relative z-20 w-full max-w-3xl 2xl:max-w-4xl text-center rounded-xl bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg"
        style={{ contain: "paint" }}
      >
        <h1
          dir="rtl"
          className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-shadow"
        >
          إحياء الأمة بعلم الدين المقدس
        </h1>

        <p className="mt-4 text-xl md:text-2xl text-white/90">
          <span className="sr-only">Reviving the Ummah</span>
          <span aria-hidden>
            Reviving the Ummah through Sacred Islamic Knowledge
          </span>
        </p>

        <motion.button
          onClick={() => handleScroll("welcome")}
          aria-label="Scroll to Welcome section"
          initial={false}
          animate={reduceMotion ? undefined : { y: [0, 10, 0], opacity: 1 }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.2, ease: "easeInOut", repeat: Infinity }
          }
          className="mt-10 inline-flex justify-center text-white/90 hover:text-white focus:outline-none"
        >
          <FaArrowDown size={40} />
        </motion.button>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 hidden md:block bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.35)_100%)]"
      />
    </section>
  );
}
