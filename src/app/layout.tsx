import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { Navbar } from "@/components/navbar";
import { ThemeSelector } from "@/components/theme-selector";
import { LiveFeedTicker } from "@/components/live-feed-ticker";

export const metadata: Metadata = {
  title: "FuturesBet — Prediction Markets",
  description: "Trade prediction markets with style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;500;700;900&family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;700;900&family=Press+Start+2P&family=Permanent+Marker&family=Cinzel:wght@400;600;700&family=Fredoka:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-fg-primary">
        <ThemeProvider>
          <ThemeSelector />
          <Navbar />
          <LiveFeedTicker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
