import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import type { UseFirebaseUserIdReturn, FirebaseError } from "../types";

/**
 * 自定義 Hook - 用於監聽 Firebase 使用者認證狀態並取得使用者 ID
 *
 * 功能：
 * - 監聽 Firebase 認證狀態變化
 * - 當使用者登入時返回 userId，登出時返回 null
 * - 自動處理認證狀態訂閱的清理
 * - 提供 loading 狀態和錯誤處理
 *
 * @returns {UseFirebaseUserIdReturn} 包含 userId、loading 狀態和錯誤信息的物件
 */
export const useFirebaseUserId = (): UseFirebaseUserIdReturn => {
  /**
   * 狀態管理 - 儲存當前使用者的 ID
   *
   * 資料類型：string | null
   * - string: 當使用者已登入時，儲存 Firebase 使用者的 UID
   * - null: 當使用者未登入時
   */
  const [userId, setUserId] = useState<string | null>(null);
  
  /**
   * 狀態管理 - 載入狀態
   * 
   * 用於追蹤認證狀態是否正在初始化
   */
  const [loading, setLoading] = useState<boolean>(true);
  
  /**
   * 狀態管理 - 錯誤狀態
   * 
   * 用於儲存認證過程中發生的錯誤
   */
  const [error, setError] = useState<FirebaseError | null>(null);

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
    const unsubscribe = onAuthStateChanged(
      auth, 
      (user) => {
        try {
          setUserId(user ? user.uid : null);
          setError(null);
        } catch (err) {
          setError(err as FirebaseError);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err as FirebaseError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []); // 空依賴陣列，確保只在組件掛載和卸載時執行

  /**
   * 返回 Hook 結果物件
   *
   * 返回值包含：
   * - userId: 使用者的 UID 或 null（未登入時）
   * - loading: 認證狀態是否正在載入
   * - error: 認證過程中發生的錯誤或 null
   */
  return {
    userId,
    loading,
    error
  };
};
