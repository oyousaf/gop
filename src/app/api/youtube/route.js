export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const channelId = searchParams.get("channelId");
  const query = searchParams.get("query") || "";

  if (!API_KEY || !channelId) {
    console.warn("❌ Missing YOUTUBE_API_KEY or channelId");
    return Response.json(
      { error: "Missing API key or channelId" },
      { status: 400 }
    );
  }

  // Accept single or comma-separated multiple IDs
  const channelIds = channelId.split(",").map((id) => id.trim());
  const queryParam = query ? `&q=${encodeURIComponent(query)}` : "";

  const fetchVideoId = async (url) => {
    try {
      const r = await fetch(url);
      const data = await r.json();

      if (data?.error) {
        console.error("🔴 YouTube API error:", data.error);
        return null;
      }

      return data?.items?.[0]?.id?.videoId || null;
    } catch (err) {
      console.error("🔴 Failed YouTube API fetch:", err);
      return null;
    }
  };

  try {
    // 1. Try to find any live stream from given channels
    for (const id of channelIds) {
      const liveURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&channelId=${id}&key=${API_KEY}`;
      const videoId = await fetchVideoId(liveURL);

      if (videoId) {
        console.log(`✅ Live stream found on channel ${id}`);
        return Response.json(
          { videoId, channelId: id, type: "live" },
          { status: 200 }
        );
      }
    }

    // 2. If no live stream, fallback to most recent upload from first valid channel
    const fallbackId = channelIds[0];
    const latestURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&channelId=${fallbackId}&key=${API_KEY}${queryParam}`;
    const latestVideoId = await fetchVideoId(latestURL);

    if (latestVideoId) {
      console.log(
        `⚙️ No live streams. Returning latest upload from ${fallbackId}`
      );

      return Response.json(
        {
          videoId: latestVideoId,
          channelId: fallbackId,
          type: "latest",
        },
        { status: 200 }
      );
    }

    return Response.json(
      { error: "No live or recent videos found for any channel." },
      { status: 404 }
    );
  } catch (err) {
    console.error("🔥 API Handler Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
