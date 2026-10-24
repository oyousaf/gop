import { getNews } from "../../lib/news";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  try {
    return Response.json(await getNews(lang), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
