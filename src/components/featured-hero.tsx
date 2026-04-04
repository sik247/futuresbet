"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { PolymarketEvent } from "@/lib/polymarket/types";

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(0)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

const OUTCOME_COLORS = [
  "var(--color-primary)",
  "var(--color-secondary-light)",
  "var(--color-info)",
  "var(--color-warning)",
  "var(--color-danger)",
];

interface FeaturedHeroProps {
  events: PolymarketEvent[];
}

export function FeaturedHero({ events }: FeaturedHeroProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % events.length);
  }, [events.length]);

  useEffect(() => {
    if (paused || events.length <= 1) return;
    const interval = setInterval(next, 8000);
    return () => clearInterval(interval);
  }, [paused, next, events.length]);

  if (!events.length) return null;
  const event = events[activeIndex];
  const topMarket = event.markets?.[0];

  // Collect all outcomes across markets (up to 5)
  const outcomes: { name: string; pct: number; color: string }[] = [];
  for (const market of event.markets ?? []) {
    for (let i = 0; i < (market.outcomes?.length ?? 0); i++) {
      if (outcomes.length >= 5) break;
      const price = parseFloat(market.outcomePrices?.[i] ?? "0");
      outcomes.push({
        name: market.outcomes[i],
        pct: Math.round(price * 100),
        color: OUTCOME_COLORS[outcomes.length % OUTCOME_COLORS.length],
      });
    }
  }

  const themeClass =
    theme === "casino" ? "casino-border-shimmer" :
    theme === "nightmarket" ? "neon-glow" :
    "convenience-accent-bar";

  const endDateStr = event.endDate
    ? `Ends ${new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "";

  return (
    <div
      className={`card ${themeClass} relative overflow-hidden`}
      style={{ minHeight: "380px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image */}
      {event.image && (
        <div className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            style={{ opacity: 0.15 }}
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--bg-card) 40%, transparent 100%)" }} />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-6 gap-4">
        {/* Category + title */}
        <div className="flex items-center gap-2">
          <span className="badge badge-primary text-[10px] uppercase">{event.category}</span>
          {topMarket?.question && (
            <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
              {topMarket.question !== event.title ? topMarket.question : ""}
            </span>
          )}
        </div>

        <Link
          href={`/markets/${event.slug || event.id}`}
          className="text-xl font-bold leading-tight hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)", textDecoration: "none" }}
        >
          {event.title}
        </Link>

        {/* Multi-outcome display */}
        <div className="flex flex-col gap-2 flex-1">
          {outcomes.map((o, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: o.color }}
              />
              <span className="text-sm flex-1" style={{ color: "var(--fg-secondary)" }}>
                {o.name}
              </span>
              <span className="mono-num text-sm font-bold" style={{ color: o.color }}>
                {o.pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Outcome legend bar (mini chart placeholder) */}
        <div className="flex rounded overflow-hidden h-2 mt-auto">
          {outcomes.map((o, i) => (
            <div
              key={i}
              style={{ width: `${o.pct}%`, background: o.color, minWidth: "4px" }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs" style={{ color: "var(--fg-muted)" }}>
          <span className="mono-num">{formatVolume(event.volume ?? 0)} Vol</span>
          <span>{endDateStr}</span>
        </div>

        {/* Carousel dots */}
        {events.length > 1 && (
          <div className="flex items-center gap-1.5 mt-1">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? "20px" : "6px",
                  height: "6px",
                  background: i === activeIndex ? "var(--color-primary)" : "var(--fg-muted)",
                  opacity: i === activeIndex ? 1 : 0.4,
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
