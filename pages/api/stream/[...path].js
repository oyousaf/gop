const DIRECT_STREAMS = {
  makkah: "http://m.live.net.sa:1935/live/quran/gmswf.m3u8",
  madinah: "http://m.live.net.sa:1935/live/sunnah/playlist.m3u8",
};

export default async function handler(req, res) {
  const { path = [] } = req.query;
  const [loc, ...rest] = path;
  const streamUrl = DIRECT_STREAMS[loc?.toLowerCase()];

  if (!streamUrl) {
    return res.status(404).json({ error: "Unknown stream location" });
  }

  // Use base from full stream URL
  const baseUrl = streamUrl.substring(0, streamUrl.lastIndexOf("/") + 1);

  // Build target stream URL (root file or ts/m3u8 chunk)
  const proxyPath = rest.join("/");
  const targetUrl = rest.length ? `${baseUrl}${proxyPath}` : streamUrl;

  try {
    const upstream = await fetch(targetUrl);
    if (!upstream.ok) {
      console.error("Upstream error", upstream.status, targetUrl);
      return res.status(502).json({ error: "Upstream fetch failed" });
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

    // Binary data (TS segments)
    const buf = await upstream.arrayBuffer();
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).send(Buffer.from(buf));
  } catch (err) {
    console.error("Proxy error", err);
    return res.status(500).json({ error: "Stream proxy error" });
  }
}
