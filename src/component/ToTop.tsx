import { useEffect, useState, FC, MouseEventHandler } from "react";
import { ArrowUpFromLine } from "lucide-react";

// ToTop 組件的 Props 型別定義
interface ToTopProps {
  /** 顯示按鈕的滾動閾值，預設為 100px */
  showThreshold?: number;
}

// 滾動事件處理函數的型別定義
type ScrollEventHandler = (ev?: Event) => void;

// 點擊事件處理函數的型別定義
type ClickEventHandler = MouseEventHandler<HTMLButtonElement>;

// 滾動狀態配置的型別定義
interface ScrollConfig {
  showThreshold: number; // 顯示按鈕的滾動閾值
}

const ToTop: FC<ToTopProps> = ({ 
  showThreshold = 100
}) => {
  // useState hook: 創建狀態變數 show 來控制按鈕的顯示與隱藏
  // 初始值為 false，表示頁面載入時按鈕不顯示
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 處理滾動事件的函數，決定是否顯示「回到頂部」按鈕
    const handleScroll: ScrollEventHandler = (ev?: Event) => {
      // 取得目前垂直滾動位置 (兼容不同瀏覽器)
      const scrollY = window.scrollY || window.pageYOffset;

      // 取得視窗高度
      const windowHeight = window.innerHeight;

      // 取得整個文檔的高度
      const docHeight = document.documentElement.scrollHeight;

      // 設置顯示條件：
      // 1. 文檔高度必須大於視窗高度 (確保頁面有可滾動內容)
      // 2. 滾動位置必須大於設定的閾值 (用戶已經向下滾動一定距離)
      setShow(docHeight > windowHeight && scrollY > showThreshold);
    };

    // 註冊事件監聽器，當滾動或調整視窗大小時執行 handleScroll
    window.addEventListener("scroll", handleScroll);

    // 初始檢查是否應該顯示按鈕
    handleScroll();

    // 清理函數：組件卸載時移除事件監聽器，防止記憶體洩漏
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showThreshold]); // 當 showThreshold 改變時重新執行 effect

  // 條件渲染：如果 show 為 false，則不渲染任何內容
  if (!show) return null;

  // 點擊事件處理函數
  const handleClick: ClickEventHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 當 show 為 true 時渲染「回到頂部」按鈕
  return (
    <button
      // 點擊事件處理：使用平滑滾動回到頁面頂部
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 bg-red-900 hover:bg-red-800 text-white rounded-full p-3 shadow-lg transition"
      aria-label="回到頂部"
    >
      <ArrowUpFromLine className="w-6 h-6" />
    </button>
  );
};

export default ToTop;
export type { 
  ToTopProps, 
  ScrollEventHandler, 
  ClickEventHandler,
  ScrollConfig 
};
