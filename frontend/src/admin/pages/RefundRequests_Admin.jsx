import { useState } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'

// Icons
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const KebabIcon = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#009ef7">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

const TABS = [
  { id: 'all',      label: 'All Refunds' },
  { id: 'admin',    label: 'Admin Refunds' },
  { id: 'seller',   label: 'Seller Refunds' },
  { id: 'pending',  label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'wallet',   label: 'Wallet' },
  { id: 'offline',  label: 'Offline' },
]


const REQUESTS = [
  {
    id: 1, code: '20260421-102757641', customer: 'William L. Carney',
    productImg: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/lipstick.png',
    productName: 'Gucci Blush- Active eCommerce CMS', amount: '$52.43',
    sellerStatus: 'Rejected', adminStatus: 'Pending', payMethod: 'Wallet', payStatus: 'Non-Paid',
  },
  {
    id: 2, code: '20260421-102757554', customer: 'Mark E. Reale',
    productImg: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/airpods.png',
    productName: 'Apple Airpods- Active eCommerce CMS', amount: '$140.00',
    sellerStatus: 'Pending', adminStatus: 'Pending', payMethod: 'Wallet', payStatus: 'Non-Paid',
  },
  {
    id: 3, code: '20260421-102757414', customer: 'Active eCommerce CMS',
    productImg: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/teddy.png',
    productName: 'Teddy Bear - Demo content for Active...', amount: '$36.00',
    sellerStatus: 'N/A', adminStatus: 'Rejected', payMethod: 'Wallet', payStatus: 'Non-Paid',
  },
  {
    id: 4, code: '20260421-102757391', customer: 'Active eCommerce CMS',
    productImg: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/wallet.png',
    productName: "Men's Wallet - Demo content for Active...", amount: '$88.00',
    sellerStatus: 'N/A', adminStatus: 'Approved', payMethod: 'Wallet', payStatus: 'Paid',
  },
  {
    id: 5, code: '20260421-102757255', customer: 'Active eCommerce CMS',
    productImg: 'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/iphone.png',
    productName: 'iPhone 17 Pro Max - Demo content for...', amount: '$1,018.98',
    sellerStatus: 'N/A', adminStatus: 'Approved', payMethod: 'Wallet', payStatus: 'Paid',
  },
]

function StatusBadge({ value }) {
  if (value === 'N/A') return <span className="text-[13px] text-[#7e8299]">N/A</span>
  if (value === 'Pending')  return <span className="inline-block px-[10px] py-[3px] text-[12px] font-medium text-white bg-[#8f60ee] rounded-[3px]">Pending</span>
  if (value === 'Approved') return <span className="inline-block px-[10px] py-[3px] text-[12px] font-medium text-white bg-[#3cb417] rounded-[3px]">Approved</span>
  if (value === 'Rejected') return <span className="inline-block px-[10px] py-[3px] text-[12px] font-medium text-white bg-[#f1416c] rounded-[3px]">Rejected</span>
  return <span className="text-[13px] text-[#7e8299]">{value}</span>
}

function PayStatusBadge({ value }) {
  if (value === 'Paid')     return <span className="inline-block px-[10px] py-[3px] text-[12px] font-medium text-white bg-[#3cb417] rounded-[3px]">Paid</span>
  if (value === 'Non-Paid') return <span className="inline-block px-[10px] py-[3px] text-[12px] font-medium text-[#232734] bg-[#ffc700] rounded-[3px]">Non-Paid</span>
  return <span className="text-[13px] text-[#7e8299]">{value}</span>
}

function RequestRow({ r }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <tr className="border-b border-dashed border-[#f1f1f4] hover:bg-[#f9f9f9]">
      <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">{r.id}</td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="text-[13px] leading-[18px] text-[#009ef7]">{r.code}</div>
        <div className="text-[13px] leading-[18px] text-[#232734]">{r.customer}</div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#f5f5f7] rounded-[3px] flex-shrink-0 overflow-hidden">
            <img src={r.productImg} alt={r.productName} className="w-full h-full object-contain"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/40' }} />
          </div>
          <a href="#" className="text-[13px] leading-[18px] text-[#009ef7] hover:underline">{r.productName}</a>
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">{r.amount}</td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-[6px] mb-[4px]">
          <span className="text-[13px] text-[#232734] w-[42px]">Seller</span>
          <StatusBadge value={r.sellerStatus} />
        </div>
        <div className="flex items-center gap-[6px]">
          <span className="text-[13px] text-[#232734] w-[42px]">Admin</span>
          <StatusBadge value={r.adminStatus} />
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="text-[13px] text-[#232734] mb-[4px]">{r.payMethod}</div>
        <PayStatusBadge value={r.payStatus} />
      </td>
      <td className="px-[16px] py-[14px] align-middle text-right relative">
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="w-[28px] h-[28px] rounded-full bg-[#f1fafd] hover:bg-[#e3f4fc] inline-flex items-center justify-center">
          <KebabIcon />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1 text-left">
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">View</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Approve</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Reject</a>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function RefundRequests_Admin() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <>
      {/* Page title */}
      <div className="pb-[5px]">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Refund Requests</h1>
      </div>

      <Card>
        {/* Nav Tabs */}
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[25px]">
          <div>
            <ul className="flex items-center gap-[24px] m-0 p-0 list-none flex-wrap">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => setActiveTab(t.id)}
                    className={`px-0 pb-[15px] text-[14px] font-medium border-b-2 ${activeTab === t.id ? 'border-[#009ef7] text-[#009ef7]' : 'border-transparent text-[#9da3ae]'}`}>
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-[16px] md:px-[24px] pt-[16px]">
          <div className="flex items-center border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px] h-[38px]">
            <span className="flex items-center pr-2"><SearchIconGray /></span>
            <input type="text" placeholder="Search Request ..."
              className="flex-1 bg-transparent border-0 outline-none text-[13px] text-[#232734] placeholder-[#a5a5b8]" />
          </div>
        </div>

        {/* Table */}
        <div className="px-[8px] md:px-[16px] pt-[16px] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide w-[40px]">#</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">REFUND CODE</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">PRODUCT</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">REFUND AMOUNT</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">APPROVAL STATUS</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">PAYMENT STATUS</th>
                <th className="px-[16px] py-[12px] text-right text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {REQUESTS.map((r) => (<RequestRow key={r.id} r={r} />))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}