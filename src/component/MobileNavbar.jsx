import { NavLink, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";

export default function MobileNavbar({ isNavOpen, toggleNav }) {
  // 從Zustand store中獲取用戶信息和登出方法
  const { user, logout, loading } = authStore();
  // React Router導航hook，用於程序化頁面跳轉
  const navigate = useNavigate();

  let avatarSrc = "/avatar.webp";
  if (user?.photoURL) {
    // 可選鏈運算符(?)，安全地訪問 user 物件的 photoURL 屬性
    // 避免當 user 為 null 或 undefined 時出現錯誤
    avatarSrc = user.photoURL;
  } else {
    avatarSrc = "/avatar.webp";
  }

  // toggleNav函數：由父組件傳入的回調函數
  // 用途：控制導航菜單的展開/收合狀態
  // 調用時機：點擊導航鏈接、會員資料、登入按鈕時

  return (
    <div
      className={`hamLists z-[999] fixed top-16 w-full p-5 flex align-middle justify-between shadow-2xl bg-base-100 md:hidden
      ${isNavOpen ? "max-h-fit" : "hidden"} 
      `}
    >
      <ul className="flex flex-col justify-evenly items-left w-full">
        <li>
          <NavLink to="/" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
            首頁
          </NavLink>
        </li>
        <li>
          <NavLink to="/company" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
            公司
          </NavLink>
        </li>
        <li>
          <NavLink to="/life" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
            生平
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
            新聞
          </NavLink>
        </li>
        <li>
          <NavLink to="/info" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
            更多消息
          </NavLink>
        </li>

        <li>
          {/* 使用條件渲染處理登入/未登入兩種狀態 */}
          {loading ? (
            // 載入中顯示預設頭像
            <img
              src="/avatar.webp"
              alt="載入中..."
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
          ) : user ? (
            <details className="collapse">
              <summary className="collapse-title font-semibold flex justify-center cursor-pointer">
                {/* 根據條件處理的頭像顯示 */}
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy"
                />
              </summary>
              <div
                className="collapse-content cursor-pointer"
                onClick={() => {
                  // 複合動作：先導航至會員頁面，然後收合菜單
                  navigate("/member");
                  toggleNav();
                }}
              >
                會員資料
              </div>
              <div className="collapse-content cursor-pointer" onClick={logout}>
                {/* 調用Zustand store中的登出方法 */}
                登出
              </div>
            </details>
          ) : (
            <NavLink to="/login" className={({ isActive }) => 
              isActive ? "navLink active" : "navLink"
            } onClick={toggleNav}>
              登入
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
}
