import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(req, res) {
  const feedUrl = "https://hadithoftheday.com/feed/";
  try {
    const feed = await parser.parseURL(feedUrl);
    const hadiths = feed.items.slice(0, 9).map((item) => ({
      title: item.title,
      content: item.contentSnippet || item.content,
      link: item.link,
      date: new Date(item.isoDate).toLocaleDateString(),
    }));
    res.status(200).json(hadiths);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Hadiths" });
  }
}
