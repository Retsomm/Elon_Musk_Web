import React from "react";
import { useParams, Link } from "react-router-dom";
import companyData from "../component/Company.json";

// 型別定義
interface TimelineItem {
  year: string;
  title?: string;
  event?: string;
}

interface ProductTimelineItem {
  year: string;
  event: string;
}

interface Product {
  name: string;
  description: string;
  timeline?: ProductTimelineItem[];
}

interface Company {
  name: string;
  url: string;
  timeline?: TimelineItem[];
  products?: Product[];
}

interface CompanyData {
  companies: Company[];
}

const CompanyItem: React.FC = () => {
  const { name } = useParams<{ name?: string }>();
  // 保證每個 year 都是 string
  // map 處理是為了把所有 year 欄位轉成 string，讓資料完全符合 TypeScript 的型別定義，避免型別錯誤。
  const companies: Company[] = ((companyData as unknown) as CompanyData).companies.map((company) => ({
    ...company,
    timeline: company.timeline?.map((item) => ({
      ...item,
      year: String(item.year),
    })),
    products: company.products?.map((product) => ({
      ...product,
      timeline: product.timeline?.map((pt) => ({
        ...pt,
        year: String(pt.year),
      })),
    })),
  }));
  const company = companies.find((c) => c.name === name);

  if (!company) return <div className="p-6">找不到公司資料</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
        {/* 時間軸 */}
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {company.timeline?.map((item, idx) => (
            <li key={idx}>
              {/* 除了第一個都要加 <hr /> 在最前面 */}
              {idx !== 0 && <hr />}
              {/* 奇數在左 timeline-start，偶數在右 timeline-end */}
              {idx % 2 === 1 ? (
                <>
                  <div className="timeline-start mb-10 md:text-end max-sm:text-left">
                    <time className="font-mono italic">{item.year}</time>
                    <p className="text-lg font-black leading-loose">{item.title}</p>
                    {item.event}
                  </div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end md:mb-10 text-left">
                    <time className="font-mono italic">{item.year}</time>
                    <p className="text-lg font-black leading-loose">{item.title}</p>
                    {item.event}
                  </div>
                </>
              )}
              {/* 除了最後一個都要加 <hr /> 在最後面 */}
              {idx !== (company.timeline?.length ?? 0) - 1 && <hr />}
            </li>
          ))}
        </ul>
        {/* 公司產品 */}
        <h2 className="text-xl font-semibold mt-6 mb-2">主要產品</h2>
        <ul className="list">
          {company.products?.map((product, idx) => (
            <li key={idx} className="list flex flex-col p-3 items-center justify-between">
              <p className="font-extrabold opacity-90 text-left leading-loose ">
                {product.name}
              </p>
              <p className="font-semibold opacity-60 text-left leading-loose ">
                {product.description}
              </p>
              {/* 若產品有 timeline 也顯示 */}
              {product.timeline && (
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-5">
                  {product.timeline?.map((pt, pi) => (
                    <li key={pi}>
                      {/* 偶數在右 timeline-end，奇數在左 timeline-start */}
                      {pi !== 0 && <hr />}
                      {pi % 2 === 0 ? (
                        <>
                          <div className="timeline-start mb-10 md:text-end max-sm:text-left">
                            <time className="font-mono italic">{pt.year}</time>
                            <p className="text-md font-black leading-loose">{pt.event}</p>
                          </div>
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <hr />
                        </>
                      ) : (
                        <>
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="timeline-end md:mb-10 text-left">
                            <time className="font-mono italic">{pt.year}</time>
                            <p className="text-md font-black leading-loose">{pt.event}</p>
                          </div>
                        </>
                      )}
                      {pi !== (product.timeline?.length ?? 0) - 1 && <hr />}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <Link to="/company" className="btn btn-primary w-fit m-3">
          上一頁
        </Link>
        <div
          className="tooltip tooltip-right w-fit mx-auto m-3"
          data-tip="前往外部網站"
        >
          <Link
            to={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary m-3"
          >
            官方網站
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;