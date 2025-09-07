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
    // 使用 useState Hook 管理資料狀態
    // data: 當前的資料狀態，初始值為 defaultValue
    // setData: 更新資料狀態的函數
    const [data, setData] = useState(defaultValue);

    // 使用 useEffect Hook 處理副作用 (資料庫監聽)
    useEffect(() => {
        // 路徑驗證: 如果沒有提供路徑，設置為預設值並提早返回
        if (!path) {
            setData(defaultValue);
            return;
        }

        // 創建 Firebase 資料庫引用
        // ref(): Firebase 方法，用於創建對特定路徑的引用
        // database: 從 firebase 配置文件導入的資料庫實例
        // path: 要監聽的資料庫路徑字符串
        const dbRef = ref(database, path);

        // 設置實時監聽器
        // onValue(): Firebase 方法，監聽指定引用的數據變化
        // 當資料庫中的數據發生變化時，會自動觸發回調函數
        const unsubscribe = onValue(dbRef, (snapshot) => {
            // snapshot: Firebase 快照物件，包含當前路徑的數據
            // snapshot.val(): 提取快照中的實際數據值
            // 
            // 數據類型處理:
            // - 如果是物件: 返回完整的物件結構
            // - 如果是陣列: 返回陣列 (可能包含 null 元素)
            // - 如果是基本類型: 返回字符串、數字、布林值等
            // - 如果路徑不存在: 返回 null
            setData(snapshot.val());
        });

        // 清理函數: 當組件卸載或依賴項變化時執行
        // unsubscribe(): 取消 Firebase 監聽器，防止內存洩漏
        // 這是重要的清理步驟，避免在組件銷毀後繼續監聽
        return () => unsubscribe();
    }, [path]); // 依賴陣列: 只有當 path 變化時才重新執行 effect
    
    // 返回當前的資料狀態
    // 資料會隨著 Firebase 資料庫的變化而自動更新
    return data;
};

/*
使用範例:

1. 監聽物件數據:
const userData = useDatabaseValue('users/123');
// 返回: { name: "John", age: 30, email: "john@example.com" }

2. 監聽陣列數據:
const todoList = useDatabaseValue('todos');
// 返回: [{ id: 1, text: "任務1" }, { id: 2, text: "任務2" }]

3. 使用預設值:
const settings = useDatabaseValue('userSettings/theme', 'light');
// 如果資料不存在，返回 'light'

4. 在組件中使用:
function UserProfile({ userId }) {
    const user = useDatabaseValue(`users/${userId}`, {});
    
    if (!user.name) return <div>載入中...</div>;
    
    return <div>{user.name}</div>;
}

注意事項:
- 此 Hook 會建立實時連接，數據變化會自動反映到組件
- 組件卸載時會自動清理監聽器
- 適用於需要實時同步的數據場景
- 對於一次性數據獲取，建議使用 get() 方法而非此 Hook
*/