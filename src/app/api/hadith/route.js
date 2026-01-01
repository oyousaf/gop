import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let RESULT_CACHE = {};

/* ----------------------------------------------------
   🔒 Safe string
---------------------------------------------------- */
const safe = (v) => (typeof v === "string" ? v : v ? String(v) : "");

/* ----------------------------------------------------
   📅 Hijri Month Keywords
---------------------------------------------------- */
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

/* ----------------------------------------------------
   🧹 Normalize text for deduplication
---------------------------------------------------- */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

/* ----------------------------------------------------
   📚 Load hadith corpus
---------------------------------------------------- */
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
        h?.narrator || h?.english?.narrator || h?.hadith?.narrator || ""
      );

      if (!map.has(key)) {
        map.set(key, {
          collection,
          book: safe(h.bookId || h?.reference?.book || ""),
          number: safe(h.idInBook || h.hadithnumber || ""),
          text: english.toLowerCase(),
          original: english,
          arabic: arabic || null,
          narrator,
          sources: [collection],
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

/* ----------------------------------------------------
   🔎 Keyword search
---------------------------------------------------- */
function searchKeyword(keyword) {
  const k = keyword.toLowerCase();
  const results = [];

  for (const h of HADITH_DATA) {
    if (!h.text.includes(k)) continue;

    results.push({
      title: `${h.collection} ${h.book}:${h.number}`,
      content: h.original,
      arabic: h.arabic || null,
      link: `https://sunnah.com/${h.collection}:${h.number}`,
      narrator: h.narrator || null,
      sources: h.sources,
    });

    if (results.length >= 20) break;
  }

  return results;
}

/* ----------------------------------------------------
   🕌 MAIN ROUTE — FLAT ARRAY OUTPUT
---------------------------------------------------- */
export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const keywords = hijriMonthKeywords[month] || ["faith"];
  const cacheKey = `month-${month}`;

  if (RESULT_CACHE[cacheKey] && Date.now() < RESULT_CACHE[cacheKey].expiry) {
    return NextResponse.json(RESULT_CACHE[cacheKey].results);
  }

  let results = [];

  for (const k of keywords) {
    results = searchKeyword(k);
    if (results.length) break;
  }

  if (!results.length) {
    for (const k of GLOBAL_FALLBACK) {
      results = searchKeyword(k);
      if (results.length) break;
    }
  }

  RESULT_CACHE[cacheKey] = {
    results,
    expiry: Date.now() + 6 * 60 * 60 * 1000,
  };

  return NextResponse.json(results);
}
