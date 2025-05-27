import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,//開啟一個 Google 登入視窗，讓使用者選擇 Google 帳號登入
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "../firebase";

// 建立 AuthContext，供全站使用者認證狀態共享
const AuthContext = createContext();

// 提供者元件，包裹全站，提供認證相關狀態與方法
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 使用者資訊
  const [loginType, setLoginType] = useState(null); // 登入方式（google 或 email）
  const [loading, setLoading] = useState(true); // 是否正在載入認證狀態
  const auth = getAuth(); // 取得 Firebase Auth 實例
  const db = getDatabase(); // 取得 Firebase Database 實例

  // 監聽 Firebase 認證狀態變化
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // 若有登入，設定 user 狀態
        setUser({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        // 判斷登入方式
        const providerId = firebaseUser.providerData[0]?.providerId;
        setLoginType(providerId === "google.com" ? "google" : "email");
      } else {
        // 未登入，清空狀態
        setUser(null);
        setLoginType(null);
      }
      setLoading(false); // 狀態判斷完畢，關閉 loading
    });
    return () => unsubscribe(); // 組件卸載時移除監聽
  }, [auth]);

  // 註冊新帳號
  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // // 註冊後將 email 存入資料庫
    // await set(ref(db, "users/" + userCredential.user.uid), { email });
    // setUser({ email });
  };

  // 使用 email/password 登入
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUser({ email: userCredential.user.email });
    setLoginType("email");
  };

  // 使用 Google 登入
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser({
      email: result.user.email,
      name: result.user.displayName,
      photoURL: result.user.photoURL,
    });
    setLoginType("google");
  };

  // 登出
  const logout = () => {
    setUser(null);
    auth.signOut();
  };

  // 將狀態與方法提供給子元件
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithGoogle,
        logout,
        loginType,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自訂 hook，方便取得 AuthContext
export const useAuth = () => useContext(AuthContext);
