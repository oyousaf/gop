"use client";

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown, FiShare2 } from "react-icons/fi";
import SectionHeading from "./SectionHeading";

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

const toParagraphs = (raw = "") =>
  raw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

function HadithCard({ hadith, index }) {
  const [lang, setLang] = useState("en");
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  // Track the natural height so expand/collapse can transition to exact pixels
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFullHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [lang]);

  // Native share sheet where available (mobile), otherwise copy to clipboard
  const share = async () => {
    const source = hadith.sources?.map((s) => COLLECTION_LABELS[s]?.en || s).join(", ");
    const text = [
      hadith.narrator,
      (isArabic ? hadith.arabic : hadith.content).replace(/\s+/g, " ").trim(),
      source && `— ${source}`,
    ]
      .filter(Boolean)
      .join("\n\n");
    const url = `${window.location.origin}/#hadith`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Hadith", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share sheet dismissed or clipboard blocked: nothing to do
    }
  };

  const isArabic = lang === "ar" && hadith.arabic;
  const paragraphs = toParagraphs(isArabic ? hadith.arabic : hadith.content);
  const canExpand = fullHeight !== null && fullHeight > PREVIEW_HEIGHT + 8;
  const height = !canExpand
    ? "auto"
    : expanded
      ? fullHeight
      : PREVIEW_HEIGHT;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${(index % PAGE_SIZE) * 40}ms` }}
      className="relative rounded-[2rem] bg-paper px-6 pb-10 pt-14 text-paper-ink shadow-[0_24px_60px_-36px_oklch(0.2_0.03_58/0.55)] ring-1 ring-black/5 sm:px-12"
    >
      <span
        aria-hidden="true"
        className="absolute left-6 top-2 font-display text-7xl leading-none text-[oklch(0.7_0.12_78)] sm:left-10"
      >
        “
      </span>

      {hadith.arabic && (
        <button
          type="button"
          aria-label={`Show ${isArabic ? "English" : "Arabic"} text`}
          onClick={() => setLang(isArabic ? "en" : "ar")}
          lang={isArabic ? "en" : "ar"}
          className="absolute right-5 top-5 rounded-full border border-paper-ink/15 px-3.5 py-1 text-sm text-paper-muted transition-colors hover:bg-paper-ink/5 hover:text-paper-ink"
        >
          {isArabic ? "English" : "العربية"}
        </button>
      )}

      {hadith.narrator && (
        <h3 className="mb-6 text-center font-display text-3xl text-paper-ink">
          {hadith.narrator}
        </h3>
      )}

      <div
        id={`hadith-body-${index}`}
        style={{ height }}
        className={`relative overflow-hidden max-w-3xl mx-auto transition-[height] duration-700 motion-reduce:transition-none ${
          canExpand && !expanded
            ? "mask-b-from-60% mask-b-to-100%"
            : ""
        }`}
      >
        <div
          ref={contentRef}
          key={lang}
          lang={isArabic ? "ar" : "en"}
          dir={isArabic ? "rtl" : "ltr"}
          className={`animate-[fade-in_0.5s_ease-out] ${
            isArabic
              ? "text-right font-arabic text-2xl leading-[2.1] text-paper-ink"
              : "text-lg leading-[1.95] text-paper-ink/90 md:text-xl"
          }`}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx} className="mb-6 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </div>

      {canExpand && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            aria-label={`${expanded ? "Collapse" : "Expand"} hadith`}
            aria-expanded={expanded}
            aria-controls={`hadith-body-${index}`}
            onClick={() => setExpanded((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-paper-ink/15 text-paper-ink transition-colors hover:bg-paper-ink/5"
          >
            <FiChevronDown
              size={20}
              aria-hidden="true"
              className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}

      {Array.isArray(hadith.sources) && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {hadith.sources.map((s) => {
            const meta = COLLECTION_LABELS[s];
            const label = meta?.[isArabic ? "ar" : "en"] || s;

            return (
              <span
                key={s}
                className={
                  meta?.sahihayn
                    ? "rounded-full bg-[oklch(0.8_0.12_80/0.35)] px-3 py-1 text-xs font-medium text-paper-ink"
                    : "rounded-full bg-paper-ink/6 px-3 py-1 text-xs font-medium text-paper-muted"
                }
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-paper-muted transition-colors hover:bg-paper-ink/5 hover:text-paper-ink"
        >
          {copied ? <FiCheck aria-hidden="true" /> : <FiShare2 aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Share"}</span>
        </button>
      </div>
    </article>
  );
}

/* `initial` is the first page, rendered on the server so it's in the HTML */
export default function Hadith({ initial }) {
  const [hadiths, setHadiths] = useState(initial?.results ?? []);
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [loading, setLoading] = useState(!initial);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchPage = async (offset) => {
    try {
      const res = await fetch(`/api/hadith?limit=${PAGE_SIZE}&offset=${offset}`);
      const data = await res.json();
      const results = Array.isArray(data?.results) ? data.results : [];
      if (data.total) setTotal(data.total);
      setHadiths((prev) => (offset ? [...prev, ...results] : results));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (initial) return;
    fetchPage(0).finally(() => setLoading(false));
  }, [initial]);

  const loadMore = async () => {
    if (hadiths.length >= total) return;
    setLoadingMore(true);
    await fetchPage(hadiths.length);
    setLoadingMore(false);
  };

  return (
    <section
      id="hadith"
      aria-labelledby="hadith-heading"
      className="relative mx-auto max-w-4xl px-4 py-24 md:py-32"
    >
      <SectionHeading
        id="hadith-heading"
        eyebrow="Hadith"
        arabic="الحديث"
        title="Pearls of Prophetic Wisdom"
        lede="A selection from the six canonical collections, chosen for the current Hijri month."
      />

      {loading && (
        <div aria-hidden="true" className="space-y-10">
          {[0, 1].map((n) => (
            <div key={n} className="h-72 animate-pulse rounded-[2rem] bg-surface-2" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-danger">Failed to load hadiths</p>
      )}

      <div className="flex flex-col gap-10">
        {hadiths.map((h, i) => (
          <HadithCard key={`${h.narrator || "hadith"}-${i}`} hadith={h} index={i} />
        ))}
      </div>

      {hadiths.length < total && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-full border border-line-strong px-6 py-3 font-medium text-ink transition-colors hover:bg-surface-2 disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
