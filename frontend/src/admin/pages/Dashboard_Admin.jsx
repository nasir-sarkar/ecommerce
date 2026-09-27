import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Asset URLs (kept identical to source HTML)
const PLACEHOLDER = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg';
const CUSTOMER_AVATAR = 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/IifLDtx9TOPOz0hwSWSczsA5StmHp2tp62qXgibG.webp';
const SELLER_AVATAR_1 = 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/g3SEVVlirXer1rweRMT4oGQDHfPNzkCJIG54GoVG.webp';
const SELLER_AVATAR_2 = 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/NPdRxPwDJqKiaPu3oo4TJTpVtEzFV03GPd3bcx8Z.webp';

// Inline Decorative SVG Icons
const IconCustomerHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M21,13.75a1.25,1.25,0,0,0,2.5,0,7.508,7.508,0,0,0-4.068-6.667,4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,8.5,13.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0ZM14.125,4.375A1.875,1.875,0,1,1,16,6.25,1.877,1.877,0,0,1,14.125,4.375ZM10.932,24.083a4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,0,30.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0,1.25,1.25,0,0,0,2.5,0A7.508,7.508,0,0,0,10.932,24.083ZM5.625,21.375A1.875,1.875,0,1,1,7.5,23.25,1.877,1.877,0,0,1,5.625,21.375Zm22.307,2.708a4.375,4.375,0,1,0-6.865,0A7.508,7.508,0,0,0,17,30.75a1.25,1.25,0,0,0,2.5,0,5,5,0,0,1,10,0,1.25,1.25,0,0,0,2.5,0A7.508,7.508,0,0,0,27.932,24.083Zm-5.307-2.708A1.875,1.875,0,1,1,24.5,23.25,1.877,1.877,0,0,1,22.625,21.375Zm0,0" fill="#d5d6db" />
  </svg>
);

const IconProductsHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="27.429" viewBox="0 0 32 27.429">
    <g transform="translate(-2 -4)">
      <path d="M32.857,4H3.143A1.143,1.143,0,0,0,2,5.143V12a1.143,1.143,0,0,0,1.143,1.143H4.286V30.286a1.143,1.143,0,0,0,1.143,1.143H30.571a1.143,1.143,0,0,0,1.143-1.143V13.143h1.143A1.143,1.143,0,0,0,34,12V5.143A1.143,1.143,0,0,0,32.857,4ZM29.429,29.143H6.571v-16H29.429Zm2.286-18.286H4.286V6.286H31.714Z" fill="#d5d6dc" />
      <path d="M13.143,16.286H20A1.143,1.143,0,0,0,20,14H13.143a1.143,1.143,0,0,0,0,2.286Z" transform="translate(1.429 1.429)" fill="#d5d6dc" />
    </g>
  </svg>
);

const IconCategoryHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <g fill="none" stroke="#d5d6dc" strokeWidth="1.8">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <rect x="18" y="2" width="12" height="12" rx="2" />
      <rect x="2" y="18" width="12" height="12" rx="2" />
      <rect x="18" y="18" width="12" height="12" rx="2" />
    </g>
  </svg>
);

const IconBrandsHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="31.994" height="32" viewBox="0 0 31.994 32">
    <path d="M22.534,33.9a3.963,3.963,0,0,1-2.813-1.139L3.175,16.112A4.02,4.02,0,0,1,2.037,12.49L3.175,6.854A3.952,3.952,0,0,1,6.056,3.768l6.377-1.754a4.1,4.1,0,0,1,3.906,1.139L32.783,19.6a4.031,4.031,0,0,1,0,5.694l-7.368,7.47A3.986,3.986,0,0,1,22.534,33.9Zm8.677-12.686L14.722,4.724a1.788,1.788,0,0,0-1.3-.524,1.492,1.492,0,0,0-.444.057L6.592,5.965A1.72,1.72,0,0,0,5.339,7.286L4.257,12.912a1.788,1.788,0,0,0,.49,1.628L21.327,31.1a1.765,1.765,0,0,0,1.207.524,1.663,1.663,0,0,0,1.207-.5l7.5-7.47A1.742,1.742,0,0,0,31.212,21.213Z" transform="translate(-1.966 -1.901)" fill="#d5d6dc" />
    <path d="M20.246,26A1.139,1.139,0,0,1,18.629,24.4L24.824,18.2a1.139,1.139,0,1,1,1.606,1.617Zm-7.983-9.953a4.316,4.316,0,1,1,4.293-4.339A4.339,4.339,0,0,1,12.263,16.052Zm1.355-6.229a2,2,0,0,0-1.435-.6,1.947,1.947,0,0,0-1.446.569,1.981,1.981,0,0,0-.581,1.412,2.129,2.129,0,0,0,.649,1.435,2.016,2.016,0,0,0,2.847,0,1.925,1.925,0,0,0,.569-1.412,2.027,2.027,0,0,0-.6-1.4Z" transform="translate(-1.557 -1.135)" fill="#d5d6dc" />
  </svg>
);

const IconOrderPlaced = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="23.999" height="23.999" viewBox="0 0 23.999 23.999">
    <g transform="translate(-2.25 -2.25)">
      <path d="M22.071,26.249H6.436A4.186,4.186,0,0,1,2.25,22.063V6.428A4.186,4.186,0,0,1,6.436,2.25H22.071a4.178,4.178,0,0,1,4.178,4.178V22.063a4.186,4.186,0,0,1-4.178,4.186ZM6.436,4.217A2.211,2.211,0,0,0,4.217,6.428V22.063a2.219,2.219,0,0,0,2.219,2.219H22.071a2.211,2.211,0,0,0,2.211-2.219V6.428a2.211,2.211,0,0,0-2.211-2.211Z" fill="#009ef7" />
      <path d="M12.5,15.233a1.9,1.9,0,0,1-.787-.173,1.959,1.959,0,0,1-1.149-1.8V3.234a.984.984,0,1,1,1.967,0V13.258l1.849-1.637a1.9,1.9,0,0,1,2.526,0l1.9,1.645L18.743,3.234a.984.984,0,0,1,1.967,0V13.258a1.959,1.959,0,0,1-1.149,1.8,1.9,1.9,0,0,1-2.054-.307l-1.873-1.621-1.873,1.629a1.9,1.9,0,0,1-1.259.472ZM15.6,13.109ZM15.674,13.109Zm1.141,8.278H9.734a.984.984,0,1,1,0-1.967h7.082a.984.984,0,1,1,0,1.967Z" transform="translate(-1.385)" fill="#009ef7" />
    </g>
  </svg>
);

const IconConfirmed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25.13" viewBox="0 0 24 25.134">
    <path d="M16,0L8,2.5v9.5c0,4.5,3,8.5,8,11c5-2.5,8-6.5,8-11V2.5L16,0z M14.5,16.5L10,12l1.5-1.5l3,3l6-6L22,9L14.5,16.5z" fill="#4fcc89" />
  </svg>
);

const IconProcessed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26.18" viewBox="0 0 24 26.182">
    <path d="M16,0,4,5.455V20.727l12,5.455,12-5.455V5.455ZM16,2.4,24.045,6.057,16,9.712,7.952,6.055ZM6.182,19.323V7.645l8.727,3.965V23.288Zm19.636,0-8.727,3.966V11.61l8.727-3.966Z" transform="translate(-4)" fill="#f1416c" />
  </svg>
);

