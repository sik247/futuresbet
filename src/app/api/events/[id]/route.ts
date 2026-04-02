import type { NextRequest } from "next/server";
import { fetchEvent } from "@/lib/polymarket/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const event = await fetchEvent(id);
    return Response.json(event);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch event";
    const status =
      error instanceof Error && "status" in error
        ? (error as { status: number }).status
        : 500;

    return Response.json({ error: message }, { status });
  }
}
