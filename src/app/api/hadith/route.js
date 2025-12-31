import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let RESULT_CACHE = {};

// ----------------------------------------------------
// 🔒 Safe string formatter
// ----------------------------------------------------
function safe(h) {
  if (typeof h === "string") return h;
  if (h === null || h === undefined) return "";
  return String(h);
}

// ----------------------------------------------------
// 📅 Hijri Month Keywords
// ----------------------------------------------------
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

// ----------------------------------------------------
// 🧠 Synonyms
// ----------------------------------------------------
const SYNONYMS = {
  fasting: ["fast", "fasts", "fasting", "sawm", "siyaam"],
  "fasting six": ["six days", "six fasts", "shawwal fast"],

  forgiveness: ["forgive", "forgiven", "forgives", "pardoned", "pardon", "mercy"],
  repentance: ["repent", "repents", "repented", "turn back"],

  virtues: ["virtue", "virtuous", "excellence", "best of people"],

  supplication: ["dua", "du'a", "invocation", "supplicate", "pray"],

  knowledge: ["knowledge", "ilm", "learn", "learning", "scholar"],

  mercy: ["mercy", "merciful", "compassion", "rahmah"],

  patience: ["patience", "patient", "sabr", "steadfast"],

  brotherhood: ["brother", "brothers", "love for your brother"],

  charity: ["charity", "sadaqah", "donation", "give", "spend"],

  pilgrimage: ["hajj", "pilgrimage", "pilgrim"],
  hajj: ["hajj", "pilgrimage"],

  Prophet: ["messenger", "rasul", "prophet"]
};

// ----------------------------------------------------
// 🌍 Global fallback if all else fails
// ----------------------------------------------------
const GLOBAL_FALLBACK = ["mercy", "charity", "faith", "patience", "kindness"];

// ----------------------------------------------------
// 📚 Load ONLY the 6 major collections
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
        collection: safe(h.collection || file.replace(".json", "")).toLowerCase(),
        book: safe(h.book || h.bookNumber || ""),
        number: safe(h.hadithnumber || h.refno || h.number || ""),
        text: english.toLowerCase(),
        original: {
          collection: safe(h.collection || file.replace(".json", "")).toLowerCase(),
          book: safe(h.book || h.bookNumber || ""),
          number: safe(h.hadithnumber || h.refno || h.number || ""),
          text: english
        }
      });
    }
  }

  HADITH_DATA = all;
  console.log(`📚 Loaded ${all.length} hadith (primary six, flat array mode)`);
}

// ----------------------------------------------------
// 🔎 Search with synonyms
// ----------------------------------------------------
function searchKeyword(keyword) {
  const terms = [keyword.toLowerCase(), ...(SYNONYMS[keyword] || [])];

  const results = [];

  for (const h of HADITH_DATA) {
    for (const t of terms) {
      if (h.text.includes(t)) {
        results.push({
          title: `${h.original.collection} ${h.original.book}:${h.original.number}`,
          content: h.original.text,
          link: `https://sunnah.com/${h.original.collection}:${h.original.number}`
        });
        break;
      }
    }
    if (results.length >= 20) break;
  }

  return results;
}

// ----------------------------------------------------
// 🕌 MAIN ROUTE 
// ----------------------------------------------------
export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const monthKeywords = hijriMonthKeywords[month] || ["faith"];

  const cacheKey = `month-${month}`;
  if (RESULT_CACHE[cacheKey] && Date.now() < RESULT_CACHE[cacheKey].expiry) {
    return NextResponse.json(RESULT_CACHE[cacheKey].results);
  }

  let results = [];

  // 1️⃣ Try month keywords in order 
  for (const keyword of monthKeywords) {
    results = searchKeyword(keyword);
    if (results.length > 0) break;
  }

  // 2️⃣ Fallback keywords
  if (results.length === 0) {
    for (const keyword of GLOBAL_FALLBACK) {
      results = searchKeyword(keyword);
      if (results.length > 0) break;
    }
  }

  // 3️⃣ Guaranteed fallback
  if (results.length === 0) {
    results = searchKeyword("Allah");
  }

  // Cache flat array
  RESULT_CACHE[cacheKey] = {
    results,
    expiry: Date.now() + 6 * 60 * 60 * 1000,
  };

  return NextResponse.json(results);
}
