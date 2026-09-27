import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const QR_SVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100" viewBox="0 0 100 100">
    <rect x="0" y="0" width="100" height="100" fill="#ffffff"/>
    <g transform="scale(4.762)"><g transform="translate(0,0)">
      <path fillRule="evenodd" d="M10 0L10 1L11 1L11 0ZM12 0L12 2L13 2L13 0ZM8 2L8 3L9 3L9 2ZM10 2L10 3L11 3L11 2ZM12 3L12 4L11 4L11 5L10 5L10 4L9 4L9 6L8 6L8 8L4 8L4 9L3 9L3 8L0 8L0 10L1 10L1 11L0 11L0 13L1 13L1 11L3 11L3 13L7 13L7 12L8 12L8 17L9 17L9 18L8 18L8 21L11 21L11 16L12 16L12 17L13 17L13 16L14 16L14 15L13 15L13 14L14 14L14 13L13 13L13 14L12 14L12 12L13 12L13 11L15 11L15 10L16 10L16 11L17 11L17 10L18 10L18 13L17 13L17 12L15 12L15 13L16 13L16 16L15 16L15 17L14 17L14 19L13 19L13 18L12 18L12 19L13 19L13 21L15 21L15 20L16 20L16 21L17 21L17 19L16 19L16 18L18 18L18 19L19 19L19 20L18 20L18 21L19 21L19 20L20 20L20 21L21 21L21 18L20 18L20 17L19 17L19 16L20 16L20 15L19 15L19 14L20 14L20 13L21 13L21 12L19 12L19 10L21 10L21 9L19 9L19 8L18 8L18 9L15 9L15 8L12 8L12 9L11 9L11 6L12 6L12 7L13 7L13 6L12 6L12 5L13 5L13 3ZM9 6L9 9L6 9L6 10L5 10L5 9L4 9L4 10L3 10L3 9L1 9L1 10L3 10L3 11L4 11L4 12L5 12L5 11L6 11L6 12L7 12L7 11L8 11L8 12L9 12L9 14L10 14L10 15L12 15L12 14L10 14L10 13L11 13L11 11L10 11L10 10L11 10L11 9L10 9L10 6ZM12 9L12 11L13 11L13 10L14 10L14 9ZM18 9L18 10L19 10L19 9ZM4 10L4 11L5 11L5 10ZM6 10L6 11L7 11L7 10ZM8 10L8 11L9 11L9 10ZM18 13L18 14L17 14L17 15L18 15L18 16L16 16L16 17L15 17L15 18L16 18L16 17L18 17L18 18L19 18L19 19L20 19L20 18L19 18L19 17L18 17L18 16L19 16L19 15L18 15L18 14L19 14L19 13ZM9 16L9 17L10 17L10 16ZM9 19L9 20L10 20L10 19ZM14 19L14 20L15 20L15 19ZM0 0L0 7L7 7L7 0ZM1 1L1 6L6 6L6 1ZM2 2L2 5L5 5L5 2ZM14 0L14 7L21 7L21 0ZM15 1L15 6L20 6L20 1ZM16 2L16 5L19 5L19 2ZM0 14L0 21L7 21L7 14ZM1 15L1 20L6 20L6 15ZM2 16L2 19L5 19L5 16Z" fill="#000000"/>
    </g></g>
  </svg>
)

