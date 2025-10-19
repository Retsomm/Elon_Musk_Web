// Toast Store 使用範例
// 此文件展示如何使用型別化的 toastStore

import { toastStore } from './toastStore';
import type { ToastOptions, PromiseMessages } from '../types/toast';

// 基本使用範例
export const toastExamples = {
  // 1. 基本通知
  showBasicToasts: () => {
    toastStore.success('操作成功！');
    toastStore.error('發生錯誤！');
    toastStore.info('這是一個信息');
    toastStore.warning('警告訊息');
  },

  // 2. 帶選項的通知
  showToastsWithOptions: () => {
    const options: ToastOptions = {
      duration: 5000,
      position: 'bottom-center',
      id: 'custom-toast',
    };
    
    toastStore.success('自定義設置的成功通知', options);
  },

  // 3. Loading toast
  showLoadingToast: () => {
    const loadingToastId = toastStore.loading('正在處理...');
    
    // 模擬異步操作
    setTimeout(() => {
      toastStore.dismiss(loadingToastId);
      toastStore.success('處理完成！');
    }, 3000);
  },

  // 4. Promise toast
  showPromiseToast: async () => {
    const simulateApiCall = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve('API 調用成功');
          } else {
            reject(new Error('API 調用失敗'));
          }
        }, 2000);
      });
    };

    const messages: PromiseMessages = {
      loading: '正在調用 API...',
      success: (data) => `成功：${data}`,
      error: (error) => `錯誤：${error.message}`,
    };

    try {
      const result = await toastStore.promise(simulateApiCall(), messages);
      console.log('API 結果：', result);
    } catch (error) {
      console.error('API 錯誤：', error);
    }
  },

  // 5. 快速替換通知
  showReplaceToasts: () => {
    // 這些會替換掉相同 id 的舊通知
    toastStore.replaceSuccess('第一個成功訊息', 'success-msg');
    
    setTimeout(() => {
      toastStore.replaceSuccess('更新的成功訊息', 'success-msg');
    }, 1000);
  },

  // 6. 自定義 React 組件通知（需要在 React 組件中使用）
  showCustomToast: () => {
    // 注意：這個範例需要在 React 組件中實作
    // 因為 JSX 需要 React 環境
    console.log('請在 React 組件中使用 toastStore.custom() 方法');
    
    // 簡單的字串通知作為替代
    toastStore.info('這是一個自定義樣式的通知', {
      duration: 4000,
      style: {
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px',
        padding: '16px',
      },
    });
  },

  // 7. 批量清除通知
  clearAllToasts: () => {
    toastStore.dismissAll();
  },
};

// 型別安全的配置物件範例
export const toastConfig: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
  },
};

// 預設訊息配置
export const defaultMessages = {
  success: {
    save: '儲存成功！',
    delete: '刪除成功！',
    update: '更新成功！',
    create: '創建成功！',
  },
  error: {
    network: '網路連線錯誤，請稍後再試',
    unauthorized: '您沒有權限執行此操作',
    validation: '輸入資料格式不正確',
    server: '伺服器錯誤，請聯繫管理員',
  },
  loading: {
    save: '正在儲存...',
    delete: '正在刪除...',
    load: '正在載入...',
    process: '正在處理...',
  },
} as const;

// 工具函數：顯示標準化的操作結果通知
export const showOperationResult = (
  operation: 'save' | 'delete' | 'update' | 'create',
  success: boolean,
  customMessage?: string
) => {
  if (success) {
    const message = customMessage || defaultMessages.success[operation];
    toastStore.success(message);
  } else {
    const message = customMessage || '操作失敗，請稍後再試';
    toastStore.error(message);
  }
};