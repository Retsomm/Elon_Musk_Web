import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { FC } from "react";

// 自動滾動到頁面頂部的元件
const ScrollToTop: FC = () => {
  // useLocation Hook: 獲取當前路徑資訊
  // pathname: 當前路徑字串，每當路徑改變時會更新
  const { pathname } = useLocation();

  useEffect(() => {
    // 當 pathname 改變時，執行滾動到頂部的操作
    window.scrollTo(0, 0);
  }, [pathname]);

  // 這個元件不需要渲染任何視覺內容
  return null;
};

export default ScrollToTop;