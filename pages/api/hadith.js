import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  const feedUrl = "https://hadithoftheday.com/feed/";
  try {
    const feed = await parser.parseURL(feedUrl);

    // Process the items in the feed
    const hadiths = feed.items.slice(0, 9).map((item) => {
      // Remove unwanted text using a regex or string replacement
      const cleanedContent = item.contentSnippet.replace(
        /The post .*? appeared first on .*?\./gi,
        ""
      );

      return {
        title: item.title,
        content: cleanedContent.trim(),
        link: item.link,
        date: new Date(item.isoDate).toLocaleDateString(),
      };
    });

    res.status(200).json(hadiths);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Hadiths" });
  }
}
