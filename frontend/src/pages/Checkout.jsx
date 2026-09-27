import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Container from '../components/common/Container'
import { useAuth } from '../context/AuthContext'

const PH      = '/src/images/Placeholder.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const PAYMENT_METHODS = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
]

// Calculate effective price after discount, respecting discountDateRange
function calcEffectivePrice(item) {
  const base     = item.price || 0
  const discount = item.discount || 0
  const type     = item.discountType || 'flat'
  const range    = item.discountDateRange || ''

  if (!discount || discount <= 0) return base

  if (range && range.includes(' to ')) {
    const [startStr, endStr] = range.split(' to ')
    const now   = new Date()
    const start = new Date(startStr.trim())
    const end   = new Date(endStr.trim())
    if (now < start || now > end) return base
  }

  if (type === 'percent') return Math.max(0, base - (base * discount / 100))
  return Math.max(0, base - discount)
}

const CircleCheck = ({ color = '#9d9da6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
    <path d="M58,48A10,10,0,1,0,68,58,10,10,0,0,0,58,48ZM56.457,61.543a.663.663,0,0,1-.423.212.693.693,0,0,1-.428-.216l-2.692-2.692.856-.856,2.269,2.269,6-6.043.841.87Z"
      transform="translate(-48 -48)" fill={color} />
  </svg>
)

function AccordionCard({ title, iconColor, open, onToggle, children, style }) {
  return (
    <div className="bg-white border border-[#e5e7eb] shadow-none rounded" style={{ marginBottom: '2rem', ...style }}>
      <div className="flex items-center justify-between px-4 py-3 xl:py-4 cursor-pointer select-none" onClick={onToggle}>
        <div className="flex items-center gap-2">
          <CircleCheck color={iconColor} />
          <span className="text-[19px] font-bold text-[#292933] ml-2">{title}</span>
        </div>
        <svg className={`w-[18px] h-[18px] text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}

function FormRow({ label, required, children }) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-[16.666%] md:mt-2 mb-1 md:mb-0 flex-shrink-0">
        <label className="text-sm text-[#292933]">
          {label}{required && <span className="text-red-500"> *</span>}
        </label>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isBuyNow = searchParams.get('mode') === 'buynow'

  const { isLoggedIn, token, user } = useAuth()

  const [orderItems, setOrderItems] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [openShipping, setOpenShipping] = useState(true)
  const [openDelivery, setOpenDelivery] = useState(true)
  const [openPayment,  setOpenPayment]  = useState(true)

  const [form, setForm] = useState({
    name:            user?.fullName || '',
    email:           user?.email    || '',
    address:         '',
    country:         '',
    state:           '',
    city:            '',
    postal_code:     '',
    phone:           user?.phone    || '',
    same_as_shipping: false,
    delivery_type:   'home_delivery',
    additional_info: '',
    payment_option:  'cash_on_delivery',
    agree:           false,
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const [navHeight, setNavHeight] = useState(160)

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header')
      if (header) setNavHeight(header.offsetHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    const header = document.querySelector('header')
    if (header) observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:  prev.name  || user.fullName || '',
        email: prev.email || user.email    || '',
        phone: prev.phone || user.phone    || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (isBuyNow) {
      const raw = localStorage.getItem('buyNowItem')
      if (raw) setOrderItems([JSON.parse(raw)])
    } else {
      const raw = localStorage.getItem('checkoutItems')
      if (raw) setOrderItems(JSON.parse(raw))
    }
  }, [isBuyNow])

  // Compute totals using effective price
  const originalSubtotal = orderItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
  const subtotal  = orderItems.reduce((s, i) => s + calcEffectivePrice(i) * (i.quantity || 1), 0)
  const discount  = originalSubtotal - subtotal
  const tax       = subtotal * 0.02
  const shipping  = 5.00
  const total     = subtotal + tax + shipping

  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  const pad = n => String(n).padStart(2, '0')

  const handleSubmit = async e => {
    e.preventDefault()

    const requiredFields = [
      { key: 'name',        label: 'Name' },
      { key: 'email',       label: 'Email' },
      { key: 'address',     label: 'Address' },
      { key: 'country',     label: 'Country' },
      { key: 'postal_code', label: 'Postal Code' },
      { key: 'phone',       label: 'Phone' },
    ]
    for (const f of requiredFields) {
      if (!form[f.key] || !String(form[f.key]).trim()) {
        setSubmitError(`Please fill in the "${f.label}" field.`)
        return
      }
    }

    if (!form.agree) { setSubmitError('Please agree to the terms and conditions.'); return }
    if (form.payment_option !== 'cash_on_delivery') { setSubmitError('Currently cash on delivery available only.'); return }
    if (orderItems.length === 0) { setSubmitError('No items to order.'); return }

    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        items: orderItems.map(i => ({
          productId:       i._id,
          name:            i.title,
          image:           i.image || '',
          price:           calcEffectivePrice(i),   
          originalPrice:   i.price || 0,            
          qty:             i.quantity || 1,
          selectedVariant: i.selectedVariant || '',
          seller:          i.seller || '',
          brand:           i.brand || '',
          category:        i.category || '',
        })),
        shippingAddress: {
          name:        form.name,
          email:       form.email,
          phone:       form.phone,
          address:     form.address,
          city:        form.city,
          state:       form.state,
          country:     form.country,
          postal_code: form.postal_code,
        },
        paymentMethod:  form.payment_option,
        additionalInfo: form.additional_info,
        deliveryType:   form.delivery_type,
      }

      const res  = await fetch(`${API_URL}/orders`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.message || 'Order failed')

      if (isBuyNow) localStorage.removeItem('buyNowItem')
      else {
        const cart    = JSON.parse(localStorage.getItem('cart') || '[]')
        const ordered = orderItems.map(i => i._id + '_' + (i.selectedVariant || ''))
        const newCart = cart.filter(i => !ordered.includes(i._id + '_' + (i.selectedVariant || '')))
        localStorage.setItem('cart', JSON.stringify(newCart))
        localStorage.removeItem('checkoutItems')
      }
      window.dispatchEvent(new Event('cartUpdated'))
      setOrderSuccess(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full border border-[#d1d5db] px-3 py-[6px] mb-3 text-sm text-[#292933] focus:outline-none focus:border-[#0080FF] focus:border-2 rounded resize-none'
  const sellers  = [...new Set(orderItems.map(i => i.seller || 'Inhouse'))]

  return (
    <div className="my-4" style={{ background: '#f5f5f5' }}>
      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl px-8 py-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1f2937] mb-2">Your Order Placed!</h2>
            <p className="text-sm text-[#6b7280] mb-6">
              Thank you for your purchase. Your order has been placed successfully. You can track it from your dashboard.
            </p>
            <button onClick={() => { setOrderSuccess(false); navigate('/') }}
              className="w-full bg-[#0080FF] text-white py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition-colors">
              Go Back to Home
            </button>
          </div>
        </div>
      )}

      <Container>
        <div className="flex flex-col lg:flex-row gap-4">

          {/* MAIN FORM */}
          <div className="w-full lg:flex-1 min-w-0">
            <form onSubmit={handleSubmit}>

              {/* Shipping Info */}
              <AccordionCard title="Shipping Info" iconColor="#9d9da6" open={openShipping} onToggle={() => setOpenShipping(v => !v)}>
                <div className="px-4 pb-2">
                  <div className="mb-3 mt-1">
                    <span className="text-sm font-bold text-[#292933] border-b-2 border-[#0080FF] pb-1 pr-4 inline-block">
                      Shipping address
                    </span>
                  </div>
                  <div className="p-3 space-y-0">
                    <FormRow label="Name" required>
                      <input className={inputCls} placeholder="Your name" value={form.name}
                        onChange={e => set('name', e.target.value)} required />
                    </FormRow>
                    <FormRow label="Email" required>
                      <input type="email" className={inputCls} placeholder="Your Email"
                        value={form.email} onChange={e => set('email', e.target.value)} required />
                    </FormRow>
                    <FormRow label="Address" required>
                      <textarea className={`${inputCls} resize-none`} placeholder="Your Address"
                        rows={2} value={form.address} onChange={e => set('address', e.target.value)} required />
                    </FormRow>
                    <FormRow label="Country" required>
                      <div className="mb-3">
                        <select value={form.country} onChange={e => set('country', e.target.value)}
                          className={`${inputCls} mb-0 appearance-none bg-white`} required>
                          <option value="">Select your country</option>
                          <option value="BD">Bangladesh</option>
                          <option value="IN">India</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                      </div>
                    </FormRow>
                    <FormRow label="State">
                      <input className={inputCls} placeholder="State / Division"
                        value={form.state} onChange={e => set('state', e.target.value)} />
                    </FormRow>
                    <FormRow label="City">
                      <input className={inputCls} placeholder="City"
                        value={form.city} onChange={e => set('city', e.target.value)} />
                    </FormRow>
                    <FormRow label="Postal code" required>
                      <input className={inputCls} placeholder="Your Postal Code"
                        value={form.postal_code} onChange={e => set('postal_code', e.target.value)} required />
                    </FormRow>
                    <FormRow label="Phone" required>
                      <input type="tel" className={inputCls} placeholder="+880 1XXX-XXXXXX"
                        value={form.phone} onChange={e => set('phone', e.target.value)} required />
                    </FormRow>
                  </div>
                </div>
              </AccordionCard>

              {/* Delivery Info */}
              <AccordionCard title="Delivery Info" iconColor="#85b567"
                open={openDelivery} onToggle={() => setOpenDelivery(v => !v)}
                style={{ overflow: 'visible' }}>
                <div className="p-4">
                  {sellers.map(seller => {
                    const sellerItems = orderItems.filter(i => (i.seller || 'Inhouse') === seller)
                    return (
                      <div key={seller} className="border-b border-dashed border-[#e5e7eb] mb-4 last:border-b-0">
                        <div className="pb-3">
                          <h5 className="text-base font-bold text-[#292933]">{seller} ({pad(sellerItems.length)})</h5>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 pb-4">
                          <div className="md:w-1/2">
                            <ul>
                              {sellerItems.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 py-3">
                                  <img src={item.image || PH} alt={item.title}
                                    className="w-[60px] h-[60px] object-cover flex-shrink-0 rounded border border-[#f3f4f6]"
                                    onError={e => e.target.src = PH} />
                                  <div className="min-w-0">
                                    <p className="text-sm text-[#292933] line-clamp-2 leading-snug">{item.title}</p>
                                    {item.selectedVariant && <p className="text-xs text-[#9ca3af] mt-0.5">{item.selectedVariant}</p>}
                                    <p className="text-xs text-[#6b7280] mt-0.5">Qty: {item.quantity || 1}</p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="md:w-1/2 mb-2">
                            <h6 className="text-sm font-bold mt-3 mb-3 text-[#292933]">Choose Delivery Type</h6>
                            <div className="flex gap-3 flex-wrap">
                              {[{ value: 'home_delivery', label: 'Home Delivery' }, { value: 'pickup', label: 'Pickup Point' }].map(opt => (
                                <label key={opt.value} className="cursor-pointer">
                                  <input type="radio" name="shipping_type" value={opt.value}
                                    checked={form.delivery_type === opt.value}
                                    onChange={() => set('delivery_type', opt.value)} className="sr-only" />
                                  <span className={`flex items-center gap-2 border px-4 py-3 transition-colors rounded ${
                                    form.delivery_type === opt.value
                                      ? 'border-[#0080FF] bg-blue-50' : 'border-[#e5e7eb] bg-white hover:border-[#0080FF]'
                                  }`}>
                                    <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                      form.delivery_type === opt.value ? 'border-[#0080FF]' : 'border-[#d1d5db]'
                                    }`}>
                                      {form.delivery_type === opt.value && (
                                        <span className="w-[8px] h-[8px] rounded-full bg-[#0080FF] block" />
                                      )}
                                    </span>
                                    <span className="text-sm font-semibold text-[#292933] pl-2">{opt.label}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionCard>

              {/* Payment */}
              <AccordionCard title="Payment" iconColor="#9d9da6"
                open={openPayment} onToggle={() => setOpenPayment(v => !v)}
                style={{ marginBottom: 0 }}>
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-[#292933] mb-2">Any additional info?</h3>
                    <textarea rows={4}
                      className="w-full border border-[#d1d5db] px-3 py-2 text-sm focus:outline-none focus:border-[#0080FF] focus:border-2 rounded resize-none"
                      placeholder="Type your text..."
                      value={form.additional_info}
                      onChange={e => set('additional_info', e.target.value)} />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-base font-bold text-[#292933] mb-3">Select a payment option</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {PAYMENT_METHODS.map(method => (
                        <label key={method.value} className="cursor-pointer block">
                          <input type="radio" name="payment_option" value={method.value}
                            checked={form.payment_option === method.value}
                            onChange={() => set('payment_option', method.value)} className="sr-only" />
                          <span className={`flex items-center justify-between border px-3 py-3 transition-colors ${
                            form.payment_option === method.value
                              ? 'border-[#0080FF] bg-blue-50' : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
                          }`}>
                            <span className="text-sm text-[#292933] font-normal">{method.label}</span>
                            <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ml-2 ${
                              form.payment_option === method.value ? 'border-[#0080FF]' : 'border-[#d1d5db]'
                            }`}>
                              {form.payment_option === method.value && (
                                <span className="w-[8px] h-[8px] rounded-full bg-[#0080FF] block" />
                              )}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm px-3 py-2 rounded">
                      Currently cash on delivery available only. Other options will be coming soon.
                    </div>
                  </div>

                  <div className="pt-[2rem] text-sm">
                    <label className="flex items-center gap-2 cursor-pointer select-none flex-wrap">
                      <input type="checkbox" checked={form.agree}
                        onChange={e => set('agree', e.target.checked)} required
                        className="w-[14px] h-[14px] accent-[#0080FF] flex-shrink-0" />
                      <span className="text-[#292933]">
                        I agree to the{' '}
                        <Link to="/terms-conditions" className="font-bold hover:underline">terms and conditions</Link>,{' '}
                        <Link to="/return-policy" className="font-bold hover:underline">return policy</Link>{' '}&amp;{' '}
                        <Link to="/privacy-policy" className="font-bold hover:underline">privacy policy</Link>
                      </span>
                    </label>
                  </div>

                  {submitError && (
                    <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">
                      {submitError}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 mb-4">
                    <Link to="/cart"
                      className="text-sm font-bold text-[#0080FF] hover:underline flex items-center gap-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Return to shop
                    </Link>
                    <button type="submit" disabled={submitting}
                      className={`px-6 py-[10px] text-sm font-bold transition-colors rounded
                        ${submitting ? 'bg-[#d1d5db] text-[#6b7280] cursor-not-allowed' : 'bg-[#0080FF] text-white hover:bg-blue-700'}`}>
                      {submitting ? 'Placing Order…' : 'Complete Order'}
                    </button>
                  </div>
                </div>
              </AccordionCard>

            </form>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 mt-4 lg:mt-0 lg:self-start lg:sticky"
            style={{ top: (navHeight + 16) + 'px' }}>
            <div>
              <div className="border border-[#e5e7eb] bg-white rounded overflow-hidden">
                <div className="px-4 pt-4 pb-1">
                  <h3 className="text-base font-bold text-[#292933]">Order Summary</h3>
                </div>
                <div className="px-4 pb-4 pt-2">
                  <div className="flex gap-0 mb-0">
                    <div className="flex-1 flex items-center justify-between bg-[#0080FF] px-2 py-2 rounded-tl rounded-bl">
                      <span className="text-[13px] text-white">Total Products</span>
                      <span className="text-[13px] font-bold text-white">{pad(orderItems.length)}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between bg-[#17171f] px-2 py-2 rounded-tr rounded-br">
                      <span className="text-[13px] text-white">Total Qty</span>
                      <span className="text-[13px] font-bold text-white">
                        {pad(orderItems.reduce((s, i) => s + (i.quantity || 1), 0))}
                      </span>
                    </div>
                  </div>

                  {orderItems.length > 0 && (
                    <div className="mt-3 space-y-2 border-b border-[#f3f4f6] pb-3">
                      {orderItems.map((item, idx) => {
                        const effPrice = calcEffectivePrice(item)
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <img src={item.image || PH} alt={item.title}
                              className="w-10 h-10 object-cover rounded border border-[#f3f4f6] flex-shrink-0"
                              onError={e => e.target.src = PH} />
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] text-[#374151] line-clamp-1">{item.title}</p>
                              <p className="text-[11px] text-[#9ca3af]">
                                {item.quantity || 1} × ${fmt(effPrice)}
                                {effPrice < item.price && (
                                  <span className="line-through ml-1 text-[#d1d5db]">${fmt(item.price)}</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <table className="w-full my-3">
                    <tbody>
                      <tr>
                        <td className="text-sm text-[#292933] py-1 pb-2 font-normal">
                          Subtotal ({pad(orderItems.length)} Products)
                        </td>
                        <td className="text-right text-sm text-[#292933] py-1 pb-2 whitespace-nowrap">${fmt(originalSubtotal)}</td>
                      </tr>
                      {discount > 0 && (
                        <tr>
                          <td className="text-sm text-[#292933] py-1 pb-2 font-normal">Discount</td>
                          <td className="text-right text-sm text-[#19c553] py-1 pb-2 whitespace-nowrap">-${fmt(discount)}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="text-sm text-[#292933] py-1 pb-2 font-normal">Tax (2%)</td>
                        <td className="text-right text-sm text-[#292933] py-1 pb-2 whitespace-nowrap">${fmt(tax)}</td>
                      </tr>
                      <tr>
                        <td className="text-sm text-[#292933] py-1 pb-2 font-normal">Shipping Charge</td>
                        <td className="text-right text-sm text-[#292933] py-1 pb-2 whitespace-nowrap">${fmt(shipping)}</td>
                      </tr>
                      <tr className="border-t border-[#e5e7eb]">
                        <td className="text-sm font-bold text-[#292933] pt-3 uppercase">TOTAL</td>
                        <td className="text-right text-base font-bold text-[#0080FF] pt-3">${fmt(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  )
}