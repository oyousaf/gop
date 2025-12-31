import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let RESULT_CACHE = {};

// ----------------------------------------------------
// 🔒 Safe string formatter (prevents .toLowerCase crash)
// ----------------------------------------------------
function safe(h) {
  if (typeof h === "string") return h;
  if (h === null || h === undefined) return "";
  return String(h);
}

// ---------------------------------------------
// 📅 Hijri Month Keywords
// ---------------------------------------------
const hijriMonthKeywords = {
  1: ["Muharram","Ashura","fasting","virtues","repentance","charity"],
  2: ["Safar","travel","omens","illness","hardship"],
  3: ["Rabi ul Awwal","Prophet","mercy","seerah","birth","character"],
  4: ["Rabi ul Thani","companions","gratitude","knowledge","sunnah","charity"],
  5: ["Jumada al Ula","knowledge","justice","family","worship","obedience"],
  6: ["Jumada al Thani","patience","sabr","truthfulness","character","brotherhood"],
  7: ["Rajab","forgiveness","virtues","supplication","fasting"],
  8: ["Shaban","fasting","night prayers","preparation","barakah"],
  9: ["Ramadan","fasting","Quran","Laylat al-Qadr","taraweeh"],
 10: ["Shawwal","fasting six","Eid","charity","brotherhood","community"],
 11: ["Dhul Qadah","pilgrimage","travel","justice","knowledge","peace"],
 12: ["Dhul Hijjah","Hajj","sacrifice","Eid al-Adha","pilgrimage","forgiveness"]
};

// ---------------------------------------------
// 🌍 Global fallback if month keywords fail
// ---------------------------------------------
const GLOBAL_FALLBACK = [
  "mercy","charity","worship","faith","patience","kindness","good deeds"
];

// ---------------------------------------------
// 📚 Load ONLY the 6 major books
// ---------------------------------------------
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

    const arr =
      Array.isArray(raw) ? raw :
      Array.isArray(raw.hadiths) ? raw.hadiths :
      Array.isArray(raw.data) ? raw.data :
      Array.isArray(raw.items) ? raw.items :
      raw.hadith ? [raw.hadith] : [];

    for (const h of arr) {
      const english = safe(
        h.english ||
        h.translation ||
        h.hadithEnglish ||
        h.hadith ||
        h.text
      );

      all.push({
        // lowercase fields for fast searching
        collection: safe(h.collection || file.replace(".json","")).toLowerCase(),
        book: safe(h.book || h.bookNumber || ""),
        number: safe(h.hadithnumber || h.refno || h.number || ""),
        text: english.toLowerCase(),

        // store original for output
        original: {
          collection: safe(h.collection || file.replace(".json","")).toLowerCase(),
          book: safe(h.book || h.bookNumber || ""),
          number: safe(h.hadithnumber || h.refno || h.number || ""),
          text: english
        }
      });
    }
  }

  HADITH_DATA = all;
  console.log(`📚 Loaded ${all.length} hadiths (PRIMARY SIX ONLY, safe substring search)`);
}

// ---------------------------------------------
// 🔎 SUPER FAST substring search
// ---------------------------------------------
function searchKeyword(keyword) {
  const k = keyword.toLowerCase();
  const results = [];

  for (const h of HADITH_DATA) {
    if (h.text.includes(k)) {
      results.push({
        title: `${h.original.collection} ${h.original.book}:${h.original.number}`,
        content: h.original.text,
        link: `https://sunnah.com/${h.original.collection}:${h.original.number}`
      });

      if (results.length >= 20) break;
    }
  }

  return results;
}

// ---------------------------------------------
// 🕌 MAIN ROUTE – month-first sequential search
// ---------------------------------------------
export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const monthKeywords = hijriMonthKeywords[month] || ["faith"];

  const cacheKey = `month-${month}`;
  if (RESULT_CACHE[cacheKey] && Date.now() < RESULT_CACHE[cacheKey].expiry) {
    return NextResponse.json(RESULT_CACHE[cacheKey].results);
  }

  let usedKeyword = null;
  let results = [];

  // 1️⃣ Try every month keyword sequentially
  for (const keyword of monthKeywords) {
    const out = searchKeyword(keyword);
    if (out.length > 0) {
      usedKeyword = keyword;
      results = out;
      break;
    }
  }

  // 2️⃣ Fallback if no month keyword matches
  if (!usedKeyword) {
    for (const keyword of GLOBAL_FALLBACK) {
      const out = searchKeyword(keyword);
      if (out.length > 0) {
        usedKeyword = keyword;
        results = out;
        break;
      }
    }
  }

  // 3️⃣ Hard fail
  if (!usedKeyword) {
    return NextResponse.json({ error: "No hadith found" }, { status: 502 });
  }

  const response = {
    month,
    keywordUsed: usedKeyword,
    results
  };

  RESULT_CACHE[cacheKey] = {
    results: response,
    expiry: Date.now() + 6 * 60 * 60 * 1000,
  };

  return NextResponse.json(response);
}
