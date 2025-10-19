# TypeScript 型別系統說明

這個專案已經新增了完整的 TypeScript 型別系統，提供強大的型別安全和開發體驗。

## 📁 型別文件結構

```
src/types/
├── index.ts          # 統一導出所有型別
├── common.ts         # 通用型別定義
├── firebase.ts       # Firebase 相關型別
├── hooks.ts          # 自定義 Hook 型別
├── favorites.ts      # 收藏功能型別
├── news.ts          # 新聞相關型別
├── timeline.ts      # 時間軸相關型別
├── data.ts          # 資料模型型別
└── firebase.d.ts    # Firebase 模組聲明
```

## 🔧 新增的主要型別類別

### 1. Firebase 相關型別
```typescript
// Firebase 使用者型別
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

// Firebase 錯誤型別
interface FirebaseError {
  code: string;
  message: string;
  name: 'FirebaseError';
}

// 登入憑證型別
interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

### 2. Hook 型別
```typescript
// 基礎 Hook 返回型別
interface BaseHookReturn {
  loading: boolean;
  error: Error | FirebaseError | null;
}

// Firebase 使用者 ID Hook 型別
interface UseFirebaseUserIdReturn {
  userId: string | null;
  loading: boolean;
  error: FirebaseError | null;
}

// 認證 Hook 型別
interface UseAuthReturn extends BaseHookReturn {
  user: FirebaseUser | null;
  userId: string | null;
  isAuthenticated: boolean;
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}
```

### 3. 資料庫相關型別
```typescript
// 資料庫值監聽 Hook 型別
interface UseDatabaseValueReturn<T = any> extends BaseHookReturn {
  data: T | null;
  snapshot: DatabaseSnapshot<T> | null;
  exists: boolean;
  key: string | null;
  setValue: (value: T) => Promise<void>;
  updateValue: (updates: Partial<T>) => Promise<void>;
  deleteValue: () => Promise<void>;
  refresh: () => void;
}
```

## 🚀 使用方式

### 1. 導入型別
```typescript
// 從統一導出文件導入
import type {
  FirebaseUser,
  UseFirebaseUserIdReturn,
  UseAuthReturn,
  ToastMessage
} from './types';

// 或從特定文件導入
import type { FirebaseError } from './types/firebase';
import type { UseFormReturn } from './types/hooks';
```

### 2. 在 Hook 中使用
```typescript
// 已更新的 useFirebaseUserId Hook
export const useFirebaseUserId = (): UseFirebaseUserIdReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirebaseError | null>(null);
  
  // ... Hook 邏輯
  
  return {
    userId,
    loading,
    error
  };
};
```

### 3. 在組件中使用
```typescript
import { useFirebaseUserId } from '../hooks/useFirebaseUserId';
import type { UseFirebaseUserIdReturn } from '../types';

const UserComponent: React.FC = () => {
  const { userId, loading, error }: UseFirebaseUserIdReturn = useFirebaseUserId();
  
  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;
  if (!userId) return <div>請先登入</div>;
  
  return <div>使用者 ID: {userId}</div>;
};
```

## ✨ 主要改進

1. **型別安全**: 所有 Hook 和函數都有完整的型別定義
2. **更好的開發體驗**: IDE 自動完成和錯誤檢查
3. **統一的型別管理**: 透過 `index.ts` 統一導出
4. **模組化設計**: 按功能分類型別定義
5. **擴展性**: 易於新增和修改型別

## 📋 已更新的文件

- ✅ `src/types/index.ts` - 新增所有型別導出
- ✅ `src/types/common.ts` - 新增 Firebase 使用者和通用型別
- ✅ `src/types/firebase.ts` - 完整的 Firebase 型別定義
- ✅ `src/types/hooks.ts` - 所有 Hook 相關型別
- ✅ `src/hooks/useFirebaseUserId.tsx` - 更新使用新型別

## 🔄 建議的後續步驟

1. 更新其他 Hook 文件以使用新型別
2. 在組件中逐步採用型別定義
3. 為表單和 API 調用添加型別
4. 實現型別守衛 (Type Guards) 函數
5. 添加更多工具型別 (Utility Types)

這個型別系統為整個專案提供了強大的型別安全保障，讓開發更加高效和可靠！