"use client";

import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import SectionHeading from "./SectionHeading";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const relativeTime = (iso, lang) => {
  const then = Date.parse(iso);
  if (!then) return "";
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const mins = Math.round((then - Date.now()) / 60000);
  if (Math.abs(mins) < 60) return rtf.format(mins, "minute");
  const hrs = Math.round(mins / 60);
  if (Math.abs(hrs) < 24) return rtf.format(hrs, "hour");
  return rtf.format(Math.round(hrs / 24), "day");
};

/* `initial` is the English feed, rendered on the server so it's in the HTML */
export default function News({ initial }) {
  const [news, setNews] = useState(initial ?? []);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");
  // Skip the first client fetch when the server already supplied the English feed
  const skipFetch = useRef(Boolean(initial));

  useEffect(() => {
    if (skipFetch.current) {
      skipFetch.current = false;
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/news?lang=${lang}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then(setNews)
      .catch((e) => e.name !== "AbortError" && setError(e.message))
      .finally(() => !controller.signal.aborted && setLoading(false));

    return () => controller.abort();
  }, [lang]);

  const isArabic = lang === "ar";

  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="relative mx-auto max-w-6xl px-4 py-24 md:py-32"
    >
      <SectionHeading
        id="news-heading"
        eyebrow="News"
        arabic="الأخبار"
        title="Truth from the Ground"
        lede="Stay informed, stand firm — recent reporting on Palestine and the Muslim world from trusted outlets."
      />

      {/* Language toggle — the pill slides between options */}
      <div data-reveal className="mb-12 flex justify-center">
        <div
          role="group"
          aria-label="News language"
          className="relative grid grid-cols-2 rounded-full bg-surface-2 p-1 ring-1 ring-line"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink shadow transition-transform duration-500"
            style={{ transform: `translateX(${isArabic ? 100 : 0}%)` }}
          />
          {LANGS.map(({ code, label }) => (
            <button
              type="button"
              key={code}
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              lang={code}
              className={`relative z-10 min-w-28 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-500 ${
                lang === code ? "text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 animate-pulse rounded-[1.75rem] bg-surface-2" />
          ))}
        </div>
      )}

      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => (
            <article
              key={article.url || article.title}
              data-reveal
              style={{ "--reveal-delay": `${(index % 3) * 90}ms` }}
              dir={isArabic ? "rtl" : "ltr"}
              lang={lang}
              className="h-full"
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-surface transition-[border-color,box-shadow] duration-500 hover:border-line-strong hover:shadow-[0_24px_60px_-36px_oklch(0.2_0.03_58/0.5)]">
                {article.urlToImage && (
                  <div className="aspect-video overflow-hidden bg-surface-2">
                    {/* Remote images from many publishers, so a plain lazy <img> */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.urlToImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      onError={(e) => (e.currentTarget.parentElement.style.display = "none")}
                    />
                  </div>
                )}

                <div className="flex grow flex-col p-6">
                  <p className="mb-3 flex items-center gap-2 text-sm text-ink-subtle">
                    <span className="font-medium text-accent-text">{article.source?.name}</span>
                    {article.publishedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <time dateTime={article.publishedAt}>
                          {relativeTime(article.publishedAt, lang)}
                        </time>
                      </>
                    )}
                  </p>

                  <h3
                    className={`mb-3 text-ink ${
                      isArabic
                        ? "font-arabic text-xl font-semibold leading-relaxed"
                        : "font-display text-2xl leading-snug"
                    }`}
                  >
                    {article.url ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {article.title}
                      </a>
                    ) : (
                      article.title
                    )}
                  </h3>

                  <p
                    className={`line-clamp-4 text-ink-muted ${
                      isArabic ? "font-arabic text-lg leading-loose" : "leading-relaxed"
                    }`}
                  >
                    {article.description || article.content}
                  </p>

                  {article.url && (
                    <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-ink">
                      {isArabic ? "اقرأ المزيد" : "Read article"}
                      <FiArrowUpRight
                        aria-hidden="true"
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100"
                      />
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
