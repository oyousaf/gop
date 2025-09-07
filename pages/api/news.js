export default async function handler(req, res) {
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";

    const keywords = encodeURIComponent(
      lang === "ar"
        ? `"غزة" OR "فلسطين" OR "الإسلام" OR "السنة" OR "النبي محمد" OR "مكة" OR "المدينة" OR "المسجد الأقصى" OR "القرآن الكريم" OR "أمة" OR "إسلامي" OR "الحجاب"`
        : `"gaza" OR "palestine" OR "islam" OR "sunnah" OR "prophet muhammad" OR "makkah" OR "madinah" OR "masjid al aqsa" OR "holy quran" OR "free palestine" OR "ummah" OR "islamic" OR "hijab"`
    );

    const trustedDomains =
      lang === "ar"
        ? ["aljazeera.net", "alarabiya.net", "thenationalnews.com"]
        : [
            "aljazeera.com",
            "arabnews.com",
            "middleeasteye.net",
            "thenationalnews.com",
            "islam21c.com",
            "muslimnews.co.uk",
            "aboutislam.net",
          ];

    const url = `https://newsapi.org/v2/everything?q=${keywords}&pageSize=20&sortBy=publishedAt&language=${lang}&domains=${trustedDomains.join(
      ","
    )}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch news data");

    const { articles = [] } = await response.json();

    const seenUrls = new Set();
    const seenTitles = new Set();

    const cleanText = (text) =>
      !text ? "" : text.replace(/\[\+\d+\schars\]/g, "").trim();

    const filtered = articles.filter((article) => {
      const isValid =
        article.title &&
        article.url &&
        (lang === "ar" || article.description) &&
        (lang === "ar" || article.urlToImage);

      if (!isValid) return false;

      const cleanUrl = article.url.split("?")[0].trim();
      const title = article.title.trim().toLowerCase();

      if (seenUrls.has(cleanUrl) || seenTitles.has(title)) return false;

      seenUrls.add(cleanUrl);
      seenTitles.add(title);

      // clean text before sending
      article.description = cleanText(article.description);
      article.content = cleanText(article.content);

      return true;
    });

    res.status(200).json(filtered.slice(0, 12));
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ error: error.message });
  }
}
