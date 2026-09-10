"use client";

import { motion } from "motion/react";

/* Shared full-bleed teal divider used to punctuate structural beats between
   content sections (Welcome banner, Knowledge banner). */
export default function SectionDivider({ id, label, lines, className = "" }) {
  return (
    <section
      id={id}
      role="region"
      aria-label={label}
      className={`relative flex h-72 w-full items-center justify-center overflow-hidden bg-linear-to-r
        from-teal-900 to-teal-700 shadow-lg ${className}`}
    >
      <div className="absolute inset-0 z-0 bg-linear-to-r from-black/60 to-black/30" />

      <h2 className="sr-only">{label}</h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
        variants={{ hidden: {}, visible: {} }}
        className="relative z-10 px-6 text-center font-arabic text-4xl leading-tight text-white md:px-12 md:text-6xl"
      >
        {lines.map((line, i) => (
          <motion.span
            key={line}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
            className={i > 0 ? "mt-4 block" : "block"}
          >
            {line}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
