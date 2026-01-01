"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hadith() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lang, setLang] = useState({});
  const [expanded, setExpanded] = useState({});

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

  const toggleLang = (i) => {
    setLang((prev) => ({
      ...prev,
      [i]: prev[i] === "ar" ? "en" : "ar",
    }));
  };

  const toggleExpand = (i) => {
    setExpanded((prev) => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  return (
    <section
      id="hadith"
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-16"
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
        <p className="text-white text-center animate-pulse">Loading hadiths…</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-12">
          {hadiths.map((hadith, i) => {
            const currentLang = lang[i] || "en";
            const showArabic = currentLang === "ar" && hadith.arabic;
            const isExpanded = !!expanded[i];
            const text = showArabic ? hadith.arabic : hadith.content;

            return (
              <motion.article
                key={`${hadith.title}-${i}`}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="
                  relative cursor-pointer
                  bg-white/5 backdrop-blur-md
                  rounded-2xl
                  border border-white/10
                  px-6 sm:px-10 py-8
                  shadow-md
                "
                onClick={() => toggleExpand(i)}
              >
                {/* LANGUAGE TOGGLE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLang(i);
                  }}
                  className="
                    absolute top-4 right-4
                    text-xs font-semibold
                    px-3 py-1
                    rounded-full
                    border border-white/20
                    text-white/80
                    hover:text-white
                    hover:border-white/40
                    transition
                  "
                  aria-label="Toggle language"
                >
                  {currentLang === "en" ? "AR" : "EN"}
                </button>

                {/* NARRATOR */}
                {hadith.narrator && (
                  <h3 className="text-2xl font-semibold text-[#b9e1d4] text-center mb-6">
                    {hadith.narrator}
                  </h3>
                )}

                {/* HADITH TEXT */}
                <motion.p
                  layout
                  className={`
                    text-lg leading-[2.15]
                    whitespace-pre-wrap
                    max-w-3xl mx-auto
                    py-1 overflow-hidden
                    ${showArabic ? "text-right font-arabic" : "text-left"}
                    ${!isExpanded ? "line-clamp-4" : ""}
                  `}
                >
                  {text}
                </motion.p>

                {/* ELLIPSIS HINT */}
                {!isExpanded && text.length > 400 && (
                  <p className="text-xs text-white/40 text-center mt-3">
                    Tap to read more
                  </p>
                )}

                {/* EXPANDED EXTRAS */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="w-12 h-px bg-white/20 mx-auto my-8" />

                      {Array.isArray(hadith.sources) &&
                        hadith.sources.length > 0 && (
                          <p className="text-xs text-white/50 text-center">
                            Narrated in:{" "}
                            {hadith.sources
                              .map(
                                (s) => s.charAt(0).toUpperCase() + s.slice(1)
                              )
                              .join(" · ")}
                          </p>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
