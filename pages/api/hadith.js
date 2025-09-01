import moment from "moment-hijri";

let cachedResults = null;
let cacheExpiry = 0;
let cachedMonth = null;
let keywordIndex = 0; // 🔄 rotate through month keywords

export default async function handler(req, res) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = "hadiths-api.p.rapidapi.com";

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: "Missing RapidAPI key" });
  }

  // 📅 Hijri month → themed keywords (expanded list)
  const hijriMonthKeywords = {
    1: ["fasting", "Ashura", "virtues", "repentance", "charity"], // Muharram
    2: ["Safar", "travel", "omens", "illness", "hardship"], // Safar
    3: ["birth", "Prophet", "mercy", "seerah", "character"], // Rabi ul Awwal
    4: ["charity", "knowledge", "companions", "gratitude", "sunnah"], // Rabi ul Thani
    5: ["prayer", "justice", "family", "worship", "obedience"], // Jumada al Awwal
    6: ["patience", "truthfulness", "character", "brotherhood"], // Jumada al Thani
    7: ["Rajab", "forgiveness", "virtues", "supplication", "fasting"], // Rajab
    8: ["Shaban", "fasting", "night prayers", "preparation", "barakah"], // Sha'ban
    9: ["Ramadan", "fasting", "Quran", "Laylat al-Qadr", "taraweeh"], // Ramadan
    10: ["Eid", "charity", "fasting six", "brotherhood", "community"], // Shawwal
    11: ["travel", "justice", "knowledge", "pilgrimage", "peace"], // Dhul Qadah
    12: ["Hajj", "sacrifice", "Eid al-Adha", "pilgrimage", "forgiveness"], // Dhul Hijjah
  };

  const currentMonthNum = moment().iMonth() + 1;
  const keywords = hijriMonthKeywords[currentMonthNum] || ["faith"];

  // Reset keyword rotation when month changes
  if (cachedMonth !== currentMonthNum) {
    keywordIndex = 0;
  }

  // Select keyword in round-robin fashion
  const keyword = keywords[keywordIndex % keywords.length];
  keywordIndex++;

  // ⏳ Serve cached results if not expired + same month + same keyword
  if (
    cachedResults &&
    Date.now() < cacheExpiry &&
    cachedMonth === currentMonthNum &&
    cachedResults.keyword === keyword
  ) {
    return res.status(200).json(cachedResults.results);
  }

  let data;
  const url = `https://${RAPIDAPI_HOST}/hadiths?search=${encodeURIComponent(
    keyword
  )}`;
  console.log(`🔎 Fetching hadiths with keyword: ${keyword}`);

  data = await retryFetch(url, {
    headers: {
      "x-rapidapi-key": RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      Accept: "application/json",
    },
  }).catch(() => null);

  // 🚨 Final fallback
  if (!data?.hadiths?.length) {
    console.warn(
      `No results for keyword "${keyword}", falling back to 'faith'`
    );
    const fallbackUrl = `https://${RAPIDAPI_HOST}/hadiths?search=faith`;
    data = await retryFetch(fallbackUrl, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        Accept: "application/json",
      },
    }).catch(() => null);
  }

  if (!data?.hadiths || !Array.isArray(data.hadiths)) {
    return res.status(502).json({ error: "Invalid data structure from API" });
  }

  const results = data.hadiths.slice(0, 9).map((hadith) => ({
    title: hadith.Section_English || "Hadith",
    content: hadith.English_Hadith || hadith.English_Matn || "No content",
    link: `https://www.google.com/search?q=Hadith ${encodeURIComponent(
      hadith.English_Hadith || ""
    )}`,
  }));

  // 🗄️ Cache results for 6 hours (per month + keyword)
  cachedResults = { keyword, results };
  cachedMonth = currentMonthNum;
  cacheExpiry = Date.now() + 1000 * 60 * 60 * 6;

  return res.status(200).json(results);
}

// 🔁 Retry fetch with exponential backoff
async function retryFetch(url, options, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON: ${text.slice(0, 120)}`);
      }

      if (data?.hadiths && Array.isArray(data.hadiths)) {
        return data;
      } else {
        console.warn(`Invalid data structure on attempt ${attempt}`);
      }
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  throw new Error(`All ${retries} attempts failed`);
}
