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
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []); // 空依賴陣列，確保只在組件掛載和卸載時執行

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
