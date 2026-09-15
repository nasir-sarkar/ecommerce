import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

export default function Brands() {
  const navigate = useNavigate()
  const [brands, setBrands]       = useState([])
  const [pageTitle, setPageTitle] = useState('All Brands')
  const [breadcrumb, setBreadcrumb] = useState('All Brands')
  const [placeholder, setPlaceholder] = useState(PH)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/brands/active`)
        const json = await res.json()
        if (!json.success) throw new Error(json.message || 'Failed to load brands')
        setBrands(json.data.brands || [])
        setPageTitle(json.data.pageTitle || 'All Brands')
        setBreadcrumb(json.data.breadcrumbLabel || 'All Brands')
        setPlaceholder(json.data.placeholderImage || PH)
      } catch (err) {
        console.error(err)
        setError('Failed to load brands')
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="py-6">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[#292933]">All Brands</h1>
            <Breadcrumb items={[{ label: 'All Brands' }]} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-full aspect-square border border-[#f3f4f6] rounded bg-[#f3f4f6] animate-pulse" />
                <div className="mt-1.5 h-3 w-16 bg-[#f3f4f6] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-6">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[#292933]">All Brands</h1>
            <Breadcrumb items={[{ label: 'All Brands' }]} />
          </div>
          <div className="text-center py-20 text-[#9ca3af]">{error}</div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#292933]">{pageTitle}</h1>
          <Breadcrumb items={[{ label: breadcrumb }]} />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {brands.map((brand, i) => (
            <div
              key={brand._id || i}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
            >
              <div className="w-full aspect-square border border-[#e5e7eb] rounded flex items-center justify-center bg-white hover:border-[#0080FF]/40 hover:shadow-md transition-all p-3">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                  onError={e => { e.target.src = placeholder }}
                />
              </div>
              <p className="text-[12px] text-center text-[#4b5563] mt-1.5 group-hover:text-[#0080FF] transition-colors font-medium leading-tight">
                {brand.name}
              </p>
            </div>
          ))}
        </div>

        {!brands.length && (
          <div className="text-center py-20 text-[#9ca3af]">No brands found</div>
        )}
      </Container>
    </div>
  )
}