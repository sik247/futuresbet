import type { PolymarketEvent, PolymarketMarket } from "./types";

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

export interface FetchEventsParams {
  limit?: number;
  offset?: number;
  closed?: boolean;
  tag?: string;
  order?: string;
  ascending?: boolean;
}

class PolymarketApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "PolymarketApiError";
  }
}

async function apiFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${GAMMA_API_BASE}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    signal: controller.signal,
    next: { revalidate: 60 },
  });

  clearTimeout(timeout);

  if (!response.ok) {
    throw new PolymarketApiError(
      response.status,
      `Polymarket API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchEvents(
  params?: FetchEventsParams
): Promise<PolymarketEvent[]> {
  const queryParams: Record<string, string> = {};

  if (params?.limit !== undefined) {
    queryParams.limit = String(params.limit);
  }
  if (params?.offset !== undefined) {
    queryParams.offset = String(params.offset);
  }
  if (params?.closed !== undefined) {
    queryParams.closed = String(params.closed);
  }
  if (params?.tag !== undefined) {
    queryParams.tag = params.tag;
  }
  if (params?.order !== undefined) {
    queryParams.order = params.order;
  }
  if (params?.ascending !== undefined) {
    queryParams.ascending = String(params.ascending);
  }

  return apiFetch<PolymarketEvent[]>("/events", queryParams);
}

export async function fetchEvent(id: string): Promise<PolymarketEvent> {
  return apiFetch<PolymarketEvent>(`/events/${encodeURIComponent(id)}`);
}

export async function fetchMarkets(
  eventId: string
): Promise<PolymarketMarket[]> {
  return apiFetch<PolymarketMarket[]>("/markets", {
    event_id: eventId,
  });
}
