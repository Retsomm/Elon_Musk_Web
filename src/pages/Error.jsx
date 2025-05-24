import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    // 自动在 3 秒后跳转到首页
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>404</h1>
      <p>頁面不存在，3 秒後將自動跳轉到首頁...</p>
    </div>
  );
}
