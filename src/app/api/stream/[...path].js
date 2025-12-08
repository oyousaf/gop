export const runtime = "nodejs";

const DIRECT_STREAMS = {
  makkah: [
    // "https://www.elahmad.com/tv/m3u8/online_live_14_tv.m3u8?id=qoran_tv&t=11111111",
    // "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8",
    "https://media2.streambrothers.com:1936/8122/8122/playlist.m3u8",
    "https://edge66.magictvbox.com/liveApple/al_majd/tracks-v1a1/mono.m3u8",
    "https://playlist.fasttvcdn.com/pl/dlkqw1ftuvuuzkcb4pxdcg/Iqraafasttv2/playlist.m3u8",
  ],

  madinah: [
    // "https://www.elahmad.com/tv/m3u8/online_live_14_tv.m3u8?id=sunna_tv&t=11111111",
    // "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8",
    // "https://media2.streambrothers.com:1936/8122/8122/playlist.m3u8",
    // "https://edge66.magictvbox.com/liveApple/al_majd/tracks-v1a1/mono.m3u8",
    // "https://playlist.fasttvcdn.com/pl/dlkqw1ftuvuuzkcb4pxdcg/Iqraafasttv2/playlist.m3u8",
  ],
};

export async function GET(request, { params }) {
  const pathParts = params.path || [];
  const [loc, ...rest] = pathParts;

  if (!loc) {
    return Response.json({ error: "Missing stream location" }, { status: 400 });
  }

  let streamList = DIRECT_STREAMS[loc.toLowerCase()];
  if (!streamList) {
    return Response.json({ error: "Unknown stream location" }, { status: 404 });
  }

  if (!Array.isArray(streamList)) {
    streamList = [streamList];
  }

  let upstream = null;
  let baseUrl = null;

  for (const url of streamList) {
    baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
    const targetUrl = rest.length ? `${baseUrl}${rest.join("/")}` : url;

    try {
      const resp = await fetch(targetUrl);

      if (resp.ok) {
        upstream = resp;
        break;
      } else {
        console.warn(`Upstream failed: ${targetUrl} (${resp.status})`);
      }
    } catch (err) {
      console.warn(`Upstream error: ${targetUrl}`, err);
    }
  }

  if (!upstream) {
    return Response.json(
      { error: "All upstream streams failed" },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") || "";

  // ─────────────────────────────────────────────
  // Handle HLS manifest (.m3u8)
  // ─────────────────────────────────────────────
  if (contentType.includes("mpegurl")) {
    const original = await upstream.text();

    // Rewrite .m3u8 + .ts segment URLs to pass through this route
    const rewritten = original.replace(
      /^(?!#)(.*\.(m3u8|ts)(\?.*)?)$/gm,
      (match) => {
        // absolute URLs → strip to filename
        const filename = match.split("/").pop();
        return `/api/stream/${loc}/${filename}`;
      }
    );

    return new Response(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache",
      },
    });
  }

  // ─────────────────────────────────────────────
  // Handle .ts segments and other binary files
  // ─────────────────────────────────────────────
  const buf = Buffer.from(await upstream.arrayBuffer());

  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    },
  });
}
