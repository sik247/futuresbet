export enum MarketCategory {
  crypto = "crypto",
  politics = "politics",
  sports = "sports",
  entertainment = "entertainment",
  science = "science",
  other = "other",
}

export interface PolymarketMarket {
  id: string;
  question: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: number;
  active: boolean;
  closed: boolean;
}

export interface PolymarketEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  closed: boolean;
  markets: PolymarketMarket[];
  image: string;
  category: MarketCategory;
  volume: number;
  liquidity: number;
}

export interface LiveTrade {
  id: string;
  marketQuestion: string;
  eventTitle: string;
  outcome: string;
  price: number;
  size: number;
  timestamp: string;
  side: "BUY" | "SELL";
  emoji: string;
}
