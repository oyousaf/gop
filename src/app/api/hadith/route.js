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
  1: ["Muharram", "Ashura", "fasting", "virtues", "repentance", "charity"],
  2: ["Safar", "travel", "omens", "illness", "hardship"],
  3: ["Rabi ul Awwal", "Prophet", "mercy", "seerah", "birth", "character"],
  4: ["Rabi ul Thani", "companions", "gratitude", "knowledge", "sunnah"],
  5: ["Jumada al Ula", "knowledge", "justice", "family", "worship"],
  6: ["Jumada al Thani", "patience", "sabr", "truthfulness", "character"],
  7: ["Rajab", "forgiveness", "virtues", "supplication", "fasting"],
  8: ["Shaban", "fasting", "night prayers", "preparation", "barakah"],
  9: ["Ramadan", "fasting", "Quran", "Laylat al-Qadr", "taraweeh"],
  10: ["Shawwal", "fasting six", "Eid", "charity", "community"],
  11: ["Dhul Qadah", "pilgrimage", "travel", "justice", "peace"],
  12: ["Dhul Hijjah", "Hajj", "sacrifice", "Eid al-Adha", "forgiveness"],
};

const GLOBAL_FALLBACK = ["said", "mercy", "charity", "faith"];

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

  const all = [];

  for (const file of files) {
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

      all.push({
        collection: file.replace(".json", ""),
        book: safe(h.bookId || h?.reference?.book || ""),
        number: safe(h.idInBook || h.hadithnumber || ""),
        text: english.toLowerCase(),
        original: english,
        narrator: safe(
          h?.narrator || h?.english?.narrator || h?.hadith?.narrator || ""
        ),
      });
    }
  }

  HADITH_DATA = all;
}

/* ----------------------------------------------------
   🔎 Keyword search (returns narrator)
---------------------------------------------------- */
function searchKeyword(keyword) {
  const k = keyword.toLowerCase();
  const results = [];

  for (const h of HADITH_DATA) {
    if (!h.text.includes(k)) continue;

    results.push({
      title: `${h.collection} ${h.book}:${h.number}`,
      content: h.original,
      link: `https://sunnah.com/${h.collection}:${h.number}`,
      narrator: h.narrator || null,
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
