import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import Fuse from "fuse.js";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let FUSE = null;
let RESULT_CACHE = {};

// ---------------------------------------------
// 📅 Hijri Month → Themed Keywords
// ---------------------------------------------
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

// ---------------------------------------------
// 📘 Primary 6 canonical books
// ---------------------------------------------
const PRIMARY_BOOKS = [
  "bukhari",
  "muslim",
  "tirmidhi",
  "nasai",
  "ibnmajah",
  "abudawud",
];

// ---------------------------------------------
// 📚 Load All 17 Collections
// ---------------------------------------------
function loadHadithData() {
  if (HADITH_DATA) return;

  const files = [
    // Primary 6
    "bukhari.json",
    "muslim.json",
    "tirmidhi.json",
    "nasai.json",
    "ibnmajah.json",
    "abudawud.json",

    // Secondary
    "malik.json",
    "ahmed.json",
    "darimi.json",
    "riyad_assalihin.json",
    "shamail_muhammadiyah.json",
    "bulugh_almaraam.json",
    "mishkat_almasabih.json",
    "aladab_almufrad.json",

    // Forty collections
    "nawawi40.json",
    "qudsi40.json",
    "shahwalliullah40.json",
  ];

  let all = [];

  for (const file of files) {
    const fullPath = path.join(process.cwd(), "data", "hadith", file);
    if (!fs.existsSync(fullPath)) continue;

    const arr = JSON.parse(fs.readFileSync(fullPath, "utf8"));

    for (const h of arr) {
      all.push({
        collection: (h.collection || file.replace(".json", "")).toLowerCase(),
        book: h.book || "",
        number: h.hadithnumber || h.refno || "",
        text: h.english || "",
        text_ar: h.arabic || "",
      });
    }
  }

  HADITH_DATA = all;

  FUSE = new Fuse(all, {
    keys: ["text", "text_ar"],
    threshold: 0.32,
    minMatchCharLength: 3,
  });

  console.log(`📚 Loaded ${all.length} hadiths from local dataset`);
}

// ---------------------------------------------
// 🕌 MAIN ROUTE
// ---------------------------------------------
export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const themes = hijriMonthKeywords[month] || ["faith"];
  const keyword = themes[Math.floor(Math.random() * themes.length)];

  const cacheKey = `${month}-${keyword}`;

  // ⚡ Cache check
  if (RESULT_CACHE[cacheKey] && Date.now() < RESULT_CACHE[cacheKey].expiry) {
    console.log(`⚡ Serving cached results for: ${keyword}`);
    return NextResponse.json(RESULT_CACHE[cacheKey].results);
  }

  console.log(`🔎 Searching local hadith dataset for: "${keyword}"`);

  const results = FUSE.search(keyword)
    .slice(0, 120)
    .map((r) => r.item);
  if (!results.length) {
    console.warn(`❌ No matches for keyword: ${keyword}`);
    return NextResponse.json({ error: "No hadith found" }, { status: 502 });
  }

  // ---------------------------------------------
  // 🛡️ Deduplicate by English text
  // ---------------------------------------------
  const seen = new Set();
  const dedup = [];

  for (const h of results) {
    if (!seen.has(h.text)) {
      seen.add(h.text);
      dedup.push(h);
    }
  }

  // ---------------------------------------------
  // ✨ Split into primary vs secondary collections
  // ---------------------------------------------
  const primary = [];
  const secondary = [];

  for (const h of dedup) {
    const formatted = {
      title: `${h.collection} ${h.book}:${h.number}`,
      content: h.text,
      link: `https://sunnah.com/${h.collection}:${h.number}`,
    };

    if (PRIMARY_BOOKS.includes(h.collection)) {
      primary.push(formatted);
    } else {
      secondary.push(formatted);
    }
  }

  const final = {
    keyword,
    primary: primary.slice(0, 15),
    secondary: secondary.slice(0, 15),
  };

  // ---------------------------------------------
  // 📦 Cache 6 hours
  // ---------------------------------------------
  RESULT_CACHE[cacheKey] = {
    results: final,
    expiry: Date.now() + 6 * 60 * 60 * 1000,
  };

  return NextResponse.json(final);
}
