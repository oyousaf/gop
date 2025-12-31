import fs from "fs";
import path from "path";
import moment from "moment-hijri";
import Fuse from "fuse.js";
import { NextResponse } from "next/server";

let HADITH_DATA = null;
let FUSE = null;
let RESULT_CACHE = {};

const hijriMonthKeywords = {
  1: ["Muharram", "Ashura", "fasting", "virtues", "repentance", "charity"],
  2: ["Safar", "travel", "omens", "illness", "hardship"],
  3: ["Rabi ul Awwal", "Prophet", "mercy", "seerah", "birth", "character"],
  4: ["Rabi ul Thani", "companions", "gratitude", "knowledge", "sunnah", "charity"],
  5: ["Jumada al Ula", "knowledge", "justice", "family", "worship", "obedience"],
  6: ["Jumada al Thani", "patience", "sabr", "truthfulness", "character", "brotherhood"],
  7: ["Rajab", "forgiveness", "virtues", "supplication", "fasting"],
  8: ["Shaban", "fasting", "night prayers", "preparation", "barakah"],
  9: ["Ramadan", "fasting", "Quran", "Laylat al-Qadr", "taraweeh"],
  10: ["Shawwal", "fasting six", "Eid", "charity", "brotherhood", "community"],
  11: ["Dhul Qadah", "pilgrimage", "travel", "justice", "knowledge", "peace"],
  12: ["Dhul Hijjah", "Hajj", "sacrifice", "Eid al-Adha", "pilgrimage", "forgiveness"]
};

function loadHadithData() {
  if (HADITH_DATA) return;

  const files = [
    "bukhari.json",
    "muslim.json",
    "tirmidhi.json",
    "abudawood.json",
    "nasai.json",
    "ibnmajah.json"
  ];

  let all = [];

  for (const file of files) {
    const fullPath = path.join(process.cwd(), "data", "hadith", file);

    if (!fs.existsSync(fullPath)) continue;

    const arr = JSON.parse(fs.readFileSync(fullPath, "utf8"));

    for (const h of arr) {
      all.push({
        collection: h.collection || file.replace(".json", ""),
        book: h.book || "",
        number: h.refno || "",
        text: h.english || "",
        text_ar: h.arabic || ""
      });
    }
  }

  HADITH_DATA = all;

  FUSE = new Fuse(all, {
    keys: ["text", "text_ar"],
    threshold: 0.32,
    minMatchCharLength: 3
  });

  console.log(`📚 Loaded ${all.length} hadiths from Hadith-DB`);
}

export async function GET() {
  loadHadithData();

  const month = moment().iMonth() + 1;
  const themes = hijriMonthKeywords[month] || ["faith"];
  const keyword = themes[Math.floor(Math.random() * themes.length)];

  const cacheKey = `${month}-${keyword}`;

  if (RESULT_CACHE[cacheKey] && Date.now() < RESULT_CACHE[cacheKey].expiry) {
    return NextResponse.json(RESULT_CACHE[cacheKey].results, { status: 200 });
  }

  const results = FUSE.search(keyword).slice(0, 40).map(r => r.item);

  if (!results.length) {
    return NextResponse.json({ error: "No hadith found" }, { status: 502 });
  }

  const seen = new Set();
  const unique = [];

  for (const h of results) {
    if (!seen.has(h.text)) {
      seen.add(h.text);
      unique.push({
        title: `${h.collection} ${h.book}:${h.number}`,
        content: h.text,
        link: `https://sunnah.com/${h.collection}:${h.number}`
      });
    }
  }

  const final = unique.slice(0, 15);

  RESULT_CACHE[cacheKey] = {
    results: final,
    expiry: Date.now() + 6 * 60 * 60 * 1000
  };

  return NextResponse.json(final, { status: 200 });
}
