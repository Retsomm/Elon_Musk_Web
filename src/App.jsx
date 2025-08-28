// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { useTheme } from "./hooks/useTheme";
import "./App.css";
import "./index.css";
import ErrorBoundary from "./component/ErrorBoundary";
import Toast from "./component/Toast";
const Home = lazy(() => import("./pages/Home"));
const Life = lazy(() => import("./pages/Life"));
const Company = lazy(() => import("./pages/Company"));
const CompanyItem = lazy(() => import("./pages/CompanyItem"));
const News = lazy(() => import("./pages/News"));
const Info = lazy(() => import("./pages/Info"));
const Login = lazy(() => import("./pages/Login"));
const Member = lazy(() => import("./pages/Member"));
const Error = lazy(() => import("./pages/Error"));
const Layout = lazy(() => import("./component/Layout"));
const ScrollToTop = lazy(() => import("./component/ScrollToTop"));
const ProtectedRoute = lazy(() => import("./component/ProtectedRoute"));
const InfoItem = lazy(() => import("./pages/InfoItem"));

function App() {
  const { currentTheme } = useTheme();
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout currentTheme={currentTheme} />}>
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
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
        <Toast />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
