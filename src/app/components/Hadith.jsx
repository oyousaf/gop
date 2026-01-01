"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function Hadith() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHadith, setActiveHadith] = useState(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const loadHadiths = async () => {
      try {
        const res = await fetch("/api/hadith");
        if (!res.ok) throw new Error("Failed to fetch hadith");
        const data = await res.json();
        setHadiths(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    loadHadiths();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", !!activeHadith);
    if (activeHadith && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [activeHadith]);

  const truncate = (text, limit = 260) =>
    text && text.length > limit ? `${text.slice(0, limit)}…` : text;

  return (
    <section
      id="hadith"
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16"
      aria-labelledby="hadith-heading"
    >
      <motion.h2
        id="hadith-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
      >
        Hadith
      </motion.h2>

      {loading ? (
        <p className="text-white text-center animate-pulse">Loading hadiths…</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-10">
          {hadiths.map((hadith, i) => (
            <motion.article
              key={`${hadith.title}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="cursor-pointer bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setActiveHadith(hadith)}
              tabIndex={0}
              role="button"
              aria-label="Open full hadith"
              onKeyDown={(e) => e.key === "Enter" && setActiveHadith(hadith)}
            >
              {/* NARRATOR  */}
              {hadith.narrator && (
                <h3 className="text-2xl font-semibold text-[#b9e1d4] mb-2 text-center">
                  {hadith.narrator}
                </h3>
              )}

              <p className="text-white/90 text-lg text-center">
                {truncate(hadith.content)}
              </p>
            </motion.article>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {activeHadith && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
            onClick={() => setActiveHadith(null)}
          >
            <motion.div
              className="relative bg-background text-white rounded-xl p-4 sm:p-6 max-w-2xl w-full z-10 shadow-lg border border-white/10 max-h-[90vh] overflow-y-auto"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-end mb-4">
                <button
                  ref={closeButtonRef}
                  onClick={() => setActiveHadith(null)}
                  className="text-white hover:text-red-400 transition"
                  aria-label="Close hadith modal"
                >
                  <FiX className="w-10 h-10" />
                </button>
              </div>

              {activeHadith.narrator && (
                <h3 className="text-2xl font-semibold text-[#b9e1d4] mb-2 text-center">
                  {activeHadith.narrator}
                </h3>
              )}

              <p className="text-lg leading-relaxed text-center whitespace-pre-wrap">
                {activeHadith.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
