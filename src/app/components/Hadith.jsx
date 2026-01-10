"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PREVIEW_CHAR_LIMIT = 420;
const PREVIEW_HEIGHT = 160;
const EXPANDED_MAX_HEIGHT = 2000;

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
    fetch("/api/hadith")
      .then((r) => r.json())
      .then((d) => setHadiths(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleLang = (i) =>
    setLang((p) => ({ ...p, [i]: p[i] === "ar" ? "en" : "ar" }));

  const toggleExpand = (i) =>
    setExpanded((p) => ({ ...p, [i]: !p[i] }));

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
          {hadiths.map((h, i) => {
            const currentLang = lang[i] || "en";

            const raw =
              currentLang === "ar" && h.arabic ? h.arabic : h.content || "";

            // Preserve text exactly, only split into paragraphs
            const paragraphs = raw
              .split(/\n{2,}/)
              .map((p) => p.trim())
              .filter(Boolean);

            const canExpand = raw.length > PREVIEW_CHAR_LIMIT;
            const isExpanded = !!expanded[i];

            return (
              <article
                key={`${h.narrator || "hadith"}-${i}`}
                className="relative rounded-2xl px-6 sm:px-10 py-10 shadow-md"
                style={{ backgroundColor: "#b9e1d4" }}
              >
                {/* LANGUAGE TOGGLE */}
                {h.arabic && (
                  <button
                    type="button"
                    onClick={() => toggleLang(i)}
                    className="
                      absolute top-4 right-4 z-20
                      text-xs font-semibold
                      px-3 py-1 rounded-full
                      bg-black/5 text-black/80
                      hover:bg-black/10
                      transition
                    "
                  >
                    {currentLang === "en" ? "AR" : "EN"}
                  </button>
                )}

                {/* NARRATOR */}
                {h.narrator && (
                  <h3 className="text-2xl font-semibold text-black/85 text-center mb-6">
                    {h.narrator}
                  </h3>
                )}

                {/* TEXT CONTAINER */}
                <motion.div
                  initial={false}
                  animate={{
                    maxHeight: isExpanded
                      ? EXPANDED_MAX_HEIGHT
                      : PREVIEW_HEIGHT,
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
                  <div
                    className={`
                      text-lg leading-[2.15]
                      text-black/90
                      ${
                        currentLang === "ar"
                          ? "text-right font-arabic"
                          : "text-left"
                      }
                    `}
                  >
                    {paragraphs.map((p, idx) => (
                      <p key={idx} className="mb-6 last:mb-0">
                        {p}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* EXPAND DIVIDER */}
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
                {Array.isArray(h.sources) && h.sources.length > 0 && (
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {h.sources.map((s) => {
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
