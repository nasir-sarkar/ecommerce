import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PLACEHOLDER = 'https://via.placeholder.com/50x50?text=IMG'

// Helpers
function fmt(amount) {
  if (amount == null) return '$0.00'
  return '$' + Number(amount).toFixed(2)
}

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year  = d.getFullYear()
  const hh    = String(d.getHours()).padStart(2, '0')
  const mm    = String(d.getMinutes()).padStart(2, '0')
  return `${day}-${month}-${year} ${hh}:${mm}`
}

function shortDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year  = d.getFullYear()
  return `${day}-${month}-${year}`
}

function generateOrderCode(id, createdAt) {
  if (!id) return ''
  const d = createdAt ? new Date(createdAt) : new Date()
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const tail = id.slice(-8).toUpperCase()
  return `${date}-${tail}`
}

function paymentMethodLabel(m) {
  if (!m) return 'Cash on Delivery'
  const map = { cash_on_delivery: 'Cash on Delivery', cod: 'Cash on Delivery', card: 'Card Payment', online: 'Online Payment' }
  return map[m] || m
}

function deliveryTypeLabel(t) {
  if (!t) return 'Home Delivery'
  const map = { home_delivery: 'Home Delivery', pickup: 'Pickup' }
  return map[t] || t
}

const SHIPPING_COST = 5

// Tabs & Filter constants
const TABS = [
  { slug: 'all',       label: 'All' },
  { slug: 'unpaid',    label: 'Un-Paid' },
  { slug: 'confirmed', label: 'Confirmed' },
  { slug: 'delivered', label: 'Delivered' },
  { slug: 'to-review', label: 'To Review' },
]

const DELIVERY_OPTIONS = [
  { value: '',          label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'delivered', label: 'Delivered' },
]

const PER_PAGE = 10

function filterOrders(orders, tab, delivery) {
  let r = [...orders]
  if (tab === 'unpaid')    r = r.filter(o => o.paymentStatus === 'unpaid')
  if (tab === 'confirmed') r = r.filter(o => o.status === 'confirmed')
  if (tab === 'delivered') r = r.filter(o => o.status === 'delivered')
  if (tab === 'to-review') r = r.filter(o => o.status === 'delivered' && o.items.some(i => !i.reviewed))
  if (delivery)            r = r.filter(o => o.status === delivery)
  return r
}

// Badges
function PaymentBadge({ status }) {
  return (
    <span className={`inline-block text-white text-[10px] font-semibold px-[6px] py-[2px] rounded-[3px] leading-none uppercase ${status === 'paid' ? 'bg-[#85b567]' : 'bg-[#d43533]'}`}>
      {status === 'paid' ? 'Paid' : 'Unpaid'}
    </span>
  )
}

function DeliveryBadge({ status }) {
  const map = {
    delivered: ['bg-[#85b567]', 'Delivered'],
    confirmed: ['bg-[#3490f3]', 'Confirmed'],
    pending:   ['bg-[#d43533]', 'Pending'],
  }
  const [bg, label] = map[status] || ['bg-[#919199]', status]
  return (
    <span className={`inline-block text-white text-[10px] font-semibold px-[6px] py-[2px] rounded-[3px] leading-none uppercase ${bg}`}>
      {label}
    </span>
  )
}

