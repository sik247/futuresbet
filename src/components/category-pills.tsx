"use client";

import { useRef } from "react";

interface Category {
  value: string;
  label: string;
}

interface CategoryPillsProps {
  categories: Category[];
  active: string;
  onChange: (value: string) => void;
}

export function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scroll("left")}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
        aria-label="Scroll left"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`category-pill ${active === cat.value ? "category-pill-active" : "category-pill-inactive"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", color: "var(--fg-muted)" }}
        aria-label="Scroll right"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
