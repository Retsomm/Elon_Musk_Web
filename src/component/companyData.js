import rawCompanyData from '../data/Company.json';


// 處理 companyData，確保 year 為 string
const companies = (
    rawCompanyData
).companies.map((company) => ({
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

export default companies;