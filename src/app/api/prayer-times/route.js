const ALADHAN = "https://api.aladhan.com/v1";
const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const MAKKAH = { lat: 21.4225, lng: 39.8262, label: "Makkah, Saudi Arabia" };

const unavailable = () =>
  Response.json(
    { error: "Prayer times are temporarily unavailable." },
    { status: 502 },
  );

const toCoord = (v, max) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};

const decodeHeader = (v) => {
  try {
    return v ? decodeURIComponent(v) : "";
  } catch {
    return v || "";
  }
};

/* Resolves the location to calculate for, in priority order:
   explicit address → explicit coordinates → visitor IP geo (Vercel) → Makkah */
function resolveLocation(searchParams, headers) {
  const address = (searchParams.get("address") || "").trim().slice(0, 120);
  if (address) {
    return { address, label: address, shared: true, source: "address" };
  }

  const lat = toCoord(searchParams.get("lat"), 90);
  const lng = toCoord(searchParams.get("lng"), 180);
  if (lat !== null && lng !== null) {
    return { lat, lng, label: null, shared: true, source: "coords" };
  }

  const ipLat = toCoord(headers.get("x-vercel-ip-latitude"), 90);
  const ipLng = toCoord(headers.get("x-vercel-ip-longitude"), 180);
  if (ipLat !== null && ipLng !== null) {
    const city = decodeHeader(headers.get("x-vercel-ip-city"));
    const country = headers.get("x-vercel-ip-country") || "";
    return {
      lat: ipLat,
      lng: ipLng,
      label: [city, country].filter(Boolean).join(", ") || "Your area",
      shared: false,
      source: "ip",
    };
  }

  return { ...MAKKAH, shared: true, source: "default" };
}

/* "Leeds, United Kingdom" for a coordinate pair, via OpenStreetMap Nominatim */
async function placeName(lat, lng) {
  try {
    const query = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: "jsonv2",
      zoom: "10",
      "accept-language": "en",
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "oyousaf.uk prayer times (https://oyousaf.uk)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const { address = {} } = await res.json();
    const place =
      address.city || address.town || address.village || address.county || address.state;
    return [place, address.country].filter(Boolean).join(", ") || null;
  } catch {
    return null;
  }
}

/* Months to fetch so every visitor's "today" and "tomorrow" are covered,
   whatever their timezone, plus a few weeks ahead for offline use */
function monthsToFetch(now = Date.now()) {
  const day = 86400000;
  const keys = new Map();
  for (const t of [now - day, now, now + 32 * day]) {
    const d = new Date(t);
    keys.set(`${d.getUTCFullYear()}/${d.getUTCMonth() + 1}`, true);
  }
  return [...keys.keys()];
}

// Aladhan gives "DD-MM-YYYY"; store ISO "YYYY-MM-DD" so days sort and compare
const isoDate = (ddmmyyyy) => ddmmyyyy.split("-").reverse().join("-");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = resolveLocation(searchParams, request.headers);

  // Omitting `method` lets Aladhan pick the authority nearest the location
  const method = Number.parseInt(searchParams.get("method"), 10);
  const query = new URLSearchParams();
  if (Number.isInteger(method) && method >= 0 && method <= 23) {
    query.set("method", String(method));
  }

  let path;
  if (location.address) {
    query.set("address", location.address);
    path = "calendarByAddress";
  } else {
    query.set("latitude", String(location.lat));
    query.set("longitude", String(location.lng));
    path = "calendar";
  }

  try {
    const [months, label] = await Promise.all([
      Promise.all(
        monthsToFetch().map(async (ym) => {
          const res = await fetch(`${ALADHAN}/${path}/${ym}?${query}`, {
            signal: AbortSignal.timeout(8000),
            headers: { Accept: "application/json" },
            next: { revalidate: 21600 },
          });
          if (!res.ok) throw new Error(`Aladhan ${res.status}`);
          return (await res.json())?.data || [];
        }),
      ),
      location.source === "coords"
        ? placeName(location.lat, location.lng)
        : location.label,
    ]);

    const entries = months.flat();
    if (!entries.length) {
      return Response.json(
        { error: "No prayer timings found for that location." },
        { status: 404 },
      );
    }

    const meta = entries[0].meta || {};

    return Response.json(
      {
        days: entries.map((d) => ({
          date: isoDate(d.date.gregorian.date),
          timings: Object.fromEntries(
            PRAYERS.map((name) => [name, d.timings[name]?.slice(0, 5)]),
          ),
        })),
        timezone: meta.timezone || "UTC",
        method: meta.method?.name || null,
        location: label || "Your location",
        source: location.source,
      },
      {
        status: 200,
        headers: {
          // IP-derived answers differ per visitor, so keep them out of shared caches
          "Cache-Control": location.shared
            ? "public, s-maxage=21600, stale-while-revalidate=86400"
            : "private, max-age=3600",
        },
      },
    );
  } catch (error) {
    console.error("Prayer time fetch error:", error);
    return unavailable();
  }
}
