import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

/**
 * 自定義 Hook - 用於監聽 Firebase 使用者認證狀態並取得使用者 ID
 *
 * 功能：
 * - 監聽 Firebase 認證狀態變化
 * - 當使用者登入時返回 userId，登出時返回 null
 * - 自動處理認證狀態訂閱的清理
 *
 * @returns {string|null} 使用者的 UID 或 null（未登入時）
 */
export const useFirebaseUserId = () => {
  /**
   * 狀態管理 - 儲存當前使用者的 ID
   *
   * 資料類型：string | null
   * - string: 當使用者已登入時，儲存 Firebase 使用者的 UID
   * - null: 當使用者未登入或正在載入時的初始狀態
   */
  const [userId, setUserId] = useState(null);

  /**
   * 副作用 Hook - 設置 Firebase 認證狀態監聽器
   *
   * 依賴陣列：[] (空陣列)
   * - 表示此 effect 只在組件掛載時執行一次
   * - 不會因為任何 props 或 state 變化而重新執行
   */
  useEffect(() => {
    /**
     * Firebase 認證狀態監聽器
     *
     * 資料庫方法：onAuthStateChanged
     * - 參數1: auth - Firebase 認證實例
     * - 參數2: callback function - 當認證狀態改變時執行的回調函數
     *
     * 回調函數參數 user 物件結構：
     * - 當使用者已登入：user 物件包含使用者資訊
     *   - user.uid: 使用者唯一識別碼
     *   - user.email: 使用者信箱
     *   - user.displayName: 顯示名稱等
     * - 當使用者未登入：user 為 null
     */
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      /**
       * 條件判斷與狀態更新
       *
       * 三元運算子處理：
       * - user 存在（truthy）：提取 user.uid 作為 userId
       * - user 不存在（falsy/null）：設定 userId 為 null
       *
       * 這樣的設計確保：
       * - 登入狀態：userId 為有效的字串 ID
       * - 登出狀態：userId 為 null，方便組件判斷認證狀態
       */
      setUserId(user ? user.uid : null);
    });

    /**
     * 清理函數 - 取消訂閱認證狀態監聽
     *
     * 返回的 unsubscribe 函數：
     * - 這是 onAuthStateChanged 返回的取消訂閱函數
     * - 當組件卸載時會自動調用此函數
     * - 防止記憶體洩漏和不必要的監聽器繼續運行
     *
     * React Hook 最佳實踐：
     * - 所有設置的訂閱、定時器等都應該在組件卸載時清理
     */
    return () => unsubscribe();
  }, []); // 空依賴陣列確保只在掛載時設置監聽器

  /**
   * 返回當前使用者 ID
   *
   * 返回值處理：
   * - 組件可以根據返回值判斷使用者登入狀態
   * - null: 使用者未登入或正在載入
   * - string: 使用者已登入，可用於資料庫查詢等操作
   */
  return userId;
};
