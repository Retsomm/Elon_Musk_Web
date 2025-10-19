import { create } from 'zustand'; // 引入 Zustand 的 create 函數用於創建狀態存儲
import {
  getAuth, // 獲取 Firebase 認證實例
  signInWithEmailAndPassword, // 使用電子郵件和密碼登入
  GoogleAuthProvider, // Google 認證提供者
  signInWithPopup, // 使用彈窗方式登入
  createUserWithEmailAndPassword, // 使用電子郵件和密碼創建帳號
  signOut, // 登出
  updateProfile, // 更新用戶個人資料
  type User as FirebaseUser, // Firebase 用戶類型
} from "firebase/auth";
import { getDatabase, ref, update, get, type Database, type DatabaseReference } from "firebase/database"; // 引入 Firebase 實時數據庫相關函數
import "../firebase"; // 引入 Firebase 配置文件
import type { 
  AuthStore, 
  AuthStoreCreator, 
  AppUser, 
  LoginType 
} from '../types/auth';

// 初始化 Firebase 認證實例
const auth = getAuth();
// 初始化 Firebase 實時數據庫實例
const database: Database = getDatabase();

/**
 * Zustand 狀態存儲 - 認證相關狀態管理
 */
export const authStore = create<AuthStore>((set, get): AuthStore => ({
  // === 狀態屬性 ===
  user: null, // 用戶物件，存儲登入用戶的信息
  loginType: null, // 登入類型，"email" 或 "google"
  loading: true, // 載入狀態，初始為 true 表示正在檢查認證狀態
  
  // === 狀態修改函數 ===
  setUser: (user: AppUser | null) => set({ user }), // 設置用戶物件到狀態
  setLoginType: (type: LoginType | null) => set({ loginType: type }), // 設置登入類型到狀態
  setLoading: (loading: boolean) => set({ loading }), // 設置載入狀態
  
  // === 認證功能方法 ===
  // 註冊新用戶 - 使用電子郵件和密碼
  register: async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
    // 註冊成功後，Firebase 會自動觸發 onAuthStateChanged 事件
  },
  
  // 使用電子郵件和密碼登入
  login: async (email: string, password: string): Promise<void> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // 登入成功後將用戶資料設置到狀態中
    set({ 
      user: { 
        email: userCredential.user.email!, // 使用非空斷言，Firebase 保證登入成功後 email 不為空
        name: userCredential.user.displayName || userCredential.user.email!.split('@')[0],
        displayName: userCredential.user.displayName || userCredential.user.email!.split('@')[0],
        photoURL: userCredential.user.photoURL,
        uid: userCredential.user.uid
      },
      loginType: "email" // 設置登入類型為 email
    });
  },
  
  // 使用 Google 帳號登入
  loginWithGoogle: async (): Promise<void> => {
    const provider = new GoogleAuthProvider(); // 創建 Google 認證提供者實例
    const result = await signInWithPopup(auth, provider); // 使用彈窗方式進行 Google 登入
    // 登入成功後更新本地狀態，包含更多 Google 提供的用戶資訊
    set({
      user: {
        email: result.user.email!, // 用戶電子郵件
        name: result.user.displayName || result.user.email!.split('@')[0], // 用戶顯示名稱
        photoURL: result.user.photoURL, // 用戶頭像 URL
        displayName: result.user.displayName || result.user.email!.split('@')[0],
        uid: result.user.uid
      },
      loginType: "google" // 設置登入類型為 google
    });
  },
  
  // 登出功能
  logout: async (): Promise<void> => {
    await signOut(auth);
    set({ user: null, loginType: null });
  },
  
  // 更新用戶名稱功能 - 同步到 Firebase Auth 和 Realtime Database
  updateUserName: async (newName: string): Promise<boolean> => {
    try {
      if (!auth.currentUser) {
        throw new Error("用戶未登入");
      }
      
      // 1. 更新 Firebase Auth 中的用戶資料
      await updateProfile(auth.currentUser, {
        displayName: newName // 設置新的顯示名稱
      });
      
      // 2. 更新 Firebase Realtime Database 中的用戶資料
      const userId: string = auth.currentUser.uid; // 獲取當前用戶 ID
      const userRef: DatabaseReference = ref(database, `users/${userId}`); // 創建用戶資料引用路徑
      
      // 使用 update 方法更新數據庫中的顯示名稱 (不會覆蓋其他欄位)
      await update(userRef, {
        displayName: newName
      });
      
      // 3. 更新本地狀態
      const currentUser = get().user; // 使用 get() 獲取當前用戶狀態
      if (currentUser) {
        set({
          user: {
            ...currentUser, // 使用展開運算符保留現有用戶物件的所有屬性
            name: newName, // 更新 name 屬性
            displayName: newName // 更新 displayName 屬性
          }
        });
      }
      
      return true; // 更新成功返回 true
    } catch (error) {
      console.error("更新使用者名稱時發生錯誤:", error);
      throw error; // 重新拋出錯誤以便上層處理
    }
  },
}));

