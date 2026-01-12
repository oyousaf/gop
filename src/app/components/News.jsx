"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?lang=${lang}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        setNews(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  return (
    <section
      id="news"
      className="relative max-w-7xl mx-auto px-4 py-20 scroll-mt-16"
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-semibold text-center mb-10 text-white"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {lang === "ar" ? "الأخبار" : "News"}
      </motion.h2>

      {/* Language toggle */}
      <div className="mx-auto mb-12 flex w-48 rounded-full bg-amber-800 p-1 ring-1 ring-amber-900">
        {["en", "ar"].map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`relative w-1/2 py-2 text-sm font-medium rounded-full ${
              lang === code ? "text-amber-950" : "text-amber-200"
            }`}
          >
            {lang === code && (
              <motion.span
                layoutId="lang-toggle"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full bg-amber-300"
              />
            )}
            <span className="relative z-10">
              {code === "en" ? "English" : "العربية"}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[28rem] rounded-2xl bg-amber-700 ring-1 ring-amber-900 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <motion.article
              key={article.url || article.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={canHover ? { y: -2 } : undefined}
              viewport={{ once: true }}
              transition={{
                default: { duration: 0.25, ease: "easeOut" },
                y: { type: "spring", stiffness: 420, damping: 32 },
              }}
              className="
                relative rounded-2xl p-6 flex flex-col
                bg-amber-700
                ring-1 ring-amber-900
                shadow-lg
              "
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <h3
                className={`text-lg md:text-xl font-semibold leading-snug mb-4 text-center text-amber-100 ${
                  lang === "ar" ? "font-arabic" : ""
                }`}
              >
                {article.title}
              </h3>

              <div
                className={
                  lang === "ar"
                    ? "text-xl leading-[2.05] font-bold text-right font-arabic text-amber-100 max-h-[18rem] overflow-hidden max-w-prose mx-auto"
                    : "text-base md:text-lg leading-[1.8] text-amber-200 max-h-[18rem] overflow-hidden max-w-prose mx-auto"
                }
              >
                {article.description || article.content}
              </div>

              {article.url && (
                <div className="mt-4 text-center">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-medium text-amber-100 underline hover:opacity-70 transition"
                  >
                    {lang === "ar" ? "المصدر" : "Source"}
                  </a>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}
