import { validateLoginForm, validateRegisterForm } from './validation';

export interface AuthResult {
    success: boolean;
    message: string;
}

export interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

export interface NavigateFunction {
    (to: string): void;
}

export interface AlertSetter {
    (alert: { show: boolean; type: "success" | "error"; message: string }): void;
}

/**
 * 處理註冊邏輯
 */
export const handleRegister = async (
    email: string,
    password: string,
    authActions: AuthActions,
    setAlert: AlertSetter,
    navigate: NavigateFunction
): Promise<void> => {
    // 驗證表單
    const validation = validateRegisterForm(email, password);
    if (!validation.isValid) {
        setAlert({
            show: true,
            type: "error",
            message: validation.message || "驗證失敗",
        });
        return;
    }

    try {
        await authActions.register(email, password);
        setAlert({
            show: true,
            type: "success",
            message: "註冊成功，正在自動登入...",
        });
        await authActions.login(email, password);
        setTimeout(() => navigate("/member"), 1000);
    } catch (error: any) {
        // 針對已註冊的 email 顯示友善訊息
        if (error.code === "auth/email-already-in-use") {
            setAlert({
                show: true,
                type: "error",
                message: "此 Email 已註冊，請直接登入。",
            });
        } else {
            setAlert({
                show: true,
                type: "error",
                message: error.message || "註冊失敗"
            });
        }
        console.log("Register error:", error);
    }
};

/**
 * 處理一般登入邏輯
 */
export const handleEmailLogin = async (
    email: string,
    password: string,
    authActions: AuthActions,
    setAlert: AlertSetter,
    navigate: NavigateFunction
): Promise<void> => {
    // 驗證表單
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
        setAlert({
            show: true,
            type: "error",
            message: validation.message || "驗證失敗",
        });
        return;
    }

    try {
        await authActions.login(email, password);
        setAlert({
            show: true,
            type: "success",
            message: "登入成功"
        });
        setTimeout(() => navigate("/member"), 1000);
    } catch (error: any) {
        setAlert({
            show: true,
            type: "error",
            message: error.message || "登入失敗"
        });
    }
};

/**
 * 處理 Google 登入邏輯
 */
export const handleGoogleLogin = async (
    authActions: AuthActions,
    setAlert: AlertSetter,
    navigate: NavigateFunction
): Promise<void> => {
    try {
        await authActions.loginWithGoogle();
        setAlert({
            show: true,
            type: "success",
            message: "Google 登入成功"
        });
        setTimeout(() => navigate("/member"), 1000);
    } catch (error: any) {
        setAlert({
            show: true,
            type: "error",
            message: error.message || "Google 登入失敗"
        });
    }
};
