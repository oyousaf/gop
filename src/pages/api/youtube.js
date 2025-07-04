// pages/api/youtube.js
export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const { channelId } = req.query;

  if (!API_KEY || !channelId) {
    return res.status(400).json({ error: "Missing API key or channelId" });
  }

  const fetchVideoId = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data?.items?.[0]?.id?.videoId || null;
  };

  const baseURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&key=${API_KEY}`;

  try {
    const liveURL = `${baseURL}&eventType=live`;
    let videoId = await fetchVideoId(liveURL);

    if (!videoId) {
      const fallbackURL = `${baseURL}&order=date`;
      videoId = await fetchVideoId(fallbackURL);
    }

    return videoId
      ? res.status(200).json({ videoId })
      : res.status(404).json({ error: "No video found" });
  } catch (err) {
    console.error("YouTube API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
