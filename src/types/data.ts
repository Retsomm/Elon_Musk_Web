// 數據模型相關類型定義

// 生活事件類型
export interface LifeEvent {
  id: string | number;
  year: number;
  event: string;
  description?: string;
  category?: string;
  importance?: 'low' | 'medium' | 'high';
  tags?: string[];
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    caption?: string;
  }[];
}

// 書籍類型
export interface Book {
  id: string | number;
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: string[];
  rating?: number;
  coverImage?: string;
  readingStatus?: 'to-read' | 'reading' | 'completed';
  notes?: string;
  tags?: string[];
}

// 播客類型
export interface Podcast {
  id: string | number;
  title: string;
  host: string;
  description?: string;
  category?: string;
  language?: string;
  episodeCount?: number;
  duration?: number; // 分鐘
  coverImage?: string;
  rssUrl?: string;
  website?: string;
  rating?: number;
  tags?: string[];
}

// YouTube 頻道/影片類型
export interface YouTubeContent {
  id: string | number;
  title: string;
  channelName: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  channelUrl?: string;
  publishedAt?: string;
  duration?: number; // 秒數
  viewCount?: number;
  likeCount?: number;
  category?: string;
  tags?: string[];
  isSubscribed?: boolean;
}

// 數據集合類型
export interface DataCollection<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
  lastUpdated?: string;
}

// 數據過濾選項
export interface DataFilter {
  category?: string;
  tags?: string[];
  year?: number;
  yearRange?: {
    start: number;
    end: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 數據統計信息
export interface DataStats {
  totalItems: number;
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  yearDistribution: Record<number, number>;
  averageRating?: number;
  lastUpdated: string;
}

// 數據導入/導出類型
export interface DataImportOptions {
  format: 'json' | 'csv' | 'xml';
  overwrite?: boolean;
  validateData?: boolean;
  batchSize?: number;
}

export interface DataExportOptions {
  format: 'json' | 'csv' | 'xml';
  includeMetadata?: boolean;
  fields?: string[];
  filter?: DataFilter;
}

// 數據同步狀態
export interface SyncStatus {
  isSync: boolean;
  lastSyncAt?: string;
  syncErrors?: string[];
  pendingChanges?: number;
}

// 數據備份類型
export interface BackupInfo {
  id: string;
  createdAt: string;
  size: number; // 字節
  itemCount: number;
  description?: string;
  isAutoBackup: boolean;
}