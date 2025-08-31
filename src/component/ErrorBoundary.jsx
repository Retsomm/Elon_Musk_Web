import React from "react";
import { useToastStore } from "../store/toastStore";

/**
 * 自定義錯誤處理Hook
 * 提供全局統一的錯誤處理機制
 * @returns {Object} 包含handleError方法的物件
 */
export const useErrorHandler = () => {
  // 從toastStore中獲取addToast方法，用於顯示錯誤訊息
  const { addToast } = useToastStore();

  // 使用useCallback封裝handleError函數以避免不必要的重新渲染
  // 只有當addToast依賴變更時才會重建函數
  const handleError = React.useCallback(
    (error, context) => {
      // 在控制台輸出錯誤詳情
      console.error(`${context}:`, error);

      // 使用toast系統顯示錯誤訊息
      // 創建一個包含message和type屬性的toast物件
      addToast({
        message: `${context} 發生錯誤: ${error.message}`,
        type: "error",
      });
    },
    [addToast] // 依賴項：當addToast函數變化時重新建立handleError
  );

  // 返回包含handleError方法的物件，供組件使用
  return { handleError };
};

/**
 * 錯誤邊界組件
 * 捕獲子組件樹中的JavaScript錯誤，記錄並顯示後備UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // 初始化組件狀態
    // hasError: 標記是否捕獲到錯誤
    // error: 存儲捕獲的錯誤物件
    this.state = { hasError: false, error: null };
  }

  /**
   * 靜態方法，當子組件拋出錯誤時觸發
   * 用於更新狀態並觸發重新渲染
   * @param {Error} error - 捕獲到的錯誤物件
   * @returns {Object} 更新後的狀態物件
   */
  static getDerivedStateFromError(error) {
    // 更新狀態，標記有錯誤發生並存儲錯誤資訊
    return { hasError: true, error };
  }

  /**
   * 當捕獲到子組件的錯誤時調用
   * 可用於記錄錯誤信息和來源
   * @param {Error} error - 捕獲到的錯誤物件
   * @param {Object} errorInfo - 包含componentStack等錯誤詳情
   */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary 捕捉到錯誤:", error, errorInfo);

    // 特殊處理：模組動態載入錯誤時自動重新載入頁面
    // 檢查錯誤訊息中是否包含特定字串
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
    // 當發生錯誤時顯示錯誤畫面
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center m-4">
          <h2>哎呀！出了點問題</h2>
          <p>頁面載入時發生錯誤，正在自動重新載入...</p>
          <button
            onClick={() => window.location.reload()}
            className="p-4 text-center m-4 cursor-pointer border-2 rounded-lg "
          >
            手動重新載入
          </button>
        </div>
      );
    }
    // 沒有錯誤時正常渲染子組件
    return this.props.children;
  }
}

export default ErrorBoundary;