// Options Dropdown
function OptionsDropdown({ order, onViewDetails, onCancel }) {
  const [open, setOpen] = useState(false)
  const canCancel = order.status === 'pending'

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center gap-[4px] bg-[#6c757d] hover:bg-[#5a6268] text-white text-[12px] font-semibold px-[10px] py-[5px] rounded-[3px] border-0 cursor-pointer"
      >
        Options
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 16 16" fill="white">
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+2px)] bg-white border border-[#dfdfe6] shadow-lg z-50 min-w-[130px]">
          <button
            onClick={() => { onViewDetails(order); setOpen(false) }}
            className="block w-full text-left px-[12px] py-[8px] text-[13px] text-[#292933] hover:bg-[#f5f5f5] bg-transparent border-0 cursor-pointer"
          >
            View Details
          </button>
          {canCancel && (
            <button
              onClick={() => { onCancel(order._id); setOpen(false) }}
              className="block w-full text-left px-[12px] py-[8px] text-[13px] text-[#d43533] hover:bg-[#f5f5f5] bg-transparent border-0 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Review Button
function ReviewBtn({ reviewed, onClick }) {
  if (reviewed) {
    return (
      <button disabled className="inline-flex items-center gap-[4px] bg-[#6c757d] text-white text-[12px] font-semibold px-[10px] py-[5px] rounded-[3px] border-0 cursor-default opacity-90">
        Reviewed
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-[4px] bg-[#f3af3d] hover:bg-[#d99b2e] text-white text-[12px] font-semibold px-[10px] py-[5px] rounded-[3px] border-0 cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 576 512" fill="white">
        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
      </svg>
      Review
    </button>
  )
}

// Order Row (list view)
function OrderRow({ order, onViewDetails, onCancel, onReorder, onReview }) {
  const canReview = order.status === 'delivered'
  const orderCode = generateOrderCode(order._id, order.createdAt)

  return (
    <div className="mb-0 pb-[16px] border-b border-[#dfdfe6] last:border-b-0">
      <div className="flex items-center justify-between flex-wrap gap-[6px] pt-[14px]">
        <div className="flex items-center flex-wrap gap-[8px]">
          <button
            onClick={() => onViewDetails(order)}
            className="text-[#0080FF] text-[13px] font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
          >
            Order Id - {orderCode}
          </button>
          <DeliveryBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <div className="flex items-center gap-[6px]">
          <button
            onClick={() => onReorder(order._id)}
            className="bg-white border border-[#dfdfe6] hover:bg-[#f5f5f5] text-[#292933] text-[12px] font-semibold px-[10px] py-[5px] rounded-[3px] cursor-pointer"
          >
            Reorder
          </button>
          <OptionsDropdown order={order} onViewDetails={onViewDetails} onCancel={onCancel} />
        </div>
      </div>

      <div className="text-[12px] mt-[4px] mb-[10px]">
        <span className="text-[#0080FF] font-semibold">Inhouse Products</span>
        <span className="text-[#919199] mx-[6px]">|</span>
        <span className="text-[#919199]">Date: {shortDate(order.createdAt)}</span>
      </div>

      {order.items.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between flex-wrap gap-[10px] py-[10px] border-t border-[#f0f0f0]">
          <div className="flex items-start gap-[12px] flex-1 min-w-0">
            <Link to={`/product/${item.productId}`} className="flex-shrink-0">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.name}
                className="w-[50px] h-[50px] object-contain border border-[#dfdfe6]"
                onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={`/product/${item.productId}`}
                className="text-[13px] font-semibold text-[#292933] no-underline hover:text-[#0080FF] leading-[1.4]"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                title={item.name}
              >
                {item.name}
              </Link>
              {item.selectedVariant && (
                <div className="text-[12px] text-[#919199] mt-[2px]">{item.selectedVariant}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-[6px] flex-shrink-0">
            <div className="text-right">
              <span className="text-[14px] font-bold text-[#292933] block">{fmt(item.price)}</span>
              <span className="text-[12px] text-[#919199]">QTY {item.qty}</span>
            </div>
            {canReview && (
              <ReviewBtn reviewed={item.reviewed} onClick={() => onReview({ ...item, orderId: order._id })} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Pagination
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null
  return (
    <div className="flex items-center gap-[4px] mt-[20px] mb-[4px]">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1} className="w-[32px] h-[32px] flex items-center justify-center border border-[#dfdfe6] text-[13px] bg-white hover:bg-[#f5f5f5] disabled:opacity-40 cursor-pointer rounded-none">‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)} className={`w-[32px] h-[32px] flex items-center justify-center border text-[13px] rounded-none cursor-pointer ${p === current ? 'bg-[#0080FF] border-[#0080FF] text-white font-bold' : 'border-[#dfdfe6] text-[#292933] bg-white hover:bg-[#f5f5f5]'}`}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total} className="w-[32px] h-[32px] flex items-center justify-center border border-[#dfdfe6] text-[13px] bg-white hover:bg-[#f5f5f5] disabled:opacity-40 cursor-pointer rounded-none">›</button>
    </div>
  )
}

// Cancel Modal
function CancelModal({ orderId, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-[300px] shadow-xl">
        <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#dfdfe6]">
          <h5 className="text-[15px] font-semibold m-0 text-[#292933]">Cancel Confirmation</h5>
          <button onClick={onClose} className="bg-transparent border-0 text-[#919199] text-[22px] leading-none cursor-pointer p-0">×</button>
        </div>
        <div className="p-[20px] text-center">
          <p className="text-[14px] text-[#292933] mb-[16px]">Are you sure to Cancel this Order?</p>
          <div className="flex items-center justify-center gap-[8px]">
            <button onClick={onClose} className="px-[20px] py-[6px] rounded-[20px] bg-[#919199] text-white text-[13px] font-semibold border-0 cursor-pointer">No</button>
            <button onClick={() => { onConfirm(orderId); onClose() }} className="px-[20px] py-[6px] rounded-[20px] bg-[#0080FF] text-white text-[13px] font-semibold border-0 cursor-pointer">Yes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Review Offcanvas
function ReviewOffcanvas({ item, token, onClose, onSubmitSuccess }) {
  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!rating)         return alert('Please select a rating')
    if (!comment.trim()) return alert('Please write a comment')
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/product-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: item.productId, orderId: item.orderId, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) return alert(data.message || 'Failed to submit review')
      alert('Review submitted!')
      onSubmitSuccess(item)
      onClose()
    } catch { alert('Network error') } finally { setLoading(false) }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1040]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full bg-white z-[1045] overflow-y-auto p-[24px] shadow-2xl w-[min(480px,100vw)]">
        <button onClick={onClose} className="bg-transparent border-0 text-[#919199] text-[26px] leading-none cursor-pointer p-0 mb-[16px] block">×</button>
        <h5 className="text-[16px] font-bold text-[#292933] mb-[16px]">Write a Review</h5>
        <div className="flex items-center gap-[12px] mb-[20px]">
          <img src={item.image || PLACEHOLDER} alt={item.name} className="w-[60px] h-[60px] object-contain border border-[#dfdfe6] flex-shrink-0" onError={e => { e.target.src = PLACEHOLDER }} />
          <p className="text-[13px] font-semibold text-[#292933] m-0 leading-[1.4]" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</p>
        </div>
        <label className="block text-[13px] font-semibold text-[#292933] mb-[8px]">Rating <span className="text-[#d43533]">*</span></label>
        <div className="flex gap-[4px] mb-[16px]">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} className={`bg-transparent border-0 text-[30px] leading-none cursor-pointer p-0 ${s <= rating ? 'text-[#f3af3d]' : 'text-[#dfdfe6]'}`}>★</button>
          ))}
        </div>
        <label className="block text-[13px] font-semibold text-[#292933] mb-[8px]">Comment <span className="text-[#d43533]">*</span></label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={5}
          placeholder="Write your review..."
          className="w-full border border-[#dfdfe6] p-[10px] text-[13px] resize-y outline-none rounded-none box-border font-[inherit]"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#0080FF] hover:bg-[#0066cc] disabled:opacity-60 text-white font-bold text-[14px] py-[10px] border-0 cursor-pointer mt-[16px] rounded-none"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </>
  )
}

