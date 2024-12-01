export default async function handler(req, res) {
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=islamic&pageSize=9&sortBy=publishedAt&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }

    const data = await response.json();
    res.status(200).json(data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
