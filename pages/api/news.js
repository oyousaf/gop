export default async function handler(req, res) {
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    // Fetch news articles
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=islamic&pageSize=18&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }

    const data = await response.json();

    // Filter duplicates and validate necessary fields
    const seenUrls = new Set();
    const filteredArticles = data.articles.filter((article) => {
      const isValid =
        article.title &&
        article.url &&
        article.description &&
        article.urlToImage;

      if (!isValid) return false; // Exclude articles missing important fields

      const isDuplicate = seenUrls.has(article.url);
      if (!isDuplicate) {
        seenUrls.add(article.url);
        return true;
      }
      return false;
    });

    // Return only the first 9 articles
    res.status(200).json(filteredArticles.slice(0, 9));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
