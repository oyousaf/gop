import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  const feedUrl = "https://hadithoftheday.com/feed/";
  try {
    const feed = await parser.parseURL(feedUrl);

    // Fetch hadiths
    const hadiths = feed.items.slice(0, 18).map((item) => {
      // Remove unwanted text using regex
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

    // Keep only 9 valid ones
    const filteredHadiths = hadiths.filter((hadith) => hadith.title && hadith.content).slice(0, 9);

    res.status(200).json(filteredHadiths);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Hadiths" });
  }
}
