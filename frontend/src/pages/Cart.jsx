import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'

const PH = '/src/images/Placeholder.png'

// Calculate effective price after discount, respecting discountDateRange
function calcEffectivePrice(item) {
  const base = item.price || 0
  const discount = item.discount || 0
  const type = item.discountType || 'flat'
  const range = item.discountDateRange || ''

  if (!discount || discount <= 0) return base

  // Check date range if provided
  if (range && range.includes(' to ')) {
    const [startStr, endStr] = range.split(' to ')
    const now   = new Date()
    const start = new Date(startStr.trim())
    const end   = new Date(endStr.trim())
    if (now < start || now > end) return base
  }

  if (type === 'percent') {
    return Math.max(0, base - (base * discount / 100))
  }
  return Math.max(0, base - discount)
}

// Tax = 2% of effective price
function calcTax(effectivePrice, qty) {
  return effectivePrice * (qty || 1) * 0.02
}

export default function Cart() {
  const navigate = useNavigate()
  const [items,    setItems]    = useState([])
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('cart')
      const arr = raw ? JSON.parse(raw) : []
      setItems(arr)
      setSelected(arr.map(i => i._id + '_' + (i.selectedVariant || '')))
    }
    load()
    window.addEventListener('cartUpdated', load)
    return () => window.removeEventListener('cartUpdated', load)
  }, [])

  const persist = (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const lineKey = item => item._id + '_' + (item.selectedVariant || '')
  const allSelected = items.length > 0 && items.every(i => selected.includes(lineKey(i)))
  const toggleAll   = () => setSelected(allSelected ? [] : items.map(lineKey))
  const toggleItem  = key => setSelected(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key])

  const updateQty = (key, delta) => {
    const next = items.map(item => {
      if (lineKey(item) !== key) return item
      const max = item.stockCount || 99
      return { ...item, quantity: Math.max(1, Math.min(max, (item.quantity || 1) + delta)) }
    })
    setItems(next); persist(next)
  }

  const setQtyDirect = (key, val) => {
    const n = parseInt(val)
    if (isNaN(n)) return
    const next = items.map(item => {
      if (lineKey(item) !== key) return item
      const max = item.stockCount || 99
      return { ...item, quantity: Math.max(1, Math.min(max, n)) }
    })
    setItems(next); persist(next)
  }

  const removeItem = key => {
    const next = items.filter(i => lineKey(i) !== key)
    setItems(next)
    setSelected(prev => prev.filter(x => x !== key))
    persist(next)
  }

  const selectedItems = items.filter(i => selected.includes(lineKey(i)))

  // Subtotal = sum of original prices before discount
  const originalSubtotal = selectedItems.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
  // Subtotal after discount
  const subtotal  = selectedItems.reduce((s, i) => s + calcEffectivePrice(i) * (i.quantity || 1), 0)
  const discount  = originalSubtotal - subtotal
  // Tax = 2% of discounted subtotal
  const tax       = selectedItems.reduce((s, i) => s + calcTax(calcEffectivePrice(i), i.quantity || 1), 0)
  const shipping  = 5.00
  const total     = subtotal + tax + shipping

  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2 })
  const pad = n => String(n).padStart(2, '0')

  const sellers = [...new Set(items.map(i => i.seller || 'Inhouse'))]

  const handleProceed = () => {
    if (selectedItems.length === 0) return alert('Please select at least one item to checkout.')
    // Store selected items directly; Checkout will recalculate effective price from discount fields
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems))
    navigate('/checkout')
  }

  return (
    <div className="my-4 bg-white">
      <Container>
        <div className="flex flex-col lg:flex-row gap-4">

          {/* LEFT: cart items */}
          <div className="flex-1 min-w-0">
            <div className="bg-white p-3 lg:p-4 text-left border border-[#e5e7eb] rounded">

              <div className="mb-2 pb-3 border-b border-[#e5e7eb]">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="w-[14px] h-[14px] accent-[#0080FF]" />
                  <span className="text-sm text-[#6b7280]">Select All ({items.length})</span>
                </label>
              </div>

              {items.length === 0 && (
                <div className="text-center py-16 text-[#9ca3af]">
                  <svg className="w-14 h-14 mx-auto mb-4 text-[#e5e7eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <Link to="/" className="text-[#0080FF] text-sm hover:underline">Continue Shopping</Link>
                </div>
              )}

              {items.length > 0 && sellers.map(seller => {
                const sellerItems = items.filter(i => (i.seller || 'Inhouse') === seller)
                const sellerKeys  = sellerItems.map(lineKey)
                const allSellerSel = sellerKeys.every(k => selected.includes(k))

                return (
                  <div key={seller} className="mb-4">
                    <div className="pt-3 px-0">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={allSellerSel}
                          onChange={() => setSelected(prev =>
                            allSellerSel
                              ? prev.filter(k => !sellerKeys.includes(k))
                              : [...new Set([...prev, ...sellerKeys])]
                          )}
                          className="w-[14px] h-[14px] accent-[#0080FF] flex-shrink-0" />
                        <span className="text-base font-bold text-[#292933] pb-3 block border-b border-dashed border-[#e5e7eb] w-full">
                          {seller} ({sellerItems.length})
                        </span>
                      </div>
                    </div>

                    <ul>
                      {sellerItems.map(item => {
                        const key          = lineKey(item)
                        const effPrice     = calcEffectivePrice(item)
                        const hasDiscount  = effPrice < item.price
                        const qty          = item.quantity || 1

                        return (
                          <li key={key} className="list-none px-0 border-b border-[#f3f4f6] last:border-b-0">
                            <div className="flex items-center gap-2 py-3">

                              <div className="flex-shrink-0">
                                <input type="checkbox" checked={selected.includes(key)} onChange={() => toggleItem(key)}
                                  className="w-[14px] h-[14px] accent-[#0080FF]" />
                              </div>

                              <div className="flex items-center gap-2 flex-1 min-w-0 md:w-5/12 lg:flex-[0_0_42%]">
                                <img src={item.image || PH} alt={item.title}
                                  className="w-16 h-16 object-cover flex-shrink-0 rounded border border-[#f3f4f6]"
                                  onError={e => e.target.src = PH} />
                                <div className="min-w-0">
                                  <p className="text-[13px] text-[#292933] leading-snug line-clamp-2 mb-1">{item.title}</p>
                                  {item.selectedVariant && <p className="text-xs text-[#9ca3af]">{item.selectedVariant}</p>}
                                </div>
                              </div>

                              <div className="flex flex-col flex-shrink-0 w-[90px] ml-2">
                                <span className="text-xs text-[#9ca3af] leading-none mb-1">Price</span>
                                {hasDiscount ? (
                                  <>
                                    <span className="text-sm font-bold text-[#292933]">${fmt(effPrice)}</span>
                                    <span className="text-xs text-[#9ca3af] line-through">${fmt(item.price)}</span>
                                  </>
                                ) : (
                                  <span className="text-sm font-bold text-[#292933]">${fmt(effPrice)}</span>
                                )}
                              </div>

                              <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
                                <div className="flex items-center">
                                  <button onClick={() => updateQty(key, 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] text-base border border-[#e5e7eb]">+</button>
                                  <input type="number" value={qty} min={1} max={item.stockCount || 99}
                                    onChange={e => setQtyDirect(key, e.target.value)}
                                    className="w-11 h-8 text-center border-t border-b border-[#e5e7eb] text-sm focus:outline-none appearance-none"
                                    style={{ MozAppearance: 'textfield' }} />
                                  <button onClick={() => updateQty(key, -1)}
                                    className="w-8 h-8 flex items-center justify-center bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#374151] text-base border border-[#e5e7eb]">−</button>
                                </div>
                                <span className="font-bold text-sm text-[#0080FF] w-[90px] text-right">
                                  ${fmt(effPrice * qty)}
                                </span>
                              </div>

                              <div className="flex-shrink-0 ml-1">
                                <button onClick={() => removeItem(key)} title="Remove"
                                  className="w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-red-500 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12.27" height="16" viewBox="0 0 12.27 16" fill="currentColor">
                                    <path d="M17.9,9.037l-.258,7.8a2.569,2.569,0,0,1-2.577,2.485h-4.9A2.569,2.569,0,0,1,7.587,16.84l-.258-7.8a.645.645,0,0,1,1.289-.043l.258,7.8a1.289,1.289,0,0,0,1.289,1.239h4.9a1.289,1.289,0,0,0,1.289-1.241l.258-7.8a.645.645,0,0,1,1.289.043Zm.852-2.6a.644.644,0,0,1-.644.644H7.122a.644.644,0,1,1,0-1.289h2a.822.822,0,0,0,.82-.74,1.927,1.927,0,0,1,1.922-1.736h1.5a1.927,1.927,0,0,1,1.922,1.736.822.822,0,0,0,.82.74h2a.644.644,0,0,1,.644.644ZM11.058,5.8h3.11A2.126,2.126,0,0,1,14,5.189a.644.644,0,0,0-.64-.58h-1.5a.644.644,0,0,0-.64.58,2.126,2.126,0,0,1-.165.608Zm.649,9.761V10.072a.644.644,0,0,0-1.289,0v5.488a.644.644,0,0,0,1.289,0Zm3.1,0V10.072a.644.644,0,1,0-1.289,0v5.488a.644.644,0,1,0,1.289,0Z"
                                      transform="translate(-6.478 -4.322)" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0" id="cart_summary">
            <div className="sticky top-20">
              <div className="border border-[#e5e7eb] bg-white rounded">
                <div className="px-4 pt-4 pb-1">
                  <h3 className="text-base font-bold text-[#292933]">Order Summary</h3>
                </div>
                <div className="px-4 pb-4 pt-2">
                  <div className="flex gap-0 mb-0">
                    <div className="flex-1 flex items-center justify-between bg-[#0080FF] px-2 py-2 rounded-tl rounded-bl">
                      <span className="text-[13px] text-white">Total Products</span>
                      <span className="text-[13px] font-bold text-white">{pad(selectedItems.length)}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-between bg-[#17171f] px-2 py-2 rounded-tr rounded-br">
                      <span className="text-[13px] text-white">Total Qty</span>
                      <span className="text-[13px] font-bold text-white">
                        {pad(selectedItems.reduce((s, i) => s + (i.quantity || 1), 0))}
                      </span>
                    </div>
                  </div>

                  <table className="w-full my-3">
                    <tbody>
                      <tr>
                        <td className="text-sm text-[#292933] py-1 pb-2 font-normal">
                          Subtotal ({pad(selectedItems.length)} Products)
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

                  <div className="mt-4">
                    <button onClick={handleProceed} disabled={selectedItems.length === 0}
                      className={`w-full py-[10px] text-sm font-bold transition-colors rounded
                        ${selectedItems.length === 0
                          ? 'bg-[#d1d5db] text-[#6b7280] cursor-not-allowed'
                          : 'bg-[#0080FF] text-white hover:bg-blue-700'}`}>
                      Proceed to Checkout ({pad(selectedItems.length)})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  )
}