import { useState, useEffect } from "react";
import { database, auth } from "../firebase";
import { ref, set, remove, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useToastStore } from "../store/toastStore"; 

/**
 * 單一收藏項目管理Hook
 * @param {string} type - 收藏項目類型，如'bible'、'hymn'等
 * @param {string|number} id - 收藏項目ID
 * @param {string|number} noteIdx - 收藏項目內部索引，例如聖經章節或詩歌節
 * @param {string} defaultContent - 收藏項目的預設內容
 * @returns {Object} 包含收藏狀態和控制方法的物件
 */
export const useFavoriteItem = (
    type,
    id,
    noteIdx,
    defaultContent = ""
) => {
    // 狀態管理：使用useState儲存用戶ID和收藏狀態
    const [userId, setUserId] = useState(null); // 使用者ID狀態，初始為null
    const [favorite, setFavorite] = useState(null); // 收藏物件狀態，初始為null
    const { addToast } = useToastStore(); // 從全局狀態獲取toast通知方法

    // 監聽用戶認證狀態的useEffect
    useEffect(() => {
        // onAuthStateChanged：Firebase認證狀態變更監聽器
        // 返回取消訂閱函數，用於清理effect
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null); // 有用戶時設置ID，無用戶時設為null
        });
        return () => unsubscribe(); // 元件卸載時取消監聽，防止記憶體洩漏
    }, []);

    // 監聽收藏狀態的useEffect，依賴於userId、type、id、noteIdx
    useEffect(() => {
        if (!userId) {
            setFavorite(null); // 無用戶時重置收藏狀態
            return;
        }

        // 創建資料庫引用：指向特定收藏項目的路徑
        const favRef = ref(
            database,
            `favorites/${userId}/${type}/${id}/${noteIdx}`
        );
        
        // onValue：實時監聽資料庫節點變化
        // snapshot包含當前節點的完整數據
        const unsubscribe = onValue(favRef, (snapshot) => {
            setFavorite(snapshot.val()); // 更新收藏狀態，val()方法將快照轉換為JavaScript物件
        });
        
        return () => unsubscribe(); // 元件卸載或依賴項變更時取消監聽
    }, [userId, type, id, noteIdx]);

    /**
     * 切換收藏狀態的函數
     * - 若未登入，顯示提示訊息
     * - 若已收藏，移除收藏
     * - 若未收藏，添加收藏
     */
    const toggleFavorite = () => {
        if (!userId) {
            addToast({ message: "請先登入才能收藏" }); 
            return;
        }
        
        // 再次創建資料庫引用
        const favRef = ref(
            database,
            `favorites/${userId}/${type}/${id}/${noteIdx}`
        );

        // 檢查收藏狀態，favorite為物件型態，包含status和content屬性
        if (favorite && favorite.status) {
            remove(favRef); // Firebase操作：從資料庫中移除此節點
            addToast({ message: "已移除收藏" });
        } else {
            // Firebase操作：設置資料，將物件{status: true, content: defaultContent}存入資料庫
            set(favRef, { status: true, content: defaultContent });
            addToast({ message: "已加入收藏" });
        }
    };

    // 返回包含收藏狀態和操作方法的物件
    return {
        favorite, // 原始收藏資料物件
        toggleFavorite, // 切換收藏的方法
        userId, // 當前用戶ID
        isFavorited: favorite && favorite.status // 派生狀態：是否已收藏
    };
};

/**
 * 所有收藏項目管理Hook（用於會員頁面）
 * @returns {Object} 包含所有收藏資料和操作方法的物件
 */
export const useAllFavorites = () => {
    // 狀態管理
    const [userId, setUserId] = useState(null); // 用戶ID
    const [favoritesData, setFavoritesData] = useState({}); // 收藏資料物件，初始為空物件
    const [loading, setLoading] = useState(true); // 載入狀態，初始為true表示正在載入
    const { addToast } = useToastStore();

    // 監聽用戶認證狀態並獲取所有收藏資料
    useEffect(() => {
        // 監聽Firebase認證狀態
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser) {
                // 未登入狀態處理
                setUserId(null);
                setFavoritesData({}); // 重置為空物件
                setLoading(false); // 更新載入狀態
                return;
            }

            setUserId(firebaseUser.uid);

            // 監聽用戶所有收藏資料
            const favRef = ref(database, `favorites/${firebaseUser.uid}`);
            const unsubscribeFav = onValue(favRef, (snapshot) => {
                // snapshot.val()可能為null，使用||運算符提供默認空物件
                setFavoritesData(snapshot.val() || {}); 
                setLoading(false);
            });

            // 返回取消此內部監聽的函數
            return () => unsubscribeFav();
        });

        // 返回取消外部認證監聽的函數
        return () => unsubscribeAuth();
    }, []);

    /**
     * 從收藏中移除項目的異步函數
     * @param {string} type - 收藏項目類型
     * @param {string|number} id - 收藏項目ID
     * @param {string|number} noteIdx - 收藏項目內部索引
     */
    const removeFavorite = async (
        type,
        id,
        noteIdx
    ) => {
        if (!userId) {
            addToast({ message: "請先登入或稍後再試" });
            return;
        }

        // 構建資料庫路徑字串
        let favPath = `favorites/${userId}/${type}/${id}/${noteIdx}`;

        // 異步執行資料庫移除操作
        await remove(ref(database, favPath));
        addToast({ message: "已移除收藏" });
    };

    // 返回包含所有收藏資料和操作方法的物件
    return {
        userId, // 當前用戶ID
        favoritesData, // 所有收藏資料物件
        loading, // 資料載入狀態
        removeFavorite // 移除收藏方法
    };
};