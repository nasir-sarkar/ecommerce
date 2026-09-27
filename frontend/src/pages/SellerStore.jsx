import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

const SELLER_META = {
  'Fashion Store': { initial: 'F', color: '#8B7FF8' },
  'All for Men':   { initial: 'A', color: '#4ECDC4' },
  'Home Store':    { initial: 'H', color: '#C8D89A' },
  'Tech Store':    { initial: 'T', color: '#7BC8F0' },
  'Beauty Shop':   { initial: 'B', color: '#E8A898' },
  'Baby Shop':     { initial: 'B', color: '#F4B8D1' },
  'Toy Store':     { initial: 'T', color: '#9BC49A' },
}

// Stable guest/user identifier stored in localStorage
function getFollowerId() {
  let id = localStorage.getItem('ec_follower_id')
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + Date.now()
    localStorage.setItem('ec_follower_id', id)
  }
  return id
}


/* Star display */
function Stars({ rating, size = 'sm', interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0)
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-6 h-6'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = interactive ? (hovered || rating) > i : rating > i
        return (
          <svg key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`${sz} ${filled ? 'text-[#f3af3d]' : 'text-[#e5e7eb]'} ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            viewBox="0 0 20 20" fill="currentColor"
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate && onRate(i + 1)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )
      })}
    </div>
  )
}


/* Product card */
function ProductCard({ product }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const hoverImage = product.image2 || null
  return (
    <div
      className="border border-[#e5e7eb] bg-white group cursor-pointer hover:shadow-md transition-shadow overflow-hidden rounded"
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {product.badge}
        </span>
      )}
      <div className="relative overflow-hidden bg-[#f9fafb] h-44 flex items-center justify-center">
        <img
          src={(hovered && hoverImage) ? hoverImage : (product.image || PH)}
          alt={product.title}
          className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PH }}
        />
      </div>
      <div className="p-3">
        <p className="text-[12px] text-[#292933] leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">{product.title}</p>
        <p className="text-[14px] font-bold text-[#0080FF]">${product.price?.toFixed(2)}</p>
        {product.brand && <p className="text-[11px] text-[#9ca3af] mt-0.5">{product.brand}</p>}
      </div>
    </div>
  )
}


/* Review card */
function ReviewCard({ review }) {
  const initials = review.userName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colors = ['#8B7FF8','#4ECDC4','#7BC8F0','#E8A898','#9BC49A','#f3af3d','#0080FF']
  const color = colors[review.userName?.charCodeAt(0) % colors.length]

  return (
    <div className="flex gap-3 py-4 border-b border-[#f3f4f6] last:border-0">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-sm font-semibold text-[#1f2937]">{review.userName}</span>
          <span className="text-[11px] text-[#9ca3af]">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
        <Stars rating={review.rating} size="sm" />
        <p className="text-[13px] text-[#4b5563] mt-1 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  )
}


export default function SellerStore() {
  const { sellerName } = useParams()
  const decodedSeller  = decodeURIComponent(sellerName || '')

  const [sellerData, setSellerData]   = useState(null)   // DB seller document
  const [products, setProducts]       = useState([])
  const [reviews,  setReviews]        = useState([])
  const [avgRating, setAvgRating]     = useState(0)
  const [loading,  setLoading]        = useState(true)
  const [sortBy,   setSortBy]         = useState('')
  const [page,     setPage]           = useState(1)
  const [totalPages, setTotalPages]   = useState(1)

  /* follow state */
  const [following,     setFollowing]     = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followLoading, setFollowLoading] = useState(false)

  /* review form */
  const [form, setForm] = useState({ userName: '', rating: 0, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError,  setFormError]  = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  const meta = SELLER_META[decodedSeller] || { initial: decodedSeller?.[0]?.toUpperCase() || '?', color: '#0080FF' }

  /* fetch seller DB data (for id + follower info) */
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res  = await fetch(`${API_URL}/sellers/by-shop/${encodeURIComponent(decodedSeller)}`)
        const data = await res.json()
        if (data.success) {
          setSellerData(data.data)
          const followerId = getFollowerId()
          const isFollowing = (data.data.followers || []).includes(followerId)
          setFollowing(isFollowing)
          setFollowerCount(data.data.followers?.length || 0)
        }
      } catch { /* ignore */ }
    }
    fetchSeller()
  }, [decodedSeller])

  /* fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API_URL}/products?limit=200`)
        const data = await res.json()
        const all  = (data.products || []).filter(
          p => p.seller?.toLowerCase() === decodedSeller.toLowerCase()
        )

        if (sortBy === 'price-asc')  all.sort((a, b) => a.price - b.price)
        if (sortBy === 'price-desc') all.sort((a, b) => b.price - a.price)

        const perPage = 12
        setTotalPages(Math.max(1, Math.ceil(all.length / perPage)))
        setProducts(all.slice((page - 1) * perPage, page * perPage))
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [decodedSeller, sortBy, page])


  /* fetch reviews */
  const fetchReviews = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/reviews/${encodeURIComponent(decodedSeller)}`)
      const data = await res.json()
      setReviews(data.reviews || [])
      setAvgRating(data.avgRating || 0)
    } catch { /* ignore */ }
  }, [decodedSeller])

  useEffect(() => { fetchReviews() }, [fetchReviews])


  /* follow / unfollow */
  const handleFollow = async () => {
    if (!sellerData) return
    setFollowLoading(true)
    try {
      const res  = await fetch(`${API_URL}/sellers/${sellerData._id}/follow`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ followerId: getFollowerId() }),
      })
      const data = await res.json()
      if (data.success) {
        setFollowing(data.following)
        setFollowerCount(data.followers)
      }
    } catch { /* ignore */ }
    setFollowLoading(false)
  }


  /* submit review */
  const handleReviewSubmit = async e => {
    e.preventDefault()
    setFormError('')
    if (!form.userName.trim()) return setFormError('Please enter your name.')
    if (!form.rating)          return setFormError('Please select a rating.')
    if (!form.comment.trim())  return setFormError('Please write a comment.')

    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerName: decodedSeller, ...form }),
      })
      if (!res.ok) throw new Error()
      setForm({ userName: '', rating: 0, comment: '' })
      setFormSuccess(true)
      setTimeout(() => setFormSuccess(false), 3000)
      fetchReviews()
    } catch {
      setFormError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-6 bg-[#f9fafb] min-h-screen">
      <Container>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-[#1f2937]">Seller Store</h1>
          <Breadcrumb items={[{ label: 'Sellers', href: '/seller' }, { label: decodedSeller }]} />
        </div>

        {/* Seller banner */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 flex flex-col sm:flex-row items-center gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
            style={{ backgroundColor: meta.color }}
          >
            {meta.initial}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#1f2937] flex items-center gap-2 justify-center sm:justify-start">
              {decodedSeller}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0080FF]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </h2>
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <Stars rating={Math.round(avgRating)} size="sm" />
              <span className="text-sm text-[#6b7280]">
                {avgRating > 0 ? `${avgRating} / 5` : 'No ratings yet'} &nbsp;·&nbsp; {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start">
              <p className="text-sm text-[#6b7280]">{products.length > 0 ? `${products.length} products` : 'No products yet'}</p>
              <span className="text-[#d1d5db]">·</span>
              <p className="text-sm text-[#6b7280]">{followerCount} follower{followerCount !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {/* Follow button */}
          <button
            type="button"
            onClick={handleFollow}
            disabled={followLoading}
            className={`flex-shrink-0 h-[36px] px-[20px] rounded-full text-[13px] font-semibold transition-all disabled:opacity-60 ${
              following
                ? 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb] border border-[#e5e7eb]'
                : 'bg-[#0080FF] text-white hover:bg-[#0070e0]'
            }`}
          >
            {followLoading ? '...' : following ? 'Following' : '+ Follow'}
          </button>
        </div>

        {/* Products section */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h3 className="text-base font-bold text-[#1f2937]">Products</h3>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1) }}
              className="border border-[#e5e7eb] text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#0080FF]"
            >
              <option value="">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 text-[#0080FF]">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-[#9ca3af]">No products from this seller yet.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-[#e5e7eb] rounded hover:border-[#0080FF] hover:text-[#0080FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 text-sm border rounded transition-colors ${
                        n === page ? 'bg-[#0080FF] text-white border-[#0080FF]' : 'border-[#e5e7eb] hover:border-[#0080FF] hover:text-[#0080FF]'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-sm border border-[#e5e7eb] rounded hover:border-[#0080FF] hover:text-[#0080FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Reviews section */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          <h3 className="text-base font-bold text-[#1f2937] mb-5">Ratings &amp; Reviews</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Write review */}
            <div>
              <h4 className="text-sm font-semibold text-[#374151] mb-4">Write a Review</h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#4b5563] mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={form.userName}
                    onChange={e => setForm(f => ({ ...f, userName: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#0080FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4b5563] mb-2">Your Rating *</label>
                  <Stars
                    rating={form.rating}
                    size="lg"
                    interactive
                    onRate={r => setForm(f => ({ ...f, rating: r }))}
                  />
                  {form.rating > 0 && (
                    <p className="text-xs text-[#6b7280] mt-1">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4b5563] mb-1">Your Comment *</label>
                  <textarea
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    rows={4}
                    placeholder="Share your experience with this seller..."
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#0080FF] resize-none"
                  />
                </div>

                {formError && <p className="text-red-500 text-xs">{formError}</p>}
                {formSuccess && <p className="text-green-600 text-xs">✓ Review submitted successfully!</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-gradient-to-r from-[#0080FF] to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* Review list */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#1f2937]">{avgRating > 0 ? avgRating : '—'}</p>
                  <Stars rating={Math.round(avgRating)} size="sm" />
                  <p className="text-xs text-[#9ca3af] mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-sm text-[#9ca3af] italic">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="max-h-[420px] overflow-y-auto pr-1">
                  {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
                </div>
              )}
            </div>
          </div>
        </div>

      </Container>
    </div>
  )
}