import { create } from 'zustand';

/**
 * 主題管理Store
 * 
 * 資料存儲:
 * - currentTheme: 儲存目前使用的主題名稱 (字串型別)
 * - localStorage: 使用瀏覽器本地存儲保存主題設定，確保頁面重整後保持一致
 *
 * 方法說明:
 * - toggleTheme: 在 'autumn' 和 'black' 主題間切換
 * - setTheme: 直接設定指定的主題
 */
export const themeStore = create((set, get) => ({
  // 狀態屬性：從localStorage獲取已儲存的主題，若無則使用預設主題'black'
  currentTheme: (localStorage.getItem('theme')) || 'black',
  
  // 切換主題方法：在'autumn'和'black'之間切換
  toggleTheme: () => {
    // 使用get()存取當前狀態，判斷並設定新主題
    // get() 是一個函式，通常會回傳整個 store 的當前狀態（state）。
    //currentTheme 是 state 物件裡的一個屬性。
    //所以 get().currentTheme 就是「取得現在的狀態物件，然後存取其中的 currentTheme 屬性」。
    const newTheme = get().currentTheme === 'autumn' ? 'black' : 'autumn';
    
    // 更新store中的狀態
    set({ currentTheme: newTheme });
    
    // 更新HTML根元素的data-theme屬性，使CSS樣式生效
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 將主題偏好保存至localStorage以便持久化存儲
    localStorage.setItem('theme', newTheme);
  },
  
  // 設定特定主題方法
  setTheme: (theme) => {
    // 直接更新store狀態為指定主題
    set({ currentTheme: theme });
    
    // 更新DOM屬性
    document.documentElement.setAttribute('data-theme', theme);
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
  },
  
}));

// 初始化時同步主題設定到DOM
// 從localStorage讀取主題設定，若無則使用預設主題'black'
const theme = (localStorage.getItem('theme')) || 'black';

// 將主題套用到HTML根元素
document.documentElement.setAttribute('data-theme', theme);