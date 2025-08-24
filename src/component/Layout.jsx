import { useState} from "react";
import { Outlet } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";
import Accordion from "./Accordion";
import Footer from "./Footer";
import ToTop from "./ToTop";



export default function Layout({ currentTheme, onToggleTheme }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);

  const toggle = (setFn) => () =>
    setFn((prev) => !prev);
  const toggleNav = toggle(setIsNavOpen);
  const toggleDrop = toggle(setIsDropOpen);

  return (
    <div>
      <MobileNavbar
        isNavOpen={isNavOpen}
        toggleNav={toggleNav}
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
      />

      <DesktopNavbar
        toggleNav={toggleNav}
        isDropOpen={isDropOpen}
        toggleDrop={toggleDrop}
        currentTheme={currentTheme}
        onToggleTheme={onToggleTheme}
      />

      <div className="mt-16">
        <Accordion
          imageSrc="/banner.webp"
          altText="Banner"
          showButton={true}
          buttonText="OCCUPY MARS"
          showRocket={true}
        />
      </div>

      <main className="min-h-screen flex flex-col justify-center z-0">
        <Outlet />
      </main>

      <Footer />
      <ToTop />
    </div>
  );
}
