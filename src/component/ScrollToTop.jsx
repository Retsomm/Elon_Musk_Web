import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // 使用 useLocation hook 從 react-router-dom 獲取當前路由資訊
  // useLocation 返回一個包含當前 URL 相關資訊的物件，我們透過解構賦值取出 pathname
  // pathname: 字串類型，代表當前 URL 的路徑部分
  const { pathname } = useLocation();

  // useEffect hook: 處理組件的副作用
  // 參數1: 回調函式，包含要執行的副作用邏輯
  // 參數2: 依賴項陣列，當陣列中的值改變時才會重新執行回調函式
  useEffect(() => {
    // window.scrollTo(): 瀏覽器 API，用於控制視窗捲動位置
    // 參數 (0, 0): x和y座標，將頁面捲動至最頂端
    window.scrollTo(0, 0);
  }, [pathname]); // 當 pathname 變化（路由切換）時，觸發頁面回到頂部

  // 此組件為功能性組件，不渲染任何 UI 元素
  return null;
}