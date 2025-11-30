// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { FC, ComponentType, LazyExoticComponent } from "react";
import "./App.css";
import "./index.css";

// 懶載入頁面元件 - 使用新的路徑別名
const Home: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Home"));
const Life: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Life"));
const Company: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Company"));
const CompanyItem: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/CompanyItem"));
const News: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/News"));
const Info: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Info"));
const Login: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Login"));
const Member: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/Member"));
const InfoItem: LazyExoticComponent<ComponentType<any>> = lazy(() => import("pages/InfoItem"));
// 懶載入共用元件 - 使用新的路徑別名
const Layout: LazyExoticComponent<ComponentType<any>> = lazy(() => import("components/Layout"));
const ScrollToTop: LazyExoticComponent<ComponentType<any>> = lazy(() => import("hooks/useScrollToTop"));
const ProtectedRoute: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./component/ProtectedRoute.tsx"));
const ErrorBoundary: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./component/ErrorBoundary.tsx"));

// 直接匯入的元件
import Toast from "./component/Toast.tsx";

/**
 * 主應用程式元件
 * 負責路由配置和全域狀態管理
 */
const App: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/life" element={<Life />} />
              <Route path="/company" element={<Company />} />
              <Route path="/company/:name" element={<CompanyItem />} />
              <Route path="/news" element={<News />} />
              <Route path="/info" element={<Info />} />
              <Route path="/info/:type/:id" element={<InfoItem />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/member"
                element={
                  <ProtectedRoute>
                    <Member />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toast />
      </ErrorBoundary>
    </Suspense>
  );
};

export default App;
