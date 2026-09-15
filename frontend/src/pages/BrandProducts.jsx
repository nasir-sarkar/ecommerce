import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const hoverImage = product.image2 || null
  return (
    <div
      className="border border-[#e5e7eb] bg-white group cursor-pointer hover:shadow-md transition-shadow overflow-hidden rounded relative"
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {product.badge}
        </span>
      )}
      <div className="overflow-hidden bg-[#f9fafb] h-44 flex items-center justify-center">
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
        {product.seller && <p className="text-[11px] text-[#9ca3af] mt-0.5">{product.seller}</p>}
      </div>
    </div>
  )
}

export default function BrandProducts() {
  const { brandName } = useParams()
  const decoded = decodeURIComponent(brandName || '')

  const [products, setProducts]     = useState([])
  const [allProducts, setAll]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [sortBy, setSortBy]         = useState('')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [subFilters, setSubFilters] = useState([])
  const [selectedSub, setSelectedSub] = useState('')


  // Brand logo from DB
  const [brandLogoSrc, setBrandLogoSrc] = useState(null)

  const PER_PAGE = 12


  // Fetch brand logo from DB
  useEffect(() => {
    const fetchBrandLogo = async () => {
      try {
        const res  = await fetch(`${API_URL}/brands/active`)
        const json = await res.json()
        if (json.success && json.data?.brands) {
          const match = json.data.brands.find(
            b => b.name?.toLowerCase() === decoded.toLowerCase()
          )
          if (match?.image) setBrandLogoSrc(match.image)
        }
      } catch {
      }
    }
    fetchBrandLogo()
  }, [decoded])

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API_URL}/products?limit=500`)
        const data = await res.json()
        const all  = (data.products || []).filter(
          p => p.brand?.toLowerCase() === decoded.toLowerCase()
        )
        setAll(all)
        const cats = [...new Set(all.map(p => p.category).filter(Boolean))]
        setSubFilters(cats)
      } catch {
        setAll([])
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [decoded])

  useEffect(() => {
    let filtered = [...allProducts]
    if (selectedSub) filtered = filtered.filter(p => p.category === selectedSub)
    if (sortBy === 'price-asc')  filtered.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price)

    setTotalPages(Math.max(1, Math.ceil(filtered.length / PER_PAGE)))
    setProducts(filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE))
  }, [allProducts, sortBy, page, selectedSub])

  useEffect(() => { setPage(1) }, [sortBy, selectedSub])

  return (
    <div className="py-6 bg-[#f9fafb] min-h-screen">
      <Container>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-[#1f2937]">Brand Products</h1>
          <Breadcrumb items={[{ label: 'Brands', href: '/brands' }, { label: decoded }]} />
        </div>

        {/* Brand banner */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-6 flex flex-col sm:flex-row items-center gap-5 mb-6">
          {brandLogoSrc ? (
            <img
              src={brandLogoSrc}
              alt={decoded}
              className="h-16 w-32 object-contain"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="h-16 w-32 flex items-center justify-center bg-[#f3f4f6] rounded text-[#6b7280] font-bold text-lg">
              {decoded}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-[#1f2937]">{decoded}</h2>
            <p className="text-sm text-[#6b7280] mt-1">
              {allProducts.length} product{allProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {/* Filters + sort bar */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg px-5 py-3 mb-4 flex flex-wrap items-center gap-3">
          {subFilters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSub('')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  !selectedSub ? 'bg-[#0080FF] text-white border-[#0080FF]' : 'border-[#e5e7eb] text-[#4b5563] hover:border-[#0080FF] hover:text-[#0080FF]'
                }`}
              >
                All
              </button>
              {subFilters.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedSub(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedSub === cat ? 'bg-[#0080FF] text-white border-[#0080FF]' : 'border-[#e5e7eb] text-[#4b5563] hover:border-[#0080FF] hover:text-[#0080FF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-[#e5e7eb] text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#0080FF]"
            >
              <option value="">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-5">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-[#0080FF]">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-[#9ca3af]">No products found for this brand.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

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

      </Container>
    </div>
  )
}