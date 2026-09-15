import { useState, useEffect } from 'react'
import Container from '../components/common/Container'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function SupportPolicy() {
  const [sections, setSections] = useState([])
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/policy/support`)
      .then(r => r.json())
      .then(data => {
        setSections(Array.isArray(data.sections) ? data.sections : [])
        setUpdatedAt(data.updatedAt || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (iso) => {
    if (!iso) return 'N/A'
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="bg-[#f5f6fa] min-h-screen py-8">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-[12px] text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#0080FF]">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700">Support Policy</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h1 className="text-[24px] font-bold text-[#292933] mb-6">Support Policy</h1>

          {loading ? (
            <div className="space-y-6 text-[14px] text-gray-700 leading-relaxed animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 text-[14px] text-gray-700 leading-relaxed">
              {sections.map((sec, i) => (
                <section key={i}>
                  {sec.title && (
                    <h2 className="text-[18px] font-semibold text-[#292933] mb-3">{sec.title}</h2>
                  )}
                  {sec.description && (
                    <p style={{ whiteSpace: 'pre-line' }}>{sec.description}</p>
                  )}
                </section>
              ))}

              <div className="text-[12px] text-gray-400 pt-4 border-t border-gray-200">
                <p>Last Updated: {formatDate(updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}