import { create } from 'zustand'; // 引入 Zustand 的 create 函數用於創建狀態存儲
import {
  getAuth, // 獲取 Firebase 認證實例
  signInWithEmailAndPassword, // 使用電子郵件和密碼登入
  GoogleAuthProvider, // Google 認證提供者
  signInWithPopup, // 使用彈窗方式登入
  createUserWithEmailAndPassword, // 使用電子郵件和密碼創建帳號
  updateProfile, // 更新用戶個人資料
} from "firebase/auth";
import { getDatabase, ref, update } from "firebase/database"; // 引入 Firebase 實時數據庫相關函數
import "../firebase"; // 引入 Firebase 配置文件

// 初始化 Firebase 認證實例
const auth = getAuth();
// 初始化 Firebase 實時數據庫實例
const database = getDatabase();

/**
 * Zustand 狀態存儲 - 認證相關狀態管理
 */
export const authStore = create((set, get) => ({
  // === 狀態屬性 ===
  user: null, // 用戶物件，存儲登入用戶的信息
  loginType: null, // 登入類型，"email" 或 "google"
  loading: true, // 載入狀態，初始為 true 表示正在檢查認證狀態
  
  // === 狀態修改函數 ===
  setUser: (user) => set({ user }), // 設置用戶物件到狀態
  setLoginType: (type) => set({ loginType: type }), // 設置登入類型到狀態
  setLoading: (loading) => set({ loading }), // 設置載入狀態
  
  // === 認證功能方法 ===
  // 註冊新用戶 - 使用電子郵件和密碼
  register: async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
    // 註冊成功後，Firebase 會自動觸發 onAuthStateChanged 事件
  },
  
  // 使用電子郵件和密碼登入
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // 登入成功後將用戶資料設置到狀態中
    set({ 
      user: { email: userCredential.user.email }, // 創建包含用戶電子郵件的物件
      loginType: "email" // 設置登入類型為 email
    });
  },
  
  // 使用 Google 帳號登入
  loginWithGoogle: async () => {
    const provider = new GoogleAuthProvider(); // 創建 Google 認證提供者實例
    const result = await signInWithPopup(auth, provider); // 使用彈窗方式進行 Google 登入
    // 登入成功後更新本地狀態，包含更多 Google 提供的用戶資訊
    set({
      user: {
        email: result.user.email, // 用戶電子郵件
        name: result.user.displayName, // 用戶顯示名稱
        photoURL: result.user.photoURL, // 用戶頭像 URL
      },
      loginType: "google" // 設置登入類型為 google
    });
  },
  
  // 登出功能
  logout: () => {
    set({ user: null, loginType: null }); // 清除本地狀態中的用戶資訊
    auth.signOut(); // 調用 Firebase 登出方法
  },
  
  // 更新用戶名稱功能 - 同步到 Firebase Auth 和 Realtime Database
  updateUserName: async (newName) => {
    try {
      if (!auth.currentUser) {
        throw new Error("用戶未登入");
      }
      
      // 1. 更新 Firebase Auth 中的用戶資料
      await updateProfile(auth.currentUser, {
        displayName: newName // 設置新的顯示名稱
      });
      
      // 2. 更新 Firebase Realtime Database 中的用戶資料
      const userId = auth.currentUser.uid; // 獲取當前用戶 ID
      const userRef = ref(database, `users/${userId}`); // 創建用戶資料引用路徑
      
      // 使用 update 方法更新數據庫中的顯示名稱 (不會覆蓋其他欄位)
      await update(userRef, {
        displayName: newName
      });
      
      // 3. 更新本地狀態
      const currentUser = get().user; // 使用 get() 獲取當前用戶狀態
      set({
        user: {
          ...currentUser, // 使用展開運算符保留現有用戶物件的所有屬性
          name: newName, // 更新 name 屬性
          displayName: newName // 更新 displayName 屬性
        }
      });
      
      return true; // 更新成功返回 true
    } catch (error) {
      console.error("更新使用者名稱時發生錯誤:", error);
      throw error; // 重新拋出錯誤以便上層處理
    }
  },
}));

// 監聽 Firebase 認證狀態變化 (當登入狀態改變時會觸發此函數)
auth.onAuthStateChanged((firebaseUser) => {
  // 從狀態存儲中獲取方法
  const { setUser, setLoginType, setLoading } = authStore.getState();
  
  if (firebaseUser) {
    // 用戶已登入，更新本地狀態
    setUser({
      email: firebaseUser.email, // 用戶電子郵件
      name: firebaseUser.displayName, // 用戶顯示名稱
      photoURL: firebaseUser.photoURL, // 用戶頭像 URL
      displayName: firebaseUser.displayName, // 用戶顯示名稱 (同 name)
      uid: firebaseUser.uid // 用戶唯一識別碼，用於數據庫操作
    });
    
    // 根據認證提供者 ID 判斷登入類型
    // providerData 是一個陣列，包含用戶的認證提供者資訊
    const providerId = firebaseUser.providerData[0]?.providerId;
    setLoginType(providerId === "google.com" ? "google" : "email");
  } else {
    // 用戶未登入或已登出，清除本地狀態
    setUser(null);
    setLoginType(null);
  }
  
  // 完成認證狀態檢查，更新載入狀態為 false
  setLoading(false);
});