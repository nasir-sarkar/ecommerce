import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Container from '../components/common/Container'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'


/* countdown hook */
function parseEndDate(str) {
  if (!str) return NaN
  return new Date(str.replace(/\//g, '-').replace(' ', 'T')).getTime()
}

function useCountdown(endDateStr) {
  const calc = () => {
    const diff = Math.max(0, parseEndDate(endDateStr) - Date.now())
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hrs:  Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [endDateStr])
  return t
}


/* sticky countdown panel (left column) */
function DealCountdownPanel({ deal }) {
  const t = useCountdown(deal.end)
  const p = n => String(n).padStart(2, '0')

  return (
    <div className="z-10 sticky top-20 py-3 lg:py-0 h-auto lg:h-[400px] xl:h-[475px]">
      <div
        className="h-full w-full flex flex-col"
        style={{
          backgroundImage: `url('${deal.img}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        <div className="py-8 px-4 lg:px-5">
          {/* Countdown box */}
          <div className="bg-white inline-block p-3 shadow">
            {/* Days */}
            <div className="flex flex-col items-center mb-1">
              <span className="text-3xl font-black text-gray-800 leading-none">{p(t.days)}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">Days</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* Hrs */}
              <div className="flex flex-col items-center bg-gray-50 border border-gray-100 px-3 py-2 min-w-[48px]">
                <span className="text-[22px] font-black text-gray-800 leading-none">{p(t.hrs)}</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-wider mt-0.5">Hrs</span>
              </div>
              <span className="text-xl font-black text-gray-400">:</span>
              {/* Mins */}
              <div className="flex flex-col items-center bg-gray-50 border border-gray-100 px-3 py-2 min-w-[48px]">
                <span className="text-[22px] font-black text-gray-800 leading-none">{p(t.mins)}</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-wider mt-0.5">Min</span>
              </div>
              <span className="text-xl font-black text-gray-400">:</span>
              {/* Secs */}
              <div className="flex flex-col items-center bg-gray-50 border border-gray-100 px-3 py-2 min-w-[48px]">
                <span className="text-[22px] font-black text-gray-800 leading-none">{p(t.secs)}</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-wider mt-0.5">Sec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


/* product card */
function ProductCard({ product }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const hasDiscount = product.discountPercent > 0
  const hoverImage = product.image2 || null

  const handleClick = () => {
    navigate(`/product/${product._id}`, {
      state: { discountedPrice: product.discountedPrice ?? product.price },
    })
  }

  return (
    <div
      className="border border-gray-200 bg-white group cursor-pointer hover:shadow-md transition-shadow overflow-hidden rounded relative"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Discount badge */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 z-10 bg-[#0080FF] text-white text-[10px] font-bold px-2 py-0.5 rounded">
          -{product.discountPercent}%
        </span>
      )}


      {/* Image */}
      <div className="overflow-hidden bg-gray-50 h-44 flex items-center justify-center">
        <img
          src={(hovered && hoverImage) ? hoverImage : (product.image || PH)}
          alt={product.title}
          className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PH }}
        />
      </div>


      {/* Product info */}
      <div className="p-3">
        <p className="text-[12px] text-[#292933] leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">{product.title}</p>


        {/* Add to Cart */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`, { state: { discountedPrice: product.discountedPrice ?? product.price } }); }}
          className="w-full bg-[#0080FF] text-white text-[11px] font-bold py-1 mb-1 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 duration-200 rounded-sm"
        >
          Add to cart
        </button>

        <div className="flex items-center gap-1">
          {hasDiscount && (
            <del className="font-normal text-gray-400 text-[11px]">
              ${product.originalPrice?.toFixed(2)}
            </del>
          )}
          <p className="text-[14px] font-bold text-[#0080FF]">
            ${product.discountedPrice?.toFixed(2) ?? product.price?.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}


/* skeleton */
function Skeleton() {
  return (
    <div className="border border-gray-200 bg-white rounded overflow-hidden">
      <div className="h-44 bg-gray-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  )
}


/* main page */
const PER_PAGE = 20

export default function FlashSaleDealProducts() {
  const { dealId } = useParams()
  const navigate   = useNavigate()

  const [deal, setDeal]         = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [sortBy, setSortBy]     = useState('')
  const [page, setPage]         = useState(1)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`${API_URL}/flash-sale/deals/${dealId}/products`)
        if (!res.ok) throw new Error('Deal not found')
        const json = await res.json()
        setDeal(json.deal)
        setProducts(json.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dealId])

  /* sort */
  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.discountedPrice - b.discountedPrice
    if (sortBy === 'price-desc') return b.discountedPrice - a.discountedPrice
    if (sortBy === 'discount')   return (b.discountPercent || 0) - (a.discountPercent || 0)
    return 0
  })

  const totalPages  = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const displayed   = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)


  /* loading skeleton */
  if (loading) {
    return (
      <section className="mb-10 mt-3">
        <Container>
          <div className="pt-4 mb-4">
            <h1 className="font-bold text-xl text-gray-800">Flash Sale</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-0">
            <div className="w-full lg:w-5/12 xl:w-[33%] bg-gray-100 animate-pulse h-[300px] lg:h-[400px] xl:h-[475px] shrink-0" />
            <div className="flex-1">
              <div className="px-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    )
  }


  /* error */
  if (error) {
    return (
      <section className="mb-10 mt-3">
        <Container>
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">{error}</p>
            <button onClick={() => navigate('/flash-sale')} className="mt-4 text-[#0080FF] hover:underline text-sm">
              ← Back to Flash Deals
            </button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="mb-10 mt-3">
      <Container>
        {/* ── Title & breadcrumb ── */}
        <div className="pt-2 md:pt-4 mb-2 md:mb-4 flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-bold text-xl md:text-2xl text-gray-800">
            {deal?.discountPercent > 0 ? `${deal.discountPercent}% OFF Flash Sale` : 'Flash Sale'}
          </h1>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 flex items-center gap-1">
            <Link to="/" className="hover:text-[#0080FF] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/flash-sale" className="hover:text-[#0080FF] transition-colors">Flash Sale</Link>
            <span>/</span>
            <span className="text-gray-600">Deal #{deal?.id}</span>
          </nav>
        </div>


        {/* Sort bar */}
        <div className="mb-3 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{displayed.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{products.length}</span> products
          </p>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1) }}
            className="border border-gray-200 text-sm px-3 py-1.5 rounded focus:outline-none focus:border-[#0080FF]"
          >
            <option value="">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Main two-column layout */}
        <div className="flex flex-col lg:flex-row gap-0">


          {/* LEFT: Countdown panel */}
          <div className="w-full lg:w-5/12 xl:w-[33%] shrink-0 mb-4 lg:mb-0">
            {deal && <DealCountdownPanel deal={deal} />}
          </div>


          {/* RIGHT: Product grid */}
          <div className="flex-1 min-w-0">
            {!displayed.length ? (
              <div className="flex items-center justify-center h-64 border-t border-l text-gray-400">
                No products in this deal yet.
              </div>
            ) : (
              <>
                <div className="px-0 md:px-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayed.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                </div>


                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:border-[#0080FF] hover:text-[#0080FF] disabled:opacity-40 transition-colors"
                    >
                      «
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`w-8 h-8 text-sm border rounded transition-colors ${
                          n === page
                            ? 'bg-[#0080FF] text-white border-[#0080FF]'
                            : 'border-gray-200 hover:border-[#0080FF] hover:text-[#0080FF]'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded hover:border-[#0080FF] hover:text-[#0080FF] disabled:opacity-40 transition-colors"
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}