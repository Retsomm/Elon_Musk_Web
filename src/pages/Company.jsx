import { Link } from "react-router-dom";
import companies from "../data/Companies.json";
import { useState, useEffect } from "react";

function Company() {
  // === Hook 方法: useState ===
  // 宣告狀態變數isMobile，用於追蹤畫面是否為手機尺寸
  // setIsMobile: 更新狀態的函數，初始值為false
  const [isMobile, setIsMobile] = useState(false);

  // === Hook 方法: useEffect ===
  // 用於處理副作用，如DOM操作、事件監聽、API呼叫等
  // 依賴陣列為空，表示僅在元件掛載時執行一次
  useEffect(() => {
    // 檢查螢幕尺寸並設置isMobile狀態的函數
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 如果視窗寬度小於768px，則設為手機模式
    };

    // 元件初始化時立即執行一次檢查
    checkScreenSize();

    // 註冊視窗大小改變的事件監聽器
    window.addEventListener("resize", checkScreenSize);

    // 清理函數，當元件卸載時移除事件監聽器以避免記憶體洩漏
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="container flex flex-wrap justify-center gap-8 mx-auto">
        {companies.map((company, index) => (
          <div key={index}>
            {isMobile ? (
              // 手機模式顯示
              <div className="card bg-base-100 w-96 shadow-xl">
                <figure className="px-10 pt-10">
                  <img
                    src={company.img}
                    alt={company.name}
                    className="rounded-xl"
                  />
                </figure>
                <div className="card-body items-start">
                  <h2 className="card-title">{company.name}</h2>
                  <p>{company.description}</p>
                  <div className="card-btn flex w-full my-3 justify-end">
                    <Link
                      to={`/company/${company.name}`}
                      className="btn btn-primary w-fit"
                    >
                      查看更多
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // 電腦模式顯示
              <div className="card bg-base-100 image-full w-96 h-48 shadow-xl overflow-hidden">
                <figure>
                  <img
                    src={company.img}
                    alt={company.name}
                    className="object-cover w-full h-full"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{company.name}</h2>
                  <p>{company.description}</p>
                  <div className="card-btn flex justify-end">
                    <Link
                      to={`/company/${company.name}`}
                      className="btn btn-primary w-fit"
                    >
                      查看更多
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Company;
