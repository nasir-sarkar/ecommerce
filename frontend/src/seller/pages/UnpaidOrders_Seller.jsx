import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SearchSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const KebabIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 512" fill="#a1a5b3">
    <path d="M64 360a56 56 0 1 1 0 112 56 56 0 1 1 0-112m0-160a56 56 0 1 1 0 112 56 56 0 1 1 0-112M120 96A56 56 0 1 1 8 96a56 56 0 1 1 112 0" />
  </svg>
)

function DeliveryStatusCell({ status }) {
  const colorMap = {
    'delivered': 'text-[#28a745]',
    'pending':   'text-[#2E294E]',
    'confirmed': 'text-[#28a745]',
    'cancelled': 'text-[#dc3545]',
  }
  const cls = colorMap[(status || '').toLowerCase()] || 'text-[#2E294E]'
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'
  return <span className={`font-semibold ${cls} text-[14px]`}>{label}</span>
}

function formatOrderCode(order) {
  if (!order._id) return '—'
  const d = order.createdAt ? new Date(order.createdAt) : new Date()
  const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const idSuffix = order._id.toString().slice(-8)
  return `${datePart}-${idSuffix}`
}

function formatPaymentMethod(method) {
  if (!method) return 'Cash on Delivery'
  return method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const PER_PAGE = 10
const DELIVERY_OPTIONS = ['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled']

export default function UnpaidOrders_Seller() {
  const navigate = useNavigate()
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const [page, setPage]         = useState(1)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [allChecked, setAllChecked] = useState(false)
  const [checks, setChecks]     = useState({})
  const [actionMenuId, setActionMenuId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const bulkRef   = useRef(null)
  const filterRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (bulkRef.current   && !bulkRef.current.contains(e.target))   setBulkOpen(false)
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
      if (!e.target.closest('[data-action-menu]')) setActionMenuId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('ec_token')
    setLoading(true)
    setError('')
    fetch(`${API_URL}/orders/seller`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setOrders(d.data || [])
        else setError(d.message || 'Failed to load orders')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return
    setDeleting(id)
    const token = localStorage.getItem('ec_token')
    try {
      const res  = await fetch(`${API_URL}/orders/${id}/seller-delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setOrders(prev => prev.filter(o => o._id !== id))
      } else {
        alert(data.message || 'Failed to delete order')
      }
    } catch {
      alert('Network error')
    } finally {
      setDeleting(null)
    }
  }

  // Only unpaid orders
  const filtered = orders.filter(o => {
    if ((o.paymentStatus || 'unpaid').toLowerCase() !== 'unpaid') return false
    if (deliveryFilter !== 'All') {
      if ((o.status || 'pending').toLowerCase() !== deliveryFilter.toLowerCase()) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      const code = formatOrderCode(o).toLowerCase()
      const customer = (o.shippingAddress?.name || '').toLowerCase()
      const seller = (o.items?.[0]?.seller || '').toLowerCase()
      if (!code.includes(q) && !customer.includes(q) && !seller.includes(q)) return false
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleAll = () => {
    const next = !allChecked
    setAllChecked(next)
    const newChecks = {}
    paginated.forEach(o => { newChecks[o._id] = next })
    setChecks(newChecks)
  }

  const toggleOne = (id) => {
    setChecks(prev => {
      const next = { ...prev, [id]: !prev[id] }
      setAllChecked(paginated.every(o => next[o._id]))
      return next
    })
  }

  return (
    <div>
      {/* Title */}
      <div className="text-left pb-[5px]">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-[20px] font-bold text-[#2E294E]">Unpaid Orders</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[6px] mt-3">
        <div className="">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-wrap border-0 pb-0 mt-2 px-3 gap-2 pt-3">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center mb-0 border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px]">
                  <span className="px-0 mr-2"><SearchSvg /></span>
                  <input type="text" className="border-0 px-2 bg-transparent flex-1 py-2 text-[14px] focus:outline-none" placeholder="Search Orders…"
                    value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
                </div>
              </div>

              {/* Bulk Action */}
              <div className="relative bg-[#f5f5f7] mt-2 md:mt-0 rounded-[4px]" ref={bulkRef}>
                <button onClick={() => setBulkOpen(o => !o)}
                  className="border border-[#f1f1f4] text-[#a1a5b3] text-[14px] font-normal flex items-center px-3 py-2 rounded-[4px]" type="button">
                  Bulk Action
                  <svg className="ml-2" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#a1a5b3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {bulkOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white shadow-md border border-[#f1f1f4] rounded-[4px] z-10 min-w-[120px]">
                    <a href="#" className="block px-4 py-2 text-[#a1a5b3] text-[14px] font-medium hover:bg-[#f5f5f7]">Export</a>
                  </div>
                )}
              </div>

              {/* Filter by Delivery Status */}
              <div className="md:w-[200px] relative" ref={filterRef}>
                <button onClick={() => setFilterOpen(o => !o)}
                  className="px-3 w-full flex justify-between items-center py-2 border border-[#f1f1f4] bg-white rounded-[4px]" type="button">
                  <span className="text-[#a1a5b3] text-[14px] font-normal">
                    {deliveryFilter !== 'All' ? deliveryFilter : 'Filter by Delivery Status'}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#a1a5b3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {filterOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white shadow-md border border-[#f1f1f4] rounded-[4px] z-10 w-full py-3">
                    {DELIVERY_OPTIONS.map((label) => (
                      <div key={label} className="hover:bg-[#f5f5f7] py-2 flex items-center px-3">
                        <input type="checkbox" id={`up-${label}`} className="mr-2"
                          checked={label === 'All' ? deliveryFilter === 'All' : deliveryFilter.toLowerCase() === label.toLowerCase()}
                          onChange={() => { setDeliveryFilter(label === 'All' || deliveryFilter.toLowerCase() === label.toLowerCase() ? 'All' : label); setPage(1); setFilterOpen(false) }} />
                        <label className="text-[14px] text-[#2E294E]" htmlFor={`up-${label}`}>{label}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="px-3 py-3 mt-3">
              {loading ? (
                <div className="text-center py-10 text-[14px] text-[#a1a5b3]">Loading orders…</div>
              ) : error ? (
                <div className="text-center py-10 text-[14px] text-[#dc3545]">{error}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-[#a1a5b3] text-[12px] font-semibold uppercase">
                      <th className="text-left py-3 pl-3 w-[40px]">
                        <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                      </th>
                      <th className="text-left py-3">Order Code:</th>
                      <th className="text-left py-3">Products</th>
                      <th className="text-left py-3">Customer</th>
                      <th className="text-left py-3">Seller</th>
                      <th className="text-left py-3">Amount</th>
                      <th className="text-left py-3">Delivery Status</th>
                      <th className="text-left py-3">Payment Method</th>
                      <th className="text-left py-3">Payment Status</th>
                      <th className="text-left py-3">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-10 text-[14px] text-[#a1a5b3]">No unpaid orders found.</td>
                      </tr>
                    ) : (
                      paginated.map((o) => {
                        const sellerName   = o.items?.[0]?.seller || '—'
                        const customer     = o.shippingAddress?.name || '—'
                        const amount       = `$${Number(o.totalAmount || 0).toFixed(2)}`
                        const productCount = o.items?.length || 0
                        return (
                          <tr key={o._id} className="border-t border-[#f1f1f4]">
                            <td className="py-4 pl-3">
                              <input type="checkbox" checked={!!checks[o._id]} onChange={() => toggleOne(o._id)} />
                            </td>
                            <td className="py-4 text-[#009ef7] text-[14px] font-semibold">{formatOrderCode(o)}</td>
                            <td className="py-4 text-[#2E294E] text-[14px]">{productCount}</td>
                            <td className="py-4 text-[#2E294E] text-[14px]">{customer}</td>
                            <td className="py-4 text-[#009ef7] text-[14px] font-semibold">{sellerName}</td>
                            <td className="py-4 text-[#2E294E] text-[14px]">{amount}</td>
                            <td className="py-4"><DeliveryStatusCell status={o.status} /></td>
                            <td className="py-4 text-[#2E294E] text-[14px]">{formatPaymentMethod(o.paymentMethod)}</td>
                            <td className="py-4">
                              <span className="bg-[#f1416c] text-white px-3 py-[2px] text-[12px] font-semibold rounded-[3px]">Un-Paid</span>
                            </td>
                            <td className="py-4 relative">
                              <button className="p-2 hover:bg-[#f5f5f7] rounded-full" type="button"
                                onClick={() => setActionMenuId(prev => prev === o._id ? null : o._id)}>
                                <KebabIcon />
                              </button>
                              {actionMenuId === o._id && (
                                <div data-action-menu className="absolute right-0 mt-1 bg-white shadow-md border border-[#f1f1f4] rounded-[4px] z-10 min-w-[140px]">
                                  <button className="block w-full text-left px-4 py-2 text-[#2E294E] text-[13px] hover:bg-[#f5f5f7]" type="button"
                                    onClick={() => { setActionMenuId(null); navigate(`/seller/orders/view/${o._id}`) }}>
                                    View Details
                                  </button>
                                  <button className="block w-full text-left px-4 py-2 text-[#dc3545] text-[13px] hover:bg-[#fff5f5]" type="button"
                                    disabled={deleting === o._id}
                                    onClick={() => { setActionMenuId(null); handleDelete(o._id) }}>
                                    {deleting === o._id ? 'Deleting…' : 'Delete'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-end items-center gap-1 px-3 pb-3">
                <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-[13px] border border-[#f1f1f4] rounded-[4px] text-[#a1a5b3] disabled:opacity-40 hover:bg-[#f5f5f7]">
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} type="button" onClick={() => setPage(p)}
                    className={`px-3 py-1 text-[13px] border rounded-[4px] ${p === page ? 'bg-[#2E294E] text-white border-[#2E294E]' : 'border-[#f1f1f4] text-[#a1a5b3] hover:bg-[#f5f5f7]'}`}>
                    {p}
                  </button>
                ))}
                <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1 text-[13px] border border-[#f1f1f4] rounded-[4px] text-[#a1a5b3] disabled:opacity-40 hover:bg-[#f5f5f7]">
                  Next
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}