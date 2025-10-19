// 通用組件和應用程式類型定義

// 基礎實體類型
export interface BaseEntity {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 用戶相關類型
export interface User extends BaseEntity {
  email: string;
  avatar?: string;
  role?: 'admin' | 'user' | 'guest';
  isActive?: boolean;
}

// 導航項目類型
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  isActive?: boolean;
  children?: NavItem[];
}

// 模態框相關類型
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// 媒體內容類型
export interface MediaContent {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
  duration?: number; // 用於音視頻
  size?: number; // 文件大小（字節）
}

// 分頁相關類型
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

// API 回應基礎格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
  statusCode?: number;
}

// 載入狀態類型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

// 表單驗證類型
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T = any> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isSubmitting: boolean;
  touched: Record<string, boolean>;
}

// 搜索相關類型
export interface SearchOptions {
  query: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Toast 通知類型
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  isVisible?: boolean;
  createdAt?: string;
}

// 主題相關類型
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  secondaryColor?: string;
  fontSize?: 'sm' | 'md' | 'lg';
  fontFamily?: string;
}

// 本地存儲鍵值類型
export interface LocalStorageKeys {
  USER_PREFERENCES: 'userPreferences';
  THEME_CONFIG: 'themeConfig';
  AUTH_TOKEN: 'authToken';
  NEWS_CACHE: 'newsCache';
  NEWS_HISTORY_CACHE: 'newsHistoryCache';
  FAVORITES: 'favorites';
}

// 路由相關類型
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
  title?: string;
  meta?: Record<string, any>;
}

// 錯誤邊界相關類型
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// 性能監控類型
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'kb' | 'count';
  timestamp: string;
  metadata?: Record<string, any>;
}

// Firebase 認證相關類型
export interface FirebaseUser {
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

