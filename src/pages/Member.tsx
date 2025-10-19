import { useState, useEffect, type ChangeEvent, type SyntheticEvent } from "react";
import { authStore } from "../store/authStore";
import { toastStore } from "../store/toastStore";
import { handleLogout as handleLogoutAction } from "../utils/authHandlers";
import { useNavigate } from "react-router-dom";
import MessageBoard from "../component/MessageBoard";
import CollectList from "../component/CollectList";
import type { 
  MemberTabType, 
  MemberState, 
  TabButtonConfig, 
  MemberProfileInfo, 
  NameEditValidation,
  MemberPageConfig 
} from "../types/member";

// 預設頭像路徑
const DEFAULT_PIC: string = "/avatar.webp";

// 名稱最大長度限制
const MAX_NAME_LENGTH: number = 10;

// 頁籤配置
const TAB_CONFIGS: TabButtonConfig[] = [
  { key: 'profile', label: '資料', buttonClass: 'btn-success' },
  { key: 'collect', label: '收藏', buttonClass: 'btn-info' },
  { key: 'message', label: '留言板', buttonClass: 'btn-primary' }
] as const;

const Member: React.FC = () => {
  // 從 authStore 獲取用戶資訊及方法
  // user: 包含用戶資料的物件 (email, displayName, photoURL 等)
  // logout: 登出方法，調用後會清除用戶身分認證
  // loading: 表示身分驗證狀態是否正在加載
  // updateUserName: 更新用戶名稱的異步方法，連接到 Firebase Auth
  const { user, logout, loading, updateUserName } = authStore();
  const navigate = useNavigate();
  // 本地狀態管理
  const [editMode, setEditMode] = useState<boolean>(false); // 名稱編輯模式標記
  const [editName, setEditName] = useState<string>(""); // 編輯中的名稱暫存
  const [mainTab, setMainTab] = useState<MemberTabType>("profile"); // 當前選中的頁籤

  // 處理用戶郵箱和頭像資訊
  const memberEmail: string = user?.email || ""; // 可選鏈操作符，防止 user 為 null/undefined
  const googlePhoto: string | null | undefined = user?.photoURL; // 從 user 物件取得 Google 頭像
  const isGmail: boolean = memberEmail.endsWith("@gmail.com"); // 檢查郵箱是否為 Gmail

  // 用戶名稱的本地狀態管理
  const [memberName, setMemberName] = useState<string>("");

  // useEffect 鉤子：當 user/isGmail/memberEmail 變更時執行
  // 用於初始化用戶名稱邏輯
  useEffect(() => {
    if (user) {
      let name: string = "";
      if (isGmail && user.displayName) {
        name = user.displayName;
      } else {
        name = memberEmail.split("@")[0];
      }
      setMemberName(name);
    }
  }, [user, isGmail, memberEmail]); // 依賴數組，決定何時重新執行此 effect

  const picSrc: string = googlePhoto || DEFAULT_PIC;

  if (loading) return null; // 加載中不渲染內容

  // 名稱驗證函數
  const validateName = (name: string): NameEditValidation => {
    const trimmedName = name.trim();
    const isEmpty = trimmedName === "";
    const isTooLong = trimmedName.length > MAX_NAME_LENGTH;
    
    return {
      isValid: !isEmpty && !isTooLong,
      isEmpty,
      isTooLong,
      errorMessage: isEmpty ? "名稱不能為空" : isTooLong ? `名稱長度不能超過${MAX_NAME_LENGTH}個字元` : undefined
    };
  };

  // 處理名稱更新 - 異步操作連接到資料庫
  const handleUpdateName = async (): Promise<void> => {
    const validation = validateName(editName);
    
    if (!validation.isValid) {
      toastStore.error(validation.errorMessage || "名稱格式不正確");
      return;
    }

    try {
      await updateUserName(editName.trim());
      setMemberName(editName.trim());
      setEditMode(false);
      toastStore.success("名稱更新成功");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知錯誤";
      toastStore.error("名稱更新失敗: " + errorMessage);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await handleLogoutAction({ logout, register: async () => {}, login: async () => {}, loginWithGoogle: async () => {} });
    // 登出後導航到首頁
    navigate("/");
  };

  // 處理頁籤切換
  const handleTabChange = (tab: MemberTabType): void => {
    setMainTab(tab);
  };

  // 進入編輯模式
  const enterEditMode = (): void => {
    setEditName(memberName);
    setEditMode(true);
  };

  // 取消編輯模式
  const cancelEditMode = (): void => {
    setEditName(memberName);
    setEditMode(false);
  };

  // 處理名稱輸入變更
  const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditName(e.target.value);
  };

  // 處理圖片載入錯誤
  const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.src = DEFAULT_PIC;
  };
  // 使用條件渲染決定主內容區域顯示內容
  // 根據 mainTab 狀態動態切換顯示的頁面內容
  let mainContent: React.ReactElement | null = null;
  if (mainTab === "profile") {
    mainContent = (
      <div className="sectionInfo flex flex-col justify-center items-center">
        <div className="memberPic my-5">
          <img
            src={picSrc}
            alt="會員頭像"
            className="w-24 h-24 rounded-full object-cover"
            onError={handleImageError}
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
                onChange={handleNameInputChange}
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
                  onClick={cancelEditMode}
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
                onClick={enterEditMode}
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

  return (
    <div className="memberContainer flex px-30 max-md:flex-col md:justify-around mt-16">
      <div className="memberSide md:left-10 md:fixed md:top-1/3 flex md:flex-col md:flex-1/2 justify-center items-end border-b-black flex-wrap mt-16 md:mt-0">
        {TAB_CONFIGS.map((tab) => (
          <button
            key={tab.key}
            className={`btn ${tab.buttonClass} m-3 ${
              mainTab === tab.key ? "btn-active" : ""
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}

        <button className="btn btn-warning m-3" onClick={handleLogout}>
          登出
        </button>
      </div>
      <div className="memberSection flex sm:flex-col flex-1/2 justify-center items-start border-b-black sm:pl-50 mt-5">
        {mainContent}
      </div>
    </div>
  );
}

export default Member;
