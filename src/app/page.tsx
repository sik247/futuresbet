"use client";

import { useEffect, useState, useMemo } from "react";
import type { PolymarketEvent } from "@/lib/polymarket/types";
import { MarketCard } from "@/components/market-card";
import { FeaturedHero } from "@/components/featured-hero";
import { BreakingNews } from "@/components/breaking-news";
import { HotTopics } from "@/components/hot-topics";
import { CategoryPills } from "@/components/category-pills";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "politics", label: "Politics" },
  { value: "sports", label: "Sports" },
  { value: "crypto", label: "Crypto" },
  { value: "entertainment", label: "Culture" },
  { value: "science", label: "Science" },
];

function SkeletonCard() {
  return (
    <div className="card animate-pulse" style={{ height: "200px", opacity: 0.4 }} />
  );
}

function SkeletonHero() {
  return (
    <div className="card animate-pulse" style={{ minHeight: "380px", opacity: 0.3 }} />
  );
}

function SkeletonSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <div className="card animate-pulse" style={{ height: "220px", opacity: 0.3 }} />
      <div className="card animate-pulse" style={{ height: "260px", opacity: 0.3 }} />
    </div>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<PolymarketEvent[]>([]);
  const [trending, setTrending] = useState<PolymarketEvent[]>([]);
  const [allEvents, setAllEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState({ featured: true, trending: true, all: true });
  const [activeCategory, setActiveCategory] = useState("all");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch all data in parallel on mount
  useEffect(() => {
    const controller = new AbortController();
    const opts = { signal: controller.signal };

    fetch("/api/events/featured?limit=5", opts)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setFeatured(data); })
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, featured: false })));

    fetch("/api/events/trending?limit=5", opts)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTrending(data); })
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, trending: false })));

    fetch("/api/events?limit=20&closed=false", opts)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllEvents(data);
          setOffset(data.length);
          setHasMore(data.length >= 20);
        }
      })
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, all: false })));

    return () => controller.abort();
  }, []);

  // Load more events
  const loadMore = () => {
    setLoading((l) => ({ ...l, all: true }));
    fetch(`/api/events?limit=20&offset=${offset}&closed=false`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllEvents((prev) => [...prev, ...data]);
          setOffset((o) => o + data.length);
          setHasMore(data.length >= 20);
        }
      })
      .catch(() => {})
      .finally(() => setLoading((l) => ({ ...l, all: false })));
  };

  // Filter events by category
  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return allEvents;
    return allEvents.filter((e) => e.category === activeCategory);
  }, [allEvents, activeCategory]);

  // Derive hot topics from all events
  const hotTopics = useMemo(() => {
    const categoryMap = new Map<string, number>();
    for (const e of allEvents) {
      const cat = e.category || "other";
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + (e.volume ?? 0));
    }
    return Array.from(categoryMap.entries())
      .map(([name, volume]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        volume,
        tag: name,
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [allEvents]);

  return (
    <main className="flex-1 pb-20 md:pb-0">
      {/* Hero area: Featured + Sidebar */}
      <section className="page-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Featured hero carousel */}
          {loading.featured ? (
            <SkeletonHero />
          ) : featured.length > 0 ? (
            <FeaturedHero events={featured} />
          ) : (
            <SkeletonHero />
          )}

          {/* Right: Sidebar */}
          {loading.trending ? (
            <SkeletonSidebar />
          ) : (
            <aside className="flex flex-col gap-4">
              <BreakingNews events={trending} />
              <HotTopics topics={hotTopics} />
            </aside>
          )}
        </div>
      </section>

      {/* All Markets */}
      <section className="page-container py-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-heading" style={{ fontSize: "1.5rem" }}>
            All markets
          </h2>
          <div className="flex items-center gap-3" style={{ color: "var(--fg-muted)" }}>
            {/* Search icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            {/* Filter icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
              <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
              <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
              <line x1="2" x2="6" y1="14" y2="14" /><line x1="10" x2="14" y1="8" y2="8" />
              <line x1="18" x2="22" y1="16" y2="16" />
            </svg>
            {/* Bookmark icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-6">
          <CategoryPills
            categories={CATEGORIES}
            active={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Market cards grid */}
        {loading.all && allEvents.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            className="glass rounded-2xl p-12 text-center"
            style={{ color: "var(--fg-muted)" }}
          >
            <p className="text-lg mb-2">No markets in this category.</p>
            <p className="text-sm">이 카테고리에 마켓이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="animate-fade-in">
                  <MarketCard
                    event={event}
                    variant={event.markets?.length > 2 ? "multi-outcome" : "compact"}
                  />
                </div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && activeCategory === "all" && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading.all}
                  className="px-8 py-3 text-sm font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "var(--color-primary-bg)",
                    color: "var(--color-primary)",
                    border: "1px solid var(--border-default)",
                    cursor: loading.all ? "wait" : "pointer",
                  }}
                >
                  {loading.all ? "Loading..." : "Load more markets"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
