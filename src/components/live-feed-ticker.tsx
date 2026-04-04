"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { LiveTrade } from "@/lib/polymarket/types";

function formatSize(size: number): string {
  if (size >= 1000) return `$${(size / 1000).toFixed(1)}K`;
  return `$${size.toFixed(0)}`;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

export function LiveFeedTicker() {
  const [trades, setTrades] = useState<LiveTrade[]>([]);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource("/api/live-feed");

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "trade") {
          setTrades((prev) => [data.trade, ...prev].slice(0, 30));
        }
        if (data.type === "heartbeat") {
          setConnected(true);
        }
      } catch {
        // ignore parse errors
      }
    };

    return () => es.close();
  }, []);

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div className="page-container flex items-center gap-3 py-1.5">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: connected ? "var(--color-success)" : "var(--color-danger)",
              animation: connected ? "pulse-dot 1.8s ease-in-out infinite" : "none",
            }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--color-primary)" }}
          >
            Live
          </span>
        </div>

        {/* Scrolling ticker */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 overflow-x-hidden flex-1"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)" }}
        >
          <div
            className="flex items-center gap-6 whitespace-nowrap"
            style={{
              animation: trades.length > 2 ? "ticker-scroll 30s linear infinite" : "none",
            }}
          >
            {trades.length === 0 ? (
              <span className="text-xs" style={{ color: "var(--fg-muted)" }}>
                Waiting for trades...
              </span>
            ) : (
              <>
                {trades.map((trade) => (
                  <span
                    key={trade.id}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <span>{trade.emoji}</span>
                    <span
                      className="mono-num font-bold"
                      style={{
                        color: trade.side === "BUY"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                      }}
                    >
                      {formatSize(trade.size)}
                    </span>
                    <span style={{ color: "var(--fg-muted)" }}>on</span>
                    <span
                      className="font-medium"
                      style={{
                        color: trade.side === "BUY"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                      }}
                    >
                      {trade.outcome}
                    </span>
                    <span
                      className="truncate max-w-[200px]"
                      style={{ color: "var(--fg-secondary)" }}
                    >
                      {trade.eventTitle}
                    </span>
                    <span
                      className="mono-num"
                      style={{ color: "var(--fg-muted)", fontSize: "10px" }}
                    >
                      @{(trade.price * 100).toFixed(0)}¢
                    </span>
                    <span style={{ color: "var(--fg-muted)", fontSize: "10px" }}>
                      {timeAgo(trade.timestamp)}
                    </span>
                  </span>
                ))}
                {/* Duplicate for seamless loop */}
                {trades.map((trade) => (
                  <span
                    key={`dup-${trade.id}`}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <span>{trade.emoji}</span>
                    <span
                      className="mono-num font-bold"
                      style={{
                        color: trade.side === "BUY"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                      }}
                    >
                      {formatSize(trade.size)}
                    </span>
                    <span style={{ color: "var(--fg-muted)" }}>on</span>
                    <span
                      className="font-medium"
                      style={{
                        color: trade.side === "BUY"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                      }}
                    >
                      {trade.outcome}
                    </span>
                    <span
                      className="truncate max-w-[200px]"
                      style={{ color: "var(--fg-secondary)" }}
                    >
                      {trade.eventTitle}
                    </span>
                    <span
                      className="mono-num"
                      style={{ color: "var(--fg-muted)", fontSize: "10px" }}
                    >
                      @{(trade.price * 100).toFixed(0)}¢
                    </span>
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
