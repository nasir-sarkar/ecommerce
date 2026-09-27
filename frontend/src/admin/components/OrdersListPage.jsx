import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import Pagination from './Pagination'

// Icons (extracted exactly from source HTML)
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const KebabIcon = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#9da3ae">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

const SadFaceIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#9da3ae" strokeWidth="1.4" />
    <circle cx="9" cy="10" r="1" fill="#9da3ae" />
    <circle cx="15" cy="10" r="1" fill="#9da3ae" />
    <path d="M8.5 16C9.5 14.5 10.7 14 12 14C13.3 14 14.5 14.5 15.5 16" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

// Status cell renderers
function DeliveryStatusCell({ status }) {
  if (status === 'Delivered') {
    return <span className="text-[13px] font-semibold text-[#19c553]">Delivered</span>
  }
  if (status === 'On The Way') {
    return <span className="text-[13px] font-semibold text-[#19c553]">On The Way</span>
  }
  // Pending and others
  return <span className="text-[13px] text-[#232734]">{status}</span>
}

function PaymentStatusCell({ status }) {
  if (status === 'Paid') {
    return (
      <span className="inline-block px-[10px] py-[3px] text-[11px] font-semibold leading-[16px] text-white bg-[#19c553] rounded-[3px]">
        Paid
      </span>
    )
  }
  if (status === 'Un-Paid') {
    return (
      <span className="inline-block px-[10px] py-[3px] text-[11px] font-semibold leading-[16px] text-white bg-[#f1416c] rounded-[3px]">
        Un-Paid
      </span>
    )
  }
  return <span className="text-[13px] text-[#232734]">{status}</span>
}

// Single order row
function OrderRow({ order, checked, onCheck, isLast }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const sellerIsLink = order.seller && order.seller !== '—'

  return (
    <tr
      className={`hover:bg-[#fafafb] ${
        isLast ? '' : "border-b border-dashed border-[#eaeaef]"
      }`}
    >
      <td className="px-[12px] py-[14px] text-center align-middle w-[40px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]"
        />
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <a href="#" className="text-[13px] text-[#009ef7] hover:underline">
          {order.code}
        </a>
        {order.isNew && (
          <span className="ml-[6px] inline-block px-[6px] py-[2px] text-[10px] leading-[14px] font-semibold text-white bg-[#8f60ee] rounded-[3px] align-middle">
            new
          </span>
        )}
      </td>
      <td className="px-[12px] py-[14px] text-center align-middle text-[13px] text-[#232734]">
        {order.products}
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {order.customer}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        {sellerIsLink ? (
          <a href="#" className="text-[13px] font-semibold text-[#009ef7] hover:underline">
            {order.seller}
          </a>
        ) : (
          <span className="text-[13px] text-[#232734]">{order.seller}</span>
        )}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <span className="inline-flex items-center text-[13px] text-[#232734] font-medium">
          <span className="inline-block w-[2px] h-[14px] bg-[#a5a5b8] mr-[6px]"></span>
          {order.amount}
        </span>
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <DeliveryStatusCell status={order.delivery} />
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {order.payMethod}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <PaymentStatusCell status={order.payStatus} />
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {order.refund}
      </td>
      <td className="px-[12px] py-[14px] text-center align-middle relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] flex items-center justify-center mx-auto"
        >
          <KebabIcon />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 text-left">
            <button type="button" onClick={() => { setMenuOpen(false); navigate(`/admin/sales/orders/view/${order.id}`) }} className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">View</button>
            <a href="#" className="block px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">Invoice</a>
            <a href="#" className="block px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</a>
          </div>
        )}
      </td>
    </tr>
  )
}

