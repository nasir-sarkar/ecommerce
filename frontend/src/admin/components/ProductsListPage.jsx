import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Card from './Card'
import ProductTable from './ProductTable'
import Pagination from './Pagination'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts'

// Icons
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const PlusIconWhite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <path d="M6 0v12M0 6h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Add New Product button (pill, blue circle on right)
function AddNewProductButton({ to = '/admin/products/create' }) {
  return (
    <NavLink to={to}
      className="relative inline-flex items-center pl-[16px] pr-[44px] h-[34px] rounded-full text-[#009ef7] text-[13px] font-semibold hover:opacity-90 group">
      <span className="relative z-10">Add New Product</span>
      <span className="absolute top-0 right-0 h-full w-[34px] rounded-full bg-[#009ef7] flex items-center justify-center">
        <PlusIconWhite />
      </span>
    </NavLink>
  )
}

// Toolbar with search + dropdowns
function ToolbarRow() {
  const [bulkOpen, setBulkOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="flex-1 min-w-[280px] flex items-center bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] px-[12px] h-[38px]">
        <span className="mr-2"><SearchIconGray /></span>
        <input type="text" placeholder="Search products…"
          className="flex-1 bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none" />
      </div>

      {/* Bulk Action */}
      <div className="relative">
        <button type="button" onClick={() => setBulkOpen((o) => !o)}
          className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]">
          Bulk Action <CaretIcon />
        </button>
        {bulkOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Publish</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Mark Featured</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Mark Todays Deal</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</a>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="relative w-[180px]">
        <button type="button" onClick={() => setFilterOpen((o) => !o)}
          className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
          <span>Filter</span><CaretIcon />
        </button>
        {filterOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-2">
            {['All', 'All Published', 'All Discounted', 'Low Stock', 'Refundable'].map((label) => (
              <label key={label} className="flex items-center gap-2 px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd] cursor-pointer">
                <input type="checkbox" className="w-[14px] h-[14px] accent-[#009ef7]" />{label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="relative w-[180px]">
        <button type="button" onClick={() => setSortOpen((o) => !o)}
          className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
          <span>Sort</span><CaretIcon />
        </button>
        {sortOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            {['Rating (High > Low)', 'Rating (Low > High)', 'Num of Sale (High > Low)', 'Num of Sale (Low > High)', 'Base Price (High > Low)', 'Base Price (Low > High)'].map((s) => (
              <a key={s} href="#" className="block px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">{s}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Tabs row + Add New on right
function TabsRow({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f1f1f4] px-[20px] flex-wrap gap-2">
      <div className="flex items-center">
        {tabs.map((t) => (
          <button key={t} type="button" onClick={() => onChange(t)}
            className={`px-0 mr-[28px] pt-[16px] pb-[14px] text-[14px] font-medium transition-colors border-b-[2px] ${
              activeTab === t
                ? 'text-[#009ef7] border-[#009ef7]'
                : 'text-[#232734] border-transparent hover:text-[#009ef7]'
            }`}>
            {t}
          </button>
        ))}
      </div>
      <AddNewProductButton />
    </div>
  )
}

// Main exported Page
export default function ProductsListPage({ pageTitle = 'All products', tabs = [], totalPages = 14 }) {
  const [active, setActive] = useState(tabs[0])
  const [page, setPage] = useState(1)

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">{pageTitle}</h1>

      <Card>
        <TabsRow tabs={tabs} activeTab={active} onChange={setActive} />
        <ToolbarRow />
        <ProductTable products={SAMPLE_PRODUCTS} />
        <Pagination current={page} total={totalPages} onChange={setPage} />
      </Card>
    </>
  )
}