import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { authStore } from "../store/authStore";

// ProtectedRoute 元件的 Props 型別定義
interface ProtectedRouteProps {
  children: ReactNode;
}

// 這個元件用來保護需要登入才能訪問的路由
function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 從 authStore 取得 user 和 loading 狀態
  const { user, loading } = authStore();

  // 如果正在載入驗證狀態，暫時不渲染內容
  if (loading) return null;

  // 如果沒有登入，導向登入頁面
  if (!user) {
    return <Navigate to="/" replace />;
  }
  // 已登入則顯示子元件
  return children;
}

export default ProtectedRoute;
export type { ProtectedRouteProps };
