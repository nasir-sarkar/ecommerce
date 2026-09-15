import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png';

const encodeCategoryName = (name) => encodeURIComponent(name)

export default function Categories() {
  const [categorySections, setCategorySections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_URL}/categories`)
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setCategorySections(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="py-5 mb-5 pb-3">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#292933]">All categories</h1>
            <Breadcrumb items={[{ label: 'All categories' }]} />
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-none border border-[#e5e7eb] animate-pulse">
                <div className="p-4 flex items-center border-b border-[#f3f4f6]">
                  <div className="w-[60px] h-[60px] bg-[#e5e7eb] mr-3 flex-shrink-0 rounded" />
                  <div className="h-5 bg-[#e5e7eb] rounded w-48" />
                </div>
                <div className="px-4 py-3 flex gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex-1 space-y-2">
                      <div className="h-3 bg-[#f3f4f6] rounded w-3/4" />
                      <div className="h-3 bg-[#f3f4f6] rounded w-1/2" />
                      <div className="h-3 bg-[#f3f4f6] rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-5 mb-5 pb-3">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-[#292933]">All categories</h1>
            <Breadcrumb items={[{ label: 'All categories' }]} />
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-6 text-center">
            <p className="text-red-600 font-medium mb-1">Failed to load categories</p>
            <p className="text-red-400 text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0080FF] text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-5 mb-5 pb-3">
      <Container>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-[#292933]">All categories</h1>
          <Breadcrumb items={[{ label: 'All categories' }]} />
        </div>

        <div className="space-y-4">
          {categorySections.map((section) => (
            <div key={section._id} className="bg-white rounded-none border border-[#e5e7eb]">
              {/* Category Header */}
              <Link
                to={`/category/${encodeCategoryName(section.name)}`}
                className="p-4 flex items-center text-[#292933] hover:text-[#0080FF] transition-colors border-b border-[#f3f4f6]"
              >
                <div className="w-[60px] h-[60px] overflow-hidden p-1 border border-[#e5e7eb] mr-3 flex-shrink-0">
                  <img
                    src={section.img || PH}
                    alt={section.name}
                    className="w-full h-full object-contain"
                    onError={e => { e.target.src = PH }}
                  />
                </div>
                <span className="text-[16px] md:text-[20px] font-bold hover:text-[#0080FF]">
                  {section.name}
                </span>
              </Link>

              {/* Sub-categories grid */}
              {section.cols && section.cols.length > 0 ? (
                <div className="px-4 py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4">
                    {section.cols.map((col, ci) => (
                      <div key={ci} className="text-left mb-3">
                        {col.title && (
                          <h6 className="mb-3">
                            <Link
                              to={`/category/${encodeCategoryName(col.title)}`}
                              className="text-[#292933] font-bold text-[14px] hover:text-[#0080FF] transition-colors"
                            >
                              {col.title}
                            </Link>
                          </h6>
                        )}
                        <ul className="list-none p-0 m-0">
                          {col.items.map((item, ii) => (
                            <li key={ii} className="text-[#292933] mb-2">
                              <Link
                                to={`/category/${encodeCategoryName(item)}`}
                                className="text-[#292933] font-normal text-[14px] hover:text-[#0080FF] transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3">
                  <p className="text-[13px] text-[#9ca3af]">No subcategories</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}