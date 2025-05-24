import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('autumn');

  useEffect(() => {
    // 從 localStorage 載入保存的主題，如果沒有則使用預設值
    const savedTheme = localStorage.getItem('theme') || 'autumn';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'autumn' ? 'business' : 'autumn';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { currentTheme, toggleTheme };
};