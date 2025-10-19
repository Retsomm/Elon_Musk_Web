# Toast Store TypeScript 型別化說明

## 概述

本次更新將原本的 `toastStore.js` 升級為 TypeScript，提供完整的型別安全和更好的開發體驗。

## 主要變更

### 1. 文件結構變更
- `src/store/toastStore.js` → `src/store/toastStore.ts`
- 新增 `src/types/toast.ts` - Toast 專用型別定義
- 更新 `src/types/index.ts` - 統一匯出 Toast 型別

### 2. 新增型別定義

#### 核心型別
```typescript
// Toast 選項介面
interface ToastOptions extends Partial<ReactHotToastOptions> {
  // 完全兼容 react-hot-toast 的選項
}

// Promise Toast 訊息配置
interface PromiseMessages {
  loading?: string;
  success?: string | ((data?: any) => string);
  error?: string | ((error?: any) => string);
}

// Toast Store 介面
interface ToastStore {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  promise: <T>(promise: Promise<T>, messages: PromiseMessages, options?: PromiseToastOptions) => Promise<T>;
  custom: (component: Renderable, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
  replaceSuccess: (message: string, id?: string) => string;
  replaceError: (message: string, id?: string) => string;
}
```

#### 擴展型別
- `ToastInstance` - Toast 實例型別
- `ToastPosition` - Toast 位置型別
- `ToastAnimation` - Toast 動畫型別
- `ExtendedToastOptions` - 擴展的配置選項
- `ToastEventHandlers` - 事件處理器型別
- `ToastConfig` - 全域配置型別

### 3. 型別安全的好處

#### 編譯時檢查
```typescript
// ✅ 正確使用
toastStore.success('操作成功！');
toastStore.error('錯誤訊息', { duration: 5000 });

// ❌ 編譯時會報錯
toastStore.success(); // 缺少必需的 message 參數
toastStore.error('錯誤', { invalidOption: true }); // 無效的選項
```

#### 自動完成和 IntelliSense
- IDE 會提供完整的方法和參數提示
- 參數型別檢查和驗證
- 更好的程式碼導航和重構支援

#### 更好的錯誤訊息
- 明確的型別錯誤提示
- 編譯時發現問題，而非運行時
- 更容易除錯和維護

## 使用方式

### 基本用法（無變更）
```typescript
import { toastStore } from '../store/toastStore';

// 所有現有的使用方式保持不變
toastStore.success('成功訊息');
toastStore.error('錯誤訊息');
```

### 型別化用法
```typescript
import { toastStore } from '../store/toastStore';
import type { ToastOptions, PromiseMessages } from '../types/toast';

// 帶型別的選項
const options: ToastOptions = {
  duration: 5000,
  position: 'top-center',
  id: 'unique-id',
};

toastStore.success('型別安全的訊息', options);

// Promise 處理
const messages: PromiseMessages = {
  loading: '載入中...',
  success: (data) => `成功：${data}`,
  error: (err) => `失敗：${err.message}`,
};

await toastStore.promise(apiCall(), messages);
```

## 向後兼容性

✅ **完全向後兼容** - 所有現有的程式碼無需修改即可正常工作

- 所有現有的 import 語句保持不變
- 所有方法簽名保持相同
- 所有功能行為保持一致

## 開發體驗改進

1. **型別提示** - IDE 提供完整的方法和參數提示
2. **錯誤檢查** - 編譯時發現型別錯誤
3. **自動完成** - 更好的程式碼補全功能
4. **重構安全** - 重命名和修改時的型別保護
5. **文檔生成** - 型別定義本身就是最好的文檔

## 範例文件

查看 `src/store/toastStore.examples.ts` 了解更多使用範例和最佳實踐。

## 注意事項

1. 自定義 React 組件通知需要在 React 組件環境中使用
2. 所有型別定義都基於 `react-hot-toast` 的官方型別
3. 擴展的型別提供了更多客製化選項，但核心功能保持簡潔

## 未來擴展

這個型別系統為未來的功能擴展提供了良好的基礎：
- 主題配置型別化
- 自定義動畫型別
- 更多事件處理器
- 批量操作型別安全