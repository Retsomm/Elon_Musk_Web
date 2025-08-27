import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 更新狀態，顯示錯誤 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary 捕捉到錯誤:", error, errorInfo);

    // 如果是模組載入錯誤，自動重新載入
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  render() {
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

    return this.props.children;
  }
}

export default ErrorBoundary;
