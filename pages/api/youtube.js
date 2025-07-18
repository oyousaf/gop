export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const { channelId, query = "" } = req.query;

  if (!API_KEY || !channelId) {
    console.warn("❌ Missing YOUTUBE_API_KEY or channelId");
    return res.status(400).json({ error: "Missing API key or channelId" });
  }

  const base = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${channelId}&key=${API_KEY}`;
  const queryParam = query ? `&q=${encodeURIComponent(query)}` : "";

  // Fetches the first videoId from a YouTube search result URL
  const fetchVideoId = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data?.items?.[0]?.id?.videoId || null;
    } catch (err) {
      console.error("🔴 Failed YouTube API fetch:", err);
      return null;
    }
  };

  try {
    // 1. Try fetching current live stream
    const liveURL = `${base}&eventType=live${queryParam}`;
    let videoId = await fetchVideoId(liveURL);

    // 2. Fallback to most recent upload if no live found
    if (!videoId) {
      const latestURL = `${base}&order=date${queryParam}`;
      videoId = await fetchVideoId(latestURL);
    }

    if (videoId) {
      return res.status(200).json({ videoId });
    } else {
      return res
        .status(404)
        .json({ error: "No video found for this channel." });
    }
  } catch (err) {
    console.error("🔥 API Handler Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
