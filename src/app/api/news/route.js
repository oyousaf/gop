export async function GET(request) {
  const API_KEY = process.env.NEWS_API_KEY;

  if (!API_KEY) {
    return Response.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    // Extract query params in app-router style
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

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

    const url = `https://newsapi.org/v2/everything?q=${keywords}&pageSize=30&sortBy=publishedAt&language=${lang}&domains=${trustedDomains.join(
      ","
    )}&apiKey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }

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

      article.description = cleanText(article.description);
      article.content = cleanText(article.content);

      return true;
    });

    return Response.json(filtered.slice(0, 15), { status: 200 });
  } catch (error) {
    console.error("News fetch error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
