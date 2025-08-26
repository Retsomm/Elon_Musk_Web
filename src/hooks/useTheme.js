import { create } from 'zustand';


export const useTheme = create((set, get) => ({
  currentTheme: (localStorage.getItem('theme') ) || 'autumn',
  toggleTheme: () => {
    const newTheme = get().currentTheme === 'autumn' ? 'black' : 'autumn';
    set({ currentTheme: newTheme });
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  },
  setTheme: (theme) => {
    set({ currentTheme: theme });
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}));

// 初始化時同步 DOM 屬性
const theme = (localStorage.getItem('theme') ) || 'autumn';
document.documentElement.setAttribute('data-theme', theme);