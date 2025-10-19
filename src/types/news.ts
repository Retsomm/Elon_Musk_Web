// 新聞文章類型定義
export interface NewsArticle {
  /** 文章標題 */
  title: string;
  /** 文章摘要/描述 */
  description?: string;
  /** 文章連結 */
  url: string;
  /** 文章圖片 URL */
  imageUrl?: string;
  /** 新聞來源 */
  source: string;
  /** 發布日期 (ISO 字串格式) */
  pubDate?: string;
  /** 時間戳 (ISO 字串格式) */
  timestamp?: string;
  /** 作者 */
  author?: string;
  /** 文章內容 */
  content?: string;
  /** 分類標籤 */
  category?: string;
  /** 語言 */
  language?: string;
}

// Firebase Cloud Function 回應的元資料
export interface NewsMetadata {
  /** API 回應時間 */
  responseTime?: string;
  /** 資料來源 */
  source?: string;
  /** API 版本 */
  version?: string;
  /** 總可用文章數 */
  totalAvailable?: number;
  /** 請求限制 */
  limit?: number;
  /** 是否有更多資料 */
  hasMore?: boolean;
  /** 下一頁的標記 */
  nextPageToken?: string;
}

// 新聞資料回應格式
export interface NewsResponse {
  /** 新聞文章陣列 */
  articles: NewsArticle[];
  /** 回應時間戳 */
  timestamp: string;
  /** 台灣時區日期字串 (YYYY-MM-DD) */
  date: string;
  /** 新增文章數量 */
  newCount: number;
  /** 總文章數量 */
  totalCount: number;
  /** 元資料 */
  metadata: NewsMetadata;
  /** 錯誤訊息 (可選) */
  error?: string;
}

// Firebase Functions 錯誤碼類型
export type FirebaseFunctionErrorCode = 
  | 'functions/internal'
  | 'functions/unavailable' 
  | 'functions/timeout'
  | 'functions/unauthenticated'
  | 'functions/permission-denied'
  | 'functions/not-found'
  | 'functions/resource-exhausted'
  | 'functions/failed-precondition'
  | 'functions/aborted'
  | 'functions/out-of-range'
  | 'functions/unimplemented'
  | 'functions/data-loss'
  | 'functions/unknown';

// Firebase Functions 錯誤物件
export interface FirebaseFunctionError extends Error {
  code: FirebaseFunctionErrorCode;
  message: string;
  details?: any;
}

// Firebase httpsCallable 的請求參數
export interface GetNewsParams {
  /** 限制返回的新聞數量 */
  limit?: number;
  /** 新聞分類過濾 */
  category?: string;
  /** 語言過濾 */
  language?: string;
  /** 搜索關鍵字 */
  query?: string;
  /** 日期範圍開始 */
  dateFrom?: string;
  /** 日期範圍結束 */
  dateTo?: string;
}

// Firebase httpsCallable 的回應格式
export interface FirebaseNewsResponse {
  /** 回應資料 */
  data?: {
    articles: NewsArticle[];
    metadata?: NewsMetadata;
  };
  /** 直接在根層級的文章陣列 (備用格式) */
  articles?: NewsArticle[];
  /** 直接在根層級的元資料 (備用格式) */
  metadata?: NewsMetadata;
}

// SWR Hook 回傳類型
export interface UseFetchNewsReturn {
  /** 新聞資料 */
  data: NewsResponse | undefined;
  /** 錯誤物件 */
  error: any;
  /** 是否正在載入 */
  isLoading: boolean;
  /** 手動重新獲取資料的函數 */
  mutate: () => Promise<NewsResponse | undefined>;
  /** 是否正在驗證資料 */
  isValidating: boolean;
}

// SWR 設定選項類型 (擴展常用選項)
export interface SwrNewsOptions {
  /** 視窗聚焦時是否重新驗證 */
  revalidateOnFocus?: boolean;
  /** 網路重新連線時是否重新驗證 */
  revalidateOnReconnect?: boolean;
  /** 自動刷新間隔 (毫秒，0 表示不自動刷新) */
  refreshInterval?: number;
  /** 錯誤重試次數 */
  errorRetryCount?: number;
  /** 重試間隔 (毫秒) */
  errorRetryInterval?: number;
  /** 去重間隔 (毫秒) */
  dedupingInterval?: number;
  /** 後備資料 */
  fallbackData?: NewsResponse | null;
  /** 成功回調 */
  onSuccess?: (data: NewsResponse) => void;
  /** 錯誤回調 */
  onError?: (error: any) => void;
}

// 本地快取類型
export interface NewsCache {
  /** 快取的新聞資料 */
  articles: NewsArticle[];
  /** 快取時間戳 */
  timestamp: string;
  /** 快取日期 */
  date: string;
  /** 新增數量 */
  newCount: number;
  /** 總數量 */
  totalCount: number;
  /** 元資料 */
  metadata: NewsMetadata;
}

// 新聞文章合併和去重的輔助類型
export interface ArticleDedupeKey {
  title: string;
  source: string;
}

// 日期相關工具函數的類型
export type DateString = string; // YYYY-MM-DD 格式
export type ISOString = string;  // ISO 8601 格式

// 新聞排序選項
export type NewsSortOrder = 'newest' | 'oldest' | 'relevance';

// 新聞過濾選項
export interface NewsFilterOptions {
  /** 來源過濾 */
  sources?: string[];
  /** 分類過濾 */
  categories?: string[];
  /** 日期範圍 */
  dateRange?: {
    from: DateString;
    to: DateString;
  };
  /** 搜索關鍵字 */
  searchQuery?: string;
  /** 排序方式 */
  sortOrder?: NewsSortOrder;
}

// 新聞統計資訊
export interface NewsStats {
  /** 總文章數 */
  totalArticles: number;
  /** 今日新增數 */
  todayCount: number;
  /** 來源統計 */
  sourceStats: Record<string, number>;
  /** 分類統計 */
  categoryStats: Record<string, number>;
  /** 最後更新時間 */
  lastUpdated: ISOString;
}