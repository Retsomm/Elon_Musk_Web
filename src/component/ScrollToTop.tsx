// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 每次路由切換後滾動到頂端
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
