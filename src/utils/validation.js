/**
 * 驗證工具函數
 */
/**
 * 驗證 email 格式
 * @param email - 要驗證的 email 地址
 * @returns 驗證結果
 */
export const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) {
        return {
            isValid: false,
            message: "請輸入 Email"
        };
    }

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: "請輸入正確的 Email 格式"
        };
    }

    return {
        isValid: true
    };
};

/**
 * 驗證密碼強度
 * 密碼需至少8碼，包含大小寫字母、數字、特殊符號
 * @param password - 要驗證的密碼
 * @returns 驗證結果
 */
export const validatePassword = (password) => {
    if (!password) {
        return {
            isValid: false,
            message: "請輸入密碼"
        };
    }

    if (password.length < 8) {
        return {
            isValid: false,
            message: "密碼至少需要8個字符"
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: "密碼需包含小寫字母"
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: "密碼需包含大寫字母"
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            isValid: false,
            message: "密碼需包含數字"
        };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        return {
            isValid: false,
            message: "密碼需包含特殊符號"
        };
    }

    return {
        isValid: true
    };
};

/**
 * 驗證登入表單
 * @param email - email 地址
 * @param password - 密碼
 * @returns 驗證結果
 */
export const validateLoginForm = (email, password) => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }

    if (!password) {
        return {
            isValid: false,
            message: "請輸入密碼"
        };
    }

    return {
        isValid: true
    };
};

/**
 * 驗證註冊表單
 * @param email - email 地址
 * @param password - 密碼
 * @returns 驗證結果
 */
export const validateRegisterForm = (email, password) => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return emailValidation;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }

    return {
        isValid: true
    };
};
