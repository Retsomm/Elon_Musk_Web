// Member 頁面相關型別定義

/**
 * Member 頁面的主要頁籤類型
 */
export type MemberTabType = 'profile' | 'collect' | 'message';

/**
 * Member 頁面的本地狀態介面
 */
export interface MemberState {
  /** 是否處於編輯模式 */
  editMode: boolean;
  /** 編輯中的名稱暫存 */
  editName: string;
  /** 當前選中的主要頁籤 */
  mainTab: MemberTabType;
  /** 用戶顯示名稱 */
  memberName: string;
}

/**
 * Member 頁面的事件處理器介面
 */
export interface MemberEventHandlers {
  /** 處理名稱更新 */
  handleUpdateName: () => Promise<void>;
  /** 處理登出 */
  handleLogout: () => Promise<void>;
  /** 處理頁籤切換 */
  handleTabChange: (tab: MemberTabType) => void;
  /** 進入編輯模式 */
  enterEditMode: () => void;
  /** 取消編輯模式 */
  cancelEditMode: () => void;
  /** 處理名稱輸入變更 */
  handleNameInputChange: (value: string) => void;
}

/**
 * Member 頁面的 Props 介面（如果將來需要的話）
 */
export interface MemberProps {
  /** 可選的初始頁籤 */
  initialTab?: MemberTabType;
  /** 是否顯示編輯功能 */
  showEditFeature?: boolean;
}

/**
 * 頁籤按鈕的配置介面
 */
export interface TabButtonConfig {
  /** 頁籤的唯一識別碼 */
  key: MemberTabType;
  /** 顯示標籤 */
  label: string;
  /** 按鈕樣式類型 */
  buttonClass: string;
  /** 是否啟用 */
  enabled?: boolean;
}

/**
 * 成員個人資料資訊介面
 */
export interface MemberProfileInfo {
  /** 用戶電子郵件 */
  email: string;
  /** 用戶顯示名稱 */
  displayName: string;
  /** 用戶頭像 URL */
  photoURL: string | null;
  /** 是否為 Gmail 用戶 */
  isGmail: boolean;
}

/**
 * 名稱編輯表單驗證介面
 */
export interface NameEditValidation {
  /** 是否有效 */
  isValid: boolean;
  /** 錯誤訊息 */
  errorMessage?: string;
  /** 是否為空 */
  isEmpty: boolean;
  /** 是否超出長度限制 */
  isTooLong: boolean;
}

/**
 * Member 頁面的常數配置
 */
export interface MemberPageConfig {
  /** 預設頭像路徑 */
  DEFAULT_PIC: string;
  /** 名稱最大長度 */
  MAX_NAME_LENGTH: number;
  /** 可用的頁籤列表 */
  AVAILABLE_TABS: TabButtonConfig[];
}