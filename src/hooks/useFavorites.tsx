import { set, ref } from "firebase/database";
import { toastStore } from "../store/toastStore";
import { useFirebaseUserId } from "./useFirebaseUserId";
import { useDatabaseValue } from "./useDatabaseValue";
import { database } from "../firebase";
import type { 
  FavoriteItem, 
  UseFavoriteItemReturn, 
  UseAllFavoritesReturn,
  CreateFavoriteParams 
} from "../types/favorites";

/**
 * 生成唯一的收藏項目 ID
 */
const generateFavoriteId = (
  type: string,
  itemId: string | number,
  noteIdx: number
): string => {
  return `${type}-${itemId}-${noteIdx}`;
};

/**
 * 單一收藏項目的 Hook
 */
export const useFavoriteItem = (
  type: string,
  id: string | number,
  noteIdx: number,
  defaultContent: string = "",
  title: string
): UseFavoriteItemReturn => {
  const { userId } = useFirebaseUserId();

  // 修正：只有當 userId 存在時才監聽資料庫
  const favoritesArray: FavoriteItem[] | null = useDatabaseValue(
    userId ? `favorites/${userId}` : null,  // 修正：傳遞 null 而不是空字串
    []
  );

  // 生成當前項目的唯一 ID
  const currentFavoriteId: string = generateFavoriteId(type, id, noteIdx);

  // 在陣列中尋找對應的收藏項目
  const favorite: FavoriteItem | null = Array.isArray(favoritesArray) && userId
    ? favoritesArray.find(
        (item: FavoriteItem) =>
          item.id === currentFavoriteId && item.status === true
      ) || null
    : null;

  /**
   * 切換收藏狀態的方法
   */
  const toggleFavorite = async (): Promise<void> => {
    if (!userId) {
      toastStore.warning("請先登入才能收藏");
      return;
    }

    const favRef = ref(database, `favorites/${userId}`);

    if (favorite) {
      // 移除收藏
      const updatedArray: FavoriteItem[] = (favoritesArray || []).filter(
        (item: FavoriteItem) => item.id !== currentFavoriteId
      );

      await set(favRef, updatedArray);
      toastStore.success("已移除收藏");
    } else {
      // 新增收藏
      const newFavorite: FavoriteItem = {
        id: currentFavoriteId,
        type,
        itemId: id,
        noteIdx,
        title: title || `${type} - ${id}`,
        content: defaultContent,
        status: true,
        createdAt: new Date().toISOString(),
      };

      const updatedArray: FavoriteItem[] = Array.isArray(favoritesArray)
        ? [...favoritesArray, newFavorite]
        : [newFavorite];

      await set(favRef, updatedArray);
      toastStore.success("已加入收藏");
    }
  };

  return {
    favorite,
    toggleFavorite,
    userId,
    isFavorited: !!favorite,
  };
};

/**
 * 所有收藏項目的 Hook
 */
export const useAllFavorites = (): UseAllFavoritesReturn => {
  const { userId } = useFirebaseUserId();

  // 修正：只有當 userId 存在時才監聽資料庫
  const favoritesData: FavoriteItem[] | null = useDatabaseValue(
    userId ? `favorites/${userId}` : null,  // 修正：傳遞 null 而不是空字串
    []
  );

  const loading: boolean = userId === null;

  /**
   * 根據 ID 直接移除收藏項目的方法
   */
  const removeFavorite = async (favoriteId: string): Promise<void> => {
    if (!userId) {
      toastStore.info("請先登入或稍後再試");
      return;
    }

    const favRef = ref(database, `favorites/${userId}`);
    const updatedArray: FavoriteItem[] = (favoritesData || []).filter(
      (item: FavoriteItem) => item.id !== favoriteId
    );

    await set(favRef, updatedArray);
    toastStore.success("已移除收藏");
  };

  const updateFavorite = async (favoriteId: string, params: { title?: string; content?: string; status?: boolean }): Promise<void> => {
    if (!userId) {
      toastStore.info("請先登入或稍後再試");
      return;
    }

    const favRef = ref(database, `favorites/${userId}`);
    const updatedArray: FavoriteItem[] = (favoritesData || []).map(
      (item: FavoriteItem) => {
        if (item.id === favoriteId) {
          return {
            ...item,
            ...params,
            updatedAt: new Date().toISOString()
          };
        }
        return item;
      }
    );

    await set(favRef, updatedArray);
    toastStore.success("收藏已更新");
  };

  const refetch = async (): Promise<void> => {
    // 由於使用 useDatabaseValue，數據會自動更新
    // 這個方法主要用於強制刷新或錯誤處理
    if (!userId) return;
    // 可以在這裡添加額外的重新獲取邏輯
  };

  return {
    userId,
    favoritesData: Array.isArray(favoritesData) ? favoritesData : [],
    loading,
    removeFavorite,
    updateFavorite,
    refetch,
  };
};