const IconShipped = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20.727" viewBox="0 0 24 20.727">
    <path d="M25,13.409v5.455a1.091,1.091,0,0,1-1.091,1.091H22.818a3.273,3.273,0,1,1-6.545,0H9.727a3.273,3.273,0,1,1-6.545,0H2.091A1.091,1.091,0,0,1,1,18.864V5.773A3.273,3.273,0,0,1,4.273,2.5h9.818a3.273,3.273,0,0,1,3.273,3.273V7.955h2.182a3.273,3.273,0,0,1,2.618,1.309l2.618,3.491a.665.665,0,0,1,.076.153l.065.12A1.091,1.091,0,0,1,25,13.409ZM7.545,19.955a1.091,1.091,0,1,0-1.091,1.091A1.091,1.091,0,0,0,7.545,19.955ZM15.182,5.773a1.091,1.091,0,0,0-1.091-1.091H4.273A1.091,1.091,0,0,0,3.182,5.773v12h.851a3.273,3.273,0,0,1,4.844,0h6.305Zm2.182,6.545h4.364l-1.309-1.745a1.091,1.091,0,0,0-.873-.436H17.364Zm3.273,7.636a1.091,1.091,0,1,0-1.091,1.091A1.091,1.091,0,0,0,20.636,19.955ZM22.818,14.5H17.364v3.033a3.273,3.273,0,0,1,4.6.24h.851Z" transform="translate(-1 -2.5)" fill="#ffc700" />
  </svg>
);

const IconPending = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <g transform="translate(-2 -2)">
      <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" fill="#fff" />
      <path d="M12,6a1,1,0,0,0-1,1v4.59l-2.71,2.7A1,1,0,1,0,9.7,15.7l3-3A1,1,0,0,0,13,12V7A1,1,0,0,0,12,6Z" fill="#fff" />
    </g>
  </svg>
);

// Donut chart
function DonutChart({ cashOnDeliveryPercent = 0.92 }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const cashLen = c * cashOnDeliveryPercent;
  const otherLen = c - cashLen;
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#009ef7" strokeWidth="22"
          strokeDasharray={`${cashLen} ${otherLen}`}
          transform="rotate(-90 90 90)" />
        <circle cx="90" cy="90" r={r} fill="none" stroke="#f1416c" strokeWidth="22"
          strokeDasharray={`${otherLen} ${cashLen}`}
          strokeDashoffset={-cashLen}
          transform="rotate(-90 90 90)" />
      </svg>
      <div className="flex items-center justify-center gap-4 mt-2 text-[12px] text-[#232734]">
        <span className="flex items-center gap-1"><span className="w-[10px] h-[10px] rounded-full bg-[#f1416c] inline-block" />Others</span>
        <span className="flex items-center gap-1"><span className="w-[10px] h-[10px] rounded-full bg-[#009ef7] inline-block" />Cash On Delivery</span>
      </div>
    </div>
  );
}

// Tiny line chart placeholder for "Sales Stat"
function SalesLineChart() {
  return (
    <svg viewBox="0 0 300 80" className="w-full h-[80px] mt-2">
      <polyline
        points="0,40 30,40 60,40 90,40 120,40 150,40 180,40 210,40 240,40 270,40 300,40"
        fill="none"
        stroke="#009ef7"
        strokeWidth="2"
      />
      <circle cx="60" cy="40" r="3" fill="#009ef7" />
    </svg>
  );
}

