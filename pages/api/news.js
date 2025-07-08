export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    const query = encodeURIComponent(
      `islam OR palestine OR gaza OR "middle east" OR islamic OR aqsa OR "masjid al aqsa" OR quran OR makkah OR sunnah OR madinah OR hijab OR ummah`
    );

    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=20&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch news data");

    const { articles = [] } = await response.json();

    // Track duplicates by normalized URL and title
    const seenUrls = new Set();
    const seenTitles = new Set();

    const filtered = articles.filter((article) => {
      const isValid =
        article.title &&
        article.url &&
        article.description &&
        article.urlToImage;

      if (!isValid) return false;

      // Normalize URL (remove query params, if needed)
      const cleanUrl = article.url.split("?")[0].trim();
      const title = article.title.trim().toLowerCase();

      const isDuplicate = seenUrls.has(cleanUrl) || seenTitles.has(title);

      if (isDuplicate) return false;

      seenUrls.add(cleanUrl);
      seenTitles.add(title);

      return true;
    });

    res.status(200).json(filtered.slice(0, 12));
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ error: error.message });
  }
}
