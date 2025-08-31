import { Link, useNavigate } from "react-router-dom";
import { Hamburger } from "lucide-react";
import { authStore } from "../store/authStore";
import Nebula from "../component/Nebula";

export default function DesktopNavbar({ toggleNav }) {
  // 從 authStore 中解構出 user 物件，使用 Zustand store 來管理認證狀態
  // user 物件包含使用者登入資訊，如 photoURL 等屬性
  const { user } = authStore();
  
  // React Router v6 hook，用於程式化導航
  // 可通過 navigate('/path') 進行頁面跳轉
  const navigate = useNavigate();

  // 使用者頭像來源的條件處理
  // 1. 若 user 物件存在且有 photoURL 屬性，則使用用戶的頭像
  // 2. 否則使用預設頭像
  let avatarSrc = "/avatar.webp";
  if (user?.photoURL) {
    // 可選鏈運算符(?)，安全地訪問 user 物件的 photoURL 屬性
    // 避免當 user 為 null 或 undefined 時出現錯誤
    avatarSrc = user.photoURL;
  } else {
    avatarSrc = "/avatar.webp";
  }

  return (
    <nav className="nav p-2 px-10 flex align-middle sm:justify-between justify-center shadow-2xl z-[1000] items-center bg-base-100 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        <Nebula className="w-full h-full" />
      </div>
      <div className="ham md:hidden left-5 absolute rounded-full p-2">
        {/* 點擊漢堡選單觸發 toggleNav 函數，控制行動版選單的顯示/隱藏 */}
        <Hamburger className="hamburger cursor-pointer" onClick={toggleNav} />
      </div>
      <div
        className="logo"
        // 條件式事件處理：僅在行動裝置時執行 toggleNav
        // 使用 window.innerWidth 檢測螢幕寬度，若小於 768px 則啟用 toggleNav 功能
        onClick={window.innerWidth < 768 ? toggleNav : undefined}
      >
        <Link to="/" className="navLink flex text-center">
          <img
            src="/logo.webp"
            className="max-w-md"
            alt="Elon Musk 首頁連結"
            loading="lazy"
          />
        </Link>
      </div>
      <ul className="flex justify-evenly max-md:hidden items-center">
        <li>
          <Link to="/company" className="navLink">
            公司
          </Link>
        </li>
        <li>
          <Link to="/life" className="navLink">
            生平
          </Link>
        </li>
        <li>
          <Link to="/news" className="navLink">
            新聞
          </Link>
        </li>
        <li>
          <Link to="/info" className="navLink">
            更多消息
          </Link>
        </li>

        <li>
          {/* 條件式渲染：根據 user 物件是否存在決定顯示用戶頭像或登入連結 */}
          {user ? (
            // 若 user 存在，顯示用戶頭像並設置下拉選單
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent border-none hover:bg-transparent"
                // 點擊頭像時導航到會員頁面
                onClick={() => navigate("/member")}
              >
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            // 若 user 不存在，顯示登入連結
            <Link to="/login" className="navLink">
              登入
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}