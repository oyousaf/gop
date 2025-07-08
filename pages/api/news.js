export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    // Concise, effective multi-keyword Islamic news query
    const query = encodeURIComponent(
      `islam OR palestine OR gaza OR "middle east" OR islamic OR aqsa OR "masjid al aqsa" OR quran OR makkah OR sunnah OR madinah OR hijab OR ummah`
    );

    const url = `https://newsapi.org/v2/everything?q=${query}&pageSize=20&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch news data");

    const { articles = [] } = await response.json();

    const seenUrls = new Set();
    const filtered = articles.filter((article) => {
      const isValid =
        article.title &&
        article.url &&
        article.description &&
        article.urlToImage;

      if (!isValid || seenUrls.has(article.url)) return false;

      seenUrls.add(article.url);
      return true;
    });

    res.status(200).json(filtered.slice(0, 12));
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ error: error.message });
  }
}
