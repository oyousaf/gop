import { NextResponse } from "next/server";
import { getHadithPage } from "../../lib/hadith";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const requestedLimit = Number.parseInt(searchParams.get("limit"), 10);
  const requestedOffset = Number.parseInt(searchParams.get("offset"), 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 50)
    : 20;
  const offset = Number.isFinite(requestedOffset)
    ? Math.max(requestedOffset, 0)
    : 0;

  return NextResponse.json(getHadithPage({ limit, offset }), {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
