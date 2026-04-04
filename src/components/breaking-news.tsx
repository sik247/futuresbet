"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import type { PolymarketEvent } from "@/lib/polymarket/types";

interface BreakingNewsProps {
  events: PolymarketEvent[];
}

export function BreakingNews({ events }: BreakingNewsProps) {
  const { theme } = useTheme();

  return (
    <div
      className="card p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Header */}
      <Link
        href="/markets"
        className="flex items-center justify-between group"
        style={{ textDecoration: "none" }}
      >
        <h3
          className="text-sm font-bold"
          style={{
            fontFamily: "var(--font-heading)",
            color: theme === "casino" ? "var(--color-primary)" : "var(--fg-primary)",
          }}
        >
          Breaking news
        </h3>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ color: "var(--fg-muted)" }}
          className="group-hover:translate-x-0.5 transition-transform"
        >
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {events.slice(0, 5).map((event, i) => {
          const topMarket = event.markets?.[0];
          const price = parseFloat(topMarket?.outcomePrices?.[0] ?? "0.5");
          const pct = Math.round(price * 100);
          const isHigh = pct >= 50;

          return (
            <Link
              key={event.id}
              href={`/markets/${event.slug || event.id}`}
              className="flex items-start gap-2.5 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)] px-2 -mx-2"
              style={{ textDecoration: "none" }}
            >
              <span
                className="mono-num text-xs font-bold shrink-0 mt-0.5"
                style={{
                  color: theme === "nightmarket"
                    ? i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary-light)"
                    : "var(--fg-muted)",
                  minWidth: "16px",
                }}
              >
                {i + 1}
              </span>
              <span
                className="text-xs leading-snug flex-1"
                style={{ color: "var(--fg-primary)" }}
              >
                {event.title}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="mono-num text-xs font-bold"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {pct}%
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: isHigh ? "var(--color-success)" : "var(--color-danger)" }}
                >
                  {isHigh ? "▲" : "▼"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
