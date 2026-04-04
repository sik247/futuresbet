"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LiveTrade } from "@/lib/polymarket/types";

function formatSize(size: number): string {
  if (size >= 10000) return `$${(size / 1000).toFixed(1)}K`;
  if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`;
  return `$${size.toFixed(0)}`;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function LiveFeed() {
  const [trades, setTrades] = useState<LiveTrade[]>([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/live-feed");

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "trade") {
          setTrades((prev) => [data.trade, ...prev].slice(0, 50));
        }
        if (data.type === "heartbeat") {
          setConnected(true);
        }
      } catch {
        // ignore
      }
    };

    return () => es.close();
  }, []);

  // Re-render time-ago every 10 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="card p-4 flex flex-col gap-3"
      style={{ background: "var(--bg-surface)", maxHeight: "400px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: connected ? "var(--color-success)" : "var(--color-danger)",
              animation: connected ? "pulse-dot 1.8s ease-in-out infinite" : "none",
            }}
          />
          <h3
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--fg-primary)" }}
          >
            Live Trades
          </h3>
          <span className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
            실시간 거래
          </span>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{
            background: connected ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: connected ? "var(--color-success)" : "var(--color-danger)",
          }}
        >
          {connected ? "LIVE" : "CONNECTING..."}
        </span>
      </div>

      {/* Trade list */}
      <div
        className="flex flex-col gap-1 overflow-y-auto flex-1"
        style={{ scrollbarWidth: "thin" }}
      >
        {trades.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-8 gap-2"
            style={{ color: "var(--fg-muted)" }}
          >
            <span className="text-2xl">📡</span>
            <span className="text-xs">Listening for trades...</span>
            <span className="text-[10px]">거래 대기중...</span>
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)] animate-fade-in"
            >
              {/* Emoji + size */}
              <span className="text-base shrink-0">{trade.emoji}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="mono-num text-xs font-bold"
                    style={{
                      color: trade.side === "BUY"
                        ? "var(--color-success)"
                        : "var(--color-danger)",
                    }}
                  >
                    {formatSize(trade.size)}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      background:
                        trade.side === "BUY"
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(239,68,68,0.12)",
                      color: trade.side === "BUY"
                        ? "var(--color-success)"
                        : "var(--color-danger)",
                    }}
                  >
                    {trade.outcome}
                  </span>
                  <span
                    className="mono-num text-[10px]"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    @{(trade.price * 100).toFixed(0)}¢
                  </span>
                </div>
                <span
                  className="text-[11px] truncate"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  {trade.eventTitle}
                </span>
              </div>
              <span
                className="text-[10px] shrink-0"
                style={{ color: "var(--fg-muted)" }}
              >
                {timeAgo(trade.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
