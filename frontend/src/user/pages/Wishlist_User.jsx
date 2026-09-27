import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PLACEHOLDER = '/src/images/Placeholder.png'

function WishlistCard({ product, onRemove }) {
  const navigate     = useNavigate()
  const productId    = product._id || product.id
  const productName  = product.title || product.name || 'Product'
  const productImage = product.image || (product.images?.[0]) || PLACEHOLDER
  const productPrice = product.price || 0
  const hasOptions   = !!(product.variants?.length || product.colors?.length || product.sizes?.length)

  return (
    <div
      className="py-[1rem] px-[8px] text-center border-r border-b border-[#dfdfe6] transition relative z-[1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] cursor-pointer"
      id={`wishlist_${productId}`}
      onClick={() => navigate(`/product/${productId}`)}
    >
      <div className="relative h-[140px] md:h-[200px] overflow-hidden mb-[1rem]">
        {/* Product image */}
        <div className="block h-full relative">
          <img
            src={productImage}
            className="mx-auto w-full h-full object-contain"
            title={productName}
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
            alt={productName}
          />
          {product.image2 && (
            <img
              className="mx-auto w-full h-full object-contain absolute top-0 left-0 opacity-0 hover:opacity-100"
              src={product.image2}
              alt={productName}
              title={productName}
              onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER }}
            />
          )}
        </div>

        {/* Remove from wishlist */}
        <div className="absolute top-0 right-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(productId) }}
            title="Remove from wishlist"
            className="inline-flex items-center justify-center w-[30px] h-[30px] bg-white text-[#292933] hover:bg-[#0080ff] hover:text-white"
          >
            <i className="la la-trash"></i>
          </a>
        </div>

        {/* Add to cart / options */}
        {hasOptions ? (
          <a
            className="absolute bottom-0 left-0 w-full h-[35px] bg-[#0080ff] text-white text-[13px] font-bold hidden sm:flex flex-col justify-center items-center"
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <span>Select Option</span>
            <span><i className="las la-sliders-h" style={{ fontSize: '1.4rem' }}></i></span>
          </a>
        ) : (
          <a
            className="absolute bottom-0 left-0 w-full h-[35px] bg-[#0080ff] text-white text-[13px] font-bold hidden sm:flex flex-col justify-center items-center"
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <span>Add to Cart</span>
            <span><i className="las la-shopping-cart" style={{ fontSize: '1.4rem' }}></i></span>
          </a>
        )}
      </div>

      {/* Product Name */}
      <h5 className="text-[14px] leading-[1.5] font-normal mb-[1rem] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        <span className="text-inherit hover:text-[#0080ff] no-underline" title={productName}>
          {productName}
        </span>
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

export default function Wishlist_User() {
  const { token, isLoggedIn } = useAuth()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setLoading(false)
      return
    }
    const fetchWishlist = async () => {
      try {
        const res  = await fetch(`${API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setItems(data.products)
        }
      } catch (err) {
        console.error('Wishlist fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [isLoggedIn, token])

  const handleRemove = async (productId) => {
    setItems(prev => prev.filter(p => (p._id || p.id) !== productId))
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
    <>
      {/* Title */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <b className="text-[20px] font-bold text-[#292933]">Wishlist</b>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-[3rem]">
          <p className="text-[#919199] text-[14px]">Loading wishlist...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-[3rem]">
          <i className="las la-heart-broken" style={{ fontSize: 64, color: '#dfdfe6' }}></i>
          <p className="text-[#919199] mt-[1rem] text-[14px]">Your wishlist is empty.</p>
          <Link to="/" className="inline-block bg-[#0080ff] hover:bg-[#0066cc] text-white py-[0.375rem] px-[0.75rem] text-[14px] mt-[0.5rem] no-underline rounded-[25px]">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 border-t border-l border-[#dfdfe6] mx-[0.25rem] md:mx-0 mb-[1.5rem]">
          {items.map((product) => (
            <WishlistCard key={product._id || product.id} product={product} onRemove={handleRemove} />
          ))}
        </div>
      )}

      <div></div>
    </>
  )
}