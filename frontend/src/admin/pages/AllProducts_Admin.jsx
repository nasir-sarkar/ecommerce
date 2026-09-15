// AllProducts_Admin.jsx
import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import ProductTable from '../components/ProductTable'
import Pagination from '../components/Pagination'

const API = import.meta.env.VITE_API_URL

// Icons 
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const PlusIconWhite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <path d="M6 0v12M0 6h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Add New Product button 
function AddNewProductButton({ to = '/admin/products/create' }) {
  return (
    <NavLink to={to}
      className="relative inline-flex items-center pl-[16px] pr-[44px] h-[34px] rounded-full text-[#009ef7] text-[13px] font-semibold hover:opacity-90 group">
      <span className="relative z-10">Add New Product</span>
      <span className="absolute top-0 right-0 h-full w-[34px] rounded-full bg-[#009ef7] flex items-center justify-center">
        <PlusIconWhite />
      </span>
    </NavLink>
  )
}

// Toolbar with search + dropdowns 
function ToolbarRow({ onSearch, onFilterChange, onSortChange, onBulkAction }) {
  const [bulkOpen, setBulkOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedSort, setSelectedSort] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter') onSearch(searchTerm)
  }

  const handleFilterToggle = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter]
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortSelect = (sort) => {
    setSelectedSort(sort)
    onSortChange(sort)
    setSortOpen(false)
  }

  const handleBulkAction = (action) => {
    onBulkAction(action)
    setBulkOpen(false)
  }

  return (
    <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="flex-1 min-w-[280px] flex items-center bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] px-[12px] h-[38px]">
        <span className="mr-2"><SearchIconGray /></span>
        <input
          type="text"
          placeholder="Search products…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          className="flex-1 bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none" />
      </div>

      {/* Bulk Action */}
      <div className="relative">
        <button type="button" onClick={() => setBulkOpen((o) => !o)}
          className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]">
          Bulk Action <CaretIcon />
        </button>
        {bulkOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-[180px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            <button onClick={() => handleBulkAction('publish')} className="w-full text-left px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Publish</button>
            <button onClick={() => handleBulkAction('featured')} className="w-full text-left px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Mark Featured</button>
            <button onClick={() => handleBulkAction('todaysDeal')} className="w-full text-left px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Mark Todays Deal</button>
            <button onClick={() => handleBulkAction('delete')} className="w-full text-left px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</button>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="relative w-[180px]">
        <button type="button" onClick={() => setFilterOpen((o) => !o)}
          className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
          <span>Filter</span><CaretIcon />
        </button>
        {filterOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-2">
            {['Published', 'Featured', 'Todays Deal', 'Low Stock', 'Refundable'].map((label) => (
              <label key={label} className="flex items-center gap-2 px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(label)}
                  onChange={() => handleFilterToggle(label)}
                  className="w-[14px] h-[14px] accent-[#009ef7]" />
                {label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="relative w-[180px]">
        <button type="button" onClick={() => setSortOpen((o) => !o)}
          className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
          <span>{selectedSort || 'Sort'}</span><CaretIcon />
        </button>
        {sortOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
            {['newest', 'oldest', 'price-asc', 'price-desc'].map((s) => (
              <button key={s} onClick={() => handleSortSelect(s)}
                className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Main exported Page
export default function AllProducts_Admin() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState([])
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const limit = 12

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy
      })

      if (search) params.append('search', search)
      if (filters.includes('Published'))   params.append('published', 'true')
      if (filters.includes('Featured'))    params.append('featured', 'true')
      if (filters.includes('Todays Deal')) params.append('todaysDeal', 'true')
      if (filters.includes('Low Stock'))   params.append('lowStock', 'true')
      if (filters.includes('Refundable'))  params.append('refundable', 'true')

      const response = await fetch(`${API}/products?${params}`)

      if (!response.ok) {
        const text = await response.text()
        console.error('Response:', text)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setProducts(data.products)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page, search, sortBy, filters])

  const handleSearch       = (term)       => { setSearch(term);   setPage(1) }
  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPage(1) }
  const handleSortChange   = (sort)       => { setSortBy(sort);   setPage(1) }

  // Edit product
  const handleEditProduct = (id) => {
    navigate(`/admin/products/edit/${id}`)
  }

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) { alert('Please select products first'); return }
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) return

    try {
      for (const productId of selectedProducts) {
        if (action === 'delete') {
          await fetch(`${API}/products/${productId}`, { method: 'DELETE' })
        } else {
          const body = action === 'publish'     ? { published: true }
                     : action === 'featured'    ? { featured: true }
                     : action === 'todaysDeal'  ? { todaysDeal: true }
                     : null
          if (body) {
            await fetch(`${API}/products/${productId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            })
          }
        }
      }
      alert(`${selectedProducts.length} product(s) updated successfully`)
      setSelectedProducts([])
      fetchProducts()
    } catch (err) {
      console.error('Bulk action error:', err)
      alert('Failed to perform bulk action')
    }
  }

  const handleTogglePublished = async (id, value) => {
    try {
      await fetch(`${API}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: value })
      })
      fetchProducts()
    } catch (err) { console.error('Error updating published status:', err) }
  }

  const handleToggleFeatured = async (id, value) => {
    try {
      await fetch(`${API}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: value })
      })
      fetchProducts()
    } catch (err) { console.error('Error updating featured status:', err) }
  }

  const handleToggleTodaysDeal = async (id, value) => {
    try {
      await fetch(`${API}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todaysDeal: value })
      })
      fetchProducts()
    } catch (err) { console.error('Error updating todays deal status:', err) }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await fetch(`${API}/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Failed to delete product')
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">All products</h1>

      <Card>
        <div className="flex items-center justify-between border-b border-[#f1f1f4] px-[20px] flex-wrap gap-2">
          <div className="flex items-center">
            <button className="px-0 mr-[28px] pt-[16px] pb-[14px] text-[14px] font-medium text-[#009ef7] border-b-[2px] border-[#009ef7]">
              All Products
            </button>
          </div>
          <AddNewProductButton />
        </div>

        <ToolbarRow
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onBulkAction={handleBulkAction}
        />

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
                if (checked) setSelectedProducts([...selectedProducts, id])
                else setSelectedProducts(selectedProducts.filter(pid => pid !== id))
              }}
              onSelectAll={(checked, productIds) => {
                setSelectedProducts(checked ? productIds : [])
              }}
              onTogglePublished={handleTogglePublished}
              onToggleFeatured={handleToggleFeatured}
              onToggleTodaysDeal={handleToggleTodaysDeal}
              onDeleteProduct={handleDeleteProduct}
              onEditProduct={handleEditProduct}
            />
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </>
        )}
      </Card>
    </>
  )
}