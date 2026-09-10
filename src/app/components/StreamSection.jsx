"use client";

import { motion } from "motion/react";

/* Shared loading/placeholder shell used before a stream section has mounted */
export function StreamSectionWrapper({ id, ariaLabel, children }) {
  return (
    <section
      id={id}
      role="region"
      aria-label={ariaLabel}
      className="relative py-16 min-h-screen flex justify-center items-center"
    >
      <div className="w-full max-w-5xl px-4 text-center">{children}</div>
    </section>
  );
}

/* Shared shell for the Makkah/Madinah/Aqsa live-stream sections */
export function StreamSection({ id, headingId, ariaLabel, title, children }) {
  return (
    <section
      id={id}
      role="region"
      aria-label={ariaLabel}
      className="relative py-16 min-h-screen scroll-mt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center items-center h-full z-10 px-4 text-center"
      >
        <motion.h2
          id={headingId}
          className="md:text-5xl text-3xl font-bold mb-6 p-3 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        {children}
      </motion.div>
    </section>
  );
}
