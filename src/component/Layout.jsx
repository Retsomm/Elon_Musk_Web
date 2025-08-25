import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

import Footer from "./Footer";
import ToTop from "./ToTop";

export default function Layout({ currentTheme }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);

  const toggle = (setFn) => () => setFn((prev) => !prev);
  const toggleNav = toggle(setIsNavOpen);
  const toggleDrop = toggle(setIsDropOpen);

  return (
    <div>
      <DesktopNavbar
        toggleNav={toggleNav}
        isDropOpen={isDropOpen}
        toggleDrop={toggleDrop}
        currentTheme={currentTheme}
      />
      <MobileNavbar isNavOpen={isNavOpen} />

      <main className="min-h-screen flex flex-col justify-center z-0">
        <Outlet />
      </main>
      <Footer />
      <ToTop />
    </div>
  );
}
