import { Link } from "react-router-dom";
import companyData from "../data/Company.json";


const companies = companyData.companies;

function Company() {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`
                companyCard
                rounded-xl 
                shadow-lg 
                p-6 
                transform 
                transition 
                duration-300 
                hover:scale-105 
                hover:shadow-xl
                flex
                flex-col
                justify-around
              `}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-semibold ml-4">{company.name}</h2>
              </div>
              {/* 顯示第一個產品描述或簡短介紹 */}
              <p className="mb-4 leading-loose">
                {company.products && company.products[0]
                  ? company.products[0].description
                  : ""}
              </p>

              <Link
                to={`/company/${company.name}`}
                className="btn btn-primary w-fit"
              >
                查看更多
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Company;
