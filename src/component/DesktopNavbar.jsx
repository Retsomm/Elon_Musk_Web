import { Link, useNavigate } from "react-router-dom";
import { Hamburger } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import Nebula from "../component/Nebula";

export default function DesktopNavbar({ toggleNav }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  let avatarSrc = "/defaultMemberPic.webp";
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
        <Hamburger className="hamburger cursor-pointer" onClick={toggleNav} />
      </div>
      <div className="logo">
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
          {user ? (
            <div className="dropdown bg-opacity-100">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-opacity-100"
                onClick={() => navigate("/member")}
              >
                <img
                  src={avatarSrc}
                  alt="會員頭像"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            </div>
          ) : (
            <Link to="/login" className="navLink">
              登入
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
