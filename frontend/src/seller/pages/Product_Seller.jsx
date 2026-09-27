import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SearchSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const TABS = [{ id: 'all-products', label: 'All products' }]

function SellerSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-block w-[40px] h-[22px] cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? 'bg-[#624b95]' : 'bg-[#e5e7eb]'}`} />
      <span className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </label>
  )
}

function Stars({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-[1px]">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= rating ? '#ffc700' : '#e5e7eb'}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </span>
  )
}

const fmt = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price || 0)

function ProductRow({ product, checked, onCheck, onTogglePublished, onToggleFeatured, onToggleTodaysDeal, onDelete, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reviewData, setReviewData] = useState({ avgRating: 0, total: 0 })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API}/product-reviews/${product._id}`)
        if (res.ok) { const data = await res.json(); setReviewData({ avgRating: data.avgRating || 0, total: data.total || 0 }) }
      } catch {}
    }
    fetchReviews()
  }, [product._id])

  const imgSrc = product.image || product.image2 || product.image3 || 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'
  const discount = product.discount && product.discount > 0
    ? (product.discountType === 'percent' ? `${product.discount}%` : fmt(product.discount)) : null

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#faf9ff]">
      <td className="px-[12px] py-[12px] text-center align-middle">
        <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px]" style={{ accentColor: '#624b95' }} />
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="w-[60px] h-[60px] rounded-[4px] overflow-hidden bg-[#f5f5f7] border border-[#f1f1f4]">
          <img src={imgSrc} alt={product.title} className="w-full h-full object-contain"
            onError={e => { e.target.onerror = null; e.target.src = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg' }} />
        </div>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="text-[12px] leading-[16px] text-[#2E294E] line-clamp-2 max-w-[280px] font-medium">{product.title}</div>
        <span className="text-[12px] leading-[16px] text-[#624b95] font-semibold mt-1 inline-block">{product.brand || 'No Brand'}</span>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <span className="text-[12px] leading-[16px] text-[#624b95] font-semibold block">{product.seller || '—'}</span>
        <div className="text-[11px] leading-[15px] text-[#9da3ae] mt-1">{product.category || 'Uncategorized'}</div>
        {product.subCategory && <div className="text-[11px] leading-[15px] text-[#9da3ae]">{product.subCategory}</div>}
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <Stars rating={Math.round(reviewData.avgRating)} />
        <div className="text-[12px] leading-[16px] text-[#2E294E] mt-1">{reviewData.avgRating.toFixed(1)} out of 5.0</div>
        <div className="text-[12px] leading-[16px] text-[#9da3ae]">{reviewData.total} reviews</div>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="border-l-[3px] border-[#624b95] pl-2">
          <div className="text-[11px] leading-[15px] text-[#9da3ae]">Price</div>
          <div className="text-[13px] leading-[18px] text-[#2E294E] font-semibold">{fmt(product.price)}</div>
        </div>
        {discount && (
          <div className="border-l-[3px] border-[#f1416c] pl-2 mt-2">
            <div className="text-[11px] leading-[15px] text-[#9da3ae]">Discount <span className="text-[#f1416c] font-semibold ml-1">{discount}</span></div>
          </div>
        )}
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="text-[11px] leading-[15px] text-[#9da3ae]">Number of Stock</div>
        <div className="text-[13px] leading-[18px] text-[#2E294E] font-semibold">{product.stockCount || 0}</div>
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <SellerSwitch checked={product.published} onChange={(val) => onTogglePublished(product._id, val)} />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <SellerSwitch checked={product.featured} onChange={(val) => onToggleFeatured(product._id, val)} />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <SellerSwitch checked={product.todaysDeal} onChange={(val) => onToggleTodaysDeal(product._id, val)} />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle relative">
        <button type="button" onClick={() => setMenuOpen(o => !o)}
          className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] flex items-center justify-center mx-auto">
          <svg width="4" height="16" viewBox="0 0 4 16" fill="#9da3ae">
            <circle cx="2" cy="2" r="2" /><circle cx="2" cy="8" r="2" /><circle cx="2" cy="14" r="2" />
          </svg>
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(46,41,78,0.15)] border border-[#f1f1f4] py-1 text-left">
              <button onClick={() => { setMenuOpen(false); navigate(`/seller/products/edit/${product._id}`) }}
                className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#2E294E] hover:bg-[#f3f0ff]">Edit</button>
              <button onClick={() => window.open(`/product/${product._id}`, '_blank')}
                className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#2E294E] hover:bg-[#f3f0ff]">View</button>
              <button onClick={() => { onDelete(product._id); setMenuOpen(false) }}
                className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</button>
            </div>
          </>
        )}
      </td>
    </tr>
  )
}

