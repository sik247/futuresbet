"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import type { PolymarketEvent } from "@/lib/polymarket/types";

interface MarketCardProps {
  event: PolymarketEvent;
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

export function MarketCard({ event }: MarketCardProps) {
  const { theme } = useTheme();
  const topMarket = event.markets?.[0];

  // Derive YES probability from outcomePrices
  let yesPct = 50;
  if (topMarket?.outcomePrices?.length) {
    const price = parseFloat(topMarket.outcomePrices[0]);
    if (!isNaN(price)) yesPct = Math.round(price * 100);
  }

  const isCasino = theme === "casino";
  const isConvenience = theme === "convenience";
  const isNightmarket = theme === "nightmarket";

  // Theme-specific button labels
  const yesLabel = isCasino ? "Bet" : isConvenience ? "사요" : "맛있다!";
  const noLabel = isCasino ? "Fold" : isConvenience ? "안사요" : "별로...";

  // Theme-specific card extra class
  const cardExtraClass = isConvenience ? "convenience-accent-bar" : "";

  const cardStyle: React.CSSProperties = isCasino
    ? { boxShadow: "var(--shadow-card)" }
    : isNightmarket
    ? { boxShadow: "var(--shadow-card), 0 0 0 1px rgba(245,158,11,0.06)" }
    : {};

  return (
    <Link
      href={`/markets/${event.slug || event.id}`}
      className={`card ${cardExtraClass} flex flex-col overflow-hidden group`}
      style={{ textDecoration: "none", ...cardStyle }}
    >
      {/* Image */}
      {event.image ? (
        <div className="relative w-full overflow-hidden" style={{ height: "140px" }}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 40%, var(--bg-card) 100%)",
            }}
          />
          <div className="absolute top-2 right-2">
            <span
              className="badge badge-primary text-[10px] px-2 py-0.5"
              style={{ backdropFilter: "blur(8px)" }}
            >
              {formatVolume(event.volume)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category + live indicator */}
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-primary uppercase text-[0.65rem]">
            {event.category}
          </span>
          {!event.closed && (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "var(--fg-muted)" }}
            >
              <span className="pulse-dot" />
              Live
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="truncate-2 font-semibold leading-snug flex-1"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.9rem",
            color: "var(--fg-primary)",
          }}
        >
          {event.title}
        </h3>

        {/* Market question */}
        {topMarket && (
          <p
            className="truncate-2 text-xs"
            style={{ color: "var(--fg-secondary)", lineHeight: "1.4" }}
          >
            {topMarket.question}
          </p>
        )}

        {/* Probability bar */}
        <div>
          <div className="flex justify-between mb-1">
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--color-success)" }}
            >
              YES {yesPct}%
            </span>
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--color-danger)" }}
            >
              NO {100 - yesPct}%
            </span>
          </div>
          <div className="prob-bar-track">
            <div
              className="prob-bar-fill"
              style={{ width: `${yesPct}%` }}
              role="progressbar"
              aria-valuenow={yesPct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Prices row */}
        {topMarket && (
          <div className="flex gap-2">
            <div
              className="flex-1 px-2 py-1.5 text-center outcome-yes"
              style={{ fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
            >
              <span className="font-bold mono-num">
                ${parseFloat(topMarket.outcomePrices?.[0] ?? "0").toFixed(2)}
              </span>
            </div>
            <div
              className="flex-1 px-2 py-1.5 text-center outcome-no"
              style={{ fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
            >
              <span className="font-bold mono-num">
                ${parseFloat(topMarket.outcomePrices?.[1] ?? "0").toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Volume + date footer */}
        <div
          className="flex items-center justify-between text-xs border-t pt-2 mt-auto"
          style={{
            color: "var(--fg-muted)",
            borderColor: "var(--border-card)",
          }}
        >
          <span>Vol {formatVolume(event.volume ?? 0)}</span>
          <span>
            {event.endDate
              ? new Date(event.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2 text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: "var(--color-success)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {yesLabel}
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2 text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: "var(--color-danger)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {noLabel}
          </button>
        </div>
      </div>
    </Link>
  );
}

// Also export as default for backwards compatibility
export default MarketCard;
