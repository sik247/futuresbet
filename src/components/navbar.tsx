"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useTheme, THEMES } from "@/lib/theme-context";
import { SearchBar } from "./search-bar";

const NAV_LINKS = [
  { href: "/", labelEn: "Home", labelKo: "홈" },
  { href: "/markets", labelEn: "Markets", labelKo: "마켓" },
  { href: "/portfolio", labelEn: "Portfolio", labelKo: "포트폴리오" },
  { href: "/leaderboard", labelEn: "Leaderboard", labelKo: "순위" },
] as const;


const CATEGORY_TABS = [
  { href: "/markets", label: "Trending", emoji: "🔥" },
  { href: "/markets?sort=new", label: "New", emoji: "" },
  { href: "/markets?tag=politics", label: "Politics", emoji: "" },
  { href: "/markets?tag=sports", label: "Sports", emoji: "" },
  { href: "/markets?tag=crypto", label: "Crypto", emoji: "" },
  { href: "/markets?tag=entertainment", label: "Culture", emoji: "" },
  { href: "/markets?tag=science", label: "Tech", emoji: "" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Desktop navbar — primary bar */}
      <nav
        className="glass hidden md:flex items-center gap-4 px-6 py-2.5 sticky top-0 z-40"
        style={{
          borderRadius: 0,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 select-none shrink-0"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}
        >
          <span className="text-xl font-bold tracking-tight">FuturesBet</span>
        </Link>

        {/* Search bar — center */}
        <div className="flex-1 max-w-md mx-auto">
          <SearchBar />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nav links */}
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-1.5 rounded-lg transition-all duration-150 text-xs font-medium",
                  isActive
                    ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                    : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--color-primary-bg)]"
                )}
              >
                {link.labelEn}
              </Link>
            );
          })}

          {/* Theme switcher */}
          <div className="relative ml-2">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-150 text-sm",
                "border-[var(--border-default)] text-[var(--fg-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--fg-primary)]"
              )}
              aria-label="Switch theme"
            >
              <span>{THEMES.find((t) => t.id === theme)!.emoji}</span>
              <svg
                width="10" height="10" viewBox="0 0 12 12" fill="none"
                className={clsx("transition-transform", dropdownOpen && "rotate-180")}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-lg py-1 z-50"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-modal)",
                }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setDropdownOpen(false);
                    }}
                    className={clsx(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm",
                      theme === t.id
                        ? "text-[var(--color-primary)] bg-[var(--color-primary-bg)]"
                        : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--color-primary-bg)]"
                    )}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-medium leading-none">{t.nameKo}</span>
                      <span className="text-[10px] opacity-60 mt-0.5">{t.nameEn}</span>
                    </div>
                    {theme === t.id && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-auto">
                        <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {dropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            )}
          </div>

          {/* Auth buttons */}
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{ color: "var(--fg-secondary)" }}
          >
            Log In
          </button>
          <button
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
            style={{
              background: "var(--color-primary)",
              color: "var(--fg-inverse)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Desktop navbar — secondary category bar */}
      <div
        className="hidden md:block sticky z-30"
        style={{
          top: "49px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div className="page-container">
          <div
            className="flex items-center gap-1 py-2 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = pathname + (typeof window !== "undefined" ? window.location.search : "") === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={clsx(
                    "px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "text-[var(--color-primary)] bg-[var(--color-primary-bg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-card-hover)]"
                  )}
                >
                  {tab.emoji ? `${tab.emoji} ${tab.label}` : tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--border-default)",
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex flex-col items-center px-3 py-1.5 rounded-lg transition-all text-xs",
                isActive ? "text-[var(--color-primary)]" : "text-[var(--fg-muted)]"
              )}
            >
              <span className="font-medium leading-none">{link.labelEn}</span>
              <span className="text-[9px] mt-0.5 opacity-70">{link.labelKo}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex flex-col items-center px-3 py-1.5 rounded-lg text-xs"
          style={{ color: "var(--fg-muted)" }}
        >
          <span className="text-base leading-none">{THEMES.find((t) => t.id === theme)!.emoji}</span>
          <span className="text-[9px] mt-0.5 opacity-70">Theme</span>
        </button>
      </nav>
    </>
  );
}
