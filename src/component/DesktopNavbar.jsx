import { Link, useNavigate } from "react-router-dom";
import { Hamburger } from "lucide-react";
import { authStore } from "../store/authStore";
import Nebula from "../component/Nebula";

export default function DesktopNavbar({ toggleNav }) {
  // 從 authStore 中解構出 user 物件，使用 Zustand store 來管理認證狀態
  // user 物件包含使用者登入資訊，如 photoURL 等屬性
  const { user, loading } = authStore();

  // React Router v6 hook，用於程式化導航
  // 可通過 navigate('/path') 進行頁面跳轉
  const navigate = useNavigate();
  let avatarSrc = "/avatar.webp";
  if (user?.photoURL) {
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
          {loading ? (
            // 載入中顯示預設頭像
            <img
              src="/avatar.webp"
              alt="載入中..."
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : user ? (
            // 用戶已登入
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-transparent border-none hover:bg-transparent"
                onClick={() => navigate("/member")}
              >
                <img
                  src={user.photoURL || "/avatar.webp"}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            // 用戶未登入
            <Link to="/login" className="navLink">
              登入
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
