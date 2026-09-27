import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Pagination from '../components/Pagination'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.001 16">
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
    <circle cx="2" cy="2" r="2" /><circle cx="2" cy="8" r="2" /><circle cx="2" cy="14" r="2" />
  </svg>
)
const SadFaceIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#9da3ae" strokeWidth="1.4" />
    <circle cx="9" cy="10" r="1" fill="#9da3ae" /><circle cx="15" cy="10" r="1" fill="#9da3ae" />
    <path d="M8.5 16C9.5 14.5 10.7 14 12 14C13.3 14 14.5 14.5 15.5 16" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

function DeliveryStatusCell({ status }) {
  const s = (status || '').toLowerCase()
  if (s === 'delivered') return <span className="text-[13px] font-semibold text-[#19c553]">Delivered</span>
  if (s === 'confirmed') return <span className="text-[13px] font-semibold text-[#009ef7]">Confirmed</span>
  return <span className="text-[13px] text-[#232734] capitalize">{status || 'Pending'}</span>
}

function PaymentStatusCell({ status }) {
  if ((status || '').toLowerCase() === 'paid') {
    return <span className="inline-block px-[10px] py-[3px] text-[11px] font-semibold leading-[16px] text-white bg-[#19c553] rounded-[3px]">Paid</span>
  }
  return <span className="inline-block px-[10px] py-[3px] text-[11px] font-semibold leading-[16px] text-white bg-[#f1416c] rounded-[3px]">Un-Paid</span>
}

function fmtCode(order) {
  const d = new Date(order.createdAt)
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const time = `${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
  const suffix = order._id.slice(-8)
  return `${date}-${time}${suffix}`
}

// Single order row
function OrderRow({ order, checked, onCheck, isLast }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const customerName = order.userId?.fullName || order.shippingAddress?.name || '—'
  const sellerName   = order.items?.[0]?.seller || '—'
  const amount       = `$${(order.totalAmount || 0).toFixed(2)}`
  const payMethod    = (order.paymentMethod || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const refund       = order.refundable ? 'True' : '—'
  const code         = fmtCode(order)

  return (
    <tr className={`hover:bg-[#fafafb] ${isLast ? '' : 'border-b border-dashed border-[#eaeaef]'}`}>
      <td className="px-[12px] py-[14px] text-center align-middle w-[40px]">
        <input type="checkbox" checked={checked} onChange={e => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <button onClick={() => navigate(`/admin/sales/orders/view/${order._id}`)}
          className="text-[13px] text-[#009ef7] hover:underline bg-transparent border-0 p-0 cursor-pointer">
          {code}
        </button>
      </td>
      <td className="px-[12px] py-[14px] text-center align-middle text-[13px] text-[#232734]">
        {order.items?.length || 0}
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {customerName}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        {sellerName !== '—' ? (
          <span className="text-[13px] font-semibold text-[#009ef7]">{sellerName}</span>
        ) : (
          <span className="text-[13px] text-[#232734]">In House</span>
        )}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <span className="inline-flex items-center text-[13px] text-[#232734] font-medium">
          <span className="inline-block w-[2px] h-[14px] bg-[#a5a5b8] mr-[6px]"></span>
          {amount}
        </span>
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <DeliveryStatusCell status={order.status} />
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {payMethod}
      </td>
      <td className="px-[12px] py-[14px] align-middle whitespace-nowrap">
        <PaymentStatusCell status={order.paymentStatus || 'unpaid'} />
      </td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734] whitespace-nowrap">
        {refund}
      </td>
      <td className="px-[12px] py-[14px] text-center align-middle relative">
        <button type="button" onClick={() => setMenuOpen(o => !o)}
          className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] flex items-center justify-center mx-auto">
          <KebabIcon />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 text-left">
            <button type="button" onClick={() => { setMenuOpen(false); navigate(`/admin/sales/orders/view/${order._id}`) }}
              className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">View</button>
            <a href="#" className="block px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">Invoice</a>
            <a href="#" className="block px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</a>
          </div>
        )}
      </td>
    </tr>
  )
}

