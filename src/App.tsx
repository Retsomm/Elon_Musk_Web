// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { FC, ComponentType, LazyExoticComponent } from "react";
import "./App.css";
import "./index.css";

// 懶載入頁面元件
const Home: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Home.tsx"));
const Life: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Life.tsx"));
const Company: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Company.tsx"));
const CompanyItem: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/CompanyItem.tsx"));
const News: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/News.tsx"));
const Info: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Info.tsx"));
const Login: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Login.tsx"));
const Member: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/Member.tsx"));
const InfoItem: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./pages/InfoItem.tsx"));
// 懶載入共用元件
const Layout: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./component/Layout.tsx"));
const ScrollToTop: LazyExoticComponent<ComponentType<any>> = lazy(() => import("./hooks/useScrollToTop.tsx"));
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
