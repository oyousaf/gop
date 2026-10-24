"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { boycott } from "../utils/constants";
import SectionHeading from "./SectionHeading";

const fold = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const isPriority = (brand) => /priority target/i.test(brand.reason);

const BRANDS = [...boycott]
  .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
  .map((b) => ({
    ...b,
    priority: isPriority(b),
    letter: /[a-z]/i.test(b.name[0]) ? fold(b.name[0]).toUpperCase() : "#",
    haystack: fold(`${b.name} ${b.reason}`),
  }));

const LETTERS = [...new Set(BRANDS.map((b) => b.letter))];

const INTRO = [
  "The growing discourse around divesting from companies supporting Israel has gained momentum, particularly during the current crisis. Esteemed Islamic scholars urge Muslims to avoid such brands, citing the profound spiritual and historical significance of Masjid Al-Aqsa.",
  "This reference list reflects the BDS Movement guide retrieved on 3 September 2026. Priority targets and grassroots campaigns are labelled separately; check the linked source for the latest guidance.",
];

const CLOSING = [
  "Many brands either directly support Israel or receive Israeli funding. If uncertain, a simple check is the barcode—those beginning with ‘729’ are associated with Israel.",
  "Consumers hold significant power in shaping economic and political outcomes. Boycotting such products is not merely economic but a moral stance of solidarity.",
  "The Prophet ﷺ said: “Whoever among you sees an injustice, let them change it with their hand; if they cannot, then with their tongue; if they cannot, then with their heart.” — 40 Hadith an-Nawawi",
];

export default function Divestment() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const q = fold(deferredQuery.trim());
    return q ? BRANDS.filter((b) => b.haystack.includes(q)) : BRANDS;
  }, [deferredQuery]);

  const firstOfLetter = useMemo(() => {
    const seen = new Set();
    return results.reduce((ids, b) => {
      if (!seen.has(b.letter)) {
        seen.add(b.letter);
        ids.add(b.name);
      }
      return ids;
    }, new Set());
  }, [results]);

  const searching = deferredQuery.trim().length > 0;

  return (
    <section
      id="divestment"
      aria-labelledby="divestment-heading"
      className="mx-auto max-w-6xl px-4 py-24 md:py-32"
    >
      <SectionHeading
        id="divestment-heading"
        eyebrow="Divestment"
        arabic="المقاطعة"
        title="Boycott with knowledge"
      />

      <div
        data-reveal
        className="mx-auto max-w-3xl space-y-5 text-center text-lg leading-relaxed text-ink-muted md:text-xl"
      >
        {INTRO.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>

      {/* Search + A–Z (search stays pinned while browsing the list) */}
      <div
        data-reveal
        className="sticky top-20 z-20 mx-auto mt-12 flex max-w-3xl flex-col items-center gap-3 rounded-[1.75rem] border border-line
          bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] p-3 backdrop-blur-xl"
      >
        <div className="relative w-full">
          <label htmlFor="boycott-search" className="sr-only">
            Search brands
          </label>
          <FiSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-ink-subtle"
          />
          <input
            id="boycott-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${BRANDS.length} brands or parent companies…`}
            autoComplete="off"
            className="w-full rounded-full border border-line bg-surface py-3 pl-11 pr-24 text-lg text-ink placeholder:text-ink-subtle
              [&::-webkit-search-cancel-button]:hidden"
          />
          <span
            aria-live="polite"
            className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-sm tabular-nums text-ink-subtle"
          >
            {searching ? results.length : BRANDS.length}
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>

        {!searching && (
          <nav aria-label="Jump to letter" className="flex flex-wrap justify-center gap-0.5">
            {LETTERS.map((l) => (
              <a
                key={l}
                href={`#brands-${l}`}
                className="grid h-8 w-8 place-items-center rounded-full text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {l}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Cards */}
      <ul
        aria-label="Boycott brands"
        className="mt-10 grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {results.map((brand, i) => (
          <li
            key={brand.name}
            data-reveal
            style={{ "--reveal-delay": `${(i % 4) * 50}ms` }}
            id={!searching && firstOfLetter.has(brand.name) ? `brands-${brand.letter}` : undefined}
            className="scroll-mt-48 [content-visibility:auto] [contain-intrinsic-size:auto_9rem]"
          >
            <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-snug text-ink">{brand.name}</h3>
                {brand.priority && (
                  <span className="shrink-0 rounded-full bg-danger-soft px-2.5 py-0.5 text-xs font-semibold text-danger">
                    Priority
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-ink-muted">{brand.reason}</p>
            </div>
          </li>
        ))}
      </ul>

      {searching && results.length === 0 && (
        <p className="mt-10 text-center text-lg text-ink-muted">
          No brands match “{deferredQuery}”.
        </p>
      )}

      <div
        data-reveal
        className="mx-auto mt-20 max-w-3xl space-y-5 text-center text-lg leading-relaxed text-ink-muted md:text-xl"
      >
        {CLOSING.slice(0, -1).map((text) => (
          <p key={text}>{text}</p>
        ))}
        <blockquote className="pt-6 font-display text-2xl italic leading-snug text-ink md:text-3xl">
          {CLOSING.at(-1)}
        </blockquote>
      </div>
    </section>
  );
}
