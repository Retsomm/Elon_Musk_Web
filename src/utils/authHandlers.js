import { validateLoginForm, validateRegisterForm } from './validation';
import { toastStore } from '../store/toastStore';

/**
 * 處理用戶註冊流程
 * @param {string} email - 用戶輸入的電子郵件
 * @param {string} password - 用戶輸入的密碼
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleRegister = async (
    email,
    password,
    authActions,
    navigate
) => {
    // 驗證註冊表單，返回物件結構: { isValid: boolean, message: string }
    const validation = validateRegisterForm(email, password);
    if (!validation.isValid) {
        // 當驗證失敗時，顯示錯誤通知
        toastStore.error(validation.message || "驗證失敗");
        return;
    }

    try {
        // 非同步操作：使用 Firebase Authentication 註冊新用戶
        await authActions.register(email, password);
        // 註冊成功，顯示成功通知
        toastStore.success("註冊成功，正在自動登入...");
        // 非同步操作：自動登入剛註冊的用戶
        await authActions.login(email, password);
        // 使用 setTimeout 延遲導航，讓用戶有時間看到成功訊息
        setTimeout(() => navigate("/member"), 1000);
    } catch (error) {
        // 錯誤物件處理，Firebase auth 錯誤物件包含 code 和 message 屬性
        if (error.code === "auth/email-already-in-use") {
            toastStore.error("此 Email 已註冊，請直接登入。");
        } else {
            toastStore.error(error.message || "註冊失敗");
        }
    }
};

/**
 * 處理電子郵件和密碼登入流程
 * @param {string} email - 用戶輸入的電子郵件
 * @param {string} password - 用戶輸入的密碼
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleEmailLogin = async (
    email,
    password,
    authActions,
    navigate
) => {
    // 驗證登入表單，返回物件結構: { isValid: boolean, message: string }
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
        // 當驗證失敗時，顯示錯誤通知
        toastStore.error(validation.message || "驗證失敗");
        return;
    }

    try {
        // 非同步操作：Firebase Authentication 登入
        await authActions.login(email, password);
        // 登入成功，顯示成功通知
        toastStore.success("登入成功");
        // 延遲導航，處理 UI 狀態轉換
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        // 處理登入錯誤，error 物件通常包含 message 屬性
        toastStore.error(error.message || "登入失敗");
    }
};

/**
 * 處理 Google OAuth 第三方登入流程
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleGoogleLogin = async (
    authActions,
    navigate
) => {
    try {
        // 非同步操作：調用 Firebase Authentication 的 Google 提供者登入
        await authActions.loginWithGoogle();
        // 登入成功，顯示成功通知
        toastStore.success("Google 登入成功");
        // 延遲導航，優化使用者體驗
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        // 處理 Google 登入錯誤，可能包含 OAuth 相關的特定錯誤
        toastStore.error(error.message || "Google 登入失敗");
    }
};

/**
 * 處理用戶登出流程
 * @param {Object} authActions - 包含認證相關方法的物件
 * @param {Function} navigate - React Router 的導航函數，用於頁面跳轉
 * @returns {Promise<void>}
 */
export const handleLogout = async (
    authActions,
    navigate
) => {
    try {
        
        // 先執行登出，再顯示成功訊息
        await authActions.logout();
        
        toastStore.success("登出成功！");
        
        setTimeout(() => {
            navigate("/");
        }, 1000);
    } catch (error) {
        toastStore.error(error.message || "登出失敗");
    }
};