// Dashboard tab pills (All/Today/Week/Month)
function DashboardTabs({ color = 'primary', activeTab, onTabChange }) {
  const variants = {
    primary: { active: 'bg-[#f1fafd] text-[#009ef7]', text: 'text-[#232734]' },
    danger:  { active: 'bg-[#fff4f8] text-[#f1416c]', text: 'text-[#232734]' },
    warning: { active: 'bg-[#fff9e3] text-[#ffc700]', text: 'text-[#232734]' },
  };
  const v = variants[color];
  const tabs = ['All', 'Today', 'Week', 'Month'];
  return (
    <ul className="flex items-center gap-1">
      {tabs.map((t) => (
        <li key={t}>
          <button
            type="button"
            onClick={() => onTabChange(t.toLowerCase())}
            className={`text-[12px] leading-[18px] font-medium px-[10px] py-[3px] rounded-[3px] ${
              activeTab === t.toLowerCase() ? v.active : v.text
            }`}
          >
            {t}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Main Dashboard Component
export default function Dashboard_Admin() {
  const [stats, setStats] = useState({
    customers: { total: 0, topAvatars: [] },
    products: { total: 0, inhouse: 0, sellers: 0 },
    sales: { total: 0, thisMonth: 0, inHouse: 0, sellers: 0 },
    categories: { total: 0, top: [] },
    brands: { total: 0, top: [] },
    orders: { total: 0, pending: 0, confirmed: 0, delivered: 0 },
    inHouseTopCategory: { all: [], today: [], week: [], month: [] },
    inHouseTopBrands: { all: [], today: [], week: [], month: [] },
    topSellers: [],
    topProducts: [],
    inhouseStoreStats: { totalSales: 0, totalProducts: 0, ratings: 5.0, totalOrders: 0, cashOnDeliveryPercent: 0 },
    sellers: { total: 0, approved: 0, topList: [] },
  });
  const [catTab, setCatTab] = useState('all');
  const [brandTab, setBrandTab] = useState('all');
  const [sellerTab, setSellerTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('ec_token') || sessionStorage.getItem('ec_token');
        const res = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navigate = useNavigate();

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  // Prepare dynamic data
  const topCategories = stats.categories.top || [];
  const topBrands = stats.brands.top || [];
  const inHouseCategories = stats.inHouseTopCategory[catTab] || [];
  const inHouseBrands = stats.inHouseTopBrands[brandTab] || [];
  const topSellersList = stats.topSellers.slice(0, 3);
  const topProductsList = stats.topProducts || [];

  // Dynamic seller data from DB
  const totalSellers    = stats.sellers?.total    ?? 0;
  const approvedSellers = stats.sellers?.approved ?? 0;
  const topSellersCard  = stats.sellers?.topList  ?? [];

  // Helper: colored bullet circles based on index
  const bulletColors = [
    'bg-[#19c553]',   // green
    'bg-[#009ef7]',   // blue
    'bg-[#8f60ee]',   // purple
    'bg-[#ffc700]',   // yellow
    'bg-[#f1416c]'    // red
  ];

  return (
    <div className="grid grid-cols-12 gap-[16px]">

      {/* Row 1 — Customer/Products + Sales/Sellers */}
      <div className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">

          {/* Total Customer */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] h-[220px] overflow-hidden p-[20px]">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">{stats.customers.total}</h1>
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Customer</h3>
                </div>
                <div className="mt-2"><IconCustomerHeader /></div>
              </div>
              <div>
                <h3 className="text-[13px] leading-[18px] font-semibold text-[#232734] mb-1 flex items-center">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#f1416c] inline-block mr-2" />
                  Top Customers
                </h3>
                <div className="flex -space-x-[8px]">
                  {stats.customers.topAvatars.slice(0, 5).map((src, i) => (
                    <div key={i} className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-white bg-[#f1f1f4]">
                      <img src={src || PLACEHOLDER} alt="customer" className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }} />
                    </div>
                  ))}
                  {stats.customers.topAvatars.length === 0 && Array(5).fill().map((_, i) => (
                    <div key={i} className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-white bg-[#f1f1f4]">
                      <img src={PLACEHOLDER} alt="customer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] h-[220px] overflow-hidden p-[20px]">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">{stats.products.total}</h1>
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Products</h3>
                </div>
                <div className="mt-2"><IconProductsHeader /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0 flex items-center">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#19c553] inline-block mr-2" />
                    Inhouse Products
                  </h3>
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0">{stats.products.inhouse}</h3>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0 flex items-center">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#009ef7] inline-block mr-2" />
                    Sellers Products
                  </h3>
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0">{stats.products.sellers}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Category */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] h-[220px] overflow-hidden p-[20px]">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">{stats.categories.total}</h1>
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Category</h3>
                </div>
                <div className="mt-2"><IconCategoryHeader /></div>
              </div>
              <div className="space-y-1">
                {topCategories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between">
                    <h3 className="text-[13px] leading-[18px] font-semibold mb-0 truncate mr-2 flex items-center">
                      <span className="inline-block mr-2" style={{ width: 20, height: 4, borderRadius: 2, background: idx === 0 ? '#f1416c' : idx === 1 ? '#ffc700' : '#009ef7' }} />
                      {cat.name || 'Unnamed'}
                    </h3>
                    <h3 className="text-[13px] leading-[18px] font-semibold mb-0">${(cat.sales || 0).toFixed(2)}</h3>
                  </div>
                ))}
                {topCategories.length === 0 && (
                  <div className="text-[13px] text-[#a1a5b3] py-2">No category data</div>
                )}
              </div>
            </div>
          </div>

          {/* Total Brands */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] h-[220px] overflow-hidden p-[20px]">
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div>
                  <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">{stats.brands.total}</h1>
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Brands</h3>
                </div>
                <div className="mt-2"><IconBrandsHeader /></div>
              </div>
              <div>
                <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-2">Top Brands</h3>
                <div className="space-y-1">
                  {topBrands.map((brand, idx) => (
                    <div key={idx} className="flex justify-between">
                      <h3 className="text-[13px] leading-[18px] font-semibold mb-0 truncate mr-2 flex items-center">
                        <span className={`w-[8px] h-[8px] rounded-full inline-block mr-2 ${idx === 0 ? 'bg-[#19c553]' : idx === 1 ? 'bg-[#009ef7]' : 'bg-[#8f60ee]'}`} />
                        {brand.name || 'Unnamed'}
                      </h3>
                      <h3 className="text-[13px] leading-[18px] font-semibold mb-0">${(brand.sales || 0).toFixed(2)}</h3>
                    </div>
                  ))}
                  {topBrands.length === 0 && (
                    <div className="text-[13px] text-[#a1a5b3]">No brand data</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COL: Sales + Sellers */}
      <div className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">

          {/* Total Sales */}
          <div className="bg-[#f1fafd] rounded-[8px] overflow-hidden p-[20px]" style={{ height: 470 }}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#009ef7] mb-1">${(stats.sales.total / 1000).toFixed(0)}K</h1>
                <h3 className="text-[13px] leading-[18px] font-semibold text-[#009ef7] mb-0">Total Sales</h3>
              </div>
              <div className="flex items-center justify-between p-3 rounded-[6px] bg-[#009ef7] text-white mr-2">
                <h3 className="text-[13px] leading-[18px] font-semibold mb-0">Sales this month</h3>
                <h3 className="text-[13px] leading-[18px] font-semibold mb-0">${stats.sales.thisMonth.toFixed(2)}</h3>
              </div>
              <div>
                <h3 className="text-[13px] leading-[18px] font-semibold text-[#009ef7] mb-0">Sales Stat</h3>
              </div>
              <SalesLineChart />
              <div>
                <div className="flex justify-between mb-1">
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0 flex items-center">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#8f60ee] inline-block mr-2" />In-house Sales
                  </h3>
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0">${stats.sales.inHouse.toFixed(2)}</h3>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0 flex items-center">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#19c553] inline-block mr-2" />Sellers Sales
                  </h3>
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0">${stats.sales.sellers.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Sellers (dynamic) */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden p-[20px]" style={{ height: 470 }}>
            <div className="flex flex-col justify-between h-full">
              <div>
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">{totalSellers}</h1>
                <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total sellers</h3>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0 flex items-center">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#19c553] inline-block mr-2" />Approved Sellers
                  </h3>
                  <h3 className="text-[13px] leading-[18px] font-semibold mb-0">{approvedSellers}</h3>
                </div>
              </div>
              <div>
                <h3 className="text-[13px] leading-[18px] font-semibold mb-1 flex items-center">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#ffc700] inline-block mr-2" />Top Sellers
                </h3>
                <div className="flex -space-x-[8px]">
                  {topSellersCard.map((seller, i) => (
                    <div key={i} className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-white bg-[#f1f1f4] flex items-center justify-center text-lg font-bold">
                      {seller.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  ))}
                  {topSellersCard.length < 3 && Array(3 - topSellersCard.length).fill().map((_, i) => (
                    <div key={`placeholder-${i}`} className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-white bg-[#f1f1f4]">
                      <img src={PLACEHOLDER} alt="seller" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <hr style={{ borderTop: '1px dashed #dbdfe9', borderBottom: 0, marginTop: 16, marginBottom: 16 }} />
                <button
                  type="button"
                  onClick={() => navigate('/admin/sellers/list')}
                  className="block w-full text-center bg-[#e6fff3] text-[#19c553] hover:bg-[#19c553] hover:text-white text-[13px] leading-[18px] font-semibold py-[10px] rounded-[6px] mb-3 transition-colors"
                >All Sellers</button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/sellers/applied')}
                  className="block w-full text-center bg-[#fff4f8] text-[#f1416c] hover:bg-[#f1416c] hover:text-white text-[13px] leading-[18px] font-semibold py-[10px] rounded-[6px] transition-colors"
                >Pending Sellers</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 2 — Orders + Top Category + Top Brands */}
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden p-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            {/* Total Order + Pending */}
            <div className="flex flex-col gap-3">
              <div className="bg-[#f4effe] rounded-[8px] h-[300px] overflow-hidden p-[20px] flex flex-col justify-between">
                <div>
                  <h1 className="text-[30px] leading-[36px] font-semibold text-[#8f60ee] mb-1">{stats.orders.total}</h1>
                  <h3 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Order</h3>
                </div>
                <button type="button" onClick={() => navigate('/admin/sales/all')} className="block w-full text-center bg-[#8f60ee] hover:bg-[#714cbd] text-white text-[13px] leading-[18px] font-semibold py-[10px] rounded-[6px] mt-3 transition-colors">All Orders</button>
              </div>
              <div className="bg-[#f1416c] rounded-[8px] h-[90px] flex items-center justify-between text-white px-[20px]">
                <div className="flex items-center gap-3"><IconPending /><p className="text-[13px] leading-[18px] font-semibold mb-0">Pending order</p></div>
                <h1 className="text-[24px] leading-[28px] font-semibold mb-0">{stats.orders.pending}</h1>
              </div>
            </div>

            {/* Order Placed/Confirmed/Processed/Shipped */}
            <div className="flex flex-col gap-3">
              <div className="bg-[#f1fafd] rounded-[8px] h-[90px] flex items-center justify-between text-[#009ef7] px-[20px]">
                <div className="flex items-center gap-3"><IconOrderPlaced /><p className="text-[13px] leading-[18px] font-semibold text-[#232734] mb-0">Order placed</p></div>
                <h1 className="text-[24px] leading-[28px] font-semibold mb-0">{stats.orders.total}</h1>
              </div>
              <div className="bg-[#e6fff3] rounded-[8px] h-[90px] flex items-center justify-between text-[#19c553] px-[20px]">
                <div className="flex items-center gap-3"><IconConfirmed /><span className="text-[13px] leading-[18px] font-semibold text-[#232734] mb-0">Confirmed Order</span></div>
                <h1 className="text-[24px] leading-[28px] font-semibold mb-0">{stats.orders.confirmed}</h1>
              </div>
              <div className="bg-[#fff4f8] rounded-[8px] h-[90px] flex items-center justify-between text-[#f1416c] px-[20px]">
                <div className="flex items-center gap-3"><IconProcessed /><span className="text-[13px] leading-[18px] font-semibold text-[#232734] mb-0">Processed Order</span></div>
                <h1 className="text-[24px] leading-[28px] font-semibold mb-0">{stats.orders.confirmed}</h1>
              </div>
              <div className="bg-[#fff9e3] rounded-[8px] h-[90px] flex items-center justify-between text-[#ffc700] px-[20px]">
                <div className="flex items-center gap-3"><IconShipped /><span className="text-[13px] leading-[18px] font-semibold text-[#232734] mb-0">Order Shipped</span></div>
                <h1 className="text-[24px] leading-[28px] font-semibold mb-0">{stats.orders.delivered}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">

          {/* In-house Top Category */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden" style={{ height: 474 }}>
            <div className="px-[20px] pt-[20px] mb-2">
              <h2 className="text-[16px] leading-[22px] font-semibold text-[#009ef7] mb-1">In-house Top Category</h2>
              <h4 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">By Sales</h4>
            </div>
            <div className="px-[20px] mb-3">
              <DashboardTabs color="primary" activeTab={catTab} onTabChange={setCatTab} />
            </div>
            <div className="px-[20px] mt-4 overflow-y-auto" style={{ maxHeight: 290 }}>
              {inHouseCategories.map((c, idx) => (
                <div key={c.name || idx} className="flex items-center justify-between py-2 border-b border-[#f1f1f4] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-[8px] h-[8px] rounded-full inline-block ${bulletColors[idx % bulletColors.length]}`} />
                    <span className="text-[13px] leading-[18px] font-semibold text-[#232734]">{c.name || 'Unnamed'}</span>
                  </div>
                  <span className="text-[13px] leading-[18px] font-semibold text-[#232734]">${(c.sales || 0).toFixed(2)}</span>
                </div>
              ))}
              {inHouseCategories.length === 0 && (
                <div className="text-[13px] text-[#a1a5b3] py-2">No data for selected period</div>
              )}
            </div>
          </div>

          {/* In-house Top Brands */}
          <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden" style={{ height: 474 }}>
            <div className="px-[20px] pt-[20px] mb-2">
              <h2 className="text-[16px] leading-[22px] font-semibold text-[#f1416c] mb-1">In-house Top Brands</h2>
              <h4 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">By Sales</h4>
            </div>
            <div className="px-[20px] mb-3">
              <DashboardTabs color="danger" activeTab={brandTab} onTabChange={setBrandTab} />
            </div>
            <div className="px-[20px] mt-4 overflow-y-auto" style={{ maxHeight: 290 }}>
              {inHouseBrands.map((b, idx) => (
                <div key={b.name || idx} className="flex items-center justify-between py-2 border-b border-[#f1f1f4] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-[8px] h-[8px] rounded-full inline-block ${bulletColors[idx % bulletColors.length]}`} />
                    <span className="text-[13px] leading-[18px] font-semibold text-[#232734]">{b.name || 'Unnamed'}</span>
                  </div>
                  <span className="text-[13px] leading-[18px] font-semibold text-[#232734]">${(b.sales || 0).toFixed(2)}</span>
                </div>
              ))}
              {inHouseBrands.length === 0 && (
                <div className="text-[13px] text-[#a1a5b3] py-2">No data for selected period</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Row 3 — In-house Store + Top Seller & Products */}
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden p-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-[16px] leading-[22px] font-semibold text-[#232734] mb-[20px]">In-house Store</h2>
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-1">${stats.inhouseStoreStats.totalSales.toFixed(2)}</h1>
                <h4 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">Total Sales</h4>
              </div>
              <DonutChart cashOnDeliveryPercent={stats.inhouseStoreStats.cashOnDeliveryPercent ?? 0} />
              <button type="button" onClick={() => navigate('/admin/sales/inhouse')} className="block w-full text-center bg-[#f4effe] text-[#8f60ee] hover:bg-[#8f60ee] hover:text-white text-[13px] leading-[18px] font-semibold py-[10px] rounded-[6px] mt-4 sm:mt-0 transition-colors">All In-house Orders</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-[#f5f5f7] rounded-[8px] h-[120px] flex flex-col justify-center px-[20px]">
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-0">{stats.inhouseStoreStats.totalProducts}</h1>
                <p className="text-[13px] leading-[18px] font-semibold text-[#009ef7] mb-0">Inhouse product</p>
              </div>
              <div className="bg-[#f5f5f7] rounded-[8px] h-[120px] flex flex-col justify-center px-[20px]">
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-0">{stats.inhouseStoreStats.ratings.toFixed(2)}</h1>
                <p className="text-[13px] leading-[18px] font-semibold text-[#ffc700] mb-0">Ratings</p>
              </div>
              <div className="bg-[#f5f5f7] rounded-[8px] h-[120px] flex flex-col justify-center px-[20px]">
                <h1 className="text-[30px] leading-[36px] font-semibold text-[#232734] mb-0">{stats.inhouseStoreStats.totalOrders}</h1>
                <p className="text-[13px] leading-[18px] font-semibold text-[#8f60ee] mb-0">Total orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Seller & Products */}
      <div className="col-span-12 lg:col-span-6">
        <div className="bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] overflow-hidden p-[20px]" style={{ height: 474 }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[16px] leading-[22px] font-semibold text-[#1b2133] mb-2">Top Seller &amp; Products</h2>
              <h4 className="text-[13px] leading-[18px] font-semibold text-[#a1a5b3] mb-0">By Sales</h4>
            </div>
            <DashboardTabs color="warning" activeTab={sellerTab} onTabChange={setSellerTab} />
          </div>
          <div className="flex items-end gap-3 mb-4">
            {topSellersList.map((seller, idx) => (
              <div key={idx} className="text-center">
                <div className="w-[60px] h-[60px] rounded-[8px] bg-[#e9e0f7] flex items-center justify-center text-[#8f60ee] text-[24px] leading-[28px] font-semibold mx-auto border-2 border-[#8f60ee]">
                  {seller.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <p className="text-[12px] leading-[16px] mt-1 text-[#232734]">{seller.name || 'Unknown'}</p>
                <p className="text-[12px] leading-[16px] text-[#a1a5b3]">Active...</p>
              </div>
            ))}
            {topSellersList.length < 3 && Array(3 - topSellersList.length).fill().map((_, i) => (
              <div key={`empty-${i}`} className="text-center">
                <div className="w-[60px] h-[60px] rounded-[8px] bg-[#dee5e8] flex items-center justify-center text-[#5a6c7d] text-[24px] leading-[28px] font-semibold mx-auto">?</div>
                <p className="text-[12px] leading-[16px] mt-1 text-[#232734]">No seller</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f1f1f4] pt-3">
            <div className="flex justify-between text-[12px] leading-[16px] font-semibold text-[#a1a5b3] pb-2">
              <span>Item</span>
              <span><span className="mr-[40px]">Quantity</span><span>Total Price</span></span>
            </div>
            <div className="space-y-2">
              {topProductsList.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-[28px] h-[28px] rounded-[4px] overflow-hidden bg-[#f1f1f4] flex-shrink-0">
                      <img src={p.image || PLACEHOLDER} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }} />
                    </div>
                    <span className="text-[12px] leading-[16px] text-[#232734]">{p.name || 'Unnamed'}</span>
                  </div>
                  <div className="flex items-center gap-[40px]">
                    <span className="text-[12px] leading-[16px] text-[#232734]">{p.qty || 'X 0'}</span>
                    <span className="text-[12px] leading-[16px] text-[#232734] font-semibold w-[70px] text-right">{p.price || '$0.00'}</span>
                  </div>
                </div>
              ))}
              {topProductsList.length === 0 && (
                <div className="text-[12px] text-[#a1a5b3] py-2">No product data</div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}