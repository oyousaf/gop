import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let RESULT_CACHE = {};

// ----------------------------------------------------
// 🔒 Safe string
// ----------------------------------------------------
const safe = (v) => (typeof v === "string" ? v : v ? String(v) : "");

// ----------------------------------------------------
// 📅 Hijri Month Keywords
// ----------------------------------------------------
const hijriMonthKeywords = {
  1: ["Muharram", "Ashura", "fasting", "virtues", "repentance", "charity"],
  2: ["Safar", "travel", "omens", "illness", "hardship"],
  3: ["Rabi ul Awwal", "Prophet", "mercy", "seerah", "birth", "character"],
  4: [
    "Rabi ul Thani",
    "companions",
    "gratitude",
    "knowledge",
    "sunnah",
    "charity",
  ],
  5: [
    "Jumada al Ula",
    "knowledge",
    "justice",
    "family",
    "worship",
    "obedience",
  ],
  6: [
    "Jumada al Thani",
    "patience",
    "sabr",
    "truthfulness",
    "character",
    "brotherhood",
  ],
  7: ["Rajab", "forgiveness", "virtues", "supplication", "fasting"],
  8: ["Shaban", "fasting", "night prayers", "preparation", "barakah"],
  9: ["Ramadan", "fasting", "Quran", "Laylat al-Qadr", "taraweeh"],
  10: ["Shawwal", "fasting six", "Eid", "charity", "brotherhood", "community"],
  11: ["Dhul Qadah", "pilgrimage", "travel", "justice", "knowledge", "peace"],
  12: [
    "Dhul Hijjah",
    "Hajj",
    "sacrifice",
    "Eid al-Adha",
    "pilgrimage",
    "forgiveness",
  ],
};

// ----------------------------------------------------
// 🌍 Guaranteed fallback keywords
// ----------------------------------------------------
const GLOBAL_FALLBACK = ["said", "mercy", "charity", "faith"];

// ----------------------------------------------------
// 📚 Load ONLY the 6 major books
// ----------------------------------------------------
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

  let all = [];

  for (const file of files) {
    const fp = path.join(process.cwd(), "data", "hadith", file);
    if (!fs.existsSync(fp)) continue;

    const raw = JSON.parse(fs.readFileSync(fp, "utf8"));

    const arr = Array.isArray(raw)
      ? raw
      : Array.isArray(raw.hadiths)
      ? raw.hadiths
      : [];

    for (const h of arr) {
      // ✅ CORRECT English extraction
      const english =
        h?.english?.text || // Bukhari / Tirmidhi / Nasai
        h?.text?.english || // Muslim
        h?.hadith?.text || // Abu Dawud
        "";

      if (!english) continue;

      all.push({
        collection: file.replace(".json", ""),
        book: safe(h.bookId || h?.reference?.book || ""),
        number: safe(h.idInBook || h.hadithnumber || ""),
        text: english.toLowerCase(),
        original: english,
      });
    }
  }

  HADITH_DATA = all;
}

// ----------------------------------------------------
// 🔎 Fast substring search
// ----------------------------------------------------
function searchKeyword(keyword) {
  const k = keyword.toLowerCase();
  const results = [];

  for (const h of HADITH_DATA) {
    if (h.text.includes(k)) {
      results.push({
        title: `${h.collection} ${h.book}:${h.number}`,
        content: h.original,
        link: `https://sunnah.com/${h.collection}:${h.number}`,
      });
      if (results.length >= 20) break;
    }
  }

  return results;
}

// ----------------------------------------------------
// 🕌 MAIN ROUTE — FLAT ARRAY OUTPUT
// ----------------------------------------------------
export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const keywords = hijriMonthKeywords[month] || ["faith"];

  let results = [];

  // 1️⃣ Month-specific keywords
  for (const k of keywords) {
    results = searchKeyword(k);
    if (results.length) break;
  }

  // 2️⃣ Global fallback
  if (!results.length) {
    for (const k of GLOBAL_FALLBACK) {
      results = searchKeyword(k);
      if (results.length) break;
    }
  }

  return NextResponse.json(results);
}
