import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuthStore } from "../hooks/useAuthStore";

interface MobileNavbarProps {
  isNavOpen: boolean;
  toggleNav: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
}

export default function MobileNavbar({
  isNavOpen,
  toggleNav,
  currentTheme,
  onToggleTheme,
}: MobileNavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  let avatarSrc = "/defaultMemberPic.webp";
  if (user?.photoURL) {
    avatarSrc = user.photoURL;
  } else if (user?.email?.endsWith("@gmail.com")) {
    avatarSrc = `https://www.google.com/s2/photos/profile/${user.email}`;
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/avatar.webp";
  };

  return (
    <div
      className={`hamLists z-999 mt-15 fixed top-15 left-0 right-0 p-2 px-1 flex align-middle justify-between shadow-2xl bg-base-100 md:hidden
      ${isNavOpen ? "max-h-fit" : "hidden"} 
      `}
      style={{ zIndex: 9998 }}
    >
      <ul className={`hamList ${isNavOpen ? true : false}`}>
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
          {user ? (
            <details className="collapse">
              <summary className="collapse-title font-semibold flex justify-center">
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                  onError={handleImgError}
                />
              </summary>
              <div
                className="collapse-content"
                onClick={() => {
                  navigate("/member");
                  toggleNav();
                }}
              >
                會員資料
              </div>
              <div className="collapse-content" onClick={logout}>
                登出
              </div>
            </details>
          ) : (
            <Link to="/login" className="navLink" onClick={toggleNav}>
              登入
            </Link>
          )}
        </li>
        <li>
          <div
            className="navLink flex items-center gap-2 tooltip tooltip-bottom"
            data-tip="switchTheme"
          >
            <span className="text-sm"></span>
            <ThemeToggle currentTheme={currentTheme} onToggle={onToggleTheme} />
          </div>
        </li>
      </ul>
    </div>
  );
}
