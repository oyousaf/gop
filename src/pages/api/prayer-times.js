// pages/api/prayer-times.js

export default async function handler(req, res) {
  const { city = "Makkah" } = req.query;

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = "muslimsalat.p.rapidapi.com";

  if (!RAPIDAPI_KEY) {
    console.error("Missing RapidAPI key.");
    return res.status(500).json({ error: "Missing RapidAPI key." });
  }

  const endpoint = `https://${RAPIDAPI_HOST}/${encodeURIComponent(city)}.json`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to fetch prayer times:", errorBody);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch prayer times." });
    }

    const data = await response.json();
    const item = data?.items?.[0];

    if (!item) {
      console.warn("No items in prayer time data response.");
      return res.status(404).json({ error: "No prayer timings found." });
    }

    return res.status(200).json({
      Fajr: item.fajr,
      Sunrise: item.shurooq,
      Dhuhr: item.dhuhr,
      Asr: item.asr,
      Maghrib: item.maghrib,
      Isha: item.isha,
    });
  } catch (error) {
    console.error("Prayer time fetch error:", error);
    return res.status(500).json({ error: "Prayer time fetch failed." });
  }
}
