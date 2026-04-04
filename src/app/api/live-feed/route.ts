import { fetchEvents } from "@/lib/polymarket/client";
import type { LiveTrade } from "@/lib/polymarket/types";

function getTradeEmoji(size: number): string {
  if (size >= 10000) return "\u{1F40B}"; // whale
  if (size >= 1000) return "\u{1F988}"; // shark
  if (size >= 100) return "\u{1F420}"; // tropical fish
  return "\u{1F41F}"; // fish
}

function generateTradeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Simulates live trade activity by polling events and generating
// realistic trade data from volume changes
async function* generateTrades(
  signal: AbortSignal
): AsyncGenerator<LiveTrade> {
  let prevVolumes = new Map<string, number>();

  while (!signal.aborted) {
    try {
      const events = await fetchEvents({ limit: 30, closed: false });

      for (const event of events) {
        for (const market of event.markets ?? []) {
          const prevVol = prevVolumes.get(market.id) ?? 0;
          const currentVol = market.volume ?? 0;

          // If we have a previous reading and volume increased, generate a trade
          if (prevVol > 0 && currentVol > prevVol) {
            const delta = currentVol - prevVol;
            const price = parseFloat(market.outcomePrices?.[0] ?? "0.5");
            const isBuy = Math.random() > 0.4; // Slightly favor buys
            const outcome = isBuy
              ? market.outcomes?.[0] ?? "Yes"
              : market.outcomes?.[1] ?? "No";

            const trade: LiveTrade = {
              id: generateTradeId(),
              marketQuestion: market.question,
              eventTitle: event.title,
              outcome,
              price: isBuy ? price : 1 - price,
              size: Math.round(delta * (0.3 + Math.random() * 0.7)),
              timestamp: new Date().toISOString(),
              side: isBuy ? "BUY" : "SELL",
              emoji: getTradeEmoji(delta),
            };

            yield trade;
          }

          prevVolumes.set(market.id, currentVol);
        }
      }

      // On first pass with no previous data, generate some initial trades
      if (prevVolumes.size > 0) {
        // Generate a few synthetic trades from high-volume markets
        const topEvents = events
          .filter((e) => e.volume > 100000)
          .slice(0, 5);

        for (const event of topEvents) {
          const market = event.markets?.[0];
          if (!market) continue;

          // Random chance to generate a trade
          if (Math.random() > 0.6) {
            const price = parseFloat(market.outcomePrices?.[0] ?? "0.5");
            const isBuy = Math.random() > 0.4;
            const sizes = [150, 250, 500, 750, 1000, 2500, 5000, 10000, 25000];
            const size = sizes[Math.floor(Math.random() * sizes.length)];

            yield {
              id: generateTradeId(),
              marketQuestion: market.question,
              eventTitle: event.title,
              outcome: isBuy
                ? market.outcomes?.[0] ?? "Yes"
                : market.outcomes?.[1] ?? "No",
              price: isBuy ? price : 1 - price,
              size,
              timestamp: new Date().toISOString(),
              side: isBuy ? "BUY" : "SELL",
              emoji: getTradeEmoji(size),
            };
          }
        }
      }
    } catch {
      // Silently retry on error
    }

    // Wait 8-15 seconds between polls
    const delay = 8000 + Math.random() * 7000;
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, delay);
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  const controller = new AbortController();

  // Abort when client disconnects
  request.signal.addEventListener("abort", () => controller.abort());

  const stream = new ReadableStream({
    async start(streamController) {
      // Send initial heartbeat
      streamController.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "heartbeat" })}\n\n`)
      );

      try {
        for await (const trade of generateTrades(controller.signal)) {
          if (controller.signal.aborted) break;

          const data = JSON.stringify({ type: "trade", trade });
          streamController.enqueue(encoder.encode(`data: ${data}\n\n`));

          // Small delay between trades to avoid flooding
          await new Promise((r) => setTimeout(r, 500 + Math.random() * 2000));
        }
      } catch {
        // Stream ended
      }

      streamController.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
