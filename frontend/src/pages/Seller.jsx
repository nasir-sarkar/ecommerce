import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const SELLERS = [
  { id: 1, name: 'Fashion Store', initial: 'F', color: '#8B7FF8', verified: true },
  { id: 2, name: 'All for Men',   initial: 'A', color: '#4ECDC4', verified: true },
  { id: 3, name: 'Home Store',    initial: 'H', color: '#C8D89A', verified: true },
  { id: 4, name: 'Tech Store',    initial: 'T', color: '#7BC8F0', verified: true },
  { id: 5, name: 'Beauty Shop',   initial: 'B', color: '#E8A898', verified: true },
  { id: 6, name: 'Baby Shop',     initial: 'B', color: '#F4B8D1', verified: true },
  { id: 7, name: 'Toy Store',     initial: 'T', color: '#9BC49A', verified: true },
]

function StarRating({ rating, total }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-[#f3af3d]' : 'text-[#e5e7eb]'}`}
          viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-[12px] text-[#6b7280] ml-1">({total} reviews)</span>
    </div>
  )
}

function SellerCard({ seller, rating, reviewCount, loadingReview }) {
  const navigate = useNavigate()
  return (
    <div className="border border-[#e5e7eb] rounded-[6px] p-5 flex flex-col items-center bg-white hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="relative mb-3">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
          style={{ backgroundColor: seller.color }}
        >
          {seller.initial}
        </div>
        {seller.verified && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      <h3 className="text-[13px] font-semibold text-[#1f2937] text-center mb-2 leading-tight">
        {seller.name}
      </h3>

      {loadingReview ? (
        <div className="h-4 w-28 bg-[#f3f4f6] rounded animate-pulse" />
      ) : (
        <StarRating rating={rating} total={reviewCount} />
      )}

      <button
        onClick={() => navigate(`/seller/${encodeURIComponent(seller.name)}`)}
        className="mt-4 flex items-center gap-2 border border-[#e5e7eb] rounded px-4 py-1.5 text-[13px] text-[#374151] hover:border-primary hover:text-primary transition-colors w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
        VISIT STORE
      </button>
    </div>
  )
}

export default function Seller() {
  const [reviewData, setReviewData] = useState({})
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          SELLERS.map(s =>
            fetch(`${API_URL}/reviews/${encodeURIComponent(s.name)}`)
              .then(r => r.json())
              .then(data => ({ name: s.name, avgRating: data.avgRating || 0, total: data.total || 0 }))
              .catch(() => ({ name: s.name, avgRating: 0, total: 0 }))
          )
        )
        const map = {}
        results.forEach(r => { map[r.name] = { avgRating: r.avgRating, total: r.total } })
        setReviewData(map)
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#1f2937]">All Sellers</h1>
          <Breadcrumb items={[{ label: 'All Sellers' }]} />
        </div>

        <div className="border border-[#e5e7eb] rounded-[6px] p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {SELLERS.map(seller => {
              const data = reviewData[seller.name] || { avgRating: 0, total: 0 }
              return (
                <SellerCard
                  key={seller.id}
                  seller={seller}
                  rating={data.avgRating}
                  reviewCount={data.total}
                  loadingReview={loading}
                />
              )
            })}
          </div>
        </div>
      </Container>
    </div>
  )
}