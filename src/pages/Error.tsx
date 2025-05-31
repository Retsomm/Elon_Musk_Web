import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
const Error: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>404</h1>
      <p>頁面不存在，3 秒後將自動跳轉到首頁...</p>
    </div>
  );
};
export default Error;
