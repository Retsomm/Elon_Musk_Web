// Firebase 相關類型定義

// Firebase 錯誤類型
export interface FirebaseError {
  code: string;
  message: string;
  name: 'FirebaseError';
}

// Firebase 配置類型
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Firebase 資料庫快照類型
export interface DatabaseSnapshot<T = any> {
  exists(): boolean;
  val(): T | null;
  key: string | null;
  ref: DatabaseReference;
  child(path: string): DatabaseSnapshot<T>;
  forEach(action: (child: DatabaseSnapshot<T>) => boolean | void): boolean;
  hasChild(path: string): boolean;
  hasChildren(): boolean;
  numChildren(): number;
  size: number;
  toJSON(): T | null;
}

// Firebase 資料庫引用類型
export interface DatabaseReference {
  key: string | null;
  parent: DatabaseReference | null;
  root: DatabaseReference;
  child(path: string): DatabaseReference;
  push(value?: any): Promise<DatabaseReference>;
  set(value: any): Promise<void>;
  update(values: any): Promise<void>;
  remove(): Promise<void>;
  on(eventType: string, callback: (snapshot: DatabaseSnapshot) => void): (snapshot: DatabaseSnapshot) => void;
  off(eventType?: string, callback?: (snapshot: DatabaseSnapshot) => void): void;
  once(eventType: string): Promise<DatabaseSnapshot>;
  transaction(updateFunction: (currentData: any) => any): Promise<{ committed: boolean; snapshot: DatabaseSnapshot }>;
}

// 認證提供者類型
export type AuthProvider = 'google' | 'facebook' | 'twitter' | 'github' | 'apple';

// 認證方法類型
export type AuthMethod = 'email' | 'popup' | 'redirect' | 'anonymous';

// 登入憑證類型
export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 註冊資料類型
export interface SignUpData extends SignInCredentials {
  displayName?: string;
  confirmPassword: string;
}

// 密碼重設類型
export interface PasswordResetData {
  email: string;
}

// 用戶資料更新類型
export interface UserUpdateData {
  displayName?: string;
  photoURL?: string;
  email?: string;
}

// Firebase 操作結果類型
export interface FirebaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: FirebaseError;
  message?: string;
}

// Firebase 批次操作類型
export interface BatchOperation {
  type: 'set' | 'update' | 'delete';
  path: string;
  value?: any;
}

// Firebase 查詢選項類型
export interface QueryOptions {
  orderBy?: string;
  limitToFirst?: number;
  limitToLast?: number;
  startAt?: any;
  endAt?: any;
  equalTo?: any;
}

// Firebase 監聽器選項類型
export interface ListenerOptions {
  once?: boolean;
  errorCallback?: (error: FirebaseError) => void;
}

// Firebase 離線模式配置
export interface OfflineConfig {
  persistence: boolean;
  cacheSizeBytes?: number;
  synchronizeTabs?: boolean;
}

// Firebase 安全規則類型
export interface SecurityRules {
  read: string;
  write: string;
  validate?: string;
  indexOn?: string[];
}