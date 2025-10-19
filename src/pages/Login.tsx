import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import {
  handleRegister as handleRegisterAction,
  handleEmailLogin as handleEmailLoginAction,
  handleGoogleLogin as handleGoogleLoginAction,
} from "../utils/authHandlers";
import type { AuthActions, NavigationFunction } from "../utils/authHandlers";
import type { FormEvent, ChangeEvent, FC } from "react";

const Login: FC = () => {
  // [Hook] 使用 useState 管理表單輸入值
  const [email, setEmail] = useState(""); // 管理電子郵件輸入值的狀態
  const [password, setPassword] = useState(""); // 管理密碼輸入值的狀態

  // [Hook] 使用自定義 store hooks 獲取狀態和操作方法
  const { login, register, loginWithGoogle, logout } = authStore(); // 從 authStore 解構認證相關方法
  const navigate: NavigationFunction = useNavigate(); // React Router 導航控制 hook

  // 註冊處理函數
  const handleRegister = async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    // [物件處理] 將 auth 方法打包成物件傳遞給處理函數
    await handleRegisterAction(
      email,
      password,
      { login, register, loginWithGoogle, logout }, // 將認證方法作為物件傳遞
      navigate // 導航函數，用於成功後跳轉
    );
  };

  // 一般登入處理函數
  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // [物件處理] 將 auth 方法打包成物件傳遞給處理函數
    await handleEmailLoginAction(
      email,
      password,
      { login, register, loginWithGoogle, logout }, // 將認證方法作為物件傳遞
      navigate // 導航函數
    );
  };

  // Google 登入處理函數
  const handleGoogleLogin = async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    // [物件處理] 將 auth 方法打包成物件傳遞給處理函數
    await handleGoogleLoginAction(
      { login, register, loginWithGoogle, logout }, // 將認證方法作為物件傳遞
      navigate // 導航函數
    );
  };
  return (
    <>
      <form
        className="max-w-120 mx-auto border p-5"
        onSubmit={handleEmailLogin}
      >
        <div className="form-control w-full max-w-md mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text">Your email</span>
          </label>
          <input
            type="email"
            id="email"
            className="input input-bordered w-full max-w-md"
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-md mb-6">
          <label className="label" htmlFor="password">
            <span className="label-text">Your password</span>
          </label>
          <input
            type="password"
            id="password"
            className="input input-bordered w-full max-w-md"
            required
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            className="btn btn-active"
            onClick={handleRegister}
            type="button"
          >
            註冊
          </button>
          <button className="btn" type="submit">
            <svg
              aria-label="Email icon"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="black"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            Login with Email
          </button>
          <button className="btn" type="button" onClick={handleGoogleLogin}>
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>
          
        </div>
      </form>
    </>
  );
};

export default Login;
