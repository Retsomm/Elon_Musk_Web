import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import Nebula from "../component/Nebula";

export default function MobileNavbar({
  isNavOpen,
  toggleNav,
}) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  let avatarSrc = "/defaultMemberPic.webp";
  if (user?.photoURL) {
    avatarSrc = user.photoURL;
  } else {
    avatarSrc = "/avatar.webp";
  }

  return (
    <div
      className={`hamLists z-999 mt-15 p-2 px-1 flex align-middle justify-between shadow-2xl bg-base-100 md:hidden relative
      ${isNavOpen ? "max-h-fit" : "hidden"} 
      `}
    >
      <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
        <Nebula className="w-full h-full" />
      </div>
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
            //daisyui內建收合功能
            <details className="collapse">
              <summary className="collapse-title font-semibold flex justify-center">
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
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
      
      </ul>
    </div>
  );
}
