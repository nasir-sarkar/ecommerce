import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import Container from '../components/common/Container'
import { useAuth } from '../context/AuthContext'

const PH      = '/src/images/Placeholder.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


/* Star row */
function StarRow({ filled = 0, size = 14, interactive = false, onSelect }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          width={size} height={size} viewBox="0 0 20 20"
          fill={(interactive ? (hovered || filled) : filled) >= s ? '#f5a623' : '#d1d5db'}
          className={interactive ? 'cursor-pointer' : ''}
          onMouseEnter={interactive ? () => setHovered(s) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          onClick={interactive && onSelect ? () => onSelect(s) : undefined}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}


/* Add-to-Cart popup modal */
function CartModal({ productTitle, onVisitCart, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        {/* Success icon */}
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[15px] font-bold text-[#292933] mb-1">Added to Cart!</h3>
        <p className="text-[13px] text-[#6b7280] mb-5 line-clamp-2">{productTitle}</p>
        <div className="flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 py-2.5 border border-[#d1d5db] text-[13px] font-semibold text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={onVisitCart}
            className="flex-1 py-2.5 bg-[#0080FF] text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Visit Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const flashDiscountedPrice = location.state?.discountedPrice ?? null

  const [product,         setProduct]         = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)
  const [mainImg,         setMainImg]         = useState(PH)
  const [selectedColor,   setSelectedColor]   = useState(null)
  const [selectedAttr,    setSelectedAttr]    = useState(null)
  const [qty,             setQty]             = useState(1)
  const [isAdding,        setIsAdding]        = useState(false)
  const [isBuying,        setIsBuying]        = useState(false)
  const [activeTab,       setActiveTab]       = useState('description')
  const [showCartModal,   setShowCartModal]   = useState(false)
  const [loginAlert,      setLoginAlert]      = useState(false)

  // Reviews state
  const [reviews,    setReviews]    = useState([])
  const [avgRating,  setAvgRating]  = useState(0)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  const descRef    = useRef(null)
  const relatedRef = useRef(null)
  const reviewsRef = useRef(null)

  const scrollToSection = (ref, tab) => {
    setActiveTab(tab)
    if (ref.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`${API_URL}/products/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
        setMainImg(data.image || PH)
        if (data.category) {
          const r  = await fetch(`${API_URL}/products?category=${encodeURIComponent(data.category)}&limit=7`)
          if (r.ok) {
            const rd = await r.json()
            setRelatedProducts((rd.products || []).filter(p => p._id !== id).slice(0, 6))
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  // Load product reviews
  useEffect(() => {
    if (!id) return
    const loadReviews = async () => {
      setReviewsLoading(true)
      try {
        const r    = await fetch(`${API_URL}/product-reviews/${id}`)
        const data = await r.json()
        if (data.success) {
          setReviews(data.reviews || [])
          setAvgRating(data.avgRating || 0)
        }
      } catch { /* ignore */ }
      finally { setReviewsLoading(false) }
    }
    loadReviews()
  }, [id])

  const isOutOfStock = product && (product.stockCount === 0 || product.stockCount == null)

  // Product-level discount (discount / discountType / discountDateRange)
  const isProductDiscountActive = (() => {
    if (!product || !product.discount || product.discount <= 0) return false
    if (!product.discountDateRange || !product.discountDateRange.trim()) return true
    const parts = product.discountDateRange.split(/\s+to\s+/i)
    if (parts.length !== 2) return true
    const now   = new Date()
    const start = new Date(parts[0].trim())
    const end   = new Date(parts[1].trim())
    end.setHours(23, 59, 59, 999)
    return now >= start && now <= end
  })()

  const productDiscountedPrice = (() => {
    if (!isProductDiscountActive || !product) return null
    if (product.discountType === 'percent') {
      return Math.max(0, product.price - (product.price * product.discount) / 100)
    }
    return Math.max(0, product.price - product.discount)
  })()

  const effectivePrice = flashDiscountedPrice !== null
    ? flashDiscountedPrice
    : (productDiscountedPrice !== null ? productDiscountedPrice : product?.price)

  // Get selected variant string for cart
  const getSelectedVariantString = () => {
    const variants = []
    if (selectedColor) variants.push(selectedColor)
    if (selectedAttr) variants.push(selectedAttr)
    return variants.join(' / ')
  }

  /*  Guard: must be logged in */
  const guardLogin = () => {
    if (!isLoggedIn) {
      setLoginAlert(true)
      setTimeout(() => setLoginAlert(false), 3500)
      return false
    }
    return true
  }


  /* Add to cart (localStorage) */
  const saveToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const selectedVariant = getSelectedVariantString()
    const idx  = cart.findIndex(i => i._id === product._id && i.selectedVariant === selectedVariant)
    if (idx !== -1) cart[idx].quantity = (cart[idx].quantity || 1) + qty
    else cart.push({
      _id:             product._id,
      title:           product.title,
      image:           product.image,
      price:           effectivePrice,          // ← discounted price if from flash sale
      originalPrice:   (flashDiscountedPrice !== null || productDiscountedPrice !== null) ? product.price : undefined,
      stockCount:      product.stockCount,
      seller:          product.seller || '',
      selectedVariant: selectedVariant,
      quantity:        qty,
      brand:           product.brand || '',
      category:        product.category || '',
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleAddToCart = () => {
    if (isOutOfStock || !guardLogin()) return
    setIsAdding(true)
    try {
      saveToCart()
      setShowCartModal(true)
    } catch { /* ignore */ }
    finally { setIsAdding(false) }
  }

  const handleBuyNow = () => {
    if (isOutOfStock || !guardLogin()) return
    setIsBuying(true)
    try {
      const item = {
        _id:             product._id,
        title:           product.title,
        image:           product.image,
        price:           effectivePrice,         // ← discounted price if from flash sale
        originalPrice:   (flashDiscountedPrice !== null || productDiscountedPrice !== null) ? product.price : undefined,
        stockCount:      product.stockCount,
        seller:          product.seller || '',
        selectedVariant: getSelectedVariantString(),
        quantity:        qty,
        brand:           product.brand || '',
        category:        product.category || '',
      }
      localStorage.setItem('buyNowItem', JSON.stringify(item))
      navigate('/checkout?mode=buynow')
    } catch { /* ignore */ }
    finally { setIsBuying(false) }
  }

  const fmt = p => Number(p).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // Get colors and attributes from the new variation structure
  const getColors = () => {
    if (!product?.variation?.colors || !Array.isArray(product.variation.colors)) return []
    return product.variation.colors.filter(c => c && c.trim())
  }

  const getAttributes = () => {
    if (!product?.variation?.attributes || !Array.isArray(product.variation.attributes)) return []
    return product.variation.attributes.filter(a => a && a.trim())
  }

  const hasVariations = getColors().length > 0 || getAttributes().length > 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0080FF] mx-auto" />
        <p className="mt-2 text-sm text-[#6b7280]">Loading product...</p>
      </div>
    </div>
  )

  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-red-500 text-sm mb-3">{error || 'Product not found'}</p>
        <Link to="/" className="text-[#0080FF] text-sm hover:underline">← Back home</Link>
      </div>
    </div>
  )

  const images   = [product.image, product.image2, product.image3].filter(x => x?.trim())
  const colors   = getColors()
  const attrs    = getAttributes()

  const tabs = [
    { key: 'description', label: 'Description',       ref: descRef    },
    { key: 'related',     label: 'Related products',  ref: relatedRef },
    { key: 'reviews',     label: 'Reviews & Ratings', ref: reviewsRef },
  ]

  const hasFlashDiscount = flashDiscountedPrice !== null && flashDiscountedPrice < product.price
  const hasProductDiscount = productDiscountedPrice !== null && productDiscountedPrice < product.price
  const hasDiscount = hasFlashDiscount || hasProductDiscount

  return (
    <div className="bg-[#f5f6fa] min-h-screen">

      {/* Cart-added modal */}
      {showCartModal && (
        <CartModal
          productTitle={product.title}
          onVisitCart={() => { setShowCartModal(false); navigate('/cart') }}
          onContinue={() => { setShowCartModal(false); navigate('/') }}
        />
      )}


      {/* Login alert toast */}
      {loginAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-[13px] font-semibold px-5 py-3 rounded-lg shadow-xl flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          Please <Link to="/login" className="underline font-bold mx-1">login</Link> to place an order
        </div>
      )}


      {/* PRODUCT SECTION */}
      <div className="bg-white py-5 mb-4">
        <Container>

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1 text-[12px] text-[#6b7280] mb-4">
            <Link to="/" className="hover:text-[#0080FF]">Home</Link>
            <span className="text-[#d1d5db]">/</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-[#0080FF]">
              {product.subCategory || product.category}
            </Link>
            <span className="text-[#d1d5db]">/</span>
            <span className="text-[#374151] truncate max-w-[240px]">
              {product.title?.length > 55 ? product.title.slice(0, 55) + '…' : product.title}
            </span>
          </nav>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

            {/* LEFT — images */}
            <div className="flex gap-3">
              {images.length >= 1 && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setMainImg(img)}
                      className={`w-[72px] h-[72px] border-2 rounded overflow-hidden flex-shrink-0 transition-colors
                        ${mainImg === img ? 'border-[#0080FF]' : 'border-[#e5e7eb] hover:border-[#9ca3af]'}`}>
                      <img src={img} alt="" className="w-full h-full object-contain p-1"
                        onError={e => e.target.src = PH} />
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex-1 bg-[#f5f6fa] rounded overflow-hidden flex items-center justify-center"
                style={{ minHeight: 370 }}>
                <img src={mainImg} alt={product.title}
                  className="max-w-full max-h-[370px] object-contain"
                  onError={e => e.target.src = PH} />
              </div>
            </div>

            {/* RIGHT — info */}
            <div>
              <h1 className="text-[17px] font-semibold text-[#292933] leading-snug mb-2">
                {product.title}
              </h1>

              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[13px] text-[#6b7280]">Brand</span>
                <Link to={`/brand/${encodeURIComponent(product.brand)}`}
                  className="text-[13px] text-[#0080FF] font-medium hover:underline">
                  {product.brand}
                </Link>
              </div>

              {/* Dynamic rating summary */}
              <div className="flex items-center gap-2 mb-3">
                <StarRow filled={Math.round(avgRating)} size={14} />
                <span className="text-[12px] text-[#9ca3af]">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Price — show discounted price if from flash sale or product discount */}
              <div className="mb-2 flex items-center gap-2">
                {hasDiscount && (
                  <del className="text-[18px] text-[#9ca3af] font-normal">${fmt(product.price)}</del>
                )}
                <span className="text-[26px] font-bold text-[#292933]">${fmt(effectivePrice)}</span>
                {hasFlashDiscount && (
                  <span className="text-[12px] bg-[#0080FF] text-white font-bold px-2 py-0.5 rounded-sm">
                    Flash Sale
                  </span>
                )}
                {hasProductDiscount && !hasFlashDiscount && (
                  <span className="text-[12px] bg-[#0080FF] text-white font-bold px-2 py-0.5 rounded-sm">
                    {product.discountType === 'percent' ? `${product.discount}% Off` : `$${fmt(product.discount)} Off`}
                  </span>
                )}
              </div>

              <div className="mb-3">
                {isOutOfStock ? (
                  <span className="text-[13px] font-semibold text-red-500">Out of Stock</span>
                ) : (
                  <>
                    <span className="text-[13px] text-[#0080FF]">{product.stockCount} available</span>
                    <span className="text-[12px] text-[#9ca3af] ml-2">Minimum order qty 1</span>
                  </>
                )}
              </div>

              {/* QTY */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[13px] text-[#6b7280] font-medium">QTY</span>
                <div className="flex items-center border border-[#d1d5db] rounded overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-8 h-9 flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6] text-base select-none">
                    −
                  </button>
                  <span className="w-10 text-center text-[13px] font-medium border-x border-[#d1d5db] h-9 flex items-center justify-center">
                    {qty}
                  </span>
                  <button onClick={() => setQty(q => isOutOfStock ? q : Math.min(product.stockCount, q + 1))}
                    className="w-8 h-9 flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6] text-base select-none">
                    +
                  </button>
                </div>
              </div>

              {/* NEW VARIATION SECTION - Colors */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[13px] font-semibold text-[#292933]">Colors</span>
                    {selectedColor && (
                      <span className="text-[11px] text-[#9ca3af] ml-2">Selected: {selectedColor}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, i) => (
                      <button key={i}
                        onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                        className={`min-w-[40px] px-3 py-1.5 text-[13px] border rounded transition-all
                          ${selectedColor === color
                            ? 'border-[#0080FF] text-[#0080FF] font-semibold bg-white ring-1 ring-[#0080FF]'
                            : 'border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

             
              {attrs.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[13px] font-semibold text-[#292933]">Attributes</span>
                    {selectedAttr && (
                      <span className="text-[11px] text-[#9ca3af] ml-2">Selected: {selectedAttr}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attrs.map((attr, i) => (
                      <button key={i}
                        onClick={() => setSelectedAttr(selectedAttr === attr ? null : attr)}
                        className={`min-w-[40px] px-3 py-1.5 text-[13px] border rounded transition-all
                          ${selectedAttr === attr
                            ? 'border-[#0080FF] text-[#0080FF] font-semibold bg-white ring-1 ring-[#0080FF]'
                            : 'border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]'}`}>
                        {attr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show selected combination */}
              {hasVariations && (selectedColor || selectedAttr) && (
                <div className="mb-4 text-[12px] text-[#6b7280] bg-[#f9fafb] p-2 rounded">
                  Selected: {[selectedColor, selectedAttr].filter(Boolean).join(' / ')}
                </div>
              )}

              {product.Tags && product.Tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[12px] text-[#6b7280] font-medium">Tags:</span>
                  {product.Tags.map((tag, i) => (
                    <Link
                      key={i}
                      to={`/brand/${encodeURIComponent(tag)}`}
                      className="text-[11px] px-2 py-0.5 border border-[#e5e7eb] rounded-full text-[#4b5563] hover:border-[#0080FF] hover:text-[#0080FF] transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mb-5">
                <button 
                  onClick={handleBuyNow} 
                  disabled={isBuying || isOutOfStock}
                  className={`flex-1 py-[11px] text-[14px] font-semibold rounded transition-colors
                    bg-[#1a1a2e] text-white hover:bg-[#2d2d42]
                    ${(isBuying || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isBuying ? 'Processing…' : 'Buy Now'}
                </button>
                <button 
                  onClick={handleAddToCart} 
                  disabled={isAdding || isOutOfStock}
                  className={`flex-1 py-[11px] text-[14px] font-semibold rounded transition-colors
                    bg-[#cce3ff] text-[#0060cc] hover:bg-[#b3d4ff]
                    ${(isAdding || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAdding ? 'Adding…' : `Add to cart (${String(qty).padStart(2, '0')})`}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 border border-[#e5e7eb] rounded p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#0080FF] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(product.seller || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#9ca3af]">Sold by</p>
                    <Link to={`/seller/${encodeURIComponent(product.seller || '')}`}
                      className="text-[13px] text-[#0080FF] font-semibold hover:underline block truncate leading-tight">
                      {product.seller || 'Fashion Store'}
                    </Link>
                    <Link
                      to={`/seller/${encodeURIComponent(product.seller || '')}`}
                      className="text-[11px] text-[#0080FF] hover:underline"
                    >
                      Products from this shop
                    </Link>
                  </div>
                </div>
                <div className="flex-1 border border-[#e5e7eb] rounded p-3 flex items-center gap-3">
                  <div className="w-9 h-9 border border-[#e5e7eb] rounded flex items-center justify-center flex-shrink-0 bg-[#f9fafb]">
                    <svg className="w-5 h-5 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#9ca3af]">Brand</p>
                    <Link to={`/brand/${encodeURIComponent(product.brand)}`}
                      className="text-[13px] text-[#0080FF] font-semibold hover:underline block truncate leading-tight">
                      {product.brand}
                    </Link>
                    <Link to={`/brand/${encodeURIComponent(product.brand)}`}
                      className="text-[11px] text-[#0080FF] hover:underline">
                      Products from this brand
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>


      {/* STICKY TAB HEADER */}
      <div className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30">
        <Container>
          <div className="flex">
            {tabs.map(t => (
              <button key={t.key}
                onClick={() => scrollToSection(t.ref, t.key)}
                className={`px-5 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors cursor-pointer
                  ${activeTab === t.key
                    ? 'border-[#0080FF] text-[#292933]'
                    : 'border-transparent text-[#6b7280] hover:text-[#292933]'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </Container>
      </div>


      {/* SECTIONS */}
      <div className="py-6">
        <Container>
          <div className="flex flex-col gap-5">

            {/* DESCRIPTION */}
            <div ref={descRef} className="bg-white border border-[#e5e7eb] rounded-xl p-6 w-full">
              <h2 className="text-[15px] font-bold text-[#292933] mb-4">
                {product.title} (Product Details)
              </h2>
              {product.description ? (
                <div className="text-[13px] text-[#374151] leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              ) : (
                <div className="text-[13px] text-[#4b5563] space-y-1.5">
                  <p><strong>Category:</strong> {product.category}</p>
                  <p><strong>SubCategory:</strong> {product.subCategory}</p>
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Price:</strong> ${fmt(effectivePrice)}</p>
                  <p><strong>Condition:</strong> {product.Product_Condition || 'New'}</p>
                  {product.Location && <p><strong>Location:</strong> {product.Location}</p>}
                </div>
              )}
            </div>

            {/* RELATED PRODUCTS */}
            <div ref={relatedRef} className="bg-white border border-[#e5e7eb] rounded-xl p-6 w-full">
              <h2 className="text-[16px] font-bold text-[#292933] mb-4">Related products</h2>
              {relatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {relatedProducts.map(p => (
                    <div key={p._id} className="cursor-pointer group"
                      onClick={() => navigate(`/product/${p._id}`)}>
                      <div className="relative border border-[#e5e7eb] bg-white rounded overflow-hidden aspect-square mb-2">
                        {p.badge && (
                          <span className="absolute top-1.5 left-1.5 z-10 text-[10px] font-bold px-1.5 py-0.5 text-white rounded bg-[#0080FF]">
                            {p.badge}
                          </span>
                        )}
                        <img src={p.image || PH} alt={p.title}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                          onError={e => e.target.src = PH} />
                      </div>
                      <p className="text-[12px] text-[#374151] line-clamp-2 leading-tight mb-1 group-hover:text-[#0080FF] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[13px] font-bold text-[#292933]">${fmt(p.price)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#9ca3af]">No related products found.</p>
              )}
            </div>

            {/* REVIEWS & RATINGS */}
            <div ref={reviewsRef} className="bg-white border border-[#e5e7eb] rounded-xl p-6 w-full">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-bold text-[#292933]">Reviews & Ratings</h2>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-[48px] font-bold text-[#292933] leading-none">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRow filled={Math.round(avgRating)} size={18} />
                  <span className="text-[13px] text-[#6b7280] mt-1 block">
                    Total Review{reviews.length !== 1 ? 's' : ''}: {reviews.length}
                  </span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0080FF] mx-auto" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-3 text-[#d1d5db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[13px] text-[#9ca3af]">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r._id} className="border border-[#f3f4f6] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#0080FF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {r.userName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="text-[13px] font-semibold text-[#292933]">{r.userName}</span>
                        </div>
                        <span className="text-[11px] text-[#9ca3af]">
                          {new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <StarRow filled={r.rating} size={13} />
                      <p className="text-[13px] text-[#4b5563] mt-2 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Container>
      </div>

    </div>
  )
}