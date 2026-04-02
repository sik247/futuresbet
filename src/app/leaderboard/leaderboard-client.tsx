"use client";

import clsx from "clsx";
import { useTheme } from "@/lib/theme-context";

interface Trader {
  name: string;
  pnl: number;
  winRate: number;
  trades: number;
  roi: number;
}

const TRADERS: Trader[] = [
  { name: "CryptoKing", pnl: 42800, winRate: 78, trades: 156, roi: 342 },
  { name: "김투자", pnl: 38200, winRate: 72, trades: 203, roi: 285 },
  { name: "BondTrader007", pnl: 31500, winRate: 69, trades: 89, roi: 412 },
  { name: "야시장달인", pnl: 28900, winRate: 75, trades: 134, roi: 228 },
  { name: "PolyWhale", pnl: 24100, winRate: 65, trades: 312, roi: 178 },
  { name: "편의점사장", pnl: 19800, winRate: 71, trades: 98, roi: 195 },
  { name: "NeonTrader", pnl: 15200, winRate: 63, trades: 167, roi: 145 },
  { name: "MonteCarlo", pnl: 12800, winRate: 67, trades: 76, roi: 168 },
  { name: "서울밤", pnl: 9400, winRate: 58, trades: 245, roi: 112 },
  { name: "LuckyDice", pnl: 7200, winRate: 55, trades: 189, roi: 98 },
];

const MY_RANK = 42;
const MY_STATS: Trader = {
  name: "You",
  pnl: 3200,
  winRate: 54,
  trades: 23,
  roi: 64,
};

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardClient() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-bg-base text-fg-primary">
      <div className="page-container py-10 animate-fade-in">
        <header className="mb-8">
          {theme === "casino" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                Leaderboard
              </p>
              <h1
                className="casino-text-gradient text-4xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                High Rollers 🎰
              </h1>
            </div>
          )}
          {theme === "convenience" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                LEADERBOARD
              </p>
              <h1
                className="text-4xl font-bold text-fg-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                단골 손님 🏪
              </h1>
            </div>
          )}
          {theme === "nightmarket" && (
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-fg-muted mb-1">
                리더보드
              </p>
              <h1
                className="neon-amber text-4xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                단골{" "}
                <span
                  className="neon-flicker"
                  style={{
                    textShadow:
                      "0 0 10px rgba(245,158,11,0.75), 0 0 30px rgba(245,158,11,0.35)",
                  }}
                >
                  🏮
                </span>
              </h1>
            </div>
          )}
        </header>

        <TopThree traders={TRADERS.slice(0, 3)} theme={theme} />

        <div className="mt-8 overflow-x-auto">
          <LeaderTable traders={TRADERS} theme={theme} />
        </div>

        <div className="mt-6">
          <YourPosition rank={MY_RANK} trader={MY_STATS} theme={theme} />
        </div>
      </div>
    </div>
  );
}

function TopThree({ traders, theme }: { traders: Trader[]; theme: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4 stagger-children">
      {traders.map((t, i) => {
        const cardClass = clsx(
          "p-5 text-center animate-fade-in rounded-[var(--radius-lg)]",
          theme === "casino" && i === 0 && "card casino-border-shimmer",
          theme === "casino" && i === 1 && "card border-[rgba(192,192,192,0.35)]",
          theme === "casino" && i === 2 && "card border-[rgba(205,127,50,0.35)]",
          theme === "convenience" && "surface convenience-accent-bar shadow-md",
          theme === "nightmarket" && i === 0 && "card neon-glow",
          theme === "nightmarket" && i > 0 && "card",
        );
        const nameClass = clsx(
          "font-bold mb-1 text-base",
          theme === "casino" && i === 0 && "casino-text-gold !text-lg",
          theme === "nightmarket" && i === 0 && "neon-amber !text-lg neon-flicker",
          ((theme === "casino" && i > 0) ||
            theme === "convenience" ||
            (theme === "nightmarket" && i > 0)) &&
            "text-fg-primary",
        );
        const pnlClass = clsx(
          "mono-num font-bold text-xl",
          theme === "casino" ? "casino-text-gold" : "price-up",
        );

        return (
          <div key={t.name} className={cardClass}>
            <div className="text-3xl mb-2">{MEDAL[i]}</div>
            <p className={nameClass}>{t.name}</p>
            <p className={pnlClass}>${t.pnl.toLocaleString()}</p>
            <p className="text-xs text-fg-muted mt-1">ROI: +{t.roi}%</p>
          </div>
        );
      })}
    </div>
  );
}

function RankBadge({ rank, theme }: { rank: number; theme: string }) {
  const isTop3 = rank <= 3;

  if (theme === "casino") {
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mono-num",
          isTop3
            ? "casino-text-gold border border-[var(--color-primary)]"
            : "text-fg-muted border border-[var(--border-default)]",
        )}
      >
        {rank}
      </span>
    );
  }

  if (theme === "convenience") {
    const colors = [
      "bg-yellow-400 text-yellow-900",
      "bg-gray-300 text-gray-800",
      "bg-amber-600 text-white",
    ];
    return (
      <span
        className={clsx(
          "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold mono-num",
          isTop3
            ? colors[rank - 1]
            : "bg-[var(--bg-surface)] text-fg-muted border border-[var(--border-default)]",
        )}
      >
        {rank}
      </span>
    );
  }

  const neonColors = [
    "text-[#fbbf24] border border-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    "text-[#ec4899] border border-[#ec4899] shadow-[0_0_8px_rgba(236,72,153,0.5)]",
    "text-[#06b6d4] border border-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.5)]",
  ];
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center w-8 h-8 rounded-sm text-sm font-bold mono-num",
        isTop3
          ? neonColors[rank - 1]
          : "text-fg-muted border border-[var(--border-default)]",
      )}
    >
      {rank}
    </span>
  );
}

