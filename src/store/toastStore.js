// 使用 Zustand 管理 Toast 通知的狀態管理庫
import { create } from 'zustand';

// 創建 Toast 狀態管理 store
// Zustand 是一個輕量級的狀態管理庫，使用 hooks 模式管理全局狀態
export const useToastStore = create((set) => ({
  // 狀態定義區
  toasts: [], // 存儲所有 toast 通知的陣列

  // 方法定義區
  // 添加新的 toast 通知
  // @param {Object} toast - 要添加的 toast 物件
  addToast: (toast) =>
    set((state) => ({
      // 使用展開運算符創建新陣列，保持不可變性原則
      // 將現有的 toasts 陣列與新的 toast 物件合併
      // 為每個新 toast 自動生成唯一 ID (使用時間戳)
      toasts: [...state.toasts, { id: Date.now(), ...toast }],
    })),

  // 根據 ID 移除指定的 toast 通知
  // @param {Number} id - 要移除的 toast 的唯一識別碼
  removeToast: (id) =>
    set((state) => ({
      // 使用 filter 方法創建新陣列，僅保留 ID 不匹配的 toast
      // 這是一種不修改原陣列的過濾操作
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // 清空所有 toast 通知
  // 直接將 toasts 重置為空陣列
  clearToasts: () => set({ toasts: [] }),
}));