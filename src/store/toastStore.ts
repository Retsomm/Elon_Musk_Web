import toast, { Renderable } from 'react-hot-toast';
import type { 
  ToastOptions, 
  PromiseMessages, 
  PromiseToastOptions, 
  ToastStore 
} from '../types/toast';

export const toastStore: ToastStore = {
  // 成功通知
  // message：要顯示的通知訊息內容
  // options：可選的配置選項物件
  success: (message: string, options: ToastOptions = {}): string => {
    // 先清除同類型的舊通知，避免堆積
    if (options.id) {
      toast.dismiss(options.id);
    }
    return toast.success(message, {
      duration: 3000, // 縮短持續時間
      position: 'top-right',
      ...options,
    });
  },

  // 錯誤通知
  error: (message: string, options: ToastOptions = {}): string => {
    if (options.id) {
      toast.dismiss(options.id);
    }
    return toast.error(message, {
      duration: 4000, // 縮短持續時間
      position: 'top-right',
      ...options,
    });
  },

  // 一般信息通知
  info: (message: string, options: ToastOptions = {}): string => {
    if (options.id) {
      toast.dismiss(options.id);
    }
    return toast(message, {
      duration: 3000, // 縮短持續時間
      position: 'top-right',
      icon: 'ℹ️',
      ...options,
    });
  },

  // 警告通知
  warning: (message: string, options: ToastOptions = {}): string => {
    if (options.id) {
      toast.dismiss(options.id);
    }
    return toast(message, {
      duration: 3000, // 縮短持續時間
      position: 'top-right',
      icon: '⚠️',
      ...options,
    });
  },

  // 載入中通知
  loading: (message: string, options: ToastOptions = {}): string => {
    return toast.loading(message, {
      position: 'top-right',
      ...options,
    });
  },

  // Promise 處理通知
  promise: <T>(
    promise: Promise<T>, 
    messages: PromiseMessages, 
    options: PromiseToastOptions = {}
  ): Promise<T> => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || '載入中...',
        success: messages.success || '操作成功！',
        error: messages.error || '操作失敗！',
      },
      {
        position: 'top-right',
        success: { duration: 3000 },
        error: { duration: 4000 },
        ...options,
      }
    );
  },

  // 自定義通知
  custom: (component: Renderable, options: ToastOptions = {}): string => {
    return toast.custom(component, {
      duration: 3000,
      position: 'top-right',
      ...options,
    });
  },

  // 移除指定 toast
  dismiss: (toastId?: string): void => {
    toast.dismiss(toastId);
  },

  // 移除所有 toast
  dismissAll: (): void => {
    toast.dismiss();
  },

  // 新增：快速清除並顯示新訊息
  replaceSuccess: (message: string, id: string = 'success'): string => {
    toast.dismiss(id);
    return toast.success(message, { id, duration: 3000 });
  },

  replaceError: (message: string, id: string = 'error'): string => {
    toast.dismiss(id);
    return toast.error(message, { id, duration: 4000 });
  },
};