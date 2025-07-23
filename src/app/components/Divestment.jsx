"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { boycott } from "../utils/constants";
import { AnimatePresence, motion } from "framer-motion";

const BATCH_SIZE = 16;

export default function Divestment() {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, boycott.length));
  }, []);

  const observerRef = useCallback(
    (node) => {
      if (!node || visibleCount >= boycott.length) return;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && loadMore(),
        { threshold: 1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [loadMore, visibleCount]
  );

  return (
    <section
      className="max-w-7xl mx-auto p-6 py-12 scroll-mt-24"
      id="divestment"
      aria-labelledby="divestment-heading"
      role="region"
    >
      {/* Animated Heading */}
      <motion.h2
        id="divestment-heading"
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Divestment
      </motion.h2>

      {/* Static Text Section */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6 text-white/90 text-lg md:text-2xl leading-relaxed"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: {} }}
      >
        {[
          "The growing discourse around divesting in Israeli products and companies supporting Israel has gained momentum, especially during the current crisis. Esteemed Islamic scholars are advocating for Muslims to avoid such brands, highlighting the profound spiritual and historical significance of Masjid Al-Aqsa, one of Islam’s holiest sites.",
          "The following brands are known to either provide significant support to Israel or receive funding from Israeli sources.",
        ].map((text, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>

      {/* Brand Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12"
        aria-label="Boycott brands"
      >
        <AnimatePresence>
          {boycott
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, visibleCount)
            .map((brand, index) => (
              <motion.article
                key={brand.name}
                className="bg-white/5 backdrop-blur-lg shadow-md rounded-lg p-6 border border-white/10 flex flex-col text-white text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.015, 0.2),
                }}
                tabIndex={0}
                role="article"
                aria-label={`Brand: ${brand.name}`}
              >
                <h3 className="md:text-3xl text-2xl text-red-300 font-semibold mb-4">
                  {brand.name}
                </h3>
                <p className="md:text-2xl text-lg flex-grow">{brand.reason}</p>
              </motion.article>
            ))}
        </AnimatePresence>
      </div>

      {/* Lazy Load Observer */}
      {visibleCount < boycott.length && (
        <div ref={observerRef} className="h-10 mt-10" aria-hidden="true" />
      )}

      {/* Closing Text */}
      <motion.div
        className="max-w-5xl mx-auto text-center space-y-6 text-white/90 text-lg md:text-2xl leading-relaxed mt-12"
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: {} }}
      >
        {[
          "A significant number of brands either directly support Israel or receive funding from Israeli sources. If uncertain, a simple verification method is to examine the barcode—any barcode beginning with ‘729’ is associated with Israel.",
          "Consumers possess considerable influence over both political and economic landscapes. Boycotting Israeli products is not merely an economic choice but a moral stance—an unequivocal act of solidarity with the Palestinian people.",
          "The Blessed Prophet ﷺ instructed: “When one witnesses injustice, they must strive to rectify it through action; if not, then through speech; and if even that is not possible, one must at least denounce it within their heart.” — *40 Hadith an-Nawawi*",
        ].map((text, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            {text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}
