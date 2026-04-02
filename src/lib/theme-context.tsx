"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "casino" | "convenience" | "nightmarket";

export interface ThemeInfo {
  id: Theme;
  nameEn: string;
  nameKo: string;
  descEn: string;
  descKo: string;
}

export const THEMES: ThemeInfo[] = [
  {
    id: "casino",
    nameEn: "Casino Monte Carlo",
    nameKo: "카지노 몬테카를로",
    descEn: "Bet like Bond. 007 vibes.",
    descKo: "본드처럼 베팅하세요",
  },
  {
    id: "convenience",
    nameEn: "Convenience Store",
    nameKo: "편의점",
    descEn: "Your neighborhood prediction shop",
    descKo: "동네 예측 가게",
  },
  {
    id: "nightmarket",
    nameEn: "Night Market",
    nameKo: "야시장",
    descEn: "Seoul after dark. Neon predictions.",
    descKo: "서울의 밤, 네온 예측",
  },
];

const STORAGE_KEY = "futuresbet-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: ThemeInfo[];
  isFirstVisit: boolean;
  dismissFirstVisit: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("casino");
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && (stored === "casino" || stored === "convenience" || stored === "nightmarket")) {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      // No theme in storage → first visit
      setIsFirstVisit(true);
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  const dismissFirstVisit = useCallback(() => {
    setIsFirstVisit(false);
  }, []);

  // Avoid flash: render nothing until we've read localStorage
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{ theme, setTheme, themes: THEMES, isFirstVisit: false, dismissFirstVisit }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, isFirstVisit, dismissFirstVisit }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
