const API = "https://www.googleapis.com/youtube/v3";

/* Finds what to play for one or more channels, cheapest source first:
   1. The channel's /live page (no quota) names its current broadcast,
      confirmed live with videos.list (1 unit for all channels).
   2. Otherwise the most recent finished broadcast from the first channel's
      uploads playlist (2 units), e.g. last Friday's khutbah from Al-Aqsa.
   3. search.list (100 units) only if the /live pages couldn't be read at all.
   The old search-only approach cost 100–500 units per lookup and exhausted
   the 10,000/day quota. */

const json = (body, status, maxAge) =>
  Response.json(body, {
    status,
    headers: maxAge
      ? { "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 4}` }
      : {},
  });

async function youtubeApi(path, params, revalidate) {
  const query = new URLSearchParams({ ...params, key: process.env.YOUTUBE_API_KEY });
  const res = await fetch(`${API}/${path}?${query}`, {
    signal: AbortSignal.timeout(8000),
    next: { revalidate },
  });
  const data = await res.json();
  if (data?.error) throw new Error(`YouTube ${path}: ${data.error.message}`);
  return data;
}

/* Video id the channel's /live page points at, null if none, undefined if unreadable */
async function liveCandidate(channelId) {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/141.0 Safari/537.36",
        "Accept-Language": "en",
        Cookie: "CONSENT=YES+1",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const match = html.match(
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/,
    );
    return match ? match[1] : null;
  } catch {
    return undefined;
  }
}

const describe = (video, type) => ({
  videoId: video.id,
  channelId: video.snippet.channelId,
  type,
  title: video.snippet.title,
  startedAt: video.liveStreamingDetails?.actualStartTime || video.snippet.publishedAt,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channelIds = (searchParams.get("channelId") || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^UC[\w-]{22}$/.test(id))
    .slice(0, 5);

  if (!process.env.YOUTUBE_API_KEY || !channelIds.length) {
    return json({ error: "Missing API key or valid channelId" }, 400);
  }

  try {
    // 1. Live now, via each channel's /live page
    const candidates = await Promise.all(channelIds.map(liveCandidate));
    const ids = [...new Set(candidates.filter(Boolean))];

    if (ids.length) {
      const { items = [] } = await youtubeApi(
        "videos",
        { part: "snippet,liveStreamingDetails", id: ids.join(",") },
        120,
      );
      // Respect channel order (main before backups)
      for (const channelId of channelIds) {
        const live = items.find(
          (v) => v.snippet.channelId === channelId && v.snippet.liveBroadcastContent === "live",
        );
        if (live) return json(describe(live, "live"), 200, 300);
      }
    }

    // 3. Pages unreadable for every channel: fall back to search, sparingly
    if (candidates.every((c) => c === undefined)) {
      for (const channelId of channelIds) {
        const { items = [] } = await youtubeApi(
          "search",
          { part: "id", type: "video", eventType: "live", channelId, maxResults: "1" },
          900,
        );
        const videoId = items[0]?.id?.videoId;
        if (videoId) return json({ videoId, channelId, type: "live" }, 200, 300);
      }
    }

    // 2. Nothing live: most recent broadcast (or upload) from the first channel
    const uploads = await youtubeApi(
      "playlistItems",
      { part: "contentDetails", playlistId: `UU${channelIds[0].slice(2)}`, maxResults: "15" },
      600,
    );
    const recentIds = (uploads.items || []).map((i) => i.contentDetails.videoId);
    if (recentIds.length) {
      const { items = [] } = await youtubeApi(
        "videos",
        { part: "snippet,liveStreamingDetails", id: recentIds.join(",") },
        600,
      );
      const playable = items.filter((v) => v.snippet.liveBroadcastContent !== "upcoming");
      const lastBroadcast = playable.find((v) => v.liveStreamingDetails?.actualEndTime);
      const pick = lastBroadcast || playable[0];
      if (pick) return json(describe(pick, lastBroadcast ? "replay" : "latest"), 200, 600);
    }

    return json({ error: "No live or recent videos found." }, 404, 300);
  } catch (err) {
    console.error("YouTube lookup failed:", err.message);
    return json({ error: "Live stream lookup failed" }, 502);
  }
}
