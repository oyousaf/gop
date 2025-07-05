import moment from "moment-hijri";

export default async function handler(req, res) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = "hadiths-api.p.rapidapi.com";

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: "Missing RapidAPI key" });
  }

  const currentHijriMonth = moment().locale("en").format("iMMMM");

  const url = `https://${RAPIDAPI_HOST}/hadiths?search=${encodeURIComponent(
    currentHijriMonth
  )}`;

  try {
    const data = await retryFetch(url, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        Accept: "application/json",
      },
    });

    if (!data.hadiths || !Array.isArray(data.hadiths)) {
      console.warn("Unexpected data format from API:", data);
      return res.status(500).json({ error: "Invalid data structure from API" });
    }

    const results = data.hadiths.slice(0, 9).map((hadith) => ({
      title: hadith.Section_English || "Hadith",
      content: hadith.English_Hadith || hadith.English_Matn || "No content",
      link: `https://www.google.com/search?q=Hadith ${encodeURIComponent(
        hadith.English_Hadith || ""
      )}`,
    }));

    return res.status(200).json(results);
  } catch (error) {
    console.error("Final fetch error:", error);
    return res.status(500).json({ error: "Failed to load Hadiths after retries" });
  }
}

// 🔁 Helper: Retry fetch with exponential backoff
async function retryFetch(url, options, retries = 5, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      const text = await response.text();

      const data = JSON.parse(text);

      // ✅ Confirm structure is valid before returning
      if (data.hadiths && Array.isArray(data.hadiths)) {
        return data;
      } else {
        console.warn(`Invalid data structure on attempt ${attempt}`);
      }
    } catch (err) {
      console.warn(`Attempt ${attempt} failed:`, err.message);
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw new Error(`All ${retries} attempts failed`);
}