// Orders Table
function OrdersTable({ orders }) {
  const [allChecked, setAllChecked] = useState(false)
  const [checks, setChecks] = useState({})

  const toggleAll = (v) => {
    setAllChecked(v)
    const next = {}
    orders.forEach((o) => {
      next[o.id] = v
    })
    setChecks(next)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#eaeaef]">
            <th className="px-[12px] py-[12px] text-center w-[40px]">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={(e) => toggleAll(e.target.checked)}
                className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]"
              />
            </th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">ORDER CODE:</th>
            <th className="px-[12px] py-[12px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">PRODUCTS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">CUSTOMER</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">SELLER</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">AMOUNT</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">DELIVERY STATUS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">PAYMENT METHOD</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">PAYMENT STATUS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">REFUND</th>
            <th className="px-[12px] py-[12px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase tracking-wide">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={11}>
                <div className="flex flex-col items-center justify-center py-[60px]">
                  <p className="text-[14px] text-[#232734] mb-[12px] font-semibold">No Orders found!</p>
                  <SadFaceIcon />
                </div>
              </td>
            </tr>
          ) : (
            orders.map((o, idx) => (
              <OrderRow
                key={o.id}
                order={o}
                checked={!!checks[o.id]}
                onCheck={(v) => setChecks((prev) => ({ ...prev, [o.id]: v }))}
                isLast={idx === orders.length - 1}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Tabs row
function TabsRow({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f1f1f4] px-[25px] flex-wrap gap-2">
      <div className="flex items-center">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`px-0 mr-[28px] pt-[16px] pb-[14px] text-[14px] font-medium transition-colors border-b-[2px] ${
              activeTab === t
                ? 'text-[#009ef7] border-[#009ef7]'
                : 'text-[#232734] border-transparent hover:text-[#009ef7]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

// Toolbar (Search + Bulk + Filters)
function ToolbarRow({ showPaymentFilter = true }) {
  const [bulkOpen, setBulkOpen] = useState(false)
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)

  return (
    <div className="px-[25px] pt-[16px] pb-[16px] flex flex-wrap gap-[8px] items-center">
      {/* Search */}
      <div className="flex-1 min-w-[280px] flex items-center bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] px-[12px] h-[38px]">
        <span className="mr-2"><SearchIconGray /></span>
        <input
          type="text"
          placeholder="Search Orders…"
          className="flex-1 bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none"
        />
      </div>

      {/* Bulk Action */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setBulkOpen((o) => !o)}
          className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]"
        >
          Bulk Action <CaretIcon />
        </button>
        {bulkOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Export</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete selection</a>
          </div>
        )}
      </div>

      {/* Filter by Delivery Status */}
      <div className="relative w-[200px]">
        <button
          type="button"
          onClick={() => setDeliveryOpen((o) => !o)}
          className="w-full bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]"
        >
          <span>Filter by Delivery Status</span>
          <CaretIcon />
        </button>
        {deliveryOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-2">
            {['All', 'Pending', 'Confirmed', 'Picked Up', 'On The Way', 'Delivered', 'Cancel'].map((label) => (
              <label
                key={label}
                className="flex items-center gap-2 px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd] cursor-pointer"
              >
                <input type="checkbox" className="w-[14px] h-[14px] accent-[#009ef7]" />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filter by Payment Status (optional) */}
      {showPaymentFilter && (
        <div className="relative w-[200px]">
          <button
            type="button"
            onClick={() => setPaymentOpen((o) => !o)}
            className="w-full bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]"
          >
            <span>Filter by Payment Status</span>
            <CaretIcon />
          </button>
          {paymentOpen && (
            <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-2">
              {['Filter by Payment Status', 'Paid', 'Un-Paid'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="block px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter by date */}
      <div className="w-[160px] bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center">
        <input
          type="text"
          placeholder="Filter by date"
          className="w-full bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none"
        />
      </div>
    </div>
  )
}

// Main exported page component
export default function OrdersListPage({
  pageTitle,
  tabs = ['All', 'In-House', 'Seller'],
  orders = [],
  totalPages = 1,
  showPaymentFilter = true,
}) {
  const [active, setActive] = useState(tabs[0])
  const [page, setPage] = useState(1)

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">
        {pageTitle}
      </h1>

      <Card>
        <TabsRow tabs={tabs} activeTab={active} onChange={setActive} />
        <ToolbarRow showPaymentFilter={showPaymentFilter} />
        <OrdersTable orders={orders} />
        {orders.length > 0 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </Card>
    </>
  )
}