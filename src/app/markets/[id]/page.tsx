"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MarketDetailClient from "./market-detail-client";
import Link from "next/link";
import type { PolymarketEvent } from "@/lib/polymarket/types";

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<PolymarketEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/events/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => setEvent(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="flex-1 bg-bg-base">
      <div className="border-b border-border-card">
        <div className="page-container py-3">
          <Link
            href="/markets"
            className="text-sm text-fg-muted hover:text-fg-primary transition-colors"
          >
            ← Back to Markets
          </Link>
        </div>
      </div>

      <main className="page-container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
          </div>
        ) : error || !event ? (
          <div className="glass rounded-2xl p-12 text-center" style={{ color: "var(--fg-muted)" }}>
            <p className="text-lg mb-2">Market not found</p>
            <p className="text-sm">마켓을 찾을 수 없습니다</p>
          </div>
        ) : (
          <MarketDetailClient event={event} />
        )}
      </main>
    </div>
  );
}
