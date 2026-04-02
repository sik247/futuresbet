import MarketsClient from "./markets-client";

export const metadata = {
  title: "Markets — FuturesBet",
  description: "Browse prediction markets across crypto, politics, sports, and more.",
};

export default function MarketsPage() {
  return (
    <div className="flex-1 bg-bg-base">
      {/* Hero */}
      <section className="hero-gradient py-12 border-b border-border-card">
        <div className="page-container">
          <p className="text-xs font-semibold tracking-widest uppercase text-fg-muted mb-2">
            Prediction Markets
          </p>
          <h1 className="section-heading mb-2">Browse Markets</h1>
          <p className="text-fg-secondary max-w-xl">
            Trade on the outcomes of real-world events. Filter by category or
            search to find your next position.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="page-container py-8">
        <MarketsClient initialEvents={[]} />
      </main>
    </div>
  );
}
