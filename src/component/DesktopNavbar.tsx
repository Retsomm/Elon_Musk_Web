import { NavLink, useNavigate } from "react-router-dom";
import { Hamburger } from "lucide-react";
import { authStore } from "../store/authStore";
import Nebula from "./Nebula";

// 定義 DesktopNavbar 組件的 props 型別
interface DesktopNavbarProps {
  toggleNav: () => void;
}

export default function DesktopNavbar({ toggleNav }: DesktopNavbarProps): React.ReactElement {
  // 從 authStore 中解構出 user 物件，使用 Zustand store 來管理認證狀態
  // user 物件包含使用者登入資訊，如 photoURL 等屬性
  const { user, loading } = authStore();

  // React Router v6 hook，用於程式化導航
  // 可通過 navigate('/path') 進行頁面跳轉
  const navigate = useNavigate();
  let avatarSrc: string = "/avatar.webp";
  if (user?.photoURL) {
    avatarSrc = user.photoURL;
  } else {
    avatarSrc = "/avatar.webp";
  }

  return (
    <nav className="fixed top-0 left-0 right-0 nav p-2 px-10 flex align-middle md:justify-between justify-center shadow-2xl z-[1000] items-center bg-base-100 overflow-hidden">
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        <Nebula />
      </div>
      <div
        className="ham md:hidden left-5 absolute rounded-full p-2"
        onClick={toggleNav}
      >
        <Hamburger className="hamburger cursor-pointer" />
      </div>
      <div className="logo">
        <img
          src="/logo.webp"
          className="h-12 cursor-pointer"
          alt="web logo"
          loading="lazy"
        />
      </div>
      <ul className="flex justify-evenly max-md:hidden items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
            onClick={toggleNav}
          >
            首頁
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/company"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            公司
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/life"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            生平
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            新聞
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/info"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            更多消息
          </NavLink>
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
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              登入
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
