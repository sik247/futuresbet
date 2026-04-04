import { fetchEvents } from "@/lib/polymarket/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "5");

    const events = await fetchEvents({
      limit: Math.max(limit, 20), // fetch more, sort client-side
      closed: false,
    });

    // Sort by volume descending and take top N
    const sorted = events
      .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
      .slice(0, limit);

    return NextResponse.json(sorted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