// Order Detail View
function OrderDetailView({ orderId, token, user, onBack, onReview, reviewedSet }) {
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/orders/my-orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setOrder(d.data) })
      .finally(() => setLoading(false))
  }, [orderId, token])

  if (loading) return <Loader />
  if (!order)  return <div className="text-[14px] text-[#919199] p-[20px]">Order not found.</div>

  const orderCode = generateOrderCode(order._id, order.createdAt)
  const subtotal  = order.items.reduce((s, i) => s + i.price * i.qty, 0)
  const total     = subtotal + SHIPPING_COST
  const addr      = order.shippingAddress || {}
  const addrStr   = [addr.address, addr.city, addr.state, addr.country, addr.postal_code].filter(Boolean).join(', ') || '—'
  const canReview = order.status === 'delivered'

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-[6px] text-[#0080FF] text-[13px] font-semibold bg-transparent border-0 cursor-pointer p-0 mb-[16px] hover:underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        Back to Purchase History
      </button>

      <h5 className="text-[18px] font-bold text-[#292933] mb-[16px]">Order Id: {orderCode}</h5>

      {/* Order Summary */}
      <div className="border border-[#dfdfe6] mb-[20px]">
        <div className="bg-[#f8f9fa] border-b border-[#dfdfe6] px-[16px] py-[10px]">
          <h6 className="m-0 text-[14px] font-bold text-[#292933]">Order Summary</h6>
        </div>
        <div className="p-[16px]">
          <div className="flex flex-wrap gap-x-[32px] gap-y-[10px] text-[13px]">
            <div className="flex-1 min-w-[220px] space-y-[10px]">
              <Row label="Order Code"       value={orderCode} />
              <Row label="Customer"         value={user?.fullName || user?.name || 'Customer'} />
              <Row label="Email"            value={user?.email || '—'} />
              <Row label="Shipping address" value={addrStr} />
              <Row label="Billing address"  value={addrStr} />
            </div>
            <div className="flex-1 min-w-[220px] space-y-[10px]">
              <Row label="Order date"         value={fmtDate(order.createdAt)} />
              <div className="flex gap-[8px]">
                <span className="text-[#292933] font-semibold min-w-[130px]">Order status:</span>
                <DeliveryBadge status={order.status} />
              </div>
              <Row label="Total order amount" value={fmt(total)} />
              <Row label="Shipping method"    value="Flat shipping rate" />
              <Row label="Payment method"     value={paymentMethodLabel(order.paymentMethod)} />
              {order.additionalInfo && <Row label="Additional Info" value={order.additionalInfo} />}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details + Amount */}
      <div className="flex gap-[16px] flex-wrap items-start">
        <div className="flex-1 min-w-0 border border-[#dfdfe6]">
          <div className="bg-[#f8f9fa] border-b border-[#dfdfe6] px-[16px] py-[10px]">
            <h6 className="m-0 text-[14px] font-bold text-[#292933]">Order Details</h6>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[#dfdfe6] bg-[#fafafa]">
                  {['#','Product','Variation','Quantity','Delivery Type','Price','Refund Status','Review'].map(h => (
                    <th key={h} className="text-left px-[12px] py-[8px] font-semibold text-[#292933] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => {
                  const isReviewed = item.reviewed || reviewedSet.has(`${order._id}__${item.productId}`)
                  return (
                    <tr key={idx} className="border-b border-[#f0f0f0] last:border-b-0">
                      <td className="px-[12px] py-[10px] text-[#919199]">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="px-[12px] py-[10px]">
                        <div className="flex items-center gap-[10px]">
                          <img
                            src={item.image || PLACEHOLDER}
                            alt={item.name}
                            className="w-[40px] h-[40px] object-contain border border-[#dfdfe6] flex-shrink-0"
                            onError={e => { e.target.src = PLACEHOLDER }}
                          />
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-[#0080FF] no-underline hover:underline text-[12px] leading-[1.4]"
                            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '200px' }}
                          >
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td className="px-[12px] py-[10px] text-[#919199] whitespace-nowrap">{item.selectedVariant || '—'}</td>
                      <td className="px-[12px] py-[10px] text-[#919199] whitespace-nowrap">{item.qty}</td>
                      <td className="px-[12px] py-[10px] text-[#919199] whitespace-nowrap">{deliveryTypeLabel(order.deliveryType)}</td>
                      <td className="px-[12px] py-[10px] font-semibold text-[#292933] whitespace-nowrap">{fmt(item.price)}</td>
                      <td className="px-[12px] py-[10px] text-[#919199] whitespace-nowrap">N/A</td>
                      <td className="px-[12px] py-[10px]">
                        {canReview
                          ? <ReviewBtn reviewed={isReviewed} onClick={() => onReview({ ...item, orderId: order._id })} />
                          : <span className="text-[12px] text-[#919199]">—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full sm:w-[200px] flex-shrink-0 border border-[#dfdfe6]">
          <div className="bg-[#f8f9fa] border-b border-[#dfdfe6] px-[16px] py-[10px]">
            <h6 className="m-0 text-[14px] font-bold text-[#292933]">Order Ammount</h6>
          </div>
          <div className="p-[16px] text-[13px] space-y-[8px]">
            {[['Subtotal', fmt(subtotal)], ['Shipping', fmt(SHIPPING_COST)], ['Tax', fmt(0)], ['Coupon', fmt(0)]].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-[#292933]">{l}</span>
                <span className="text-[#919199]">{v}</span>
              </div>
            ))}
            <div className="border-t border-[#dfdfe6] pt-[8px] flex justify-between font-bold">
              <span className="text-[#292933]">Total</span>
              <span className="text-[#292933]">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-[8px]">
      <span className="text-[#292933] font-semibold min-w-[130px]">{label}:</span>
      <span className="text-[#919199]">{value}</span>
    </div>
  )
}

// Loader / Empty
function Loader() {
  return (
    <div className="flex justify-center items-center py-[48px]">
      <div className="w-[28px] h-[28px] border-[3px] border-[#dfdfe6] border-t-[#0080FF] rounded-full animate-spin" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-[48px]">
      <p className="text-[#919199] mt-[8px] text-[14px]">No orders found.</p>
    </div>
  )
}

// Main Page
export default function PurchaseHistory_User() {
  const { token, user } = useAuth()

  const [allOrders,      setAllOrders]      = useState([])
  const [loading,        setLoading]        = useState(true)
  const [activeTab,      setActiveTab]      = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('')
  const [page,           setPage]           = useState(1)
  const [cancelOrderId,  setCancelOrderId]  = useState(null)
  const [reviewItem,     setReviewItem]     = useState(null)
  const [detailOrder,    setDetailOrder]    = useState(null)
  const [reviewedSet,    setReviewedSet]    = useState(new Set())

  const fetchOrders = useCallback(() => {
    if (!token) return
    setLoading(true)
    fetch(`${API_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.success) setAllOrders(d.data.orders || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered   = filterOrders(allOrders, activeTab, deliveryFilter)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const pageOrders = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCancel = async (id) => {
    try {
      const res  = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) return alert(data.message || 'Failed to cancel order')
      alert('Order cancelled successfully.')
      fetchOrders()
    } catch { alert('Network error') }
  }

  const handleReorder = async (id) => {
    try {
      const res  = await fetch(`${API_URL}/orders/${id}/reorder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) return alert(data.message || 'Failed to reorder')
      alert('Reorder placed successfully!')
      fetchOrders()
    } catch { alert('Network error') }
  }

  const handleReviewSuccess = (item) => {
    const key = `${item.orderId}__${item.productId}`
    setReviewedSet(prev => new Set([...prev, key]))
    setAllOrders(prev => prev.map(o => {
      if (o._id !== item.orderId) return o
      return { ...o, items: o.items.map(i => i.productId === item.productId ? { ...i, reviewed: true } : i) }
    }))
  }

  // Detail view
  if (detailOrder) {
    return (
      <div className="bg-white shadow-none rounded-none border border-[#dfdfe6] p-[16px]">
        <OrderDetailView
          orderId={detailOrder._id}
          token={token}
          user={user}
          onBack={() => setDetailOrder(null)}
          onReview={item => setReviewItem(item)}
          reviewedSet={reviewedSet}
        />
        {reviewItem && (
          <ReviewOffcanvas
            item={reviewItem}
            token={token}
            onClose={() => setReviewItem(null)}
            onSubmitSuccess={handleReviewSuccess}
          />
        )}
      </div>
    )
  }

  // List view
  return (
    <>
      <div className="bg-white shadow-none rounded-none border border-[#dfdfe6] pl-[16px] pr-[16px] pt-[16px]">
        <h5 className="mb-[8px] text-[20px] font-bold text-[#292933]">Purchase History</h5>

        <div className="flex justify-between items-center border-b border-[#dfdfe6] pb-[12px] flex-wrap gap-[6px]">
          <ul className="flex flex-wrap list-none m-0 p-0 -ml-[12px]">
            {TABS.map(tab => (
              <li key={tab.slug} className="m-0 p-0">
                <button
                  onClick={() => { setActiveTab(tab.slug); setDeliveryFilter(''); setPage(1) }}
                  className={`bg-transparent border-0 border-b-[2px] cursor-pointer text-[12px] px-[12px] py-[6px] transition-colors ${
                    activeTab === tab.slug
                      ? 'text-[#0080FF] font-semibold border-b-[#0080FF]'
                      : 'text-[#292933] border-b-transparent hover:text-[#0080FF]'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="w-[25%] min-w-[120px]">
            <select
              value={deliveryFilter}
              onChange={e => { setDeliveryFilter(e.target.value); setActiveTab('all'); setPage(1) }}
              className="w-full border border-[#dfdfe6] px-[10px] py-[6px] text-[13px] text-[#292933] bg-white outline-none rounded-none cursor-pointer"
            >
              {DELIVERY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-[16px] pb-[4px]">
          {loading ? (
            <Loader />
          ) : pageOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {pageOrders.map(order => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onViewDetails={o => setDetailOrder(o)}
                  onCancel={id => setCancelOrderId(id)}
                  onReorder={handleReorder}
                  onReview={item => setReviewItem(item)}
                />
              ))}
              <Pagination current={page} total={totalPages} onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
            </>
          )}
        </div>
      </div>

      {cancelOrderId && (
        <CancelModal
          orderId={cancelOrderId}
          onClose={() => setCancelOrderId(null)}
          onConfirm={id => { handleCancel(id); setCancelOrderId(null) }}
        />
      )}
      {reviewItem && (
        <ReviewOffcanvas
          item={reviewItem}
          token={token}
          onClose={() => setReviewItem(null)}
          onSubmitSuccess={handleReviewSuccess}
        />
      )}
    </>
  )
}