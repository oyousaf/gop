"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const PREVIEW_HEIGHT = 160;

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
  const [canExpand, setCanExpand] = useState({});

  const contentRefs = useRef({});

  useEffect(() => {
    fetch("/api/hadith")
      .then((r) => r.json())
      .then((d) => setHadiths(Array.isArray(d) ? d : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const next = {};
    Object.entries(contentRefs.current).forEach(([i, el]) => {
      if (!el) return;
      next[i] = el.scrollHeight > PREVIEW_HEIGHT + 8;
    });
    setCanExpand(next);
  }, [hadiths, lang]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setExpanded((p) => ({ ...p }));
    });
  }, [lang]);

  const toggleLang = (i) =>
    setLang((p) => ({ ...p, [i]: p[i] === "ar" ? "en" : "ar" }));

  const toggleExpand = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  return (
    <section
      id="hadith"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-16"
    >
      <h2 className="text-4xl md:text-5xl font-semibold text-center mb-14 text-white">
        Hadith
      </h2>

      {loading && (
        <p className="text-white/70 text-center animate-pulse">
          Loading hadiths…
        </p>
      )}
      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="flex flex-col gap-14">
        {hadiths.map((h, i) => {
          const currentLang = lang[i] || "en";
          const raw =
            currentLang === "ar" && h.arabic ? h.arabic : h.content || "";

          const paragraphs = raw
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean);

          const isExpanded = !!expanded[i];
          const showArrow = !!canExpand[i];

          return (
            <motion.article
              key={`${h.narrator || "hadith"}-${i}`}
              layout
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative rounded-2xl px-6 sm:px-10 py-10 bg-teal-100 shadow-md"
            >
              {/* Language toggle */}
              {h.arabic && (
                <button
                  type="button"
                  onClick={() => toggleLang(i)}
                  className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 hover:bg-teal-900/20 transition"
                >
                  {currentLang === "en" ? "AR" : "EN"}
                </button>
              )}

              {/* Narrator */}
              {h.narrator && (
                <h3 className="text-2xl font-semibold text-teal-900 text-center mb-6">
                  {h.narrator}
                </h3>
              )}

              {/* Text container */}
              <motion.div
                layout
                initial={false}
                animate={{
                  height: isExpanded
                    ? contentRefs.current[i]?.scrollHeight ?? "auto"
                    : PREVIEW_HEIGHT,
                }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden max-w-3xl mx-auto"
              >
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  className={
                    currentLang === "ar"
                      ? "text-xl leading-[2.35] text-teal-800 text-right font-arabic tracking-normal"
                      : "text-lg leading-[2.15] text-teal-800 text-left"
                  }
                >
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className="mb-6 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Expand arrow */}
              {showArrow && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => toggleExpand(i)}
                    aria-expanded={isExpanded}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-900/10 text-teal-900 hover:bg-teal-900/20 transition"
                  >
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <FiChevronDown size={20} />
                    </motion.span>
                  </button>
                </div>
              )}

              {/* Sources */}
              {Array.isArray(h.sources) && h.sources.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {h.sources.map((s) => {
                    const meta = COLLECTION_LABELS[s];
                    const label = meta?.[currentLang] || s;

                    return (
                      <span
                        key={s}
                        className={
                          meta?.sahihayn
                            ? "text-xs px-3 py-1 rounded-full border border-amber-400/70 bg-amber-300/40 text-amber-900"
                            : "text-xs px-3 py-1 rounded-full border border-teal-900/20 bg-teal-900/10 text-teal-900"
                        }
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
