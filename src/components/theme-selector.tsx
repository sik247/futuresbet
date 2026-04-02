"use client";

import { useTheme, type Theme } from "@/lib/theme-context";

interface ThemeCard {
  id: Theme;
  emoji: string;
  previewBg: string;
  previewAccent: string;
  nameKo: string;
  nameEn: string;
  descEn: string;
  descKo: string;
}

const THEME_CARDS: ThemeCard[] = [
  {
    id: "casino",
    emoji: "🎰",
    previewBg: "#111111",
    previewAccent: "#d4af37",
    nameKo: "카지노 몬테카를로",
    nameEn: "Casino Monte Carlo",
    descEn: "Bet like Bond. 007 vibes.",
    descKo: "본드처럼 베팅하세요",
  },
  {
    id: "convenience",
    emoji: "🏪",
    previewBg: "#f5f7ff",
    previewAccent: "#0066ff",
    nameKo: "편의점",
    nameEn: "Convenience Store",
    descEn: "Your neighborhood prediction shop",
    descKo: "동네 예측 가게",
  },
  {
    id: "nightmarket",
    emoji: "🏮",
    previewBg: "#1c1a14",
    previewAccent: "#f59e0b",
    nameKo: "야시장",
    nameEn: "Night Market",
    descEn: "Seoul after dark. Neon predictions.",
    descKo: "서울의 밤, 네온 예측",
  },
];

export function ThemeSelector() {
  const { isFirstVisit, setTheme, dismissFirstVisit } = useTheme();

  if (!isFirstVisit) return null;

  function handleSelect(themeId: Theme) {
    setTheme(themeId);
    dismissFirstVisit();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="animate-scale-in w-full max-w-3xl"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: "Playfair Display, Georgia, serif",
              color: "#f5f0e8",
            }}
          >
            Choose Your Vibe
          </h1>
          <p style={{ color: "#b8aa8e", fontSize: "0.95rem" }}>
            당신의 스타일을 선택하세요 — You can change this any time.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEME_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelect(card.id)}
              className="group text-left transition-all duration-200 focus-visible:outline-none"
              style={{
                background: card.previewBg,
                border: `2px solid transparent`,
                borderRadius: "14px",
                padding: "1.5rem",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.border = `2px solid ${card.previewAccent}`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${card.previewAccent}44`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.border = "2px solid transparent";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Preview swatch */}
              <div
                className="w-full mb-4 rounded-lg overflow-hidden"
                style={{
                  height: "80px",
                  background: card.previewBg,
                  border: `1px solid ${card.previewAccent}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Mini card preview */}
                <div
                  style={{
                    width: "60%",
                    height: "52px",
                    background: card.id === "convenience" ? "#fff" : `${card.previewBg}cc`,
                    border: `1px solid ${card.previewAccent}55`,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      height: "4px",
                      background: card.previewAccent,
                      borderRadius: "99px",
                    }}
                  />
                  <div
                    style={{
                      width: "40%",
                      height: "3px",
                      background: `${card.previewAccent}66`,
                      borderRadius: "99px",
                    }}
                  />
                </div>
              </div>

              {/* Emoji */}
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {card.emoji}
              </div>

              {/* Names */}
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: card.previewAccent,
                  marginBottom: "2px",
                }}
              >
                {card.nameKo}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: card.id === "convenience" ? "#3d4466" : "#b8aa8e",
                  marginBottom: "0.6rem",
                  fontWeight: "500",
                }}
              >
                {card.nameEn}
              </div>

              {/* Desc */}
              <p
                style={{
                  fontSize: "0.78rem",
                  color: card.id === "convenience" ? "#8891b0" : "#6b6355",
                  lineHeight: "1.5",
                }}
              >
                {card.descEn}
                <br />
                <span style={{ opacity: 0.7 }}>{card.descKo}</span>
              </p>

              {/* Select indicator */}
              <div
                className="mt-4 w-full text-center py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: `${card.previewAccent}15`,
                  color: card.previewAccent,
                  border: `1px solid ${card.previewAccent}33`,
                }}
              >
                Select →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