// 監聽 Firebase 認證狀態變化 (當登入狀態改變時會觸發此函數)
auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {  // 添加類型註解
  // 從狀態存儲中獲取方法
  const { setUser, setLoginType, setLoading } = authStore.getState();
  
  if (firebaseUser) {
    // 優先從 Realtime Database 獲取 displayName
    const userId: string = firebaseUser.uid;
    const userRef: DatabaseReference = ref(database, `users/${userId}`);
    
    try {
      // 使用 get 一次性獲取數據庫中的 displayName
      const snapshot = await get(userRef);
      const dbData = snapshot.exists() ? snapshot.val() : null;
      const dbDisplayName: string | null = dbData?.displayName || null;
      
      // 計算最終顯示名稱：
      // 1. 優先使用數據庫中的 displayName（如果存在）
      // 2. 否則使用 Firebase Auth 的 displayName
      // 3. 如果都為空，使用 email 的 @ 前面的部分作為預設值
      const finalDisplayName: string = dbDisplayName || firebaseUser.displayName || firebaseUser.email!.split('@')[0];
      
      // 用戶已登入，更新本地狀態
      const appUser: AppUser = {
        email: firebaseUser.email!, // 用戶電子郵件
        name: finalDisplayName, // 用戶顯示名稱（已處理優先級）
        photoURL: firebaseUser.photoURL, // 用戶頭像 URL
        displayName: finalDisplayName, // 用戶顯示名稱（同 name）
        uid: firebaseUser.uid // 用戶唯一識別碼，用於數據庫操作
      };
      
      setUser(appUser);
      
      // 根據認證提供者 ID 判斷登入類型
      const providerId: string | undefined = firebaseUser.providerData[0]?.providerId;
      const loginType: LoginType = providerId === "google.com" ? "google" : "email";
      setLoginType(loginType);
    } catch (error) {
      console.error("獲取數據庫中的 displayName 時發生錯誤:", error);
      // 如果數據庫獲取失敗，回退到 Firebase Auth 的 displayName 或預設值
      const fallbackDisplayName: string = firebaseUser.displayName || firebaseUser.email!.split('@')[0];
      
      const appUser: AppUser = {
        email: firebaseUser.email!,
        name: fallbackDisplayName,
        photoURL: firebaseUser.photoURL,
        displayName: fallbackDisplayName,
        uid: firebaseUser.uid
      };
      
      setUser(appUser);
      
      const providerId: string | undefined = firebaseUser.providerData[0]?.providerId;
      const loginType: LoginType = providerId === "google.com" ? "google" : "email";
      setLoginType(loginType);
    }
  } else {
    // 用戶未登入或已登出，清除本地狀態
    setUser(null);
    setLoginType(null);
  }
  
  // 完成認證狀態檢查，更新載入狀態為 false
  setLoading(false);
});