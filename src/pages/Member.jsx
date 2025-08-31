import { useState, lazy, useEffect } from "react";
import { authStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { themeStore } from "../store/themeStore";
// 使用 React.lazy 進行組件懶加載，減少初始載入時間
const MessageBoard = lazy(() => import("../component/MessageBoard"));
const CollectList = lazy(() => import("../component/CollectList"));
// 預設頭像路徑
const DEFAULT_PIC = "/avatar.webp";

function Member() {
  // 從 authStore 獲取用戶資訊及方法
  // user: 包含用戶資料的物件 (email, displayName, photoURL 等)
  // logout: 登出方法，調用後會清除用戶身分認證
  // loading: 表示身分驗證狀態是否正在加載
  // updateUserName: 更新用戶名稱的異步方法，連接到 Firebase Auth
  const { user, logout, loading, updateUserName } = authStore();

  // 本地狀態管理
  const [memberPic, setMemberPic] = useState(""); // 用戶頭像路徑
  const [editMode, setEditMode] = useState(false); // 名稱編輯模式標記
  const [editName, setEditName] = useState(""); // 編輯中的名稱暫存
  const { resetTheme } = themeStore(); // 從 themeStore 獲取重置主題方法
  const [mainTab, setMainTab] = useState("profile"); // 當前選中的頁籤
  const addToast = useToastStore((state) => state.addToast); // 從 toastStore 獲取顯示通知的方法

  // 處理用戶郵箱和頭像資訊
  const memberEmail = user?.email || ""; // 可選鏈操作符，防止 user 為 null/undefined
  const googlePhoto = user?.photoURL; // 從 user 物件取得 Google 頭像
  const isGmail = memberEmail.endsWith("@gmail.com"); // 檢查郵箱是否為 Gmail

  // 用戶名稱的本地狀態管理
  const [memberName, setMemberName] = useState("");

  // useEffect 鉤子：當 user/isGmail/memberEmail 變更時執行
  // 用於初始化用戶名稱邏輯
  useEffect(() => {
    if (user) {
      if (user.displayName) {
        // 優先使用顯示名稱
        setMemberName(user.displayName);
      } else if (isGmail) {
        // 次優先使用 name 屬性或從郵箱提取使用者名稱
        setMemberName(user?.name || memberEmail.split("@")[0]);
      } else {
        // 從郵箱地址中提取使用者名稱（@ 前的部分）
        setMemberName(memberEmail.split("@")[0]);
      }
    }
  }, [user, isGmail, memberEmail]); // 依賴數組，決定何時重新執行此 effect

  // 使用條件運算決定頭像來源
  let picSrc = "/avatar.webp";
  if (googlePhoto) {
    picSrc = googlePhoto;
  } else if (memberPic) {
    picSrc = memberPic;
  }

  if (loading) return null; // 加載中不渲染內容

  // 處理名稱更新 - 異步操作連接到資料庫
  const handleUpdateName = async () => {
    // 驗證輸入資料
    if (editName.trim() === "") {
      addToast({ message: "名稱不能為空", type: "error" });
      return;
    }
    if (editName.trim().length > 10) {
      addToast({ message: "名稱長度不能超過10個字元", type: "error" });
      return;
    }
    try {
      // 調用 authStore 中的方法更新 Firebase Auth 中的用戶名稱
      await updateUserName(editName.trim());

      // 更新本地狀態
      setMemberName(editName.trim());
      setEditMode(false);

      // 顯示成功通知
      addToast({ message: "名稱更新成功", type: "success" });
    } catch (error) {
      // 錯誤處理和通知
      addToast({ message: "名稱更新失敗: " + error.message, type: "error" });
    }
  };

  // 使用條件渲染決定主內容區域顯示內容
  // 根據 mainTab 狀態動態切換顯示的頁面內容
  let mainContent = null;
  if (mainTab === "profile") {
    mainContent = (
      <div className="sectionInfo flex flex-col justify-center items-center">
        <div className="memberPic my-5">
          <img
            src={picSrc}
            alt="會員頭像"
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => (e.target.src = DEFAULT_PIC)}
            loading="lazy"
          />
        </div>
        <div className="memberName my-5">
          {editMode ? (
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={editName}
                maxLength={10}
                onChange={(e) => setEditName(e.target.value)}
                className="input input-bordered w-full max-w-xs mb-2"
                placeholder="輸入新名稱"
              />
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={handleUpdateName}
                >
                  儲存
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setEditName(memberName);
                    setEditMode(false);
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">{memberName}</span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => {
                  setEditName(memberName);
                  setEditMode(true);
                }}
              >
                ✏️
              </button>
            </div>
          )}
        </div>
        <div className="memberEmail mt-2">
          <span className="text-xl">{memberEmail}</span>
        </div>
      </div>
    );
  } else if (mainTab === "collect") {
    mainContent = (
      <div className="sectionCollect flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">收藏頁面</h2>
        <CollectList />
      </div>
    );
  } else if (mainTab === "message") {
    mainContent = (
      <div className="sectionMessage flex flex-col items-center">
        <MessageBoard memberName={memberName} />
      </div>
    );
  }
  const handleResetTheme = () => {
    resetTheme();
    addToast({ message: "主題已重置為預設", type: "success" });
  };
  return (
    <div className="memberComtainer flex px-10 max-sm:flex-col sm:justify-evenly">
      <div className="memberSide flex sm:flex-col sm:flex-1/2 justify-center items-end border-b-black sm:pr-50 max-sm:mb-10 flex-wrap">
        <button
          className={`btn btn-success m-3 ${
            mainTab === "profile" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("profile")}
        >
          資料
        </button>
        <button
          className={`btn btn-info m-3 ${
            mainTab === "collect" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("collect")}
        >
          收藏
        </button>
        <button
          className={`btn btn-primary m-3 ${
            mainTab === "message" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("message")}
        >
          留言板
        </button>
        <button className="btn btn-outline m-3" onClick={handleResetTheme}>
          重置主題
        </button>
        <button
          className="btn btn-warning m-3"
          onClick={() => {
            logout();
            addToast({ message: "登出成功", type: "success" });
          }}
        >
          登出
        </button>
      </div>
      <div className="memberSection flex sm:flex-col flex-1/2 justify-center items-start border-b-black sm:pl-50">
        {mainContent}
      </div>
    </div>
  );
}

export default Member;
