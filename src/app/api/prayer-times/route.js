export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Makkah";

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  const RAPIDAPI_HOST = "muslimsalat.p.rapidapi.com";

  if (!RAPIDAPI_KEY) {
    console.error("Missing RapidAPI key.");
    return Response.json({ error: "Missing RapidAPI key." }, { status: 500 });
  }

  const endpoint = `https://${RAPIDAPI_HOST}/${encodeURIComponent(city)}.json`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to fetch prayer times:", errorBody);

      return Response.json(
        { error: "Failed to fetch prayer times." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const item = data?.items?.[0];

    if (!item) {
      console.warn("No items in prayer time data response.");
      return Response.json(
        { error: "No prayer timings found." },
        { status: 404 }
      );
    }

    return Response.json(
      {
        Fajr: item.fajr,
        Sunrise: item.shurooq,
        Dhuhr: item.dhuhr,
        Asr: item.asr,
        Maghrib: item.maghrib,
        Isha: item.isha,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prayer time fetch error:", error);
    return Response.json(
      { error: "Prayer time fetch failed." },
      { status: 500 }
    );
  }
}
