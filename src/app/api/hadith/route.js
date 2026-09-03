import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let MONTH_CACHE = {};

/* ---------------------------------------------
   Safe string
--------------------------------------------- */
const safe = (v) => (typeof v === "string" ? v : v ? String(v) : "");

/* ---------------------------------------------
   Hijri Month Keywords
--------------------------------------------- */
const hijriMonthKeywords = {
  1: ["Muharram", "Ashura", "fasting", "repentance", "charity"],
  2: ["Safar", "travel", "hardship"],
  3: ["Rabi ul Awwal", "Prophet", "mercy", "character"],
  4: ["Rabi ul Thani", "knowledge", "sunnah"],
  5: ["Jumada al Ula", "justice", "family"],
  6: ["Jumada al Thani", "patience", "truthfulness"],
  7: ["Rajab", "forgiveness", "fasting"],
  8: ["Shaban", "preparation", "barakah"],
  9: ["Ramadan", "fasting", "Quran"],
  10: ["Shawwal", "charity", "community"],
  11: ["Dhul Qadah", "peace", "travel"],
  12: ["Dhul Hijjah", "Hajj", "sacrifice"],
};

const GLOBAL_FALLBACK = ["mercy", "charity", "faith"];

/* ---------------------------------------------
   Normalize
--------------------------------------------- */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/* ---------------------------------------------
   Load Hadith Corpus
--------------------------------------------- */
function loadHadithData() {
  if (HADITH_DATA) return;

  const files = [
    "bukhari.json",
    "muslim.json",
    "tirmidhi.json",
    "nasai.json",
    "ibnmajah.json",
    "abudawud.json",
  ];

  const map = new Map();

  for (const file of files) {
    const collection = file.replace(".json", "");
    const fp = path.join(process.cwd(), "data", "hadith", file);
    if (!fs.existsSync(fp)) continue;

    const raw = JSON.parse(fs.readFileSync(fp, "utf8"));

    const collectionTitles = {
      en: raw?.metadata?.english?.title || collection,
      ar: raw?.metadata?.arabic?.title || null,
    };

    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.hadiths)
        ? raw.hadiths
        : [];

    for (const h of arr) {
      const english =
        h?.english?.text || h?.text?.english || h?.hadith?.text || "";
      if (!english) continue;

      const arabic =
        typeof h?.arabic === "string"
          ? h.arabic
          : typeof h?.hadith?.arabic === "string"
            ? h.hadith.arabic
            : typeof h?.text?.arabic === "string"
              ? h.text.arabic
              : "";

      const key = normalize(english);

      const narrator = safe(
        h?.narrator || h?.english?.narrator || h?.hadith?.narrator || "",
      );

      if (!map.has(key)) {
        map.set(key, {
          text: english.toLowerCase(),
          original: english,
          arabic: arabic || null,
          narrator,
          sources: [collection],
          collectionTitles,
        });
      } else {
        const existing = map.get(key);
        if (!existing.sources.includes(collection)) {
          existing.sources.push(collection);
        }
      }
    }
  }

  HADITH_DATA = Array.from(map.values());
}

/* ---------------------------------------------
   Build Month Results (cached)
--------------------------------------------- */
function buildMonthResults(month) {
  const cacheKey = `month-${month}`;

  if (MONTH_CACHE[cacheKey] && Date.now() < MONTH_CACHE[cacheKey].expiry) {
    return MONTH_CACHE[cacheKey].data;
  }

  const keywords = hijriMonthKeywords[month] || ["faith"];

  let matched = [];

  const search = (keyword) => {
    const k = keyword.toLowerCase();
    return HADITH_DATA.filter((h) => h.text.includes(k));
  };

  for (const k of keywords) {
    matched = search(k);
    if (matched.length) break;
  }

  if (!matched.length) {
    for (const k of GLOBAL_FALLBACK) {
      matched = search(k);
      if (matched.length) break;
    }
  }

  const formatted = matched.map((h) => ({
    content: h.original,
    arabic: h.arabic,
    narrator: h.narrator,
    sources: h.sources,
    collectionTitles: h.collectionTitles,
  }));

  MONTH_CACHE[cacheKey] = {
    data: formatted,
    expiry: Date.now() + 6 * 60 * 60 * 1000,
  };

  return formatted;
}

/* ---------------------------------------------
   GET Route (pagination)
--------------------------------------------- */
export async function GET(req) {
  loadHadithData();

  const { searchParams } = new URL(req.url);
  const requestedLimit = Number.parseInt(searchParams.get("limit"), 10);
  const requestedOffset = Number.parseInt(searchParams.get("offset"), 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 20;
  const offset = Number.isFinite(requestedOffset)
    ? Math.max(requestedOffset, 0)
    : 0;

  const month = moment().iMonth() + 1;

  const monthResults = buildMonthResults(month);

  const paged = monthResults.slice(offset, offset + limit);

  return NextResponse.json(
    { month, total: monthResults.length, offset, limit, results: paged },
    {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    },
  );
}
