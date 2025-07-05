"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hadith() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHadith, setActiveHadith] = useState(null);

  useEffect(() => {
    const loadHadiths = async () => {
      try {
        const res = await fetch("/api/hadith");
        if (!res.ok) throw new Error("Failed to fetch hadith");
        const data = await res.json();
        setHadiths(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadHadiths();
  }, []);

  const truncate = (text, limit = 220) => {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  return (
    <section
      id="hadith"
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
      >
        Hadith
      </motion.h2>

      {loading ? (
        <p className="text-white text-center animate-pulse">
          Loading hadiths...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hadiths.map((hadith, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-[#b9e1d4] mb-4 text-center">
                {hadith.title}
              </h3>
              <p className="text-white/90 text-base mb-6 text-center">
                {truncate(hadith.content)}
              </p>
              <div className="mt-auto text-center">
                <button
                  onClick={() => setActiveHadith(hadith)}
                  className="inline-block px-4 py-2 rounded bg-white/10 border border-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
                >
                  Read More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {activeHadith && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveHadith(null)}
          >
            <motion.div
              className="bg-background text-zinc-100 rounded-xl p-6 max-w-xl w-full relative z-10"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-4">
                {activeHadith.title}
              </h3>
              <p className="text-base leading-relaxed text-center whitespace-pre-wrap">
                {activeHadith.content}
              </p>
              <div className="text-center mt-6">
                <a
                  href={activeHadith.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline"
                >
                  Source
                </a>
              </div>
              <button
                onClick={() => setActiveHadith(null)}
                className="absolute top-3 right-3 text-gray-200 hover:text-white text-4xl"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
