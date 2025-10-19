// 認證相關的 TypeScript 型別定義

import type { User as FirebaseUser } from 'firebase/auth';

/**
 * 登入類型枚舉
 */
export type LoginType = 'email' | 'google';

/**
 * 應用程式用戶介面 - 包含從 Firebase 和本地狀態的用戶資訊
 */
export interface AppUser {
  /** 用戶電子郵件地址 */
  email: string;
  /** 用戶顯示名稱 */
  name: string;
  /** 用戶頭像 URL（主要來自 Google 登入） */
  photoURL?: string | null;
  /** 用戶顯示名稱（與 name 相同，為了兼容性） */
  displayName: string;
  /** Firebase 用戶唯一識別碼 */
  uid: string;
}

/**
 * 認證狀態介面
 */
export interface AuthState {
  /** 當前登入的用戶，未登入時為 null */
  user: AppUser | null;
  /** 登入方式類型 */
  loginType: LoginType | null;
  /** 載入狀態，初始檢查認證狀態時為 true */
  loading: boolean;
}

/**
 * 認證相關的動作介面
 */
export interface AuthActions {
  /** 設置用戶狀態 */
  setUser: (user: AppUser | null) => void;
  /** 設置登入類型 */
  setLoginType: (type: LoginType | null) => void;
  /** 設置載入狀態 */
  setLoading: (loading: boolean) => void;
  /** 使用電子郵件和密碼註冊新帳號 */
  register: (email: string, password: string) => Promise<void>;
  /** 使用電子郵件和密碼登入 */
  login: (email: string, password: string) => Promise<void>;
  /** 使用 Google 帳號登入 */
  loginWithGoogle: () => Promise<void>;
  /** 登出當前用戶 */
  logout: () => Promise<void>;
  /** 更新用戶名稱（同步到 Firebase Auth 和 Realtime Database） */
  updateUserName: (newName: string) => Promise<boolean>;
}

/**
 * 完整的認證 Store 類型 - 包含狀態和動作
 */
export interface AuthStore extends AuthState, AuthActions {}

/**
 * Zustand Store 創建函數的參數類型
 */
export type AuthStoreCreator = (
  set: (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void,
  get: () => AuthStore
) => AuthStore;

/**
 * 用戶註冊參數
 */
export interface RegisterParams {
  email: string;
  password: string;
}

/**
 * 用戶登入參數
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * 用戶名稱更新參數
 */
export interface UpdateUserNameParams {
  newName: string;
}

/**
 * Firebase Auth 狀態變化回調函數類型
 */
export type AuthStateChangeCallback = (firebaseUser: FirebaseUser | null) => Promise<void>;