import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 自動滾動到頁面頂部的自定義 Hook
export default function ScrollToTop() {
  // useLocation Hook: 獲取當前路徑資訊
  // pathname: 當前路徑字串，每當路徑改變時會更新
  const { pathname } = useLocation();

  useEffect(() => {
    // 當 pathname 改變時，執行滾動到頂部的操作
    window.scrollTo(0, 0);
  }, [pathname]);
}