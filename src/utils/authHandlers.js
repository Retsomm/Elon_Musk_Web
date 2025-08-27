import { validateLoginForm, validateRegisterForm } from './validation';

export const handleRegister = async (
    email,
    password,
    authActions,
    addToast,
    navigate
) => {
    const validation = validateRegisterForm(email, password);
    if (!validation.isValid) {
        addToast({ message: validation.message || "驗證失敗", type: "error" });
        return;
    }

    try {
        await authActions.register(email, password);
        addToast({ message: "註冊成功，正在自動登入...", type: "success" });
        await authActions.login(email, password);
        setTimeout(() => navigate("/member"), 1000);
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            addToast({ message: "此 Email 已註冊，請直接登入。", type: "error" });
        } else {
            addToast({ message: error.message || "註冊失敗", type: "error" });
        }
        console.log("Register error:", error);
    }
};

/**
 * 處理一般登入邏輯
 */
export const handleEmailLogin = async (
    email,
    password,
    authActions,
    addToast,
    navigate
) => {
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
        addToast({ message: validation.message || "驗證失敗", type: "error" });
        return;
    }

    try {
        await authActions.login(email, password);
        addToast({ message: "登入成功", type: "success" });
        // 給 toast 一些時間顯示，然後再跳轉
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        addToast({ message: error.message || "登入失敗", type: "error" });
    }
};

/**
 * 處理 Google 登入邏輯
 */
export const handleGoogleLogin = async (
    authActions,
    addToast,
    navigate
) => {
    try {
        await authActions.loginWithGoogle();
        addToast({ message: "Google 登入成功", type: "success" });
        // 縮短延遲時間
        setTimeout(() => navigate("/member"), 500);
    } catch (error) {
        addToast({ message: error.message || "Google 登入失敗", type: "error" });
    }
};