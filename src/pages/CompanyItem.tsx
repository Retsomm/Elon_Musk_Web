import { useParams, Link } from "react-router-dom";
import companies from "../data/Companies.json";
import Timeline from "../component/Timeline";
import { JSX } from "react";
import type { Company, Product, CompanyParams } from "../types/timeline";
/**
 * 公司詳細資料頁面組件
 * 根據 URL 參數顯示特定公司的詳細資訊
 * @returns JSX.Element
 */

const CompanyItem = (): JSX.Element => {
  // 從 URL 參數中獲取公司名稱
  const { name } = useParams<CompanyParams>();
  // 根據 URL 參數中的名稱查找對應的公司資料
  const company: Company | undefined = (companies as Company[]).find(
    (c: Company) => c.name === name
  );
  // 如果找不到公司資料，顯示錯誤信息
  if (!company) return <div className="p-6">找不到公司資料</div>;
  const renderProductItem = (product: Product, index: number): JSX.Element => (
    <li
      key={index}
      className="list flex flex-col p-3 items-center justify-between"
    >
      <p className="font-extrabold opacity-90 text-left leading-loose">
        {product.name}
      </p>
      <p className="font-semibold opacity-60 text-left leading-loose">
        {product.description}
      </p>
      {/* 使用新的 Timeline 組件渲染產品時間軸 */}
      {product.timeline && product.timeline.length > 0 && (
        <div className="mt-5 w-full">
          <Timeline timelineData={product.timeline} onItemClick={() => {}} />
        </div>
      )}
    </li>
  );
  // 渲染公司資料頁面
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>

        {/* 使用新的 Timeline 組件渲染公司時間軸 */}
        <Timeline timelineData={company.timeline} onItemClick={() => {}} />

        <h2 className="text-xl font-semibold mt-6 mb-2">主要產品</h2>
        {/* 產品列表 - 使用陣列映射渲染項目 */}
        <ul className="list">
          {company.products?.map((product: Product, index: number) =>
            renderProductItem(product, index)
          )}
        </ul>

        {/* 導航按鈕 */}
        <Link to="/company" className="btn btn-primary w-fit m-3">
          上一頁
        </Link>
        <div
          className="tooltip tooltip-right w-fit mx-auto m-3"
          data-tip="前往外部網站"
        >
          <a
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary m-3"
          >
            官方網站
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyItem;
