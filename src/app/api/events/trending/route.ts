import { fetchEvents } from "@/lib/polymarket/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "5");

    // Fetch recent events
    const events = await fetchEvents({
      limit: 30,
      closed: false,
    });

    // Sort by a combination of recency and volume
    const now = Date.now();
    const scored = events.map(e => ({
      event: e,
      score: (e.volume ?? 0) * (1 / (1 + (now - new Date(e.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)))
    }));

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.event);

    return NextResponse.json(sorted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
