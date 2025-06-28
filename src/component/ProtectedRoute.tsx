import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}
// 這個元件用來保護需要登入才能訪問的路由
function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 從 AuthContext 取得 user 和 loading 狀態
  const { user, loading } = useAuthStore();

  // 如果正在載入驗證狀態，暫時不渲染內容（可改為顯示 loading 畫面）
  if (loading) return null;

  // 如果沒有登入，導向登入頁面
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 已登入則顯示子元件
  return children;
}

export default ProtectedRoute;
