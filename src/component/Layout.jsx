import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Hamburger, Rocket, ChevronsDown, ChevronsUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ToTop from "./ToTop";
export default function Layout({ currentTheme, onToggleTheme }) {
  const [isPicVisible, setIsPicVisible] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const { logout } = useAuth();
  const { user, loginType } = useAuth();
  const navigate = useNavigate();

  const toggle = (setFn) => () => setFn((prev) => !prev);
  const togglePic = toggle(setIsPicVisible);
  const toggleNav = toggle(setIsNavOpen);
  const toggleDrop = toggle(setIsDropOpen);
  let avatarSrc = "/defaultMemberPic.webp";
  if (user?.photoURL) {
    avatarSrc = user.photoURL;
  } else if (user?.email?.endsWith("@gmail.com")) {
    avatarSrc = `https://www.google.com/s2/photos/profile/${user.email}`;
  }
  return (
    <div>
      <div
        className={`hamLists z-999 mt-15 fixed top-15 left-0 right-0 p-2 px-1 flex align-middle justify-between shadow-2xl bg-base-100
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
                    onError={(e) => (e.target.src = "/avatar.webp")}
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
              <ThemeToggle
                currentTheme={currentTheme}
                onToggle={onToggleTheme}
              />
            </div>
          </li>
        </ul>
      </div>
      <nav
        className="fixed top-0 left-0 right-0 nav p-2 px-10 flex align-middle sm:justify-between justify-center shadow-2xl z-1000 items-center bg-base-100"
        style={{ zIndex: 9999 }}
      >
        <div className="ham md:hidden left-5 absolute rounded-full p-2">
          <Hamburger className="hamburger cursor-pointer" onClick={toggleNav} />
        </div>
        <div className="logo tooltip tooltip-bottom" data-tip="homePage">
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
              <div className="dropdown hover:bg-opacity-100 bg-baase-100">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn m-1 hover:bg-opacity-100 bg-baase-100"
                  onClick={toggleDrop}
                >
                  <img
                    src={avatarSrc}
                    alt="會員頭像"
                    className={`w-12 h-12 rounded-full object-cover ${
                      isDropOpen ? true : false
                    }`}
                    onError={(e) => (e.target.src = "/avatar.webp")}
                  />
                </div>
                <ul
                  tabIndex={0}
                  className={`dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm ${
                    isDropOpen ? "max-h-fit" : "hidden"
                  }`}
                >
                  <li
                    onClick={() => {
                      navigate("/member");
                      toggleDrop();
                    }}
                  >
                    <a>會員資料</a>
                  </li>

                  <li onClick={logout}>
                    <a>登出</a>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="navLink">
                登入
              </Link>
            )}
          </li>
          <li>
            <div
              className="flex items-center gap-2 tooltip tooltip-bottom"
              data-tip="switchTheme"
            >
              <span className="text-sm"></span>
              <ThemeToggle
                currentTheme={currentTheme}
                onToggle={onToggleTheme}
              />
            </div>
          </li>
        </ul>
      </nav>
      <div className="accordion mt-16 flex flex-col items-center justify-center h-fit">
        <div
          className="cursor-pointer p-3 text-center font-bold"
          onClick={togglePic}
        >
          {isPicVisible ? <ChevronsUp /> : <ChevronsDown />}
        </div>

        <div
          className={`overflow-hidden transition-all duration-700 flex flex-col items-center justify-center ${
            isPicVisible ? "max-h-screen" : "max-h-0"
          }`}
        >
          <img
            src="/banner.webp"
            alt="Banner"
            className="w-full max-w-screen-lg h-auto"
            loading="lazy"
          />
          <button className="btn btn-outline btn-secondary m-3">
            OCCUPY MARS
          </button>
          <div className="rocket hidden">
            <Rocket />
          </div>
        </div>
      </div>

      <main className="min-h-screen flex flex-col justify-center z-0">
        <Outlet />
      </main>

      <footer>
        <div className="accordion flex flex-col items-center justify-center h-fit">
          <div
            className="cursor-pointer p-3 text-center font-bold"
            onClick={togglePic}
          >
            {isPicVisible ? <ChevronsUp /> : <ChevronsDown />}
          </div>
          <div
            className={`overflow-hidden transition-all duration-700 ${
              isPicVisible ? "max-h-screen" : "max-h-0"
            }`}
          >
            <img
              src="/mars.webp"
              alt="mars"
              className="w-full max-w-screen-lg h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </footer>
      <div className="contact h-15 flex justify-center items-center p-5">
        If there is any infringement, please email to 112182ssss@gmail.com
      </div>
      <ToTop />
    </div>
  );
}
