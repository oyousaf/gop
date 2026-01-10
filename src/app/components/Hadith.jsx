"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREVIEW_CHAR_LIMIT = 420;
const PREVIEW_HEIGHT = 160;

// Canonical collection labels
const COLLECTION_LABELS = {
  bukhari: { en: "Sahih al-Bukhari", ar: "صحيح البخاري", sahihayn: true },
  muslim: { en: "Sahih Muslim", ar: "صحيح مسلم", sahihayn: true },
  tirmidhi: { en: "Jami‘ at-Tirmidhi", ar: "جامع الترمذي" },
  nasai: { en: "Sunan an-Nasa’i", ar: "سنن النسائي" },
  ibnmajah: { en: "Sunan Ibn Majah", ar: "سنن ابن ماجه" },
  abudawud: { en: "Sunan Abi Dawud", ar: "سنن أبي داود" },
};

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
    setLang((prev) => ({ ...prev, [i]: prev[i] === "ar" ? "en" : "ar" }));
  };

  const toggleExpand = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <section
      id="hadith"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-16"
    >
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-semibold text-center mb-14 text-white"
      >
        Hadith
      </motion.h2>

      {loading ? (
        <p className="text-white/70 text-center animate-pulse">
          Loading hadiths…
        </p>
      ) : error ? (
        <p className="text-red-400 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-14">
          {hadiths.map((hadith, i) => {
            const arabic =
              typeof hadith.arabic === "string" ? hadith.arabic.trim() : "";
            const hasArabic = arabic.length > 0;

            const currentLang = lang[i] || "en";
            const text =
              currentLang === "ar" && hasArabic ? arabic : hadith.content || "";

            const canExpand = text.length > PREVIEW_CHAR_LIMIT;
            const isExpanded = !!expanded[i];

            return (
              <article
                key={`${hadith.narrator || "hadith"}-${i}`}
                className="relative rounded-2xl px-6 sm:px-10 py-10 shadow-md"
                style={{ backgroundColor: "#b9e1d4" }}
              >
                {/* LANGUAGE TOGGLE */}
                {hasArabic && (
                  <button
                    type="button"
                    onClick={() => toggleLang(i)}
                    className="
                      absolute top-4 right-4 z-20
                      text-xs font-semibold
                      px-3 py-1 rounded-full
                      bg-black/5 text-black/80
                      hover:bg-black/10 transition
                    "
                  >
                    {currentLang === "en" ? "AR" : "EN"}
                  </button>
                )}

                {/* NARRATOR */}
                {hadith.narrator && (
                  <h3 className="text-2xl font-semibold text-black/85 text-center mb-6">
                    {hadith.narrator}
                  </h3>
                )}

                {/* TEXT WRAPPER */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? "auto" : PREVIEW_HEIGHT,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className={`
                    overflow-hidden
                    max-w-3xl mx-auto
                    ${canExpand ? "cursor-pointer" : ""}
                  `}
                  onClick={() => canExpand && toggleExpand(i)}
                >
                  <p
                    className={`
                      text-lg leading-[2.15]
                      whitespace-pre-wrap
                      text-black/90
                      ${
                        currentLang === "ar"
                          ? "text-right font-arabic"
                          : "text-left"
                      }
                    `}
                  >
                    {text}
                  </p>
                </motion.div>

                {/* DIVIDER ON EXPAND */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="mt-8"
                    >
                      <div className="w-12 h-px bg-black/25 mx-auto" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SOURCE BADGES */}
                {Array.isArray(hadith.sources) && hadith.sources.length > 0 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {hadith.sources.map((s) => {
                      const meta = COLLECTION_LABELS[s];
                      const label = meta?.[currentLang] || s;

                      return (
                        <span
                          key={s}
                          className={`
                              text-xs px-3 py-1 rounded-full border
                              ${
                                meta?.sahihayn
                                  ? "border-amber-400 text-amber-900 bg-amber-300/40"
                                  : "border-black/20 text-black/70 bg-black/5"
                              }
                            `}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
