"use client";

import { useState } from "react";
import { useTheme, THEMES, type Theme } from "@/lib/theme-context";

const CATEGORY_LABELS: Record<string, { en: string; ko: string }> = {
  korean: { en: "Korean Vibes", ko: "한국 감성" },
  scifi: { en: "Sci-Fi", ko: "SF" },
  nature: { en: "Nature", ko: "자연" },
  popculture: { en: "Pop Culture", ko: "팝컬처" },
};

const CATEGORY_ORDER = ["korean", "scifi", "nature", "popculture"];

export function ThemeSelector() {
  const { isFirstVisit, setTheme, dismissFirstVisit } = useTheme();
  const [activeCategory, setActiveCategory] = useState("korean");
  const [search, setSearch] = useState("");

  if (!isFirstVisit) return null;

  function handleSelect(themeId: Theme) {
    setTheme(themeId);
    dismissFirstVisit();
  }

  const filteredThemes = search
    ? THEMES.filter(
        (t) =>
          t.nameEn.toLowerCase().includes(search.toLowerCase()) ||
          t.nameKo.includes(search) ||
          t.id.includes(search.toLowerCase())
      )
    : THEMES.filter((t) => t.category === activeCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="animate-scale-in w-full max-w-4xl max-h-[90vh] flex flex-col"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="text-center px-6 pt-8 pb-4">
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
            당신의 스타일을 선택하세요 — Pick from 20 unique themes
          </p>

          {/* Search */}
          <div className="mt-4 max-w-sm mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search themes..."
              style={{
                width: "100%",
                padding: "8px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(212,175,55,0.2)",
                background: "#161616",
                color: "#f5f0e8",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          {/* Category tabs */}
          {!search && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "99px",
                    border: "1px solid",
                    borderColor:
                      activeCategory === cat
                        ? "#d4af37"
                        : "rgba(212,175,55,0.15)",
                    background:
                      activeCategory === cat
                        ? "rgba(212,175,55,0.12)"
                        : "transparent",
                    color: activeCategory === cat ? "#d4af37" : "#6b6355",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {CATEGORY_LABELS[cat].en}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme grid */}
        <div
          className="flex-1 overflow-y-auto px-6 pb-6"
          style={{ scrollbarWidth: "thin" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
            {filteredThemes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className="group text-left transition-all duration-200 focus-visible:outline-none"
                style={{
                  background: t.previewColors[0],
                  border: "2px solid transparent",
                  borderRadius: "12px",
                  padding: "1rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = `2px solid ${t.previewColors[1]}`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${t.previewColors[1]}44`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = "2px solid transparent";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Color swatches */}
                <div className="flex gap-1 mb-3">
                  {t.previewColors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded"
                      style={{
                        height: "6px",
                        background: color,
                        border: i === 0 ? `1px solid ${t.previewColors[1]}33` : "none",
                      }}
                    />
                  ))}
                </div>

                {/* Emoji */}
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>
                  {t.emoji}
                </div>

                {/* Name */}
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: t.previewColors[1],
                    marginBottom: "1px",
                    lineHeight: 1.2,
                  }}
                >
                  {t.nameKo}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: t.mode === "light" ? "#3d4466" : "#b8aa8e",
                    fontWeight: 500,
                  }}
                >
                  {t.nameEn}
                </div>

                {/* Description */}
                <p
                  className="mt-1"
                  style={{
                    fontSize: "0.65rem",
                    color: t.mode === "light" ? "#8891b0" : "#6b6355",
                    lineHeight: 1.4,
                  }}
                >
                  {t.descEn}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