function LeaderTable({ traders, theme }: { traders: Trader[]; theme: string }) {
  const headRowClass = clsx(
    "text-left",
    theme === "casino" && "border-b border-[var(--border-strong)]",
    theme === "convenience" && "border-b-2 border-[var(--color-primary)]",
    theme === "nightmarket" && "border-b border-[var(--color-primary)]",
  );

  const thClass = clsx(
    "pb-3 pr-4 font-semibold uppercase tracking-wider text-xs",
    theme === "casino" && "casino-text-gold",
    theme === "convenience" && "text-[var(--color-primary)]",
    theme === "nightmarket" && "neon-amber",
  );

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className={headRowClass}>
          {["Rank", "Trader", "Total P&L", "Win Rate", "Trades", "ROI"].map((col) => (
            <th key={col} className={thClass}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="stagger-children">
        {traders.map((t, i) => {
          const rowClass = clsx(
            "animate-fade-in border-b transition-colors",
            (theme === "casino" || theme === "nightmarket") &&
              "border-[var(--border-card)] hover:bg-[var(--bg-card-hover)]",
            theme === "convenience" &&
              "border-dashed border-[var(--border-default)] hover:bg-[var(--bg-card-hover)]",
            theme === "nightmarket" && i < 3 && "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
          );

          const avatarClass = clsx(
            "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold",
            theme === "casino" &&
              "bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--border-default)]",
            (theme === "convenience" || theme === "nightmarket") &&
              "bg-[var(--color-secondary-bg)] text-[var(--color-secondary)]",
          );

          const nameClass = clsx(
            "font-medium",
            theme === "casino" && i < 3 && "casino-text-gold",
            theme === "casino" && i >= 3 && "text-fg-primary",
            theme === "convenience" && "text-fg-primary",
            theme === "nightmarket" && i < 3 && "neon-amber neon-flicker",
            theme === "nightmarket" && i >= 3 && "text-fg-primary",
          );

          const pnlClass = clsx(
            "mono-num font-bold price-up",
            theme === "casino" && i < 3 && "casino-text-gold",
          );

          const roiClass = clsx(
            "mono-num font-semibold",
            t.roi >= 200 ? "text-[var(--color-success)]" : "text-fg-secondary",
          );

          return (
            <tr key={t.name} className={rowClass}>
              <td className="py-3 pr-4">
                <RankBadge rank={i + 1} theme={theme} />
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span className={avatarClass}>{t.name[0]}</span>
                  <span className={nameClass}>{t.name}</span>
                </div>
              </td>
              <td className="py-3 pr-4">
                <span className={pnlClass}>+${t.pnl.toLocaleString()}</span>
              </td>
              <td className="py-3 pr-4">
                <span className="mono-num text-fg-secondary">{t.winRate}%</span>
              </td>
              <td className="py-3 pr-4">
                <span className="mono-num text-fg-secondary">{t.trades}</span>
              </td>
              <td className="py-3">
                <span className={roiClass}>+{t.roi}%</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function YourPosition({
  rank,
  trader,
  theme,
}: {
  rank: number;
  trader: Trader;
  theme: string;
}) {
  const wrapClass = clsx(
    "p-4 animate-fade-in",
    theme === "casino" && "card border-[var(--color-primary)] casino-glow",
    theme === "convenience" && "surface convenience-highlight convenience-accent-bar",
    theme === "nightmarket" &&
      "card border-[var(--color-secondary)] shadow-[var(--glow-cyan)]",
  );

  const avatarClass = clsx(
    "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold",
    theme === "casino" &&
      "bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--border-default)]",
    (theme === "convenience" || theme === "nightmarket") &&
      "bg-[var(--color-secondary-bg)] text-[var(--color-secondary)]",
  );

  const nameClass = clsx(
    "font-semibold",
    theme === "casino" && "casino-text-gold",
    theme === "convenience" && "text-[var(--color-primary)]",
    theme === "nightmarket" && "neon-cyan",
  );

  const displayName =
    theme === "casino" ? "You (The Player)" : theme === "convenience" ? "나 (Me)" : "나 👤";

  return (
    <div className={wrapClass}>
      <div className="flex items-center gap-4 flex-wrap">
        <RankBadge rank={rank} theme={theme} />
        <span className="flex items-center gap-2">
          <span className={avatarClass}>Y</span>
          <span className={nameClass}>{displayName}</span>
          <span className="badge badge-primary text-xs ml-1">Your rank</span>
        </span>
        <span className="ml-auto flex flex-wrap gap-6 text-sm">
          <span>
            <span className="text-fg-muted text-xs block">P&L</span>
            <span className="mono-num font-bold price-up">+${trader.pnl.toLocaleString()}</span>
          </span>
          <span>
            <span className="text-fg-muted text-xs block">Win Rate</span>
            <span className="mono-num text-fg-secondary">{trader.winRate}%</span>
          </span>
          <span>
            <span className="text-fg-muted text-xs block">Trades</span>
            <span className="mono-num text-fg-secondary">{trader.trades}</span>
          </span>
          <span>
            <span className="text-fg-muted text-xs block">ROI</span>
            <span className="mono-num font-semibold text-fg-secondary">+{trader.roi}%</span>
          </span>
        </span>
      </div>
    </div>
  );
}
