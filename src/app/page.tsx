"use client";

import { useEffect, useState } from "react";
import type { PolymarketEvent } from "@/lib/polymarket/types";
import { MarketCard } from "@/components/market-card";

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function HeroSection({
  totalVolume,
  activeMarkets,
}: {
  totalVolume: number;
  activeMarkets: number;
}) {
  return (
    <section
      className="hero-gradient relative overflow-hidden"
      style={{ minHeight: "480px" }}
    >
      <div
        aria-hidden
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary-bg) 0%, transparent 70%)",
          transform: "translate(-50%, -40%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary-bg) 0%, transparent 70%)",
          transform: "translate(50%, 40%)",
        }}
      />

      <div className="page-container relative z-10 flex flex-col items-center justify-center text-center py-24 gap-6">
        <div className="flex items-center gap-2 badge badge-primary py-1.5 px-4">
          <span className="pulse-dot" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Live Markets
          </span>
        </div>

        <div className="flex flex-col gap-2 animate-fade-in-up">
          <p
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "var(--fg-muted)", letterSpacing: "0.15em" }}
          >
            Prediction Markets
          </p>

          <h1
            className="section-heading casino-text-gradient"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: "1.1",
            }}
          >
            FuturesBet
          </h1>

          <p
            className="max-w-md mx-auto text-base leading-relaxed"
            style={{ color: "var(--fg-secondary)" }}
          >
            Trade outcomes on world events. Real money, real stakes, real vibes.
            <br />
            <span style={{ color: "var(--fg-muted)", fontSize: "0.85rem" }}>
              실제 돈, 실제 스테이크, 진짜 분위기
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a href="/markets" className="btn-primary">
            Browse Markets →
          </a>
          <a href="/markets" className="btn-ghost">
            Learn How
          </a>
        </div>

        <div
          className="glass mt-4 flex items-center gap-0 divide-x rounded-2xl overflow-hidden"
          style={{ borderColor: "var(--border-default)" }}
        >
          {[
            { label: "Total Volume", value: fmt(totalVolume), sub: "거래량" },
            {
              label: "Active Markets",
              value: activeMarkets.toLocaleString(),
              sub: "활성 마켓",
            },
            { label: "Avg. Probability", value: "50%", sub: "평균 확률" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-6 py-4 gap-0.5"
              style={{ borderColor: "var(--border-default)" }}
            >
              <span
                className="mono-num font-bold"
                style={{
                  fontSize: "1.25rem",
                  color: "var(--color-primary)",
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--fg-primary)" }}
              >
                {stat.label}
              </span>
              <span
                className="text-[10px]"
                style={{ color: "var(--fg-muted)" }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="card animate-pulse"
          style={{ height: "280px", opacity: 0.4 }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/events?limit=8&closed=false", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const totalVolume = events.reduce((sum, e) => sum + (e.volume ?? 0), 0);
  const activeMarkets = events.filter((e) => !e.closed).length;

  return (
    <main className="flex-1 pb-20 md:pb-0">
      <HeroSection totalVolume={totalVolume} activeMarkets={activeMarkets} />

      <section className="page-container py-12">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="section-heading">Featured Markets</h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--fg-muted)" }}
            >
              주목할 마켓 — Trade the most active predictions
            </p>
          </div>
          <a
            href="/markets"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-primary)" }}
          >
            View all →
          </a>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : events.length === 0 ? (
          <div
            className="glass rounded-2xl p-12 text-center"
            style={{ color: "var(--fg-muted)" }}
          >
            <p className="text-lg mb-2">No markets available right now.</p>
            <p className="text-sm">마켓이 없습니다. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {events.map((event) => (
              <div key={event.id} className="animate-fade-in-up">
                <MarketCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