const IconPrint = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
  </svg>
)

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`
}

function fmtCode(order) {
  if (!order) return ''
  const d = new Date(order.createdAt)
  const date = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`
  const time = `${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
  return `${date}-${time}${order._id.slice(-8)}`
}

const selectStyle = {
  border: '1px solid #e4e5eb', borderRadius: 4, padding: '6px 10px',
  fontSize: 13, width: '100%', color: '#232734', background: '#fff', outline: 'none',
}
const thStyle = {
  padding: '10px 12px', textAlign: 'left', textTransform: 'uppercase',
  fontSize: 12, fontWeight: 600, border: '1px solid #dee2e6', color: '#232734',
}
const tdStyle = {
  padding: '10px 12px', border: '1px solid #dee2e6', verticalAlign: 'middle', fontSize: 13,
}

export default function ViewOrder_Admin() {
  const navigate  = useNavigate()
  const { id }    = useParams()

  const [order, setOrder]               = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [deliveryStatus, setDeliveryStatus] = useState('pending')
  const [paymentStatus, setPaymentStatus]   = useState('unpaid')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingPayStatus, setPendingPayStatus] = useState('')
  const [saving, setSaving]             = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('ec_token')
    fetch(`${API_URL}/orders/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setOrder(d.data)
          setDeliveryStatus(d.data.status || 'pending')
          setPaymentStatus(d.data.paymentStatus || 'unpaid')
        } else {
          setError(d.message || 'Failed to load order')
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDeliveryAction = async (newStatus) => {
    setSaving(true)
    const token = localStorage.getItem('ec_token')
    try {
      const res  = await fetch(`${API_URL}/orders/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setDeliveryStatus(data.data.status)
        setOrder(prev => ({ ...prev, status: data.data.status }))
      } else {
        alert(data.message || 'Failed to update status')
      }
    } catch {
      alert('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handlePaymentChange = (e) => {
    setPendingPayStatus(e.target.value)
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = async () => {
    setShowPaymentModal(false)
    setSaving(true)
    const token = localStorage.getItem('ec_token')
    try {
      const res  = await fetch(`${API_URL}/orders/admin/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: pendingPayStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setPaymentStatus(data.data.paymentStatus)
        setOrder(prev => ({ ...prev, paymentStatus: data.data.paymentStatus }))
      } else {
        alert(data.message || 'Failed to update payment')
      }
    } catch {
      alert('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-[14px] text-[#9da3ae]">Loading order…</div>
  if (error)   return <div className="p-8 text-center text-[14px] text-[#f1416c]">{error}</div>
  if (!order)  return null

  const customer = order.shippingAddress || {}
  const customerName = order.userId?.fullName || customer.name || '—'

  // Seller name: from first item with a seller, else "In House Product"
  const sellerName = order.items?.find(i => i.seller && i.seller.trim() !== '')?.seller || 'In House Product'

  // Tax 2% of totalAmount, shipping $5
  const originalTotal = (order.items || []).reduce((s, i) => s + (i.originalPrice || i.price || 0) * (i.qty || 1), 0)
  const discountTotal = originalTotal - (order.totalAmount || 0)
  const taxAmount  = (order.totalAmount || 0) * 0.02
  const shipping   = 5.00
  const grandTotal = (order.totalAmount || 0) + taxAmount + shipping

  const fmt = n => `$${Number(n).toFixed(2)}`

  const statusBadgeColor = {
    pending:   '#8f60ee',
    confirmed: '#009ef7',
    delivered: '#19c553',
  }

  return (
    <div style={{ padding: '0 0 32px' }}>
      <div className="card" style={{ borderRadius: 8, background: '#fff', border: '1px solid #f1f1f4', boxShadow: '0px 6px 14px rgba(35, 39, 52, 0.04)', margin: '0' }}>

        {/* Card Header */}
        <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f1f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#232734' }}>Order Details</h1>

          {/* Delivery action button */}
          {deliveryStatus === 'pending' && (
            <button type="button" disabled={saving} onClick={() => handleDeliveryAction('confirmed')}
              style={{ background: '#19c553', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 3px 10px rgba(25,197,83,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Confirm Order
            </button>
          )}
          {deliveryStatus === 'confirmed' && (
            <button type="button" disabled={saving} onClick={() => handleDeliveryAction('delivered')}
              style={{ background: '#009ef7', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 3px 10px rgba(0,158,247,0.3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
              Mark as Delivered
            </button>
          )}
          {deliveryStatus === 'delivered' && (
            <span style={{ background: '#e8fff3', color: '#19c553', border: '1px solid #c6f6d5', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 700 }}>✓ Delivered</span>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          {/* Controls Row: Payment Status only */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-end' }}>
              <div style={{ minWidth: 160 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#232734', display: 'block', marginBottom: 4 }}>Payment Status</label>
                <select style={selectStyle} value={paymentStatus} onChange={handlePaymentChange}>
                  <option value="unpaid">Un-Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ marginBottom: 12 }}><QR_SVG /></div>

          {/* Customer + Order Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <address style={{ fontStyle: 'normal', fontSize: 13, lineHeight: 1.7 }}>
                <strong style={{ color: '#232734' }}>{customerName}</strong><br />
                {customer.email}<br />
                {customer.phone}<br />
                {[customer.address, customer.city, customer.state, customer.country].filter(Boolean).join(', ')}<br />
                {customer.postal_code}
              </address>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                <strong style={{ color: '#232734' }}>Sold by: </strong>
                {sellerName}
              </div>
            </div>

            <div style={{ minWidth: 280 }}>
              <table style={{ width: '100%', fontSize: 13 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 8px 4px 0', fontWeight: 600, color: '#232734' }}>Order #</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#009ef7', fontWeight: 600 }}>{fmtCode(order)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px 4px 0', fontWeight: 600, color: '#232734' }}>Order status</td>
                    <td style={{ padding: '4px 0', textAlign: 'right' }}>
                      <span style={{ background: statusBadgeColor[deliveryStatus] || '#8f60ee', color: '#fff', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 3, textTransform: 'capitalize' }}>
                        {deliveryStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px 4px 0', fontWeight: 600, color: '#232734' }}>Order date</td>
                    <td style={{ padding: '4px 0', textAlign: 'right' }}>{fmtDate(order.createdAt)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px 4px 0', fontWeight: 600, color: '#232734' }}>Total amount</td>
                    <td style={{ padding: '4px 0', textAlign: 'right' }}>{fmt(grandTotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px 4px 0', fontWeight: 600, color: '#232734' }}>Payment method</td>
                    <td style={{ padding: '4px 0', textAlign: 'right' }}>
                      {(order.paymentMethod || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr style={{ borderTop: '1px solid #f1f1f4', margin: '16px 0' }} />

          {/* Products Table */}
          <div style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(35,39,52,0.06)' }}>
                  <th style={thStyle}>#</th>
                  <th style={{ ...thStyle, width: '10%' }}>Photo</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Brand</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Delivery Type</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>QTY</th>
                  <th style={thStyle}>Taxable Value (2%)</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, idx) => {
                  const taxVal = (item.price || 0) * (item.qty || 1) * 0.02
                  const lineTotal = (item.price || 0) * (item.qty || 1) + taxVal
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={tdStyle}>
                        {item.image ? (
                          <img height="50" src={item.image} alt={item.name} style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 50, height: 50, background: '#f5f5f7', borderRadius: 4 }} />
                        )}
                      </td>
                      <td style={tdStyle}>
                        <strong style={{ color: '#575b6a' }}>{item.name}</strong>
                        {item.selectedVariant && <><br /><small>{item.selectedVariant}</small></>}
                      </td>
                      <td style={tdStyle}>{item.brand || '—'}</td>
                      <td style={tdStyle}>{item.category || '—'}</td>
                      <td style={tdStyle}>{(order.deliveryType || 'home_delivery').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{fmt(taxVal)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(lineTotal)}</td>
                    </tr>
                  )
                })}

                {/* Shipping row */}
                <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>Shipping</td>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                  <td style={tdStyle}></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>1</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>—</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(shipping)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals + Print */}
          <div style={{ float: 'right', textAlign: 'right' }}>
            <table style={{ fontSize: 13 }}>
              <tbody>
                <tr>
                  <td style={{ padding: '4px 16px 4px 0' }}><strong style={{ color: '#6c757d' }}>Sub Total :</strong></td>
                  <td style={{ padding: '4px 0' }}>{fmt(originalTotal || order.totalAmount || 0)}</td>
                </tr>
                {discountTotal > 0 && (
                  <tr>
                    <td style={{ padding: '4px 16px 4px 0' }}><strong style={{ color: '#6c757d' }}>Discount :</strong></td>
                    <td style={{ padding: '4px 0', color: '#19c553' }}>-{fmt(discountTotal)}</td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: '4px 16px 4px 0' }}><strong style={{ color: '#6c757d' }}>Tax (2%) :</strong></td>
                  <td style={{ padding: '4px 0' }}>{fmt(taxAmount)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 16px 4px 0' }}><strong style={{ color: '#6c757d' }}>Shipping Charge :</strong></td>
                  <td style={{ padding: '4px 0' }}>{fmt(shipping)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 16px 4px 0' }}><strong style={{ color: '#6c757d' }}>Total :</strong></td>
                  <td style={{ padding: '4px 0' }}>
                    <span style={{ color: '#6c757d', fontSize: 16, fontWeight: 600 }}>{fmt(grandTotal)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: 8, textAlign: 'right' }}>
              <button type="button" title="Print Invoice"
                style={{ background: '#f1f1f4', border: 'none', borderRadius: 6, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => window.print()}>
                <IconPrint />
              </button>
            </div>
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      </div>

      {/* Confirm Payment Status Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: '32px 40px', maxWidth: 420, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px', color: '#232734' }}>
              Are you sure you want to change the payment status?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
              <button type="button" onClick={() => setShowPaymentModal(false)}
                style={{ background: '#f1f1f4', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: 150 }}>
                Cancel
              </button>
              <button type="button" onClick={handleConfirmPayment}
                style={{ background: '#19c553', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: 150 }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}