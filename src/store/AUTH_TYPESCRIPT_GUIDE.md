# AuthStore TypeScript 使用指南

此文件展示如何使用已經轉換為 TypeScript 的 `authStore`。

## 型別定義

### 主要型別

```typescript
// 登入類型
type LoginType = 'email' | 'google';

// 應用程式用戶介面
interface AppUser {
  email: string;
  name: string;
  photoURL?: string | null;
  displayName: string;
  uid: string;
}

// 認證狀態
interface AuthState {
  user: AppUser | null;
  loginType: LoginType | null;
  loading: boolean;
}
```

## 使用範例

### 1. 在 React 組件中使用

```typescript
import { authStore } from '../store/authStore';
import type { AppUser } from '../types/auth';

function MyComponent() {
  // 取得認證狀態
  const { user, loading, loginType } = authStore();
  
  // 取得認證方法
  const { login, logout, loginWithGoogle, register, updateUserName } = authStore();
  
  if (loading) {
    return <div>載入中...</div>;
  }
  
  if (!user) {
    return <div>請先登入</div>;
  }
  
  return (
    <div>
      <h1>歡迎，{user.name}!</h1>
      <p>電子郵件：{user.email}</p>
      <p>登入方式：{loginType}</p>
    </div>
  );
}
```

### 2. 認證操作

```typescript
import { authStore } from '../store/authStore';

// 取得 store 的狀態和方法
const store = authStore.getState();

try {
  // 電子郵件登入
  await store.login('user@example.com', 'password');
  
  // Google 登入
  await store.loginWithGoogle();
  
  // 註冊新帳號
  await store.register('newuser@example.com', 'password');
  
  // 更新用戶名稱
  const success = await store.updateUserName('新名稱');
  
  // 登出
  await store.logout();
} catch (error) {
  console.error('認證操作失敗:', error);
}
```

### 3. 型別安全的狀態檢查

```typescript
import { authStore } from '../store/authStore';
import type { AppUser, LoginType } from '../types/auth';

function handleUserAction() {
  const { user, loginType } = authStore.getState();
  
  // TypeScript 會確保型別安全
  if (user) {
    // 在這裡 TypeScript 知道 user 不是 null
    console.log(`用戶 ${user.name} 透過 ${loginType} 登入`);
    
    // 所有用戶屬性都有完整的型別檢查
    const userInfo: AppUser = {
      email: user.email,      // string
      name: user.name,        // string
      photoURL: user.photoURL, // string | null | undefined
      displayName: user.displayName, // string
      uid: user.uid          // string
    };
  }
}
```

### 4. 自定義 Hook（建議模式）

```typescript
import { useEffect, useState } from 'react';
import { authStore } from '../store/authStore';
import type { AppUser, LoginType } from '../types/auth';

// 創建一個自定義 Hook 來使用 authStore
export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginType, setLoginType] = useState<LoginType | null>(null);
  
  useEffect(() => {
    const unsubscribe = authStore.subscribe((state) => {
      setUser(state.user);
      setLoading(state.loading);
      setLoginType(state.loginType);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    user,
    loading,
    loginType,
    // 認證方法
    login: authStore.getState().login,
    logout: authStore.getState().logout,
    loginWithGoogle: authStore.getState().loginWithGoogle,
    register: authStore.getState().register,
    updateUserName: authStore.getState().updateUserName,
  };
}
```

## 型別優勢

1. **編譯時錯誤檢查**：TypeScript 會在編譯時捕獲型別錯誤
2. **智能提示**：IDE 提供完整的自動完成和智能提示
3. **重構安全**：更改型別定義時，所有相關使用會被檢查
4. **文檔化**：型別定義本身就是最好的文檔
5. **團隊協作**：統一的型別定義確保團隊成員使用一致的介面

## 注意事項

- 所有的認證操作都是異步的，記得使用 `async/await` 或 `.then()`
- Firebase 認證狀態變化是自動監聽的，不需要手動調用
- 更新用戶名稱會同時更新 Firebase Auth 和 Realtime Database
- 錯誤處理應該包裝在 try-catch 區塊中