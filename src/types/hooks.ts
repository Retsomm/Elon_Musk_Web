// 自定義 Hook 相關類型定義

import type { FirebaseUser } from './common';
import type { FirebaseError, DatabaseSnapshot } from './firebase';

// 基礎 Hook 返回類型
export interface BaseHookReturn {
  loading: boolean;
  error: Error | FirebaseError | null;
}

// 認證狀態枚舉
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// useFirebaseUserId Hook 返回類型
export interface UseFirebaseUserIdReturn {
  userId: string | null;
  loading: boolean;
  error: FirebaseError | null;
}

// 擴展版的 Firebase 用戶 ID Hook 返回類型
export interface UseFirebaseUserIdExtendedReturn extends UseFirebaseUserIdReturn {
  user: FirebaseUser | null;
  authState: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 認證 Hook 返回類型
export interface UseAuthReturn extends BaseHookReturn {
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

// 資料庫值監聽 Hook 返回類型
export interface UseDatabaseValueReturn<T = any> extends BaseHookReturn {
  data: T | null;
  snapshot: DatabaseSnapshot<T> | null;
  exists: boolean;
  key: string | null;
  setValue: (value: T) => Promise<void>;
  updateValue: (updates: Partial<T>) => Promise<void>;
  deleteValue: () => Promise<void>;
  refresh: () => void;
}

// 資料庫列表監聽 Hook 返回類型
export interface UseDatabaseListReturn<T = any> extends BaseHookReturn {
  data: T[];
  snapshots: DatabaseSnapshot<T>[];
  isEmpty: boolean;
  count: number;
  addItem: (item: T) => Promise<string>;
  updateItem: (key: string, updates: Partial<T>) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  refresh: () => void;
}

// Hook 配置選項類型
export interface HookOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: boolean | number;
  retryDelay?: number;
  staleTime?: number;
  cacheTime?: number;
}

// 認證 Hook 配置選項
export interface AuthHookOptions extends HookOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onAuthChange?: (user: FirebaseUser | null) => void;
  onError?: (error: FirebaseError) => void;
}

// 資料庫 Hook 配置選項
export interface DatabaseHookOptions extends HookOptions {
  path: string;
  orderBy?: string;
  limitToFirst?: number;
  limitToLast?: number;
  startAt?: any;
  endAt?: any;
  equalTo?: any;
  onDataChange?: (data: any) => void;
  onError?: (error: FirebaseError) => void;
}

// 本地儲存 Hook 返回類型
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  loading: boolean;
  error: Error | null;
}

// 異步操作 Hook 返回類型
export interface UseAsyncReturn<T, P extends any[] = any[]> extends BaseHookReturn {
  data: T | null;
  execute: (...params: P) => Promise<T>;
  reset: () => void;
  status: 'idle' | 'loading' | 'success' | 'error';
}

// 表單 Hook 返回類型
export interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (event: React.FormEvent) => Promise<void>;
  reset: () => void;
  validate: () => boolean;
}

// 無限滾動 Hook 返回類型
export interface UseInfiniteScrollReturn<T> extends BaseHookReturn {
  data: T[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

// 搜索 Hook 返回類型
export interface UseSearchReturn<T> extends BaseHookReturn {
  results: T[];
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  hasResults: boolean;
  totalCount: number;
  search: (query: string) => Promise<void>;
  clear: () => void;
}