function ProductTable({ products, selectedProducts, onSelectProduct, onSelectAll, onTogglePublished, onToggleFeatured, onToggleTodaysDeal, onDeleteProduct, navigate }) {
  const allChecked = products.length > 0 && selectedProducts.length === products.length
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#f1f1f4]">
            <th className="px-[12px] py-[10px] text-center w-[40px]">
              <input type="checkbox" checked={allChecked}
                onChange={e => onSelectAll(e.target.checked, products.map(p => p._id))}
                className="w-[16px] h-[16px] rounded-[3px]" style={{ accentColor: '#624b95' }} />
            </th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">THUMB</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">NAME / BRAND</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">OWNER / CATEGORY</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">RATINGS</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">PRICE DETAILS</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] font-semibold text-[#9da3ae] uppercase">INFO</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase">PUBLISHED</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase">FEATURED</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase">TODAYS DEAL</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] font-semibold text-[#9da3ae] uppercase">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <ProductRow key={product._id} product={product}
              checked={selectedProducts.includes(product._id)}
              onCheck={checked => onSelectProduct(product._id, checked)}
              onTogglePublished={onTogglePublished}
              onToggleFeatured={onToggleFeatured}
              onToggleTodaysDeal={onToggleTodaysDeal}
              onDelete={onDeleteProduct}
              navigate={navigate}
            />
          ))}
          {products.length === 0 && (
            <tr><td colSpan="11" className="text-center py-8 text-[#a5a5b8]">No products found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="w-[32px] h-[32px] flex items-center justify-center rounded border border-[#f1f1f4] text-[#9da3ae] hover:bg-[#f3f0ff] disabled:opacity-40 text-[13px]">‹</button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-[32px] h-[32px] flex items-center justify-center rounded border text-[13px] font-medium transition-colors ${p === current ? 'bg-[#2E294E] text-white border-[#2E294E]' : 'border-[#f1f1f4] text-[#2E294E] hover:bg-[#f3f0ff]'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="w-[32px] h-[32px] flex items-center justify-center rounded border border-[#f1f1f4] text-[#9da3ae] hover:bg-[#f3f0ff] disabled:opacity-40 text-[13px]">›</button>
    </div>
  )
}

export default function Product_Seller() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('all-products')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState([])
  const [sortBy, setSortBy] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const limit = 12

  const shopName = user?.shopName || ''

  
  const fetchAllSellerProducts = async () => {
    if (!shopName) return
    setLoading(true)
    try {
      // Fetch a large batch
      const url = `${API}/products?limit=500&page=1`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      
      let mine = (data.products || []).filter(p => p.seller === shopName)

      // Apply search
      if (search) {
        const q = search.toLowerCase()
        mine = mine.filter(p =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.brand || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
        )
      }

      // Apply filters
      if (filters.includes('All Published')) mine = mine.filter(p => p.published)
      if (filters.includes('All Discounted')) mine = mine.filter(p => p.discount && p.discount > 0)
      if (filters.includes('Low Stock')) mine = mine.filter(p => (p.stockCount || 0) < 10)
      if (filters.includes('Refundable')) mine = mine.filter(p => p.refundable)

      // Apply sort
      if (sortBy === 'rating,desc') mine.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      else if (sortBy === 'rating,asc') mine.sort((a, b) => (a.rating || 0) - (b.rating || 0))
      else if (sortBy === 'unit_price,desc') mine.sort((a, b) => (b.price || 0) - (a.price || 0))
      else if (sortBy === 'unit_price,asc') mine.sort((a, b) => (a.price || 0) - (b.price || 0))

      setTotalProducts(mine.length)

      // Paginate client-side
      const total = mine.length
      const pages = Math.ceil(total / limit) || 1
      setTotalPages(pages)

      const safePage = Math.min(page, pages)
      const start = (safePage - 1) * limit
      setProducts(mine.slice(start, start + limit))

      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalCount = fetchAllSellerProducts  // unified — no separate call needed

  useEffect(() => { fetchAllSellerProducts() }, [page, search, filters, sortBy, shopName])

  const handleSearchKeyDown = (e) => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1) } }

  const handleFilterToggle = (filter) => {
    setFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter])
    setPage(1)
  }

  const patchProduct = async (id, body) => {
    await fetch(`${API}/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    fetchAllSellerProducts()
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try { await fetch(`${API}/products/${id}`, { method: 'DELETE' }); fetchAllSellerProducts(); fetchAllSellerProducts() }
    catch { alert('Failed to delete product') }
  }

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) { alert('Please select products first'); return }
    if (action === 'Delete' && !confirm(`Delete ${selectedProducts.length} product(s)?`)) return
    try {
      for (const id of selectedProducts) {
        if (action === 'Delete') await fetch(`${API}/products/${id}`, { method: 'DELETE' })
        else if (action === 'Publish') await fetch(`${API}/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: true }) })
      }
      alert(`${selectedProducts.length} product(s) updated successfully`)
      setSelectedProducts([])
      fetchAllSellerProducts()
      fetchAllSellerProducts()
    } catch { alert('Failed to perform bulk action') }
  }

  return (
    <div>
      {/* Title */}
      <div className="mt-2 mb-4">
        <div className="flex items-center">
          <div className="md:w-1/2">
            <h1 className="text-[20px] font-semibold text-[#2E294E]">Products</h1>
          </div>
        </div>
      </div>

      {/* Top two feature boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] justify-center">
        {/* Total Products */}
        <div className="mb-3">
          <div className="bg-gradient-to-r from-[#2E294E] to-[#624b95] text-white rounded-[8px] overflow-hidden flex flex-col items-center justify-center" style={{height: '123px'}}>
            <div className="text-[24px] font-bold text-center">{loading ? '—' : totalProducts}</div>
            <div className="opacity-50 text-center text-[12px] mt-1">Total Products</div>
          </div>
        </div>

        {/* Add New Product */}
        <div className="mb-3">
          <button type="button" onClick={() => navigate('/seller/products/create')} className="w-full text-left">
            <div className="p-3 rounded-[6px] mb-3 cursor-pointer text-center bg-white shadow-sm hover:shadow-lg transition-shadow">
              <span className="size-[60px] rounded-full mx-auto bg-[#a1a5b3] flex items-center justify-center mb-3 w-[60px] h-[60px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className="text-[18px] text-[#2E294E]">Add New Product</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[6px] mt-2">
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[25px] pb-3 xl:pb-0">
          <div className="flex-grow">
            <ul className="flex border-0 list-none p-0 m-0 gap-6">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveTab(t.id)}
                    type="button"
                    className={`px-0 pb-[15px] pt-3 text-[14px] font-medium border-b-2 ${
                      activeTab === t.id ? 'text-[#624b95] border-[#624b95]' : 'text-[#2E294E] border-transparent'
                    }`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-[25px] py-3">
          <div className="flex flex-wrap border-0 pb-0 my-3 gap-2">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center mb-0 border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px]">
                <span className="px-0 mr-2"><SearchSvg /></span>
                <input type="text" value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="form-control text-[14px] border-0 px-2 bg-transparent flex-1 py-2 focus:outline-none"
                  placeholder="Search products…" />
              </div>
            </div>

            {/* Bulk Action */}
            <div className="relative bg-[#f5f5f7] mt-2 md:mt-0 rounded-[4px]">
              <button onClick={() => setBulkOpen(o => !o)}
                className="border border-[#f1f1f4] text-[#a1a5b3] text-[14px] font-normal flex items-center px-3 py-2 rounded-[4px]" type="button">
                Bulk Action
                <svg className="ml-2" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="#a1a5b3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {bulkOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white shadow-md border border-[#f1f1f4] rounded-[4px] z-10 min-w-[150px]">
                  <button onClick={() => { handleBulkAction('Publish'); setBulkOpen(false) }} className="block w-full text-left px-4 py-2 text-[14px] text-[#2E294E] hover:bg-[#f3f0ff]">Publish</button>
                  <button onClick={() => { handleBulkAction('Delete'); setBulkOpen(false) }} className="block w-full text-left px-4 py-2 text-[#dc3545] text-[14px] font-medium hover:bg-[#f5f5f7]">Delete selection</button>
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="md:w-[180px] mb-1 md:mb-0 px-0 md:px-1 relative">
              <button onClick={() => setFilterOpen(o => !o)}
                className="px-3 w-full flex justify-between items-center py-2 border border-[#f1f1f4] bg-white rounded-[4px]" type="button">
                <span className="text-[#a1a5b3] text-[14px] font-normal">Filter</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="#a1a5b3" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {filterOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white shadow-md border border-[#f1f1f4] rounded-[4px] z-10 w-full py-3">
                  {['All Published', 'All Discounted', 'Low Stock', 'Refundable'].map(label => (
                    <label key={label} className="hover:bg-[#f3f0ff] py-2 flex items-center px-3 cursor-pointer">
                      <input type="checkbox" checked={filters.includes(label)} onChange={() => handleFilterToggle(label)}
                        className="mr-2" style={{ accentColor: '#624b95' }} />
                      <span className="text-[14px] text-[#2E294E]">{label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="md:w-[180px] pr-0 md:pr-3 pl-0">
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}
                className="w-full bg-white border border-[#f1f1f4] py-2 px-3 rounded-[4px] text-[14px] text-[#a1a5b3]">
                <option value="">Sort</option>
                <option value="rating,desc">Rating (High &gt; Low)</option>
                <option value="rating,asc">Rating (Low &gt; High)</option>
                <option value="unit_price,desc">Base Price (High &gt; Low)</option>
                <option value="unit_price,asc">Base Price (Low &gt; High)</option>
              </select>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {loading ? (
              <div className="text-center py-8 text-[#a5a5b8]">Loading products...</div>
            ) : error ? (
              <div className="text-center py-8 text-[#f1416c]">Error: {error}</div>
            ) : (
              <>
                <ProductTable
                  products={products}
                  selectedProducts={selectedProducts}
                  onSelectProduct={(id, checked) => {
                    if (checked) setSelectedProducts(prev => [...prev, id])
                    else setSelectedProducts(prev => prev.filter(p => p !== id))
                  }}
                  onSelectAll={(checked, ids) => setSelectedProducts(checked ? ids : [])}
                  onTogglePublished={(id, val) => patchProduct(id, { published: val })}
                  onToggleFeatured={(id, val) => patchProduct(id, { featured: val })}
                  onToggleTodaysDeal={(id, val) => patchProduct(id, { todaysDeal: val })}
                  onDeleteProduct={handleDeleteProduct}
                  navigate={navigate}
                />
                <Pagination current={page} total={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}