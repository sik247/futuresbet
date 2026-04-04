"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

interface Topic {
  name: string;
  volume: number;
  tag: string;
}

interface HotTopicsProps {
  topics: Topic[];
}

function formatVol(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(0)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

export function HotTopics({ topics }: HotTopicsProps) {
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
          className="text-sm font-bold flex items-center gap-1.5"
          style={{
            fontFamily: "var(--font-heading)",
            color: theme === "casino" ? "var(--color-primary)" : "var(--fg-primary)",
          }}
        >
          Hot topics
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
      <div className="flex flex-col gap-1.5">
        {topics.slice(0, 5).map((topic, i) => (
          <Link
            key={topic.tag}
            href={`/markets?tag=${encodeURIComponent(topic.tag)}`}
            className="flex items-center gap-2.5 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)] px-2 -mx-2"
            style={{ textDecoration: "none" }}
          >
            <span
              className="mono-num text-xs font-bold shrink-0"
              style={{
                color: theme === "nightmarket"
                  ? i % 2 === 0 ? "var(--color-primary)" : "var(--color-accent, var(--color-secondary-light))"
                  : "var(--fg-muted)",
                minWidth: "16px",
              }}
            >
              {i + 1}
            </span>
            <span
              className="text-sm font-medium flex-1"
              style={{ color: "var(--fg-primary)" }}
            >
              {topic.name}
            </span>
            <span
              className="mono-num text-xs shrink-0"
              style={{ color: "var(--fg-muted)" }}
            >
              {formatVol(topic.volume)} today
            </span>
            <span style={{ color: theme === "convenience" ? "var(--color-accent, #ff6b35)" : "var(--color-warning)" }}>
              🔥
            </span>
          </Link>
        ))}
      </div>

      {/* Explore all */}
      <Link
        href="/markets"
        className="w-full py-2.5 text-center text-sm font-semibold rounded-lg transition-all hover:opacity-90"
        style={{
          background: "var(--color-primary-bg)",
          color: "var(--color-primary)",
          border: "1px solid var(--border-default)",
          textDecoration: "none",
          display: "block",
        }}
      >
        Explore all
      </Link>
    </div>
  );
}
