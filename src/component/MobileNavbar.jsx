import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import Nebula from "../component/Nebula";

export default function MobileNavbar({ isNavOpen, toggleNav }) {
  // 從Zustand store中獲取用戶信息和登出方法
  const { user, logout } = authStore();
  // React Router導航hook，用於程序化頁面跳轉
  const navigate = useNavigate();

  // 使用者頭像處理邏輯 - 條件運算符(conditional operator)處理不同情況
  let avatarSrc = "/defaultMemberPic.webp";
  if (user?.photoURL) {
    // 使用可選鏈運算符(?.)安全訪問用戶物件屬性
    avatarSrc = user.photoURL;
  } else {
    avatarSrc = "/avatar.webp";
  }

  // toggleNav函數：由父組件傳入的回調函數
  // 用途：控制導航菜單的展開/收合狀態
  // 調用時機：點擊導航鏈接、會員資料、登入按鈕時

  return (
    <div
      className={`hamLists z-999 mt-15 p-5 flex align-middle justify-between shadow-2xl bg-base-100 md:hidden relative
      // 條件渲染使用模板字符串動態控制CSS類
      ${isNavOpen ? "max-h-fit" : "hidden"} 
      `}
    >
      {/* ... */}

      <ul className="flex flex-col justify-evenly items-left w-full">
        <li>
          <Link to="/company" className="navLink" onClick={toggleNav}>
            公司
          </Link>
        </li>
        <li>
          <Link to="/life" className="navLink" onClick={toggleNav}>
            生平
          </Link>
        </li>
        <li>
          <Link to="/news" className="navLink" onClick={toggleNav}>
            新聞
          </Link>
        </li>
        <li>
          <Link to="/info" className="navLink" onClick={toggleNav}>
            更多消息
          </Link>
        </li>

        <li>
          {/* 使用條件渲染處理登入/未登入兩種狀態 */}
          {user ? (
            <details className="collapse">
              <summary className="collapse-title font-semibold flex justify-center">
                {/* 根據條件處理的頭像顯示 */}
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
              </summary>
              <div
                className="collapse-content"
                onClick={() => {
                  // 複合動作：先導航至會員頁面，然後收合菜單
                  navigate("/member");
                  toggleNav();
                }}
              >
                會員資料
              </div>
              <div className="collapse-content" onClick={logout}>
                {/* 調用Zustand store中的登出方法 */}
                登出
              </div>
            </details>
          ) : (
            <Link to="/login" className="navLink" onClick={toggleNav}>
              登入
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}
