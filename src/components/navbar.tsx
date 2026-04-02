"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useTheme, THEMES, type Theme } from "@/lib/theme-context";

const NAV_LINKS = [
  { href: "/", labelEn: "Home", labelKo: "홈" },
  { href: "/markets", labelEn: "Markets", labelKo: "마켓" },
  { href: "/portfolio", labelEn: "Portfolio", labelKo: "포트폴리오" },
  { href: "/leaderboard", labelEn: "Leaderboard", labelKo: "순위" },
] as const;

const THEME_EMOJIS: Record<Theme, string> = {
  casino: "🎰",
  convenience: "🏪",
  nightmarket: "🏮",
};

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      {/* Desktop navbar */}
      <nav
        className="glass hidden md:flex items-center justify-between px-6 py-3 sticky top-0 z-40"
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
          className="flex items-center gap-2 select-none"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-primary)" }}
        >
          <span className="text-xl font-bold tracking-tight">FuturesBet</span>
          <span
            className="text-xs font-normal opacity-60 hidden lg:inline"
            style={{ color: "var(--fg-secondary)", fontFamily: "var(--font-body)" }}
          >
            예측 마켓
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-150 text-sm",
                  isActive
                    ? "bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                    : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] hover:bg-[var(--color-primary-bg)]"
                )}
              >
                <span className="font-medium leading-none">{link.labelEn}</span>
                <span
                  className="text-[10px] leading-none mt-0.5 opacity-60"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {link.labelKo}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Theme switcher */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-150 text-sm",
              "border-[var(--border-default)] text-[var(--fg-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--fg-primary)]"
            )}
            aria-label="Switch theme"
          >
            <span>{THEME_EMOJIS[theme]}</span>
            <span className="hidden lg:inline text-xs">Theme</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
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
                  <span className="text-lg">{THEME_EMOJIS[t.id]}</span>
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

          {/* Click-outside overlay */}
          {dropdownOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
          )}
        </div>
      </nav>

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
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--fg-muted)]"
              )}
            >
              <span className="font-medium leading-none">{link.labelEn}</span>
              <span className="text-[9px] mt-0.5 opacity-70">{link.labelKo}</span>
            </Link>
          );
        })}

        {/* Mobile theme button */}
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex flex-col items-center px-3 py-1.5 rounded-lg text-xs"
          style={{ color: "var(--fg-muted)" }}
        >
          <span className="text-base leading-none">{THEME_EMOJIS[theme]}</span>
          <span className="text-[9px] mt-0.5 opacity-70">Theme</span>
        </button>
      </nav>
    </>
  );
}
