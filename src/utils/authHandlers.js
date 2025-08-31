import { validateLoginForm, validateRegisterForm } from './validation';

/**
 * 處理用戶註冊流程
 * @param {string} email - 用戶輸入的電子郵件
 * @param {string} password - 用戶輸入的密碼
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} authActions.register - 處理註冊的非同步方法，接收 email 和 password 參數
 * @param {Function} authActions.login - 處理登入的非同步方法，接收 email 和 password 參數
 * @param {Function} addToast - 顯示通知的函數，接收通知物件 {message, type}
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleRegister = async (
    email,
    password,
    authActions,
    addToast,
    navigate
) => {
    // 驗證註冊表單，返回物件結構: { isValid: boolean, message: string }
    const validation = validateRegisterForm(email, password);
    if (!validation.isValid) {
        // 當驗證失敗時，顯示錯誤通知
        // addToast 接收一個物件: { message: string, type: string }
        addToast({ message: validation.message || "驗證失敗", type: "error" });
        return;
    }

    try {
        // 非同步操作：使用 Firebase Authentication 註冊新用戶
        await authActions.register(email, password);
        // 註冊成功，顯示成功通知
        addToast({ message: "註冊成功，正在自動登入...", type: "success" });
        // 非同步操作：自動登入剛註冊的用戶
        await authActions.login(email, password);
        // 使用 setTimeout 延遲導航，讓用戶有時間看到成功訊息
        setTimeout(() => navigate("/member"), 1000);
    } catch (error) {
        // 錯誤物件處理，Firebase auth 錯誤物件包含 code 和 message 屬性
        if (error.code === "auth/email-already-in-use") {
            addToast({ message: "此 Email 已註冊，請直接登入。", type: "error" });
        } else {
            addToast({ message: error.message || "註冊失敗", type: "error" });
        }
        console.log("Register error:", error);
    }
};

/**
 * 處理電子郵件和密碼登入流程
 * @param {string} email - 用戶輸入的電子郵件
 * @param {string} password - 用戶輸入的密碼
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} authActions.login - 處理登入的非同步方法，連接 Firebase Authentication
 * @param {Function} addToast - 顯示通知的函數，接收通知物件 {message, type}
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleEmailLogin = async (
    email,
    password,
    authActions,
    addToast,
    navigate
) => {
    // 驗證登入表單，返回物件結構: { isValid: boolean, message: string }
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
        // 當驗證失敗時，顯示錯誤通知
        addToast({ message: validation.message || "驗證失敗", type: "error" });
        return;
    }

    try {
        // 非同步操作：Firebase Authentication 登入
        await authActions.login(email, password);
        // 登入成功，顯示成功通知
        addToast({ message: "登入成功", type: "success" });
        // 延遲導航，處理 UI 狀態轉換
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        // 處理登入錯誤，error 物件通常包含 message 屬性
        addToast({ message: error.message || "登入失敗", type: "error" });
    }
};

/**
 * 處理 Google OAuth 第三方登入流程
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} authActions.loginWithGoogle - 處理 Google 登入的非同步方法，調用 Firebase OAuth
 * @param {Function} addToast - 顯示通知的函數，接收通知物件 {message, type}
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleGoogleLogin = async (
    authActions,
    addToast,
    navigate
) => {
    try {
        // 非同步操作：調用 Firebase Authentication 的 Google 提供者登入
        await authActions.loginWithGoogle();
        // 登入成功，顯示成功通知
        addToast({ message: "Google 登入成功", type: "success" });
        // 延遲導航，優化使用者體驗
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        // 處理 Google 登入錯誤，可能包含 OAuth 相關的特定錯誤
        addToast({ message: error.message || "Google 登入失敗", type: "error" });
    }
};