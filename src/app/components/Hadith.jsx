"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREVIEW_CHAR_LIMIT = 420;

// Canonical collection labels
const COLLECTION_LABELS = {
  bukhari: {
    en: "Sahih al-Bukhari",
    ar: "صحيح البخاري",
    sahihayn: true,
  },
  muslim: {
    en: "Sahih Muslim",
    ar: "صحيح مسلم",
    sahihayn: true,
  },
  tirmidhi: {
    en: "Jami‘ at-Tirmidhi",
    ar: "جامع الترمذي",
  },
  nasai: {
    en: "Sunan an-Nasa’i",
    ar: "سنن النسائي",
  },
  ibnmajah: {
    en: "Sunan Ibn Majah",
    ar: "سنن ابن ماجه",
  },
  abudawud: {
    en: "Sunan Abi Dawud",
    ar: "سنن أبي داود",
  },
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
            const arabic =
              typeof hadith.arabic === "string" ? hadith.arabic.trim() : "";
            const hasArabic = arabic.length > 0;

            const currentLang = lang[i] || "en";
            const text =
              currentLang === "ar" && hasArabic
                ? arabic
                : hadith.content || "";

            const canExpand = text.length > PREVIEW_CHAR_LIMIT;
            const isExpanded = !!expanded[i];

            return (
              <article
                key={`${hadith.narrator || "hadith"}-${i}`}
                className="
                  relative
                  bg-white/5 backdrop-blur-md
                  rounded-2xl
                  border border-white/10
                  px-6 sm:px-10 py-8
                  shadow-md
                "
              >
                {/* LANGUAGE TOGGLE — TEXT ONLY */}
                {hasArabic && (
                  <button
                    type="button"
                    onClick={() => toggleLang(i)}
                    className="
                      absolute top-4 right-4 z-20
                      text-xs font-semibold
                      px-3 py-1 rounded-full border
                      border-white/20 text-white/80
                      hover:text-white hover:border-white/40
                      transition
                    "
                  >
                    {currentLang === "en" ? "AR" : "EN"}
                  </button>
                )}

                {/* NARRATOR */}
                {hadith.narrator && (
                  <h3 className="text-2xl font-semibold text-[#b9e1d4] text-center mb-6">
                    {hadith.narrator}
                  </h3>
                )}

                {/* HADITH TEXT */}
                <motion.p
                  onClick={() => canExpand && toggleExpand(i)}
                  layout
                  className={`
                    text-lg leading-[2.15]
                    whitespace-pre-wrap
                    max-w-3xl mx-auto
                    overflow-hidden
                    ${
                      currentLang === "ar"
                        ? "text-right font-arabic"
                        : "text-left"
                    }
                    ${
                      !isExpanded && canExpand
                        ? "line-clamp-4 cursor-pointer"
                        : ""
                    }
                  `}
                >
                  {text}
                </motion.p>

                {/* EXPAND ANIMATION */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6"
                    >
                      <div className="w-12 h-px bg-white/20 mx-auto mb-4" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SOURCE BADGES — EN / AR + SAHIHAYN GOLD */}
                {Array.isArray(hadith.sources) &&
                  hadith.sources.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {hadith.sources.map((s) => {
                        const meta = COLLECTION_LABELS[s];
                        const label = meta?.[currentLang] || s;

                        return (
                          <span
                            key={s}
                            className={`
                              text-xs px-3 py-1 rounded-full border backdrop-blur
                              ${
                                meta?.sahihayn
                                  ? "border-amber-400/60 text-amber-300 bg-amber-400/10"
                                  : "border-white/15 text-white/70 bg-white/5"
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
