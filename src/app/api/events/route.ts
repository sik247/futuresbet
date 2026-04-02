import type { NextRequest } from "next/server";
import { fetchEvents } from "@/lib/polymarket/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const closed = searchParams.get("closed");
  const tag = searchParams.get("tag");

  try {
    const events = await fetchEvents({
      limit: limit !== null ? Number(limit) : undefined,
      offset: offset !== null ? Number(offset) : undefined,
      closed: closed !== null ? closed === "true" : undefined,
      tag: tag !== null ? tag : undefined,
    });

    return Response.json(events);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch events";
    const status =
      error instanceof Error && "status" in error
        ? (error as { status: number }).status
        : 500;

    return Response.json({ error: message }, { status });
  }
}
