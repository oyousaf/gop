const DIRECT_STREAMS = {
  makkah: [
    //https://www.elahmad.com/tv/m3u8/online_live_14_tv.m3u8?id=qoran_tv&t=11111111",
    //"https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8",
    "https://media2.streambrothers.com:1936/8122/8122/playlist.m3u8",
    "https://edge66.magictvbox.com/liveApple/al_majd/tracks-v1a1/mono.m3u8",
    "https://playlist.fasttvcdn.com/pl/dlkqw1ftuvuuzkcb4pxdcg/Iqraafasttv2/playlist.m3u8",
  ],
  madinah: [
    //"https://www.elahmad.com/tv/m3u8/online_live_14_tv.m3u8?id=sunna_tv&t=11111111",
    //"https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8",
    //"https://media2.streambrothers.com:1936/8122/8122/playlist.m3u8",
    //"https://edge66.magictvbox.com/liveApple/al_majd/tracks-v1a1/mono.m3u8",
    //"https://playlist.fasttvcdn.com/pl/dlkqw1ftuvuuzkcb4pxdcg/Iqraafasttv2/playlist.m3u8",
  ]
};

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const [loc, ...rest] = path;

  let streamList = DIRECT_STREAMS[loc?.toLowerCase()];
  if (!streamList) {
    return res.status(404).json({ error: "Unknown stream location" });
  }

  // Always handle as array for consistency
  if (!Array.isArray(streamList)) streamList = [streamList];

  let targetUrl = null;
  let upstream = null;
  let baseUrl = null;

  // Try each URL in the list until one works
  for (const url of streamList) {
    baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
    const fullUrl = rest.length ? `${baseUrl}${rest.join("/")}` : url;

    try {
      const resp = await fetch(fullUrl);
      if (resp.ok) {
        targetUrl = fullUrl;
        upstream = resp;
        break;
      } else {
        console.warn(`Failed: ${fullUrl} (${resp.status})`);
      }
    } catch (err) {
      console.warn(`Error fetching: ${fullUrl}`, err);
    }
  }

  if (!upstream) {
    return res.status(502).json({ error: "All upstream streams failed" });
  }

  const contentType = upstream.headers.get("content-type") || "";

  if (contentType.includes("mpegurl")) {
    const originalText = await upstream.text();
    const rewritten = originalText.replace(
      /^(?!#)([^\s].+\.(m3u8|ts))$/gm,
      (match) => `/api/stream/${loc}/${match}`
    );

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).send(rewritten);
  }

  const buf = await upstream.arrayBuffer();
  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "no-cache");
  return res.status(200).send(Buffer.from(buf));
}
