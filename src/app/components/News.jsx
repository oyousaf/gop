"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [lang, setLang] = useState("en");
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?lang=${lang}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [lang]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", !!activeArticle);
    if (activeArticle && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const onEsc = (e) => {
      if (e.key === "Escape") setActiveArticle(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeArticle]);

  const truncate = (text, limit = 5000) =>
    !text
      ? "No preview available."
      : text.length > limit
      ? `${text.slice(0, limit)}...`
      : text;

  const cleanContent = (text) =>
    !text
      ? "No content available."
      : text.replace(/\[\+\d+\schars\]/, "").trim();

  return (
    <section
      id="news"
      className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16"
      aria-labelledby="news-heading"
    >
      <motion.h2
        id="news-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-white"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {lang === "ar" ? "أخبار" : "News"}
      </motion.h2>

      {/* Language Toggle */}
      <div
        className="flex justify-center mb-6"
        role="group"
        aria-label="Language toggle"
      >
        <button
          onClick={() => setLang("en")}
          className={`px-4 py-2 mx-1 rounded ${
            lang === "en"
              ? "bg-white text-background"
              : "bg-white/10 text-white"
          }`}
          aria-pressed={lang === "en"}
          aria-label="Switch to English"
        >
          English
        </button>
        <button
          onClick={() => setLang("ar")}
          className={`px-4 py-2 mx-1 rounded ${
            lang === "ar"
              ? "bg-white text-background"
              : "bg-white/10 text-white"
          }`}
          aria-pressed={lang === "ar"}
          aria-label="Switch to Arabic"
        >
          العربية
        </button>
      </div>

      {loading ? (
        <p className="text-white text-center animate-pulse">
          {lang === "ar" ? "جاري تحميل الأخبار..." : "Loading news..."}
        </p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="cursor-pointer bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setActiveArticle(article)}
              role="button"
              tabIndex={0}
              aria-label={`Open news article titled ${article.title}`}
              onKeyDown={(e) => e.key === "Enter" && setActiveArticle(article)}
            >
              <h3
                className="text-2xl font-semibold text-orange-200 mb-4 text-center"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {article.title}
              </h3>
              <p
                className="text-white/90 text-lg mb-6 text-center"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {truncate(article.description || article.content)}
              </p>
              <div className="mt-auto text-center">
                <span className="inline-block mt-4 px-4 py-2 bg-neutral-200 text-background hover:text-[#6c857d] rounded hover:bg-neutral-300 transition-colors duration-200 text-center">
                  {lang === "ar" ? "اقرأ المزيد" : "Read More"}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onClick={() => setActiveArticle(null)}
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
                  onClick={() => setActiveArticle(null)}
                  className="text-white hover:text-red-400 transition"
                  aria-label="Close article"
                >
                  <FiX className="w-10 h-10" />
                </button>
              </div>

              <h3
                id="modal-title"
                className="text-2xl font-bold text-center mb-4"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {activeArticle.title}
              </h3>

              <p
                id="modal-description"
                className="text-lg leading-relaxed text-center whitespace-pre-wrap"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {cleanContent(
                  activeArticle.description || activeArticle.content || ""
                )}
              </p>

              <div className="text-center mt-6">
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 underline hover:text-green-400"
                >
                  {lang === "ar" ? "المصدر" : "Source"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
