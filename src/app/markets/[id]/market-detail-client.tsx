"use client";

import { useState, useMemo } from "react";
import type { PolymarketEvent, PolymarketMarket } from "@/lib/polymarket/types";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function getTimeLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Closed";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h remaining`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m remaining`;
}

const QUICK_AMOUNTS = [10, 50, 100, 500];

/* ------------------------------------------------------------------ */
/* Theme-dependent trade button labels                                 */
/* ------------------------------------------------------------------ */

type Theme = "casino" | "convenience" | "nightmarket";

function getTheme(): Theme {
  if (typeof document === "undefined") return "casino";
  const t = document.documentElement.getAttribute("data-theme");
  if (t === "convenience" || t === "nightmarket") return t;
  return "casino";
}

function tradeLabels(theme: Theme) {
  switch (theme) {
    case "convenience":
      return { yes: "사요", no: "안사요", place: "주문하기" };
    case "nightmarket":
      return { yes: "맛있다!", no: "별로...", place: "주문 넣기" };
    default:
      return { yes: "Bet", no: "Fold", place: "Place Trade" };
  }
}

/* ------------------------------------------------------------------ */
/* Market stats bar                                                    */
/* ------------------------------------------------------------------ */

function StatsBar({ event }: { event: PolymarketEvent }) {
  const stats = [
    { label: "Total Volume", value: formatVolume(event.volume ?? 0) },
    { label: "Liquidity", value: formatVolume(event.liquidity ?? 0) },
    {
      label: "Markets",
      value: String(event.markets?.length ?? 0),
    },
    {
      label: "Resolution",
      value: event.endDate
        ? new Date(event.endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "TBD",
    },
  ];

  return (
    <div className="surface grid grid-cols-2 sm:grid-cols-4 divide-x divide-border-card">
      {stats.map((s) => (
        <div key={s.label} className="p-4 text-center">
          <p className="text-xs text-fg-muted mb-1">{s.label}</p>
          <p className="mono-num font-semibold text-fg-primary">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trade panel for a single market                                     */
/* ------------------------------------------------------------------ */

function TradePanel({ market }: { market: PolymarketMarket }) {
  const theme = getTheme();
  const labels = tradeLabels(theme);

  const outcomes = market.outcomes ?? [];
  const prices = (market.outcomePrices ?? []).map((p) => parseFloat(p));

  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [placed, setPlaced] = useState(false);

  const selectedPrice = selectedOutcome !== null ? prices[selectedOutcome] ?? 0 : 0;
  const potentialReturn = useMemo(() => {
    const num = parseFloat(amount);
    if (!num || !selectedPrice || selectedPrice <= 0) return null;
    return num / selectedPrice;
  }, [amount, selectedPrice]);

  function handlePlace() {
    if (selectedOutcome === null || !amount) return;
    setPlaced(true);
    setTimeout(() => setPlaced(false), 2500);
  }

  return (
    <div className="card p-5 space-y-4">
      <h4 className="text-sm font-semibold text-fg-secondary truncate-2">
        {market.question}
      </h4>

      {/* Outcome selection */}
      <div className="grid grid-cols-2 gap-2">
        {outcomes.slice(0, 2).map((outcome, i) => {
          const pricePct = Math.round((prices[i] ?? 0) * 100);
          const isYes = i === 0;
          const isSelected = selectedOutcome === i;
          return (
            <button
              key={outcome}
              onClick={() => setSelectedOutcome(isSelected ? null : i)}
              className={[
                "rounded-[var(--radius-md)] border-2 p-3 text-center transition-all duration-150 font-semibold text-sm",
                isSelected
                  ? isYes
                    ? "outcome-yes border-[var(--color-success)] scale-[1.02]"
                    : "outcome-no border-[var(--color-danger)] scale-[1.02]"
                  : "border-border-card text-fg-secondary hover:border-border-strong bg-transparent",
              ].join(" ")}
            >
              <span className="block text-base">
                {isYes ? labels.yes : labels.no}
              </span>
              <span className="block text-xs font-normal opacity-80">
                {outcome} · {pricePct}¢
              </span>
            </button>
          );
        })}
      </div>

      {/* Amount input */}
      <div className="space-y-2">
        <label className="text-xs text-fg-muted">Amount (USD)</label>
        <div className="flex gap-1">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className={[
                "flex-1 text-xs py-1.5 rounded-[var(--radius-sm)] border transition-colors",
                amount === String(q)
                  ? "border-border-focus bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                  : "border-border-card text-fg-muted hover:border-border-default",
              ].join(" ")}
            >
              ${q}
            </button>
          ))}
        </div>
        <input
          className="input"
          type="number"
          min="0"
          step="1"
          placeholder="Enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Potential payout */}
      {potentialReturn !== null && selectedOutcome !== null && (
        <div className="surface p-3 rounded-[var(--radius-md)] flex justify-between text-sm">
          <span className="text-fg-muted">Potential payout</span>
          <span className="mono-num font-semibold text-fg-primary">
            ${potentialReturn.toFixed(2)}
          </span>
        </div>
      )}

      {/* Place trade button */}
      <button
        className={[
          "btn-primary w-full",
          selectedOutcome === null || !amount ? "opacity-40 cursor-not-allowed" : "",
        ].join(" ")}
        disabled={selectedOutcome === null || !amount}
        onClick={handlePlace}
      >
        {placed ? "Trade placed! 🎉" : labels.place}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

interface MarketDetailClientProps {
  event: PolymarketEvent;
}

export default function MarketDetailClient({ event }: MarketDetailClientProps) {
  const timeLeft = event.endDate ? getTimeLeft(event.endDate) : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      {event.image && (
        <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-[var(--radius-xl)] card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-primary uppercase text-[0.65rem]">
            {event.category}
          </span>
          {timeLeft && (
            <span className="badge text-fg-muted border-border-card text-[0.65rem]">
              {timeLeft}
            </span>
          )}
          {!event.closed && (
            <span className="flex items-center gap-1.5 text-xs text-fg-muted">
              <span className="pulse-dot" />
              Live
            </span>
          )}
        </div>

        <h1 className="section-heading">{event.title}</h1>

        {event.description && (
          <p className="text-fg-secondary leading-relaxed max-w-3xl">
            {event.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <StatsBar event={event} />

      {/* Markets */}
      {event.markets && event.markets.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-fg-primary">
            Markets ({event.markets.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.markets.map((market) => (
              <TradePanel key={market.id} market={market} />
            ))}
          </div>
        </section>
      )}

      {/* No markets fallback */}
      {(!event.markets || event.markets.length === 0) && (
        <div className="surface flex flex-col items-center py-16 text-center gap-3">
          <p className="text-2xl">📊</p>
          <p className="text-fg-secondary">No markets available for this event yet.</p>
        </div>
      )}
    </div>
  );
}
