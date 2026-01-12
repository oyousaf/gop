"use client";

import { useState, useCallback, useMemo } from "react";
import { boycott } from "../utils/constants";
import { AnimatePresence, motion } from "framer-motion";

const BATCH_SIZE = 20;

export default function Divestment() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const sortedBoycott = useMemo(
    () => [...boycott].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + BATCH_SIZE, sortedBoycott.length)
    );
  }, [sortedBoycott.length]);

  const observerRef = useCallback(
    (node) => {
      if (!node || visibleCount >= sortedBoycott.length) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadMore();
            observer.disconnect();
          }
        },
        { threshold: 1 }
      );

      observer.observe(node);
    },
    [loadMore, visibleCount, sortedBoycott.length]
  );

  return (
    <section
      id="divestment"
      role="region"
      aria-labelledby="divestment-heading"
      className="max-w-7xl mx-auto px-4 py-20 scroll-mt-16"
    >
      {/* Heading */}
      <motion.h2
        id="divestment-heading"
        className="text-4xl md:text-5xl font-semibold text-center mb-8 text-white"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        Divestment
      </motion.h2>

      {/* Intro */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6 text-white/90 text-lg md:text-xl leading-relaxed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
        variants={{ hidden: {}, visible: {} }}
      >
        {[
          "The growing discourse around divesting from companies supporting Israel has gained momentum, particularly during the current crisis. Esteemed Islamic scholars urge Muslims to avoid such brands, citing the profound spiritual and historical significance of Masjid Al-Aqsa.",
          "The following brands are known to either provide direct support to Israel or receive funding from Israeli sources.",
        ].map((text, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>

      {/* Cards */}
      <ul
        aria-label="Boycott brands"
        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-14 list-none"
      >
        <AnimatePresence>
          {sortedBoycott.slice(0, visibleCount).map((brand, index) => (
            <motion.li
              key={brand.name}
              role="listitem"
              tabIndex={0}
              aria-label={`Brand: ${brand.name}`}
              className="
                rounded-xl p-6 flex flex-col text-center
                bg-red-950
                border border-red-900
                shadow-lg
                focus:outline-none
                focus:ring-2 focus:ring-red-500
              "
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{
                default: {
                  duration: 0.25,
                  delay: Math.min(index * 0.015, 0.12),
                  ease: "easeOut",
                },
                y: { type: "spring", stiffness: 420, damping: 32 },
              }}
              whileHover={{ y: -2 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-red-300">
                {brand.name}
              </h3>
              <p className="text-base md:text-lg text-red-100 flex-grow">
                {brand.reason}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Lazy trigger */}
      {visibleCount < sortedBoycott.length && (
        <div ref={observerRef} className="h-10 mt-10" aria-hidden="true" />
      )}

      {/* Closing */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6 text-white/90 text-lg md:text-xl leading-relaxed mt-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
        variants={{ hidden: {}, visible: {} }}
      >
        {[
          "Many brands either directly support Israel or receive Israeli funding. If uncertain, a simple check is the barcode—those beginning with ‘729’ are associated with Israel.",
          "Consumers hold significant power in shaping economic and political outcomes. Boycotting such products is not merely economic but a moral stance of solidarity.",
          "The Prophet ﷺ said: “Whoever among you sees an injustice, let them change it with their hand; if they cannot, then with their tongue; if they cannot, then with their heart.” — 40 Hadith an-Nawawi",
        ].map((text, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
