export default async function handler(req, res) {
  const { city, country, date } = req.query;

  if (!city || !country) {
    console.warn("Missing city or country:", { city, country });
    return res.status(400).json({ error: "Missing city or country." });
  }

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: "Missing RapidAPI key on server." });
  }

  const endpoint = `https://prayer-times11.p.rapidapi.com/timingsByCity/${
    date || ""
  }?method=2&city=${encodeURIComponent(city)}&country=${encodeURIComponent(
    country
  )}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "prayer-times11.p.rapidapi.com",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!data?.data?.timings) {
      console.warn("No timings received:", data);
      return res.status(404).json({ error: "No prayer timings available." });
    }

    return res.status(200).json(data.data.timings);
  } catch (err) {
    console.error("Prayer time fetch failed:", err);
    return res.status(500).json({ error: "Prayer time fetch failed." });
  }
}
