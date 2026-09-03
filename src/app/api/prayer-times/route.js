export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = (searchParams.get("city") || "Makkah").trim().slice(0, 80);
  const country = (searchParams.get("country") || "Saudi Arabia")
    .trim()
    .slice(0, 80);
  const endpoint =
    `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}` +
    `&country=${encodeURIComponent(country)}&method=4`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return Response.json(
        { error: "Prayer times are temporarily unavailable." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const timings = data?.data?.timings;

    if (!timings) {
      return Response.json(
        { error: "No prayer timings found." },
        { status: 502 },
      );
    }

    return Response.json(
      {
        Fajr: timings.Fajr,
        Sunrise: timings.Sunrise,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=7200",
        },
      },
    );
  } catch (error) {
    console.error("Prayer time fetch error:", error);
    return Response.json(
      { error: "Prayer times are temporarily unavailable." },
      { status: 502 },
    );
  }
}
