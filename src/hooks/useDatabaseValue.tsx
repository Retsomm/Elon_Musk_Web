import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

/**
 * 自定義 Hook: 用於監聽 Firebase 實時資料庫的數據變化
 *
 * @param path - Firebase 資料庫的路徑 (例如: "users/123" 或 "products")
 * @param defaultValue - 預設值，當路徑為空或資料尚未載入時使用 (預設為 null)
 * @returns data - 從 Firebase 資料庫獲取的實時數據
 *
 * 使用場景:
 * - 監聽單一節點的數據變化 (物件)
 * - 監聽列表數據的變化 (陣列)
 * - 實時同步資料庫狀態到 React 組件
 */
export const useDatabaseValue = <T = any>(
  path: string | null | undefined, 
  defaultValue: T | null = null
): T | null => {
  const [data, setData] = useState<T | null>(defaultValue);
  const defaultValueRef = useRef(defaultValue);
  
  // 更新 ref 當 defaultValue 改變時
  defaultValueRef.current = defaultValue;

  useEffect(() => {
    if (!path) {
      setData(defaultValueRef.current);
      return;
    }
    
    const dbRef = ref(database, path);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const value = snapshot.val() as T | null;
      setData(value ?? defaultValueRef.current);
    });
    
    return () => unsubscribe();
  }, [path]);

  return data;
};
