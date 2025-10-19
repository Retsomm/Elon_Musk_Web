import { Toaster } from "react-hot-toast";
import { FC } from "react";

// Toast 位置選項
type ToastPosition = 
  | "top-left" 
  | "top-center" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-center" 
  | "bottom-right";

// Toast 樣式配置
interface ToastStyleConfig {
  background: string;
  color: string;
}

// Toast 選項配置
interface ToastOptionsConfig {
  className: string;
  duration: number;
  style: ToastStyleConfig;
  success: {
    duration: number;
    style: ToastStyleConfig;
  };
  error: {
    duration: number;
    style: ToastStyleConfig;
  };
  loading: {
    duration: number;
    style: ToastStyleConfig;
  };
}

// Toast 容器組件的型別定義
interface ToastProps {}

// Toast 容器組件
// 使用 react-hot-toast 的 Toaster 組件來顯示所有 toast
const Toast: FC<ToastProps> = () => {


  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{
        top: "88px", // 考慮到 header 高度，調整位置
      }}
      toastOptions={{
        // 全局默認設定
        className: "",
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        // 成功通知樣式
        success: {
          duration: 3000,
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        },
        // 錯誤通知樣式
        error: {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "#fff",
          },
        },
        // 載入中 toast 樣式
        loading: {
          duration: Infinity, // 載入中的 toast 應該手動關閉
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
        },
      }}
    />
  );
};

export default Toast;
export type { 
  ToastProps, 
  ToastPosition, 
  ToastStyleConfig, 
  ToastOptionsConfig 
};
