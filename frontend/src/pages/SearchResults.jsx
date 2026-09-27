import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/products?limit=500`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error('Failed to fetch products', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([])
      return
    }

    const searchTerm = query.toLowerCase().trim()
    
    const filtered = products.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(searchTerm)
      const categoryMatch = product.category?.toLowerCase().includes(searchTerm)
      
      return titleMatch || categoryMatch
    })
    
    setFilteredProducts(filtered)
  }, [query, products])

  return (
    <div className="py-5 mb-5">
      <Container>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-[#292933]">
            Search Results for "{query}"
          </h1>
          <Breadcrumb items={[{ label: 'Search', path: '/search' }, { label: query }]} />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-2 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-sm text-gray-500 mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map(product => (
                <Link 
                  key={product._id} 
                  to={`/product/${product._id}`}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image || PH} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => e.target.src = PH}
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1 group-hover:text-[#0080FF] transition-colors min-h-[32px]">
                      {product.title}
                    </h3>
                    
                    {/* Category Badge */}
                    <div className="mb-1.5">
                      <span className="inline-block text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0080FF]">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  )
}