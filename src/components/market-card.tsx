"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme, THEMES } from "@/lib/theme-context";
import type { PolymarketEvent } from "@/lib/polymarket/types";

interface MarketCardProps {
  event: PolymarketEvent;
  variant?: "default" | "compact" | "multi-outcome";
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

/* ------------------------------------------------------------------ */
/*  Compact variant — Polymarket-style minimal card for grid          */
/* ------------------------------------------------------------------ */
function CompactCard({ event, theme }: { event: PolymarketEvent; theme: string }) {
  const topMarket = event.markets?.[0];
  let yesPct = 50;
  if (topMarket?.outcomePrices?.length) {
    const price = parseFloat(topMarket.outcomePrices[0]);
    if (!isNaN(price)) yesPct = Math.round(price * 100);
  }

  const themeInfo = THEMES.find((t) => t.id === theme)!;
  const yesLabel = themeInfo.yesLabel;
  const noLabel = themeInfo.noLabel;
  const cardExtraClass = themeInfo.cardClass;

  // Multi-outcome display for events with multiple markets
  const allOutcomes: { name: string; pct: number }[] = [];
  for (const market of event.markets ?? []) {
    if (market.outcomePrices?.length) {
      const price = parseFloat(market.outcomePrices[0]);
      allOutcomes.push({
        name: market.outcomes?.[0] ?? market.question,
        pct: Math.round((isNaN(price) ? 0.5 : price) * 100),
      });
    }
  }

  return (
    <Link
      href={`/markets/${event.slug || event.id}`}
      className={`card flex flex-col overflow-hidden group ${cardExtraClass}`}
      style={{ textDecoration: "none", minHeight: "180px" }}
    >
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Header: icon + title */}
        <div className="flex items-start gap-3">
          {event.image ? (
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--bg-card-hover)" }}>
              <Image src={event.image} alt="" fill className="object-cover" sizes="32px" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: "var(--bg-card-hover)" }} />
          )}
          <h3
            className="text-sm font-semibold leading-snug flex-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
          >
            {event.title}
          </h3>
        </div>

        {/* Outcomes */}
        {allOutcomes.length > 1 ? (
          <div className="flex flex-col gap-1.5 flex-1">
            {allOutcomes.slice(0, 4).map((o, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs truncate flex-1" style={{ color: "var(--fg-secondary)" }}>
                  {o.name}
                </span>
                <span className="mono-num text-xs font-bold" style={{ color: "var(--fg-primary)" }}>
                  {o.pct}%
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded transition-opacity hover:opacity-80"
                    style={{ background: "rgba(39, 174, 96, 0.15)", color: "var(--color-success)", border: "none", cursor: "pointer" }}
                  >
                    {yesLabel}
                  </button>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded transition-opacity hover:opacity-80"
                    style={{ background: "rgba(192, 57, 43, 0.15)", color: "var(--color-danger)", border: "none", cursor: "pointer" }}
                  >
                    {noLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 flex-1">
            <span className="mono-num text-2xl font-bold" style={{ color: "var(--fg-primary)" }}>
              {yesPct}%
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1.5 text-xs font-semibold rounded transition-opacity hover:opacity-80"
                style={{ background: "rgba(39, 174, 96, 0.15)", color: "var(--color-success)", border: "none", cursor: "pointer" }}
              >
                {yesLabel}
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="px-3 py-1.5 text-xs font-semibold rounded transition-opacity hover:opacity-80"
                style={{ background: "rgba(192, 57, 43, 0.15)", color: "var(--color-danger)", border: "none", cursor: "pointer" }}
              >
                {noLabel}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center gap-3 text-xs pt-2 border-t mt-auto"
          style={{ color: "var(--fg-muted)", borderColor: "var(--border-card)" }}
        >
          <span className="mono-num">{formatVolume(event.volume ?? 0)} Vol.</span>
          {/* swap icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <path d="M16 3l4 4-4 4" /><path d="M20 7H4" /><path d="M8 21l-4-4 4-4" /><path d="M4 17h16" />
          </svg>
          {/* bookmark icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: "auto" }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Multi-outcome variant — shows all markets in one card             */
/* ------------------------------------------------------------------ */
function MultiOutcomeCard({ event, theme }: { event: PolymarketEvent; theme: string }) {
  const themeInfo = THEMES.find((t) => t.id === theme)!;
  const cardExtraClass = themeInfo.cardClass;

  return (
    <Link
      href={`/markets/${event.slug || event.id}`}
      className={`card flex flex-col overflow-hidden group ${cardExtraClass}`}
      style={{ textDecoration: "none" }}
    >
      {/* Full-width image */}
      {event.image && (
        <div className="relative w-full overflow-hidden" style={{ height: "120px" }}>
          <Image src={event.image} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
            <span className="text-white text-sm font-bold text-center px-4" style={{ fontFamily: "var(--font-heading)" }}>
              {event.title}
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col p-4 gap-2">
        {event.markets.slice(0, 4).map((market) => {
          const price = parseFloat(market.outcomePrices?.[0] ?? "0.5");
          const pct = Math.round(price * 100);
          return (
            <div key={market.id} className="flex items-center justify-between gap-2">
              <span className="text-xs truncate flex-1" style={{ color: "var(--fg-secondary)" }}>
                {market.outcomes?.[0] ?? market.question}
              </span>
              <span className="mono-num text-xs font-bold" style={{ color: "var(--fg-primary)" }}>{pct}%</span>
              <div className="flex gap-1">
                <button
                  onClick={(e) => e.preventDefault()}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded hover:opacity-80"
                  style={{ background: "rgba(39,174,96,0.15)", color: "var(--color-success)", border: "none", cursor: "pointer" }}
                >
                  {themeInfo.yesLabel}
                </button>
                <button
                  onClick={(e) => e.preventDefault()}
                  className="px-2 py-0.5 text-[10px] font-semibold rounded hover:opacity-80"
                  style={{ background: "rgba(192,57,43,0.15)", color: "var(--color-danger)", border: "none", cursor: "pointer" }}
                >
                  {themeInfo.noLabel}
                </button>
              </div>
            </div>
          );
        })}
        {/* Footer */}
        <div className="flex items-center gap-3 text-xs pt-2 border-t mt-1" style={{ color: "var(--fg-muted)", borderColor: "var(--border-card)" }}>
          <span className="mono-num">{formatVolume(event.volume ?? 0)} Vol.</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: "auto" }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Default variant — original full card with image                   */
/* ------------------------------------------------------------------ */
function DefaultCard({ event, theme }: { event: PolymarketEvent; theme: string }) {
  const topMarket = event.markets?.[0];

  let yesPct = 50;
  if (topMarket?.outcomePrices?.length) {
    const price = parseFloat(topMarket.outcomePrices[0]);
    if (!isNaN(price)) yesPct = Math.round(price * 100);
  }

  const themeInfo = THEMES.find((t) => t.id === theme)!;
  const yesLabel = themeInfo.yesLabel;
  const noLabel = themeInfo.noLabel;
  const cardExtraClass = themeInfo.cardClass;

  const cardStyle: React.CSSProperties = {};

  return (
    <Link
      href={`/markets/${event.slug || event.id}`}
      className={`card ${cardExtraClass} flex flex-col overflow-hidden group`}
      style={{ textDecoration: "none", ...cardStyle }}
    >
      {event.image ? (
        <div className="relative w-full overflow-hidden" style={{ height: "140px" }}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg-card) 100%)" }} />
          <div className="absolute top-2 right-2">
            <span className="badge badge-primary text-[10px] px-2 py-0.5" style={{ backdropFilter: "blur(8px)" }}>
              {formatVolume(event.volume)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-primary uppercase text-[0.65rem]">{event.category}</span>
          {!event.closed && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--fg-muted)" }}>
              <span className="pulse-dot" />
              Live
            </span>
          )}
        </div>

        <h3
          className="truncate-2 font-semibold leading-snug flex-1"
          style={{ fontFamily: "var(--font-heading)", fontSize: "0.9rem", color: "var(--fg-primary)" }}
        >
          {event.title}
        </h3>

        {topMarket && (
          <p className="truncate-2 text-xs" style={{ color: "var(--fg-secondary)", lineHeight: "1.4" }}>
            {topMarket.question}
          </p>
        )}

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-success)" }}>YES {yesPct}%</span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--color-danger)" }}>NO {100 - yesPct}%</span>
          </div>
          <div className="prob-bar-track">
            <div className="prob-bar-fill" style={{ width: `${yesPct}%` }} role="progressbar" aria-valuenow={yesPct} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>

        {topMarket && (
          <div className="flex gap-2">
            <div className="flex-1 px-2 py-1.5 text-center outcome-yes" style={{ fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}>
              <span className="font-bold mono-num">${parseFloat(topMarket.outcomePrices?.[0] ?? "0").toFixed(2)}</span>
            </div>
            <div className="flex-1 px-2 py-1.5 text-center outcome-no" style={{ fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}>
              <span className="font-bold mono-num">${parseFloat(topMarket.outcomePrices?.[1] ?? "0").toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs border-t pt-2 mt-auto" style={{ color: "var(--fg-muted)", borderColor: "var(--border-card)" }}>
          <span>Vol {formatVolume(event.volume ?? 0)}</span>
          <span>
            {event.endDate ? new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2 text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "var(--color-success)", color: "#fff", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}
          >
            {yesLabel}
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2 text-xs font-semibold transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "var(--color-danger)", color: "#fff", borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer" }}
          >
            {noLabel}
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported MarketCard — delegates to variant                        */
/* ------------------------------------------------------------------ */
export function MarketCard({ event, variant = "default" }: MarketCardProps) {
  const { theme } = useTheme();

  if (variant === "compact") return <CompactCard event={event} theme={theme} />;
  if (variant === "multi-outcome") return <MultiOutcomeCard event={event} theme={theme} />;
  return <DefaultCard event={event} theme={theme} />;
}

export default MarketCard;
