import { set, remove, ref } from "firebase/database";
import { useToastStore } from "../store/toastStore";
import { useFirebaseUserId } from "./useFirebaseUserId";
import { useDatabaseValue } from "./useDatabaseValue";
import { database } from "../firebase";
/**
 * 單一收藏項目的 Hook
 * 提供給 favoriteButton 元件使用，處理單個項目的收藏狀態
 * 
 * @param {string} type - 收藏類型（如：'movies', 'books', 'articles'）
 * @param {string|number} id - 項目的唯一識別碼
 * @param {string|number} noteIdx - 筆記索引，用於區分同一項目的不同筆記
 * @param {string} defaultContent - 預設內容，收藏時儲存的初始內容
 * @returns {Object} 包含收藏狀態和操作方法的物件
 */
export const useFavoriteItem = (type, id, noteIdx, defaultContent = "") => {
    // Hook: 取得當前登入用戶的 ID
    const userId = useFirebaseUserId();
    
    // Hook: 取得 toast 通知功能
    const { addToast } = useToastStore();
    
    // 資料庫路徑構建：favorites/{userId}/{type}/{id}/{noteIdx}
    // 例如：favorites/user123/movies/movie456/note1
    const favPath = userId ? `favorites/${userId}/${type}/${id}/${noteIdx}` : null;
    
    // Hook: 監聽資料庫中的收藏狀態，返回物件格式：{ status: boolean, content: string }
    const favorite = useDatabaseValue(favPath);

    /**
     * 切換收藏狀態的方法
     * 資料庫操作：新增或移除收藏項目
     */
    const toggleFavorite = () => {
        // 驗證：檢查用戶是否已登入
        if (!userId) {
            addToast({ message: "請先登入才能收藏" });
            return;
        }
        
        // 資料庫引用：建立 Firebase 資料庫的引用路徑
        const favRef = ref(database, favPath);
        
        // 物件屬性檢查：判斷當前收藏狀態
        if (favorite && favorite.status) {
            // 資料庫操作：移除收藏（刪除整個節點）
            remove(favRef);
            addToast({ message: "已移除收藏" });
        } else {
            // 資料庫操作：新增收藏，儲存物件 { status: true, content: defaultContent }
            set(favRef, { status: true, content: defaultContent });
            addToast({ message: "已加入收藏" });
        }
    };

    // 返回物件：包含所有相關狀態和方法
    return {
        favorite,           // 完整的收藏物件資料
        toggleFavorite,     // 切換收藏狀態的方法
        userId,             // 當前用戶 ID
        isFavorited: favorite && favorite.status,  // 布林值：是否已收藏
    };
};

/**
 * 所有收藏項目的 Hook
 * 提供給收藏頁面使用，處理用戶的所有收藏項目
 * 
 * @returns {Object} 包含所有收藏資料和操作方法的物件
 */
export const useAllFavorites = () => {
    // Hook: 取得當前登入用戶的 ID
    const userId = useFirebaseUserId();
    
    // Hook: 取得 toast 通知功能
    const { addToast } = useToastStore();
    
    // Hook: 監聽用戶所有收藏資料，資料結構：
    // {
    //   movies: {
    //     movie123: {
    //       note1: { status: true, content: "很棒的電影" },
    //       note2: { status: true, content: "值得重看" }
    //     }
    //   },
    //   books: {
    //     book456: {
    //       note1: { status: true, content: "推薦閱讀" }
    //     }
    //   }
    // }
    const favoritesData = useDatabaseValue(userId ? `favorites/${userId}` : null, {});
    
    // 載入狀態判斷：當 userId 或 favoritesData 為 null 時顯示載入中
    const loading = userId === null || favoritesData === null;

    /**
     * 移除特定收藏項目的方法
     * 
     * @param {string} type - 收藏類型
     * @param {string|number} id - 項目 ID
     * @param {string|number} noteIdx - 筆記索引
     */
    const removeFavorite = async (type, id, noteIdx) => {
        // 驗證：檢查用戶登入狀態
        if (!userId) {
            addToast({ message: "請先登入或稍後再試" });
            return;
        }
        
        // 路徑構建：組合完整的資料庫路徑
        let favPath = `favorites/${userId}/${type}/${id}/${noteIdx}`;
        
        // 資料庫操作：異步移除指定的收藏項目
        await remove(ref(database, favPath));
        
        addToast({ message: "已移除收藏" });
    };

    // 返回物件：包含所有收藏相關的資料和方法
    return {
        userId,                              // 當前用戶 ID
        favoritesData: favoritesData || {},  // 所有收藏資料（確保為物件格式）
        loading,                             // 載入狀態
        removeFavorite,                      // 移除收藏的方法
    };
};