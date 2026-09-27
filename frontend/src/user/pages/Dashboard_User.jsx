import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PLACEHOLDER = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'

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
  return `${day}.${month}.${year}`
}

// Loader

function Loader() {
  return (
    <div className="flex justify-center items-center py-[48px]">
      <div className="w-[28px] h-[28px] border-[3px] border-[#dfdfe6] border-t-[#0080FF] rounded-full animate-spin" />
    </div>
  )
}

// Sub-components

function WalletCard({ orders }) {
  // Total Purchase = sum of all order totals
  const totalPurchase = orders.reduce((sum, o) => {
    const subtotal = (o.items || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
    return sum + subtotal
  }, 0)

  // Last Purchase = most recent order amount + date
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const lastOrder = sorted[0] || null
  const lastPurchaseAmount = lastOrder
    ? (lastOrder.items || []).reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
    : 0
  const lastPurchaseDate = lastOrder ? fmtDate(lastOrder.createdAt) : '—'

  return (
    <div
      className="h-full"
      style={{
        backgroundImage:
          "url('https://demo.activeitzone.com/ecommerce_repo/public/assets/img/wallet-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <div className="p-[1.5rem] h-full w-full xl:w-1/2">
        <p className="text-[14px] font-normal text-[#9d9da6] mb-[1rem]">Total Purchase</p>
        <h1 className="text-[30px] font-bold text-white">{fmt(totalPurchase)}</h1>
        <hr className="border-0 border-t border-dashed border-white opacity-40 ml-0 mt-[1.5rem] mb-[1.5rem]" />
        <p className="text-[14px] font-normal text-[#9d9da6] mb-[0.25rem]">
          Last Purchase <strong>{lastPurchaseDate}</strong>
        </p>
        <h3 className="text-[20px] font-bold text-white">{fmt(lastPurchaseAmount)}</h3>
        <Link
          to="/user/purchase-history"
          className="block w-full border border-[#dfdfe6] hover:bg-[#292933] text-white mt-[1.5rem] mb-[0.5rem] py-[1rem] rounded-[30px] text-[14px] text-center no-underline"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <i className="la la-history text-[18px] font-bold mr-[0.5rem]"></i>
          Purchase History
        </Link>
      </div>
    </div>
  )
}

function FollowingCard({ followedCount }) {
  return (
    <div className="p-[1.5rem] bg-[#0080ff]" style={{ marginBottom: '2rem' }}>
      <div className="flex items-center pb-[1.5rem]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <g transform="translate(-926 -614)">
            <rect width="48" height="48" rx="24" transform="translate(926 614)" fill="rgba(255,255,255,0.5)" />
            <g transform="translate(701.466 93)">
              <path d="M122.052,10V8.55a.727.727,0,1,0-1.455,0V10a2.909,2.909,0,0,0-2.909,2.909v.727A2.909,2.909,0,0,0,120.6,16.55h1.455A1.454,1.454,0,0,1,123.506,18v.727a1.454,1.454,0,0,1-1.455,1.455H120.6a1.454,1.454,0,0,1-1.455-1.455.727.727,0,1,0-1.455,0,2.909,2.909,0,0,0,2.909,2.909V23.1a.727.727,0,1,0,1.455,0V21.641a2.909,2.909,0,0,0,2.909-2.909V18a2.909,2.909,0,0,0-2.909-2.909H120.6a1.454,1.454,0,0,1-1.455-1.455v-.727a1.454,1.454,0,0,1,1.455-1.455h1.455a1.454,1.454,0,0,1,1.455,1.455.727.727,0,0,0,1.455,0A2.909,2.909,0,0,0,122.052,10" transform="translate(127.209 529.177)" fill="#fff" />
            </g>
          </g>
        </svg>
        <div className="ml-[1rem] flex flex-col justify-between">
          <span className="text-[14px] font-normal text-white mb-[0.25rem]">Total Following</span>
          <span className="text-[20px] font-bold text-white">{followedCount}</span>
        </div>
      </div>
      <Link to="/user/followed-sellers" className="text-[12px] text-white no-underline">
        View Followed Sellers
        <i className="las la-angle-right text-[14px]"></i>
      </Link>
    </div>
  )
}

function WishlistCountCard({ wishlistCount }) {
  return (
    <div className="p-[1.5rem] bg-[#292933]">
      <div className="flex items-center pb-[1.5rem]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <g transform="translate(-926 -614)">
            <rect width="48" height="48" rx="24" transform="translate(926 614)" fill="rgba(255,255,255,0.5)" />
            <g transform="translate(701.466 93)">
              <path d="M221.069,0a8,8,0,1,0,8,8,8,8,0,0,0-8-8m0,15a7,7,0,1,1,7-7,7,7,0,0,1-7,7" transform="translate(27.466 537)" fill="#fff" />
              <path d="M16425.393,420.226l-3.777-5.039a.42.42,0,0,1-.012-.482l1.662-2.515a.416.416,0,0,1,.313-.186l0,0h4.26a.41.41,0,0,1,.346.19l1.674,2.515a.414.414,0,0,1-.012.482l-3.777,5.039a.413.413,0,0,1-.338.169A.419.419,0,0,1,16425.393,420.226Zm-2.775-5.245,3.113,4.148,3.109-4.148-1.32-1.983h-3.592Z" transform="translate(-16177.195 129)" fill="#fff" />
            </g>
          </g>
        </svg>
        <div className="ml-[1rem] flex flex-col justify-between">
          <span className="text-[14px] font-normal text-white mb-[0.25rem]">Total Wishlist Products</span>
          <span className="text-[20px] font-bold text-white">{wishlistCount}</span>
        </div>
      </div>
      <Link to="/user/wishlist" className="text-[12px] text-white no-underline">
        Check Wishlist
        <i className="las la-angle-right text-[14px]"></i>
      </Link>
    </div>
  )
}

function SummaryCountsCard({ cartCount, pendingOrderCount, totalOrderCount }) {
  return (
    <div className="px-[1.5rem] bg-white border border-[#dfdfe6] h-full">
      {/* Cart */}
      <div className="flex items-center py-[1.5rem] border-b border-[#dfdfe6]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <g transform="translate(-1367 -427)">
            <path d="M24,0A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z" transform="translate(1367 427)" fill="#d43533" />
            <g transform="translate(1382.999 443)">
              <path d="M294.507,424.89a2,2,0,1,0,2,2A2,2,0,0,0,294.507,424.89Zm0,3a1,1,0,1,1,1-1A1,1,0,0,1,294.507,427.89Z" transform="translate(-289.508 -412.89)" fill="#fff" />
              <path d="M302.507,424.89a2,2,0,1,0,2,2A2,2,0,0,0,302.507,424.89Zm0,3a1,1,0,1,1,1-1A1,1,0,0,1,302.507,427.89Z" transform="translate(-289.508 -412.89)" fill="#fff" />
              <path d="M305.43,416.864a1.5,1.5,0,0,0-1.423-1.974h-9a.5.5,0,0,0,0,1h9a.467.467,0,0,1,.129.017.5.5,0,0,1,.354.611l-1.581,6a.5.5,0,0,1-.483.372h-7.462a.5.5,0,0,1-.489-.392l-1.871-8.433a1.5,1.5,0,0,0-1.465-1.175h-1.131a.5.5,0,1,0,0,1h1.043a.5.5,0,0,1,.489.391l1.871,8.434a1.5,1.5,0,0,0,1.465,1.175h7.55a1.5,1.5,0,0,0,1.423-1.026Z" transform="translate(-289.508 -412.89)" fill="#fff" />
            </g>
          </g>
        </svg>
        <div className="ml-[1rem] flex flex-col justify-between">
          <span className="text-[20px] font-bold mb-[0.25rem]">{String(cartCount).padStart(2, '0')}</span>
          <span className="text-[14px] font-normal text-[#919199]">Products in Cart</span>
        </div>
      </div>
      {/* Pending Orders */}
      <div className="flex items-center py-[1.5rem] border-b border-[#dfdfe6]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <g transform="translate(-1367 -499)">
            <path d="M24,0A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z" transform="translate(1367 499)" fill="#3490f3" />
            <g transform="translate(1383 515)">
              <g transform="translate(0 1)">
                <path d="M290.82,413.6a4.5,4.5,0,0,0-6.364,0l-.318.318-.318-.318a4.5,4.5,0,1,0-6.364,6.364l6.046,6.054a.9.9,0,0,0,1.272,0l6.046-6.054A4.5,4.5,0,0,0,290.82,413.6Zm-.707,5.657-5.975,5.984-5.975-5.984a3.5,3.5,0,1,1,4.95-4.95l.389.389a.9.9,0,0,0,1.272,0l.389-.389a3.5,3.5,0,1,1,4.95,4.95Z" transform="translate(-276.138 -412.286)" fill="#fff" />
              </g>
              <rect width="16" height="16" fill="none" />
            </g>
          </g>
        </svg>
        <div className="ml-[1rem] flex flex-col justify-between">
          <span className="text-[20px] font-bold mb-[0.25rem]">{String(pendingOrderCount).padStart(2, '0')}</span>
          <span className="text-[14px] font-normal text-[#919199]">Pending Orders</span>
        </div>
      </div>
      {/* Orders */}
      <div className="flex items-center py-[1.5rem]">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <g transform="translate(-1367 -576)">
            <path d="M24,0A24,24,0,1,1,0,24,24,24,0,0,1,24,0Z" transform="translate(1367 576)" fill="#85b567" />
            <path d="M11.483,3h-.009a.308.308,0,0,0-.1.026L4.26,6.068A.308.308,0,0,0,4,6.376V15.6a.308.308,0,0,0,.026.127v0l.009.017a.308.308,0,0,0,.157.147l7.116,3.042a.338.338,0,0,0,.382,0L18.8,15.9a.308.308,0,0,0,.189-.243q0-.008,0-.017s0-.01,0-.015,0-.01,0-.015,0,0,0,0V6.376a.308.308,0,0,0-.255-.306L11.632,3.031l-.007,0a.308.308,0,0,0-.05-.017l-.009,0-.022,0h-.062Zm.014.643L13,4.287,6.614,7.02,6.6,7.029,5.088,6.383,11.5,3.643Zm2.29.979,1.829.782L9.108,8.188a.414.414,0,0,0-.186.349v3.291l-.667-1a.308.308,0,0,0-.393-.1l-.786.392V7.493l6.712-2.87ZM16.4,5.738l1.509.645L11.5,9.124,9.99,8.48l6.39-2.733.018-.009ZM4.615,6.85l1.846.789v3.975a.308.308,0,0,0,.445.275l.987-.494,1.064,1.595v0a.308.308,0,0,0,.155.14h0l.027.009a.308.308,0,0,0,.057.012h.036l.036,0,.025,0,.018,0,.015,0a.308.308,0,0,0,.05-.022h0a.308.308,0,0,0,.156-.309V8.955l1.654.707v8.56L4.615,15.411Zm13.765,0v8.56L11.8,18.223V9.662Z" transform="translate(1379.5 588.5)" fill="#fff" stroke="#fff" strokeWidth="0.25" fillRule="evenodd" />
          </g>
        </svg>
        <div className="ml-[1rem] flex flex-col justify-between">
          <span className="text-[20px] font-bold mb-[0.25rem]">{String(totalOrderCount).padStart(2, '0')}</span>
          <span className="text-[14px] font-normal text-[#919199]">Total Products Ordered</span>
        </div>
      </div>
    </div>
  )
}

function AddressLines({ address }) {
  if (!address) {
    return (
      <ul className="list-none p-0 mb-[3rem]">
        <li className="text-[14px] font-normal text-[#919199] pb-[0.25rem]">No address on file.</li>
      </ul>
    )
  }

  const lines = [
    address.address,
    address.postalCode,
    address.city,
    address.state,
    address.country,
    address.phone,
  ].filter(Boolean)

  return (
    <ul className="list-none p-0 mb-[3rem]">
      {lines.map((line, i) => (
        <li key={i} className="text-[14px] font-normal text-[#292933] pb-[0.25rem]">
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

function ShippingAddressCard({ addresses }) {
  const defaultShipping = (addresses || []).find(a => a.isDefaultShipping) || addresses?.[0] || null

  return (
    <div className="p-[1.5rem] border border-[#dfdfe6] h-full">
      <h6 className="font-bold mb-[1rem] text-[#292933] text-[16px]">Default Shipping Address</h6>
      <AddressLines address={defaultShipping} />
    </div>
  )
}

function BillingAddressCard({ addresses }) {
  const defaultBilling = (addresses || []).find(a => a.isDefaultBilling) || addresses?.[0] || null

  return (
    <div className="p-[1.5rem] border border-[#dfdfe6] h-full">
      <h6 className="font-bold mb-[1rem] text-[#292933] text-[16px]">Default Billing Address</h6>
      <AddressLines address={defaultBilling} />
    </div>
  )
}

function WishlistProductCard({ product, onRemove, token }) {
  const navigate    = useNavigate()
  const productId   = product._id || product.id
  const productName = product.title || product.name || 'Product'
  const productImg  = product.image || product.images?.[0] || PLACEHOLDER
  const productPrice = product.price || 0
  const productSlug  = productId

  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove(productId)
    try {
      await fetch(`${API_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      console.error('Wishlist remove error:', err)
    }
  }

  return (
    <div
      className="py-[1rem] px-[8px] text-center border-r border-b border-[#dfdfe6] transition relative z-[1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
      id={`wishlist_${productId}`}
    >
      <div className="relative h-[140px] md:h-[200px] overflow-hidden mb-[1rem]">
        <Link to={`/product/${productSlug}`} className="block h-full relative">
          <img
            src={productImg}
            className="mx-auto w-full h-full object-contain"
            title={productName}
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
            alt={productName}
          />
          <img
            className="mx-auto w-full h-full object-contain absolute top-0 left-0 opacity-0 hover:opacity-100"
            src={productImg}
            alt={productName}
            title={productName}
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
          />
        </Link>
        {/* Remove from wishlist */}
        <div className="absolute top-0 right-0">
          <a
            href="#"
            onClick={handleRemove}
            title="Remove from wishlist"
            className="inline-flex items-center justify-center w-[30px] h-[30px] bg-white text-[#292933] hover:bg-[#0080ff] hover:text-white"
          >
            <i className="la la-trash"></i>
          </a>
        </div>
        {/* Select Option */}
        <a
          className="absolute bottom-0 left-0 w-full h-[35px] bg-[#0080ff] text-white text-[13px] font-bold hidden sm:flex flex-col justify-center items-center"
          href="#"
          onClick={(e) => { e.preventDefault(); navigate(`/product/${productSlug}`) }}
        >
          <span>Select Option</span>
          <span><i className="las la-sliders-h" style={{ fontSize: '1.4rem' }}></i></span>
        </a>
      </div>
      {/* Product Name */}
      <h5 className="text-[14px] leading-[1.5] font-normal mb-[1rem] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        <Link
          to={`/product/${productSlug}`}
          className="text-inherit hover:text-[#0080ff] no-underline"
          title={productName}
        >
          {productName}
        </Link>
      </h5>
      {/* Price */}
      <div className="text-[14px]">
        <span className="font-semibold text-[#0080ff]">
          ${typeof productPrice === 'number' ? productPrice.toFixed(2) : productPrice}
        </span>
      </div>
    </div>
  )
}

// Page Component

export default function Dashboard_User() {
  const { token, isLoggedIn } = useAuth()

  const [orders,        setOrders]        = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [profile,       setProfile]       = useState(null)
  const [followedCount, setFollowedCount] = useState(0)
  const [loading,       setLoading]       = useState(true)

  
  const getCartCount = () => {
    try {
      const raw = localStorage.getItem('cart')
      if (!raw) return 0
      const items = JSON.parse(raw)
      return Array.isArray(items) ? items.reduce((sum, i) => sum + (i.quantity || i.qty || 1), 0) : 0
    } catch { return 0 }
  }
  const [cartCount, setCartCount] = useState(getCartCount)

  const fetchAll = useCallback(async () => {
    if (!token) { setLoading(false); return }

    setLoading(true)
    try {
      const [ordersRes, wishlistRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/wishlist`,          { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/auth/profile`,      { headers: { Authorization: `Bearer ${token}` } }),
      ])

      const [ordersData, wishlistData, profileData] = await Promise.all([
        ordersRes.json(),
        wishlistRes.json(),
        profileRes.json(),
      ])

      if (ordersData.success)   setOrders(ordersData.data?.orders || [])
      if (wishlistData.success) setWishlistItems(wishlistData.products || [])
      if (profileData.success)  setProfile(profileData.user)

      // Fetch followed sellers count using localStorage followerId
      try {
        let followerId = localStorage.getItem('ec_follower_id')
        if (followerId) {
          const followedRes  = await fetch(`${API_URL}/sellers/followed-by/${encodeURIComponent(followerId)}`)
          const followedData = await followedRes.json()
          if (followedData.success) setFollowedCount((followedData.data || []).length)
        }
      } catch { /* silently fail */ }

    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchAll() }, [fetchAll])

  
  useEffect(() => {
    const onCartUpdate = () => setCartCount(getCartCount())
    window.addEventListener('cartUpdated', onCartUpdate)
    window.addEventListener('storage', onCartUpdate)
    return () => {
      window.removeEventListener('cartUpdated', onCartUpdate)
      window.removeEventListener('storage', onCartUpdate)
    }
  }, [])

  const handleWishlistRemove = (productId) => {
    setWishlistItems(prev => prev.filter(p => (p._id || p.id) !== productId))
  }

  // Derived counts
  const pendingOrderCount = orders.filter(o => o.status === 'pending').length
  const totalProductsOrdered = orders.reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.qty || 1), 0), 0)
  const wishlistCount = wishlistItems.length
  const addresses = profile?.addresses || []

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* Row 1 : Wallet + Stats*/}
      <div className="flex flex-wrap -mx-[8px]">
        <div className="w-full md:w-1/2 xl:w-2/3 px-[8px] mb-[1.5rem]">
          <WalletCard orders={orders} />
        </div>
        <div className="flex-1 px-[8px] mb-[1.5rem]">
          <div className="h-full">
            <div className="flex flex-col h-full">
              <div className="flex-1"><FollowingCard followedCount={followedCount} /></div>
              <div className="flex-1"><WishlistCountCard wishlistCount={wishlistCount} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 : Summary Counts + Addresses*/}
      <div className="flex flex-wrap -mx-[8px] mt-[0.5rem]">
        <div className="w-full md:w-1/2 xl:w-1/3 px-[8px] mb-[1.5rem]">
          <SummaryCountsCard
            cartCount={cartCount}
            pendingOrderCount={pendingOrderCount}
            totalOrderCount={totalProductsOrdered}
          />
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-[8px] mb-[1.5rem]">
          <ShippingAddressCard addresses={addresses} />
        </div>
        <div className="w-full md:w-1/2 xl:w-1/3 px-[8px] mb-[1.5rem]">
          <BillingAddressCard addresses={addresses} />
        </div>
      </div>

      {/* Row 3 : My Wishlist preview*/}
      <div className="flex flex-wrap items-center mb-[0.5rem] mt-[0.25rem]">
        <div className="w-1/2">
          <h3 className="mb-0 text-[14px] md:text-[16px] font-bold text-[#292933]">My Wishlist</h3>
        </div>
        <div className="w-1/2 text-right">
          <Link
            to="/user/wishlist"
            className="text-[#3490f3] text-[10px] md:text-[12px] font-bold hover:text-[#0080ff] no-underline"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 border-t border-l border-[#dfdfe6] mx-[0.25rem] md:mx-0 mb-[1.5rem]">
        {wishlistItems.length === 0 ? (
          <div className="col-span-full text-center py-[2rem] text-[14px] text-[#919199]">
            Your wishlist is empty.
          </div>
        ) : (
          wishlistItems.map((product) => (
            <WishlistProductCard
              key={product._id || product.id}
              product={product}
              onRemove={handleWishlistRemove}
              token={token}
            />
          ))
        )}
      </div>
    </>
  )
}