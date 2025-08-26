import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

import Footer from "./Footer";
import ToTop from "./ToTop";

export default function Layout({ currentTheme }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  function toggleNav() {
    setIsNavOpen((prev) => !prev);
  }

  return (
    <div>
      <DesktopNavbar toggleNav={toggleNav} currentTheme={currentTheme} />
      <MobileNavbar isNavOpen={isNavOpen} toggleNav={toggleNav} />

      <main className="min-h-screen flex flex-col justify-center z-0">
        <Outlet />
      </main>
      <Footer />
      <ToTop />
    </div>
  );
}
