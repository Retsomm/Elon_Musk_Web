import { create } from 'zustand';

type Theme = 'autumn' | 'business';

interface ThemeState {
  currentTheme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set, get) => ({
  currentTheme: (localStorage.getItem('theme') as Theme) || 'autumn',
  toggleTheme: () => {
    const newTheme = get().currentTheme === 'autumn' ? 'business' : 'autumn';
    set({ currentTheme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  },
  setTheme: (theme: Theme) => {
    set({ currentTheme: theme });
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}));

// 初始化時同步 DOM 屬性
const theme = (localStorage.getItem('theme') as Theme) || 'autumn';
document.documentElement.setAttribute('data-theme', theme);