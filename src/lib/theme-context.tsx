"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme =
  | "casino"
  | "convenience"
  | "nightmarket"
  | "cyberpunk"
  | "vaporwave"
  | "arcade"
  | "kpop"
  | "anime"
  | "ocean"
  | "sakura"
  | "jungle"
  | "space"
  | "desert"
  | "arctic"
  | "sunset"
  | "hacker"
  | "bubblegum"
  | "steampunk"
  | "hongdae"
  | "hanok";

export interface ThemeInfo {
  id: Theme;
  nameEn: string;
  nameKo: string;
  descEn: string;
  descKo: string;
  emoji: string;
  mode: "dark" | "light";
  category: "korean" | "scifi" | "nature" | "popculture";
  yesLabel: string;
  noLabel: string;
  cardClass: string;
  heroClass: string;
  previewColors: [string, string, string];
}

export const THEMES: ThemeInfo[] = [
  {
    id: "casino",
    nameEn: "Casino Monte Carlo",
    nameKo: "카지노 몬테카를로",
    descEn: "Bet like Bond. 007 vibes.",
    descKo: "본드처럼 베팅하세요",
    emoji: "🎰",
    mode: "dark",
    category: "korean",
    yesLabel: "Bet",
    noLabel: "Fold",
    cardClass: "",
    heroClass: "casino-border-shimmer",
    previewColors: ["#0a0a0a", "#d4af37", "#2d5a3f"],
  },
  {
    id: "convenience",
    nameEn: "Convenience Store",
    nameKo: "편의점",
    descEn: "Your neighborhood prediction shop",
    descKo: "동네 예측 가게",
    emoji: "🏪",
    mode: "light",
    category: "korean",
    yesLabel: "사요",
    noLabel: "안사요",
    cardClass: "convenience-accent-bar",
    heroClass: "convenience-accent-bar",
    previewColors: ["#f5f7ff", "#0066ff", "#ff6b35"],
  },
  {
    id: "nightmarket",
    nameEn: "Night Market",
    nameKo: "야시장",
    descEn: "Seoul after dark. Neon predictions.",
    descKo: "서울의 밤, 네온 예측",
    emoji: "🏮",
    mode: "dark",
    category: "korean",
    yesLabel: "맛있다!",
    noLabel: "별로...",
    cardClass: "",
    heroClass: "neon-glow",
    previewColors: ["#0f0f0f", "#f59e0b", "#ec4899"],
  },
  {
    id: "cyberpunk",
    nameEn: "Cyberpunk Seoul",
    nameKo: "사이버펑크 서울",
    descEn: "Neon Seoul's future",
    descKo: "네온 서울의 미래",
    emoji: "🤖",
    mode: "dark",
    category: "scifi",
    yesLabel: "Jack In",
    noLabel: "Unplug",
    cardClass: "cyberpunk-glitch",
    heroClass: "cyberpunk-glitch",
    previewColors: ["#0a0010", "#8b5cf6", "#06ffa5"],
  },
  {
    id: "vaporwave",
    nameEn: "Vaporwave",
    nameKo: "베이퍼웨이브",
    descEn: "World of retro aesthetics",
    descKo: "레트로 미학의 세계",
    emoji: "🌴",
    mode: "dark",
    category: "popculture",
    yesLabel: "Aesthetic",
    noLabel: "Cringe",
    cardClass: "vaporwave-gradient",
    heroClass: "vaporwave-gradient",
    previewColors: ["#1a0a2e", "#ff71ce", "#01cdfe"],
  },
  {
    id: "arcade",
    nameEn: "Retro Arcade",
    nameKo: "레트로 오락실",
    descEn: "Please insert coin",
    descKo: "동전을 넣어주세요",
    emoji: "👾",
    mode: "dark",
    category: "scifi",
    yesLabel: "INSERT COIN",
    noLabel: "GAME OVER",
    cardClass: "arcade-scanlines",
    heroClass: "arcade-scanlines",
    previewColors: ["#000000", "#39ff14", "#ff00ff"],
  },
  {
    id: "kpop",
    nameEn: "K-Pop Stage",
    nameKo: "케이팝 스테이지",
    descEn: "Predictions on the stage",
    descKo: "무대 위의 예측",
    emoji: "💜",
    mode: "dark",
    category: "korean",
    yesLabel: "좋아요",
    noLabel: "싫어요",
    cardClass: "kpop-sparkle",
    heroClass: "kpop-sparkle",
    previewColors: ["#0f0515", "#c084fc", "#fb7185"],
  },
  {
    id: "anime",
    nameEn: "Anime Arena",
    nameKo: "애니메 아레나",
    descEn: "Manga battle predictions",
    descKo: "만화 속 배틀",
    emoji: "⚔️",
    mode: "light",
    category: "popculture",
    yesLabel: "YOSH!",
    noLabel: "DAME!",
    cardClass: "anime-speed-lines",
    heroClass: "anime-speed-lines",
    previewColors: ["#fffbf5", "#ef4444", "#3b82f6"],
  },
  {
    id: "ocean",
    nameEn: "Deep Sea Expedition",
    nameKo: "심해 탐험",
    descEn: "Mystery of the deep sea",
    descKo: "깊은 바다의 신비",
    emoji: "🌊",
    mode: "dark",
    category: "nature",
    yesLabel: "Dive In",
    noLabel: "Surface",
    cardClass: "ocean-wave",
    heroClass: "ocean-wave",
    previewColors: ["#021526", "#0ea5e9", "#2dd4bf"],
  },
  {
    id: "sakura",
    nameEn: "Cherry Blossom Garden",
    nameKo: "벚꽃 정원",
    descEn: "Spring predictions",
    descKo: "봄날의 예측",
    emoji: "🌸",
    mode: "light",
    category: "nature",
    yesLabel: "咲く",
    noLabel: "散る",
    cardClass: "sakura-glow",
    heroClass: "sakura-glow",
    previewColors: ["#fef7fb", "#ec4899", "#a78bfa"],
  },
  {
    id: "jungle",
    nameEn: "Jungle Expedition",
    nameKo: "정글 탐험",
    descEn: "Law of the jungle",
    descKo: "정글의 법칙",
    emoji: "🌿",
    mode: "dark",
    category: "nature",
    yesLabel: "Explore",
    noLabel: "Retreat",
    cardClass: "jungle-vines",
    heroClass: "jungle-vines",
    previewColors: ["#0a1a0a", "#22c55e", "#a16207"],
  },
  {
    id: "space",
    nameEn: "Space Station",
    nameKo: "우주 정거장",
    descEn: "Galactic prediction market",
    descKo: "은하계 예측 시장",
    emoji: "🚀",
    mode: "dark",
    category: "scifi",
    yesLabel: "Launch",
    noLabel: "Abort",
    cardClass: "space-stars",
    heroClass: "space-stars",
    previewColors: ["#030014", "#818cf8", "#f472b6"],
  },
  {
    id: "desert",
    nameEn: "Desert Oasis",
    nameKo: "사막 오아시스",
    descEn: "Gem in the sand",
    descKo: "모래 속의 보석",
    emoji: "🏜️",
    mode: "light",
    category: "nature",
    yesLabel: "Oasis",
    noLabel: "Mirage",
    cardClass: "desert-sand",
    heroClass: "desert-sand",
    previewColors: ["#fef9f0", "#d97706", "#dc2626"],
  },
  {
    id: "arctic",
    nameEn: "Arctic Ice",
    nameKo: "북극 얼음",
    descEn: "Predictions on the ice",
    descKo: "얼음 위의 예측",
    emoji: "❄️",
    mode: "light",
    category: "nature",
    yesLabel: "Freeze",
    noLabel: "Thaw",
    cardClass: "arctic-frost",
    heroClass: "arctic-frost",
    previewColors: ["#f0f9ff", "#38bdf8", "#e2e8f0"],
  },
  {
    id: "sunset",
    nameEn: "Sunset Beach",
    nameKo: "석양 해변",
    descEn: "Trading under the glow",
    descKo: "노을 아래의 거래",
    emoji: "🌅",
    mode: "dark",
    category: "nature",
    yesLabel: "Chill",
    noLabel: "Pass",
    cardClass: "sunset-gradient",
    heroClass: "sunset-gradient",
    previewColors: ["#0f0a1a", "#f97316", "#a855f7"],
  },
  {
    id: "hacker",
    nameEn: "Hacker Terminal",
    nameKo: "해커 터미널",
    descEn: "Predict with code",
    descKo: "코드로 예측하다",
    emoji: "💻",
    mode: "dark",
    category: "scifi",
    yesLabel: "sudo yes",
    noLabel: "exit 0",
    cardClass: "hacker-matrix",
    heroClass: "hacker-matrix",
    previewColors: ["#000000", "#22c55e", "#facc15"],
  },
  {
    id: "bubblegum",
    nameEn: "Bubblegum Pop",
    nameKo: "버블검 팝",
    descEn: "Sweet predictions",
    descKo: "달콤한 예측",
    emoji: "🍬",
    mode: "light",
    category: "popculture",
    yesLabel: "Yummy!",
    noLabel: "Icky!",
    cardClass: "bubblegum-bounce",
    heroClass: "bubblegum-bounce",
    previewColors: ["#fef5f9", "#f472b6", "#60a5fa"],
  },
  {
    id: "steampunk",
    nameEn: "Steampunk Lab",
    nameKo: "스팀펑크 연구소",
    descEn: "Predictions of the steam engine",
    descKo: "증기 기관의 예측",
    emoji: "⚙️",
    mode: "dark",
    category: "popculture",
    yesLabel: "Engage",
    noLabel: "Disengage",
    cardClass: "steampunk-brass",
    heroClass: "steampunk-brass",
    previewColors: ["#1a1408", "#b45309", "#78716c"],
  },
  {
    id: "hongdae",
    nameEn: "Hongdae Street",
    nameKo: "홍대 거리",
    descEn: "Free predictions",
    descKo: "자유로운 예측",
    emoji: "🎨",
    mode: "dark",
    category: "korean",
    yesLabel: "대박!",
    noLabel: "노잼",
    cardClass: "hongdae-paint",
    heroClass: "hongdae-paint",
    previewColors: ["#0f0f0f", "#f43f5e", "#14b8a6"],
  },
  {
    id: "hanok",
    nameEn: "Hanok Village",
    nameKo: "한옥 마을",
    descEn: "Traditional wisdom",
    descKo: "전통의 지혜",
    emoji: "🏛️",
    mode: "light",
    category: "korean",
    yesLabel: "예",
    noLabel: "아니오",
    cardClass: "hanok-wood",
    heroClass: "hanok-wood",
    previewColors: ["#fdf8f0", "#92400e", "#1e3a5f"],
  },
];

const ALL_THEME_IDS = THEMES.map((t) => t.id);

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
    if (stored && (ALL_THEME_IDS as string[]).includes(stored)) {
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
