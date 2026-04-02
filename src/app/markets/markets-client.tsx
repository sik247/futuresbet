"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { MarketCard } from "@/components/market-card";
import { MarketCategory } from "@/lib/polymarket/types";
import type { PolymarketEvent } from "@/lib/polymarket/types";

type Category = "all" | MarketCategory;

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All · 전체" },
  { value: MarketCategory.crypto, label: "크립토 🪙" },
  { value: MarketCategory.politics, label: "정치 🏛️" },
  { value: MarketCategory.sports, label: "스포츠 ⚽" },
  { value: MarketCategory.entertainment, label: "엔터 🎬" },
  { value: MarketCategory.science, label: "과학 🔬" },
];

interface MarketsClientProps {
  initialEvents: PolymarketEvent[];
}

export default function MarketsClient({ initialEvents }: MarketsClientProps) {
  const [events, setEvents] = useState<PolymarketEvent[]>(initialEvents);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(initialEvents.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length >= 20);

  // Auto-fetch on mount if no initial events
  useEffect(() => {
    if (events.length === 0) {
      fetch("/api/events?limit=20&closed=false")
        .then((r) => r.json())
        .then((data: PolymarketEvent[]) => {
          if (Array.isArray(data)) {
            setEvents(data);
            setOffset(data.length);
            setHasMore(data.length >= 20);
          }
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory =
        activeCategory === "all" || ev.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/events?limit=20&offset=${offset}&closed=false`);
      if (!res.ok) throw new Error("Failed to fetch");
      const more: PolymarketEvent[] = await res.json();
      setEvents((prev) => [...prev, ...more]);
      setOffset((prev) => prev + more.length);
      if (more.length < 20) setHasMore(false);
    } catch {
      // silently ignore — user can retry
    } finally {
      setIsLoadingMore(false);
    }
  }, [offset]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="input pl-9"
          type="search"
          placeholder="Search markets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.value}
            label={cat.label}
            active={activeCategory === cat.value}
            onClick={() => setActiveCategory(cat.value)}
          />
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-fg-muted">
        {filtered.length} market{filtered.length !== 1 ? "s" : ""}
        {activeCategory !== "all" || searchQuery ? " found" : " available"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children animate-fade-in">
          {filtered.map((event) => (
            <MarketCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="surface flex flex-col items-center justify-center py-20 text-center gap-3">
          <p className="text-2xl">🔍</p>
          <p className="text-fg-secondary font-medium">No markets found</p>
          <p className="text-fg-muted text-sm">Try a different search or category</p>
        </div>
      )}

      {/* Load more */}
      {hasMore && activeCategory === "all" && searchQuery === "" && (
        <div className="flex justify-center pt-4">
          <button
            className="btn-ghost"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3V4a10 10 0 100 10h-2a8 8 0 01-8-8z"
                  />
                </svg>
                Loading…
              </span>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Category pill — theme-aware                                         */
/* ------------------------------------------------------------------ */

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "category-pill",
        active ? "category-pill-active" : "category-pill-inactive",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
