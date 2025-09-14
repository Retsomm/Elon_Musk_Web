import { set, ref } from "firebase/database";
import { toastStore } from "../store/toastStore";
import { useFirebaseUserId } from "./useFirebaseUserId";
import { useDatabaseValue } from "./useDatabaseValue";
import { database } from "../firebase";

/**
 * 生成唯一的收藏項目 ID
 * @param {string} type - 收藏類型
 * @param {string|number} itemId - 項目 ID
 * @param {string|number} noteIdx - 筆記索引
 * @returns {string} 唯一 ID
 */
const generateFavoriteId = (type, itemId, noteIdx) => {
  return `${type}-${itemId}-${noteIdx}`;
};

/**
 * 單一收藏項目的 Hook
 * 提供給 favoriteButton 元件使用，處理單個項目的收藏狀態
 *
 * @param {string} type - 收藏類型（如：'book', 'youtube', 'podcast'）
 * @param {string|number} id - 項目的唯一識別碼
 * @param {string|number} noteIdx - 筆記索引，用於區分同一項目的不同筆記
 * @param {string} defaultContent - 預設內容，收藏時儲存的初始內容
 * @param {string} title - 標題
 * @returns {Object} 包含收藏狀態和操作方法的物件
 */
export const useFavoriteItem = (
  type,
  id,
  noteIdx,
  defaultContent = "",
  title
) => {
  const userId = useFirebaseUserId();

  // 監聽整個收藏陣列
  const favoritesArray = useDatabaseValue(
    userId ? `favorites/${userId}` : null,
    []
  );
  // 生成當前項目的唯一 ID
  const currentFavoriteId = generateFavoriteId(type, id, noteIdx);

  // 在陣列中尋找對應的收藏項目
  //回傳在提供的陣列中第一個通過所提供測試函式的元素。如果沒有任何值通過測試函式，則回傳 undefined
  const favorite = Array.isArray(favoritesArray) 

    ? favoritesArray.find(item => item.id === currentFavoriteId && item.status === true)
    : null;

  /**
   * 切換收藏狀態的方法
   * 資料庫操作：新增或移除收藏項目
   */
  const toggleFavorite = async () => {
    // 驗證：檢查用戶是否已登入
    if (!userId) {
      toastStore.warning("請先登入才能收藏");
      return;
    }

    const favRef = ref(database, `favorites/${userId}`);
    
    if (favorite) {
      // 移除收藏：從陣列中移除該項目
      const updatedArray = favoritesArray.filter(item => item.id !== currentFavoriteId);
      
      await set(favRef, updatedArray);
      toastStore.success("已移除收藏");
    } else {
      // 新增收藏：在陣列中新增項目
      const newFavorite = {
        id: currentFavoriteId,
        type,
        itemId: id,
        noteIdx,
        title: title || `${type} - ${id}`,
        content: defaultContent,
        status: true,
        createdAt: new Date().toISOString()
      };

      const updatedArray = Array.isArray(favoritesArray) 
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
    isFavorited: !!favorite,//確保是布林值
  };
};

/**
 * 所有收藏項目的 Hook
 * 提供給收藏頁面使用，處理用戶的所有收藏項目
 * 
 * 現在資料結構為陣列格式：
 * [
 *   {
 *     id: "book-bookId1-noteIdx1",
 *     type: "book",
 *     itemId: "bookId1", 
 *     noteIdx: "noteIdx1",
 *     title: "書籍標題",
 *     content: "收藏內容",
 *     status: true,
 *     createdAt: "2025-09-14T10:00:00.000Z"
 *   },
 *   // 更多項目...
 * ]
 *
 * @returns {Object} 包含所有收藏資料和操作方法的物件
 */
export const useAllFavorites = () => {
  const userId = useFirebaseUserId();

  // 監聽用戶的收藏陣列
  const favoritesData = useDatabaseValue(
    userId ? `favorites/${userId}` : null,
    []
  );

  const loading = userId === null || favoritesData === null;

  /**
   * 移除特定收藏項目的方法
   * 使用唯一 ID 直接過濾
   *
   * @param {string} type - 收藏類型
   * @param {string|number} itemId - 項目 ID
   * @param {string|number} noteIdx - 筆記索引
   */
  

  /**
   * 根據 ID 直接移除收藏項目的方法
   * @param {string} favoriteId - 收藏項目的唯一 ID
   */
  const removeFavorite = async (favoriteId) => {
    if (!userId) {
      toastStore.info("請先登入或稍後再試");
      return;
    }

    const favRef = ref(database, `favorites/${userId}`);
    const updatedArray = (favoritesData || []).filter(item => item.id !== favoriteId);

    await set(favRef, updatedArray);
    toastStore.success("已移除收藏");
  };

  return {
    userId,
    favoritesData: Array.isArray(favoritesData) ? favoritesData : [],
    loading,
    removeFavorite, 
  };
};