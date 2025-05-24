// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { useTheme } from "../hooks/useTheme";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Life = lazy(() => import("./pages/Life"));
const Company = lazy(() => import("./pages/Company"));
const New = lazy(() => import("./pages/News"));
const Info = lazy(() => import("./pages/Info"));
const Login = lazy(() => import("./pages/Login"));
const Member = lazy(() => import("./pages/Member"));
const Error = lazy(() => import("./pages/Error"));
const MessageBoard = lazy(() => import("./pages/MessageBoard"));
const Layout = lazy(() => import("./component/Layout"));
const ScrollToTop = lazy(() => import("./component/ScrollToTop"));
const ProtectedRoute = lazy(() => import("./component/ProtectedRoute"));
const InfoItem = lazy(() => import("./pages/infoItem"));

function App() {
  const { currentTheme, toggleTheme } = useTheme();
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout currentTheme={currentTheme} onToggleTheme={toggleTheme} />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/life" element={<Life />} />
            <Route path="/company" element={<Company />} />
            <Route path="/news" element={<New />} />
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
            <Route path="/MessageBoard" element={<MessageBoard />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
