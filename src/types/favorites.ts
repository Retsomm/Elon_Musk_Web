// 收藏功能相關類型定義

// 收藏項目基礎類型
export interface FavoriteItem {
  id: string;
  type: string;
  itemId: string | number;
  noteIdx: number;
  title: string;
  content: string;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

// 收藏項目創建參數
export interface CreateFavoriteParams {
  type: string;
  itemId: string | number;
  noteIdx: number;
  title: string;
  content: string;
  userId?: string;
}

// 收藏項目更新參數
export interface UpdateFavoriteParams {
  title?: string;
  content?: string;
  status?: boolean;
}

// 收藏項目查詢選項
export interface FavoriteQueryOptions {
  userId?: string;
  type?: string;
  status?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// useFavoriteItem Hook 返回類型
export interface UseFavoriteItemReturn {
  favorite: FavoriteItem | null;
  toggleFavorite: () => Promise<void>;
  userId: string | null;
  isFavorited: boolean;
  isLoading?: boolean;
  error?: string | null;
}

// useAllFavorites Hook 返回類型
export interface UseAllFavoritesReturn {
  userId: string | null;
  favoritesData: FavoriteItem[];
  loading: boolean;
  error?: string | null;
  removeFavorite: (favoriteId: string) => Promise<void>;
  updateFavorite: (favoriteId: string, params: UpdateFavoriteParams) => Promise<void>;
  refetch: () => Promise<void>;
}

// 收藏統計信息
export interface FavoriteStats {
  total: number;
  byType: Record<string, number>;
  recentCount: number;
  activeCount: number;
}

// 收藏項目組件 Props
export interface FavoriteButtonProps {
  type: string;
  itemId: string | number;
  noteIdx: number;
  title: string;
  content: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

// 收藏列表組件 Props
export interface FavoriteListProps {
  favorites: FavoriteItem[];
  onItemClick?: (item: FavoriteItem) => void;
  onRemove?: (favoriteId: string) => void;
  onUpdate?: (favoriteId: string, params: UpdateFavoriteParams) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

// 收藏項目卡片 Props
export interface FavoriteCardProps {
  item: FavoriteItem;
  onClick?: () => void;
  onRemove?: () => void;
  onUpdate?: (params: UpdateFavoriteParams) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}