import { useToastStore } from "../store/toastStore";
import { useEffect } from "react";

export default function Toast() {
  // 從 Zustand store 獲取 toasts 陣列與 removeToast 方法
  // toasts: 包含多個 toast 訊息物件的陣列，每個物件有 id, message, type 屬性
  // removeToast: 根據 id 移除特定 toast 的方法
  const { toasts, removeToast } = useToastStore();

  // useEffect hook: 處理 toast 的自動移除邏輯
  // 依賴陣列包含 toasts 和 removeToast，當它們變化時重新執行
  useEffect(() => {
    // 如果沒有 toast，直接返回，不執行後續邏輯
    if (toasts.length === 0) return;

    // 使用 map 方法遍歷 toasts 陣列，為每個 toast 設置定時器
    // 返回一個包含所有計時器 ID 的新陣列
    const timers = toasts.map(
      (toast) => setTimeout(() => removeToast(toast.id), 1500) // 1.5 秒後自動移除 toast
    );

    // 清理函數：當組件卸載或 effect 重新執行前，清除所有定時器
    // 防止記憶體洩漏和過時的 state 更新
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-6 right-6 z-[1001] flex flex-col gap-2 mt-16">
      {/* 使用 map 方法將 toasts 陣列轉換為 JSX 元素陣列 */}
      {toasts.map((toast) => (
        <div
          key={toast.id} // 使用唯一 id 作為 React key 提升渲染效能
          className={`px-4 py-2 rounded shadow-lg animate-fade-in font-bold cursor-pointer ${
            // 條件渲染：根據 toast.type 決定使用不同的樣式類別
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white"
          }`}
          onClick={() => removeToast(toast.id)} // 點擊時移除特定 toast
        >
          {toast.message} {/* 顯示 toast 的訊息內容 */}
        </div>
      ))}
    </div>
  );
}
