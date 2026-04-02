"use client";

import clsx from "clsx";
import { useTheme } from "@/lib/theme-context";

type PositionStatus = "active" | "settled";

interface Position {
  market: string;
  position: "YES" | "NO";
  entry: number;
  current: number;
  qty: number;
  status: PositionStatus;
  won?: boolean;
}

const POSITIONS: Position[] = [
  {
    market: "Will Bitcoin reach $200K by Dec 2025?",
    position: "YES",
    entry: 0.35,
    current: 0.52,
    qty: 100,
    status: "active",
  },
  {
    market: "Will Trump win 2028 election?",
    position: "NO",
    entry: 0.6,
    current: 0.45,
    qty: 200,
    status: "active",
  },
  {
    market: "Will ETH flip BTC market cap?",
    position: "YES",
    entry: 0.08,
    current: 0.05,
    qty: 500,
    status: "active",
  },
  {
    market: "Will AI pass the Turing test by 2026?",
    position: "YES",
    entry: 0.72,
    current: 0.85,
    qty: 150,
    status: "settled",
    won: true,
  },
  {
    market: "Will SpaceX land on Mars by 2030?",
    position: "NO",
    entry: 0.25,
    current: 0.18,
    qty: 300,
    status: "active",
  },
];

function calcPnl(pos: Position): number {
  // P&L per share * qty (in cents/dollars based on 0-1 pricing)
  const direction = pos.position === "YES" ? 1 : -1;
  return direction * (pos.current - pos.entry) * pos.qty * 100;
}

function calcPnlPercent(pos: Position): number {
  const diff = pos.current - pos.entry;
  return (diff / pos.entry) * 100;
}

