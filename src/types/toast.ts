// Toast 相關類型定義
import { ReactNode } from 'react';
import { 
  Toast as ReactHotToast, 
  ToastOptions as ReactHotToastOptions, 
  Renderable 
} from 'react-hot-toast';

// Toast 選項介面（基於 react-hot-toast 的選項）
export interface ToastOptions extends Partial<ReactHotToastOptions> {
  // 可以添加自定義選項
}

// Promise Toast 訊息配置
export interface PromiseMessages {
  loading?: string;
  success?: string | ((data?: any) => string);
  error?: string | ((error?: any) => string);
}

// Promise Toast 選項
export interface PromiseToastOptions extends ToastOptions {
  success?: ToastOptions;
  error?: ToastOptions;
  loading?: ToastOptions;
}

// Toast Store 的方法型別
export interface ToastStore {
  // 基本通知方法
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  
  // Promise 處理
  promise: <T>(
    promise: Promise<T>, 
    messages: PromiseMessages, 
    options?: PromiseToastOptions
  ) => Promise<T>;
  
  // 自定義通知
  custom: (component: Renderable, options?: ToastOptions) => string;
  
  // 移除方法
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
  
  // 快速替換方法
  replaceSuccess: (message: string, id?: string) => string;
  replaceError: (message: string, id?: string) => string;
}

// Toast 實例型別（來自 react-hot-toast）
export type ToastInstance = ReactHotToast;

// Toast 狀態型別
export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';

// Toast 位置型別
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

// Toast 動畫型別
export type ToastAnimation = 'fade' | 'slide' | 'zoom' | 'flip';

// 擴展的 Toast 配置選項
export interface ExtendedToastOptions extends ToastOptions {
  // 自定義動畫
  animation?: ToastAnimation;
  // 是否可點擊關閉
  dismissible?: boolean;
  // 自動關閉延遲（毫秒）
  autoClose?: number;
  // 暫停自動關閉（當滑鼠懸停時）
  pauseOnHover?: boolean;
  // 暫停自動關閉（當視窗失去焦點時）
  pauseOnFocusLoss?: boolean;
  // 關閉按鈕
  closeButton?: boolean | ReactNode;
  // 進度條
  hideProgressBar?: boolean;
  // 點擊關閉
  closeOnClick?: boolean;
  // 拖拽關閉
  draggable?: boolean;
  // 拖拽百分比閾值
  draggablePercent?: number;
}

// Toast 事件處理器型別
export interface ToastEventHandlers {
  onOpen?: (toast: ToastInstance) => void;
  onClose?: (toast: ToastInstance) => void;
  onClick?: (toast: ToastInstance) => void;
  onMouseEnter?: (toast: ToastInstance) => void;
  onMouseLeave?: (toast: ToastInstance) => void;
}

// Toast 配置型別
export interface ToastConfig {
  // 全域預設選項
  default?: ToastOptions;
  // 各類型的預設選項
  success?: ToastOptions;
  error?: ToastOptions;
  info?: ToastOptions;
  warning?: ToastOptions;
  loading?: ToastOptions;
  // 最大顯示數量
  maxToasts?: number;
  // 容器類名
  containerClassName?: string;
  // 容器樣式
  containerStyle?: React.CSSProperties;
}