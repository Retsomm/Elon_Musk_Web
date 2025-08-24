import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import {
  handleRegister as handleRegisterAction,
  handleEmailLogin as handleEmailLoginAction,
  handleGoogleLogin as handleGoogleLoginAction,
} from "../utils/authHandlers";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // 註冊
  const handleRegister = async (e) => {
    e.preventDefault();
    await handleRegisterAction(
      email,
      password,
      { login, register, loginWithGoogle },
      setAlert,
      navigate
    );
  };

  // 一般登入
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await handleEmailLoginAction(
      email,
      password,
      { login, register, loginWithGoogle },
      setAlert,
      navigate
    );
  };

  // Google 登入
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await handleGoogleLoginAction(
      { login, register, loginWithGoogle },
      setAlert,
      navigate
    );
  };

  // alert 樣式
  const alertClass =
    alert.type === "success" ? "alert alert-success" : "alert alert-error";

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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
      {alert.show && (
        <div role="alert" className={alertClass + " mt-4 w-fit mx-auto"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{alert.message}</span>
        </div>
      )}
    </>
  );
};

export default Login;
