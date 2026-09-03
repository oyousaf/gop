"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const PREVIEW_HEIGHT = 160;
const PAGE_SIZE = 10;

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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [lang, setLang] = useState({});
  const [expanded, setExpanded] = useState({});
  const [canExpand, setCanExpand] = useState({});

  const contentRefs = useRef({});

  /* ---------------------------------------------
     Fetch page
  --------------------------------------------- */
  const fetchPage = async (pageIndex = 0, append = false) => {
    try {
      const res = await fetch(
        `/api/hadith?limit=${PAGE_SIZE}&offset=${pageIndex * PAGE_SIZE}`,
      );

      const data = await res.json();

      const results = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      if (data.total) setTotal(data.total);

      setHadiths((prev) => (append ? [...prev, ...results] : results));
    } catch (e) {
      setError(e.message);
    }
  };

  /* ---------------------------------------------
     Initial load
  --------------------------------------------- */
  useEffect(() => {
    fetchPage(0, false).finally(() => setLoading(false));
  }, []);

  /* ---------------------------------------------
     Load more
  --------------------------------------------- */
  const loadMore = async () => {
    if (hadiths.length >= total) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    await fetchPage(nextPage, true);
    setPage(nextPage);
    setLoadingMore(false);
  };

  /* ---------------------------------------------
     Expansion detection
  --------------------------------------------- */
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

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <section
      id="hadith"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-16"
    >
      <h2 id="hadith-heading" className="text-4xl md:text-5xl font-semibold text-center mb-14 text-white">
        Hadith
      </h2>

      {loading && (
        <p className="text-white/70 text-center animate-pulse">
          Loading hadiths…
        </p>
      )}

      {error && (
        <p className="text-red-400 text-center">Failed to load hadiths</p>
      )}

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
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl px-6 sm:px-10 py-10 bg-teal-200 ring-1 ring-teal-300 shadow-lg"
            >
              {h.arabic && (
                <button
                  type="button"
                  aria-label={`Show ${currentLang === "en" ? "Arabic" : "English"} translation`}
                  onClick={() => toggleLang(i)}
                  className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full bg-teal-900 text-teal-50"
                >
                  {currentLang === "en" ? "AR" : "EN"}
                </button>
              )}

              {h.narrator && (
                <h3 className="text-2xl font-semibold text-teal-900 text-center mb-6">
                  {h.narrator}
                </h3>
              )}

              <motion.div
                layout
                animate={{
                  height: isExpanded
                    ? (contentRefs.current[i]?.scrollHeight ?? "auto")
                    : PREVIEW_HEIGHT,
                }}
                className="overflow-hidden max-w-3xl mx-auto"
              >
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  className={
                    currentLang === "ar"
                      ? "text-xl leading-[2.05] font-bold text-teal-900 text-right font-arabic"
                      : "text-lg leading-[2.15] text-teal-900"
                  }
                >
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className="mb-6 last:mb-0">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>

              {showArrow && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} hadith`}
                    onClick={() => toggleExpand(i)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-900 text-teal-50"
                  >
                    <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <FiChevronDown size={20} />
                    </motion.span>
                  </button>
                </div>
              )}

              {Array.isArray(h.sources) && (
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {h.sources.map((s) => {
                    const meta = COLLECTION_LABELS[s];
                    const label = meta?.[currentLang] || s;

                    return (
                      <span
                        key={s}
                        className={
                          meta?.sahihayn
                            ? "text-xs px-3 py-1 rounded-full border border-amber-500 bg-amber-400 text-amber-950"
                            : "text-xs px-3 py-1 rounded-full border border-teal-700 bg-teal-300 text-teal-950"
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

      {/* Load More */}
      {hadiths.length < total && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 rounded-full bg-teal-900 text-teal-50 hover:bg-teal-800 transition"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
