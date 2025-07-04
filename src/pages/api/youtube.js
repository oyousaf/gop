export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const { channelId, query = "" } = req.query;

  if (!API_KEY || !channelId) {
    console.warn("Missing API key or channelId", { API_KEY, channelId });
    return res.status(400).json({ error: "Missing API key or channelId" });
  }

  const fetchVideoId = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("YouTube API response:", JSON.stringify(data, null, 2));
      return data?.items?.[0]?.id?.videoId || null;
    } catch (err) {
      console.error("Failed to fetch from YouTube:", err);
      return null;
    }
  };

  const baseURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${channelId}&key=${API_KEY}`;
  const encodedQuery = query ? `&q=${encodeURIComponent(query)}` : "";

  try {
    // 1. Try to fetch a live video with the optional query
    const liveURL = `${baseURL}&eventType=live${encodedQuery}`;
    let videoId = await fetchVideoId(liveURL);

    // 2. Fallback to latest uploaded videos if no live stream is found
    if (!videoId) {
      const fallbackURL = `${baseURL}&order=date${encodedQuery}`;
      videoId = await fetchVideoId(fallbackURL);
    }

    if (videoId) {
      return res.status(200).json({ videoId });
    } else {
      return res.status(404).json({ error: "No video found" });
    }
  } catch (err) {
    console.error("YouTube API handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