function formatPnl(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}$${Math.abs(val).toFixed(0)}`;
}

function formatPercent(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
}

export default function PortfolioClient() {
  const { theme } = useTheme();

  const totalValue = POSITIONS.reduce((sum, p) => sum + p.current * p.qty * 100, 0);
  const totalPnl = POSITIONS.reduce((sum, p) => sum + calcPnl(p), 0);
  const wins = POSITIONS.filter((p) => calcPnl(p) > 0).length;
  const winRate = Math.round((wins / POSITIONS.length) * 100);
  const activeCount = POSITIONS.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <div className="page-container py-10 animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          {theme === "casino" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                Portfolio
              </p>
              <h1
                className="casino-text-gradient text-4xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Your Hand
              </h1>
            </div>
          )}
          {theme === "convenience" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                PORTFOLIO
              </p>
              <h1
                className="text-4xl font-bold text-fg-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                영수증{" "}
                <span className="text-xl font-normal text-fg-muted">(Receipt)</span>
              </h1>
            </div>
          )}
          {theme === "nightmarket" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                포트폴리오
              </p>
              <h1
                className="neon-amber text-4xl font-bold neon-flicker"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                주문서{" "}
                <span className="text-xl font-normal opacity-70">(Order Ticket)</span>
              </h1>
            </div>
          )}
        </header>

        {/* Summary stats bar */}
        <div
          className={clsx(
            "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",
          )}
        >
          <StatCard
            label={theme === "casino" ? "Stack Value" : theme === "convenience" ? "총 금액" : "총 가치"}
            value={`$${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            theme={theme}
          />
          <StatCard
            label={theme === "casino" ? "Net P&L" : theme === "convenience" ? "손익" : "수익"}
            value={formatPnl(totalPnl)}
            valueClass={totalPnl >= 0 ? "price-up" : "price-down"}
            theme={theme}
          />
          <StatCard
            label={theme === "casino" ? "Win Rate" : theme === "convenience" ? "승률" : "적중률"}
            value={`${winRate}%`}
            theme={theme}
          />
          <StatCard
            label={theme === "casino" ? "Active Bets" : theme === "convenience" ? "진행중" : "진행 주문"}
            value={String(activeCount)}
            theme={theme}
          />
        </div>

        {/* Position cards */}
        <div
          className={clsx("space-y-4 stagger-children", {
            "space-y-0 divide-y divide-dashed divide-border": theme === "convenience",
          })}
        >
          {POSITIONS.map((pos, i) => (
            <PositionCard key={i} pos={pos} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass,
  theme,
}: {
  label: string;
  value: string;
  valueClass?: string;
  theme: string;
}) {
  return (
    <div
      className={clsx("p-4 animate-fade-in", {
        "card casino-border-shimmer": theme === "casino",
        "surface convenience-accent-bar": theme === "convenience",
        "card neon-glow": theme === "nightmarket",
      })}
    >
      <p className="text-xs uppercase tracking-widest text-fg-muted mb-1">{label}</p>
      <p className={clsx("mono-num text-2xl font-bold", valueClass ?? "text-fg-primary")}>
        {value}
      </p>
    </div>
  );
}

function PositionCard({ pos, theme }: { pos: Position; theme: string }) {
  const pnl = calcPnl(pos);
  const pnlPct = calcPnlPercent(pos);
  const isProfit = pnl >= 0;

  const statusLabel = (): string => {
    if (pos.status === "settled") return pos.won ? "Won" : "Lost";
    return "Active";
  };

  const statusClass = (): string => {
    if (pos.status === "settled") return pos.won ? "badge-success" : "badge-danger";
    return "badge-primary";
  };

  if (theme === "casino") {
    return (
      <div className="card p-5 flex flex-col gap-3 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <p className="text-fg-primary font-medium leading-snug flex-1 truncate-2">
            {pos.market}
          </p>
          <span className={clsx("badge shrink-0", statusClass())}>{statusLabel()}</span>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <p className="text-xs text-fg-muted mb-0.5">Position</p>
            <span
              className={clsx("font-bold text-sm px-2 py-0.5 rounded", {
                "outcome-yes": pos.position === "YES",
                "outcome-no": pos.position === "NO",
              })}
            >
              {pos.position}
            </span>
          </div>
          <div>
            <p className="text-xs text-fg-muted mb-0.5">Entry</p>
            <p className="mono-num text-sm text-fg-secondary">{(pos.entry * 100).toFixed(0)}¢</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted mb-0.5">Current</p>
            <p className="mono-num text-sm text-fg-primary">{(pos.current * 100).toFixed(0)}¢</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted mb-0.5">Chips</p>
            <p className="mono-num text-sm casino-text-gold font-semibold">
              ◆ {pos.qty.toLocaleString()}
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-xs text-fg-muted mb-0.5">P&L</p>
            <p
              className={clsx("mono-num text-lg font-bold", {
                "price-up": isProfit,
                "price-down": !isProfit,
              })}
            >
              {formatPnl(pnl)}{" "}
              <span className="text-sm font-normal">{formatPercent(pnlPct)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (theme === "convenience") {
    return (
      <div className="py-4 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className="text-fg-primary font-medium leading-snug flex-1 truncate-2 text-sm">
            {pos.market}
          </p>
          <span className={clsx("badge shrink-0", statusClass())}>{statusLabel()}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span>
            <span className="text-fg-muted">포지션: </span>
            <span
              className={clsx("font-semibold", {
                "text-[var(--color-success)]": pos.position === "YES",
                "text-[var(--color-danger)]": pos.position === "NO",
              })}
            >
              {pos.position}
            </span>
          </span>
          <span>
            <span className="text-fg-muted">매입: </span>
            <span className="mono-num">{(pos.entry * 100).toFixed(0)}¢</span>
          </span>
          <span>
            <span className="text-fg-muted">현재: </span>
            <span className="mono-num">{(pos.current * 100).toFixed(0)}¢</span>
          </span>
          <span>
            <span className="text-fg-muted">수량: </span>
            <span className="mono-num font-semibold">{pos.qty.toLocaleString()}</span>
          </span>
          <span className="ml-auto">
            <span
              className={clsx("mono-num font-bold text-base", {
                "price-up": isProfit,
                "price-down": !isProfit,
              })}
            >
              {formatPnl(pnl)} ({formatPercent(pnlPct)})
            </span>
          </span>
        </div>
      </div>
    );
  }

  // nightmarket
  return (
    <div
      className={clsx("card p-5 flex flex-col gap-3 animate-fade-in", {
        "border-[var(--color-primary)] shadow-[var(--glow-amber)]":
          pos.status === "active" && isProfit,
        "border-[var(--color-accent)] shadow-[var(--glow-pink)]":
          pos.status === "active" && !isProfit,
      })}
    >
      <div className="flex items-start justify-between gap-4">
        <p
          className={clsx("font-medium leading-snug flex-1 truncate-2", {
            "neon-amber": isProfit && pos.status === "active",
            "text-fg-primary": !isProfit || pos.status === "settled",
          })}
        >
          {pos.market}
        </p>
        <span className={clsx("badge shrink-0", statusClass())}>{statusLabel()}</span>
      </div>
      <div className="flex flex-wrap gap-6 items-center">
        <div>
          <p className="text-xs text-fg-muted mb-0.5">주문</p>
          <span
            className={clsx("font-bold text-sm px-2 py-0.5 rounded", {
              "outcome-yes": pos.position === "YES",
              "outcome-no": pos.position === "NO",
            })}
          >
            {pos.position}
          </span>
        </div>
        <div>
          <p className="text-xs text-fg-muted mb-0.5">매입가</p>
          <p className="mono-num text-sm text-fg-secondary">{(pos.entry * 100).toFixed(0)}¢</p>
        </div>
        <div>
          <p className="text-xs text-fg-muted mb-0.5">현재가</p>
          <p className="mono-num text-sm text-fg-primary">{(pos.current * 100).toFixed(0)}¢</p>
        </div>
        <div>
          <p className="text-xs text-fg-muted mb-0.5">수량</p>
          <p className="mono-num text-sm font-semibold text-[var(--color-secondary)]">
            {pos.qty.toLocaleString()}
          </p>
        </div>
        <div className="ml-auto">
          <p className="text-xs text-fg-muted mb-0.5">수익</p>
          <p
            className={clsx("mono-num text-lg font-bold", {
              "neon-amber": isProfit,
              "text-[var(--color-danger)]": !isProfit,
              "neon-flicker": isProfit && pos.status === "active",
            })}
          >
            {formatPnl(pnl)}{" "}
            <span className="text-sm font-normal">{formatPercent(pnlPct)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