function OrdersTable({ orders }) {
  const [allChecked, setAllChecked] = useState(false)
  const [checks, setChecks] = useState({})

  const toggleAll = v => {
    setAllChecked(v)
    const next = {}
    orders.forEach(o => { next[o._id] = v })
    setChecks(next)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#eaeaef]">
            <th className="px-[12px] py-[12px] text-center w-[40px]">
              <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)}
                className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
            </th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">ORDER CODE:</th>
            <th className="px-[12px] py-[12px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">PRODUCTS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">CUSTOMER</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">SELLER</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">AMOUNT</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">DELIVERY STATUS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">PAYMENT METHOD</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide whitespace-nowrap">PAYMENT STATUS</th>
            <th className="px-[12px] py-[12px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">REFUND</th>
            <th className="px-[12px] py-[12px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase tracking-wide">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr><td colSpan={11}>
              <div className="flex flex-col items-center justify-center py-[60px]">
                <p className="text-[14px] text-[#232734] mb-[12px] font-semibold">No Orders found!</p>
                <SadFaceIcon />
              </div>
            </td></tr>
          ) : (
            orders.map((o, idx) => (
              <OrderRow key={o._id} order={o} checked={!!checks[o._id]}
                onCheck={v => setChecks(prev => ({ ...prev, [o._id]: v }))}
                isLast={idx === orders.length - 1} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function TabsRow({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f1f1f4] px-[25px] flex-wrap gap-2">
      <div className="flex items-center">
        {tabs.map(t => (
          <button key={t} type="button" onClick={() => onChange(t)}
            className={`px-0 mr-[28px] pt-[16px] pb-[14px] text-[14px] font-medium transition-colors border-b-[2px] ${
              activeTab === t ? 'text-[#009ef7] border-[#009ef7]' : 'text-[#232734] border-transparent hover:text-[#009ef7]'
            }`}>{t}</button>
        ))}
      </div>
    </div>
  )
}

function ToolbarRow({ search, onSearch, deliveryFilter, onDeliveryFilter }) {
  const [bulkOpen, setBulkOpen] = useState(false)
  const [deliveryOpen, setDeliveryOpen] = useState(false)

  const deliveryOptions = ['All', 'Pending', 'Confirmed', 'Delivered']

  return (
    <div className="px-[25px] pt-[16px] pb-[16px] flex flex-wrap gap-[8px] items-center">
      <div className="flex-1 min-w-[280px] flex items-center bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] px-[12px] h-[38px]">
        <span className="mr-2"><SearchIconGray /></span>
        <input type="text" placeholder="Search Orders…" value={search} onChange={e => onSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none" />
      </div>

      <div className="relative">
        <button type="button" onClick={() => setBulkOpen(o => !o)}
          className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]">
          Bulk Action <CaretIcon />
        </button>
        {bulkOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Export</a>
            <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete selection</a>
          </div>
        )}
      </div>

      <div className="relative w-[200px]">
        <button type="button" onClick={() => setDeliveryOpen(o => !o)}
          className="w-full bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
          <span>{deliveryFilter === 'All' ? 'Filter by Delivery Status' : deliveryFilter}</span>
          <CaretIcon />
        </button>
        {deliveryOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-2">
            {deliveryOptions.map(label => (
              <button key={label} type="button" onClick={() => { onDeliveryFilter(label); setDeliveryOpen(false) }}
                className={`block w-full text-left px-[12px] py-[6px] text-[13px] hover:bg-[#f1fafd] ${deliveryFilter === label ? 'text-[#009ef7] font-semibold' : 'text-[#232734]'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UnpaidOrders_Admin() {
  const [orders, setOrders]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [activeTab, setActiveTab]   = useState('All')
  const [search, setSearch]         = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const [page, setPage]             = useState(1)
  const PER_PAGE = 20

  const tabs = ['All', 'In-House', 'Seller']

  useEffect(() => {
    const token = localStorage.getItem('ec_token')
    fetch(`${API_URL}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setOrders(d.data)
        else setError(d.message || 'Failed to load orders')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  // Filter: only unpaid orders
  const filtered = orders.filter(o => {
    const ps = (o.paymentStatus || 'unpaid').toLowerCase()
    if (ps !== 'unpaid') return false

    // Tab filter
    if (activeTab === 'In-House') {
      const isInhouse = o.items?.every(i => !i.seller || i.seller === '')
      if (!isInhouse) return false
    } else if (activeTab === 'Seller') {
      const hasSeller = o.items?.some(i => i.seller && i.seller !== '')
      if (!hasSeller) return false
    }
    // Delivery filter
    if (deliveryFilter !== 'All') {
      if ((o.status || 'pending').toLowerCase() !== deliveryFilter.toLowerCase()) return false
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      const customerName = (o.userId?.fullName || o.shippingAddress?.name || '').toLowerCase()
      const code = `${o._id}`.toLowerCase()
      if (!customerName.includes(q) && !code.includes(q)) return false
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">Unpaid Orders</h1>
      <Card>
        <TabsRow tabs={tabs} activeTab={activeTab} onChange={t => { setActiveTab(t); setPage(1) }} />
        <ToolbarRow
          search={search} onSearch={v => { setSearch(v); setPage(1) }}
          deliveryFilter={deliveryFilter} onDeliveryFilter={v => { setDeliveryFilter(v); setPage(1) }}
        />
        {loading ? (
          <div className="flex justify-center py-[60px] text-[14px] text-[#9da3ae]">Loading orders…</div>
        ) : error ? (
          <div className="flex justify-center py-[60px] text-[14px] text-[#f1416c]">{error}</div>
        ) : (
          <OrdersTable orders={paginated} />
        )}
        {!loading && !error && filtered.length > PER_PAGE && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </Card>
    </>
  )
}