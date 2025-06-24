import rawCompanyData from './Company.json';

interface TimelineItem {
    year: string;
    title?: string;
    event?: string;
    media?: {
        type: string;
        url: string;
    };
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

// 處理 companyData，確保 year 為 string
const companies: Company[] = (
    rawCompanyData as unknown as CompanyData
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