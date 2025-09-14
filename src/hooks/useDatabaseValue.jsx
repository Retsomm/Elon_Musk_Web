import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

/**
 * 自定義 Hook: 用於監聽 Firebase 實時資料庫的數據變化
 *
 * @param {string} path - Firebase 資料庫的路徑 (例如: "users/123" 或 "products")
 * @param {any} defaultValue - 預設值，當路徑為空或資料尚未載入時使用 (預設為 null)
 * @returns {any} data - 從 Firebase 資料庫獲取的實時數據
 *
 * 使用場景:
 * - 監聽單一節點的數據變化 (物件)
 * - 監聽列表數據的變化 (陣列)
 * - 實時同步資料庫狀態到 React 組件
 */
export const useDatabaseValue = (path, defaultValue = null) => {
  const [data, setData] = useState(defaultValue);

  useEffect(() => {
    if (!path) {
      setData(defaultValue);
      return;
    }
    const dbRef = ref(database, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      setData(snapshot.val());
    });
    return () => unsubscribe();
  }, [path]);

  return data;
};
