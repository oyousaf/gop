"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");

  /* ---------------------------------------------
     Fetch
  --------------------------------------------- */
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

  /* ---------------------------------------------
     Text cleaning
  --------------------------------------------- */
  const cleanText = (text = "") =>
    text
      .replace(/<[^>]*>/g, "")
      .replace(/list of \d+ items?/gi, "")
      .replace(/\[\+\d+\schars\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();

  const getFullText = (a) =>
    cleanText(`${a?.description || ""}\n\n${a?.content || ""}`);

  /* ---------------------------------------------
     Render
  --------------------------------------------- */
  return (
    <section
      id="news"
      className="relative max-w-7xl mx-auto px-4 py-20 scroll-mt-16"
    >
      {/* Heading — unchanged */}
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-4xl md:text-5xl font-semibold text-center text-neutral-100 mb-10"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {lang === "ar" ? "الأخبار" : "News"}
      </motion.h2>

      {/* Language toggle */}
      <div className="relative mx-auto mb-10 flex w-48 rounded-full bg-white/10 p-1">
        <motion.div
          layout
          className="absolute inset-y-1 w-1/2 rounded-full bg-white"
          style={{ left: lang === "en" ? "4px" : "50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <button
          onClick={() => setLang("en")}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium ${
            lang === "en" ? "text-background" : "text-neutral-300"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLang("ar")}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium ${
            lang === "ar" ? "text-background" : "text-neutral-300"
          }`}
        >
          العربية
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[28rem] rounded-2xl bg-orange-200/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-400">{error}</p>}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {news.map((article, i) => {
            const text = getFullText(article);

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25 }}
                className="
                  relative rounded-2xl
                  p-6
                  flex flex-col
                  shadow-md
                "
                style={{ backgroundColor: "#f3c6a6" }}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <h3 className="text-xl font-semibold text-black/90 mb-4">
                  {article.title}
                </h3>

                <div
                  className={`
                    text-sm leading-relaxed
                    text-black/80
                    space-y-3
                    max-h-[18rem] overflow-y-auto
                    pr-2
                    ${lang === "ar" ? "text-right" : "text-left"}
                  `}
                >
                  {text}
                </div>

                {/* Source */}
                {article.url && (
                  <div
                    className={`mt-4 ${
                      lang === "ar" ? "text-left" : "text-right"
                    }`}
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-block text-xs font-medium
                        text-orange-900 underline
                        hover:opacity-70
                        transition
                      "
                    >
                      {lang === "ar" ? "المصدر" : "Source"}
                    </a>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
