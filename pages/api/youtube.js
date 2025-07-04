export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCqtGJe9AnRfq5wwjk27VsoQ";

  const type = req.query.type === "fallback" ? "fallback" : "live";

  const url =
    type === "fallback"
      ? `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&key=${API_KEY}`
      : `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&q=makka&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const videoId = data?.items?.[0]?.id?.videoId || null;

    return res.status(200).json({ videoId });
  } catch (error) {
    console.error("API Route /youtube error:", error);
    return res.status(500).json({ error: "Failed to fetch video." });
  }
}
