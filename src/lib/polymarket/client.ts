import type { PolymarketEvent, PolymarketMarket } from "./types";

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

function parseMarket(market: PolymarketMarket): PolymarketMarket {
  return {
    ...market,
    outcomes:
      typeof market.outcomes === "string"
        ? JSON.parse(market.outcomes)
        : market.outcomes ?? [],
    outcomePrices:
      typeof market.outcomePrices === "string"
        ? JSON.parse(market.outcomePrices)
        : market.outcomePrices ?? [],
  };
}

function parseEvent(event: PolymarketEvent): PolymarketEvent {
  return {
    ...event,
    markets: (event.markets ?? []).map(parseMarket),
  };
}

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

  const events = await apiFetch<PolymarketEvent[]>("/events", queryParams);
  return events.map(parseEvent);
}

export async function fetchEvent(id: string): Promise<PolymarketEvent> {
  const event = await apiFetch<PolymarketEvent>(`/events/${encodeURIComponent(id)}`);
  return parseEvent(event);
}

export async function fetchMarkets(
  eventId: string
): Promise<PolymarketMarket[]> {
  const markets = await apiFetch<PolymarketMarket[]>("/markets", {
    event_id: eventId,
  });
  return markets.map(parseMarket);
}
