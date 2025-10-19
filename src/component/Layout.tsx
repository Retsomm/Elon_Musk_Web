import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

import Footer from "./Footer";
import ToTop from "./ToTop";

// 定義 toggleNav 函數的型別
type ToggleNavFunction = () => void;

export default function Layout(): React.ReactElement {
  //手機模式下，導覽列表的收合狀態
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const toggleNav: ToggleNavFunction = () => {
    setIsNavOpen((prev) => !prev);
  };

  // 監聽畫面尺寸變化，確保在切換到桌面版時關閉手機選單
  useEffect(() => {
    const handleResize = () => {
      // 當畫面寬度大於或等於 768px (md breakpoint) 時，關閉手機選單
      if (window.innerWidth >= 768 && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    // 添加事件監聽器
    window.addEventListener('resize', handleResize);
    
    // 清理函數，移除事件監聽器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isNavOpen]);

  return (
    <div>
      <DesktopNavbar toggleNav={toggleNav}/>
      <MobileNavbar isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <main className="min-h-screen flex flex-col justify-center z-0">
        <Outlet />
      </main>
      <Footer />
      <ToTop />
    </div>
  );
}
