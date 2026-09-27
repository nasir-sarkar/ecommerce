import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const placeholderImage = '/src/images/placeholder.png'

function parseEndDate(str) {
  if (!str) return NaN
  return new Date(str.replace(/\//g, '-').replace(' ', 'T')).getTime()
}

function useCountdown(endDateStr, offset = 0) {
  const calcRemaining = () => {
    const now = Date.now() + offset
    const end = parseEndDate(endDateStr)
    const diff = Math.max(0, end - now)
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hrs:  Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    }
  }
  const [time, setTime] = useState(calcRemaining)
  useEffect(() => {
    const t = setInterval(() => setTime(calcRemaining()), 1000)
    return () => clearInterval(t)
  }, [endDateStr, offset])
  return time
}

function CountdownRow({ endDate, offset }) {
  const t = useCountdown(endDate, offset)
  const p = n => String(n).padStart(2, '0')
  return (
    <div className="flex gap-1">
      {[['days', t.days], ['hrs', t.hrs], ['mins', t.mins], ['secs', t.secs]].map(([label, val]) => (
        <div key={label} className="bg-white rounded shadow text-center px-2 py-1 min-w-[42px]">
          <div className="text-[14px] font-bold text-gray-800 leading-none">{p(val)}</div>
          <div className="text-[8px] text-gray-500 uppercase mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}

function FlashDealCard({ deal, offset }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/flash-sale/deal/${deal.id}`)
  }

  return (
    <div
      className="relative overflow-hidden rounded-none cursor-pointer group h-[400px] xl:h-[475px]"
      onClick={handleClick}
      title={`View ${deal.discountPercent > 0 ? deal.discountPercent + '% off' : ''} deals`}
    >
      <img
        src={deal.img}
        alt="Flash Deal"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={e => { e.target.src = placeholderImage }}
      />


      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />


      {/* Discount badge */}
      {deal.discountPercent > 0 && (
        <div className="absolute top-5 right-3 xl:right-5">
          <div className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-sm shadow-lg">
            -{deal.discountPercent}%
          </div>
        </div>
      )}


      {/* Countdown overlay — top left */}
      <div className="absolute top-5 left-0 right-0 px-3 xl:px-5">
        <div className="bg-white inline-block p-2">
          <CountdownRow endDate={deal.end} offset={offset} />
        </div>
      </div>


      {/* "Shop Now" hover label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Shop This Deal
        </p>
      </div>
    </div>
  )
}

export default function FlashSale() {
  const [flashData, setFlashData] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res  = await fetch(`${API_URL}/flash-sale`)
        const json = await res.json()
        setFlashData(json)
      } catch (err) {
        console.error('Failed to fetch flash sale data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchFlashSale()
  }, [])

  if (loading) return null

  const bannerImage = flashData?.bannerImage || '/src/images/fs-0.png'
  const flashDeals  = flashData?.deals       || []

  return (
    <div className="py-6">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-[#292933]">Flash deals</h1>
          <Breadcrumb items={[{ label: 'Flash deals' }]} />
        </div>

        {/* Hero banner */}
        <div className="rounded-[6px] overflow-hidden mb-5 relative h-[200px]">
          <img
            src={bannerImage}
            alt="Flash Sale Banner"
            className="w-full h-full object-cover"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentNode.style.background = 'linear-gradient(135deg,#FF9A00,#FF3CAC,#784BA0)'
              e.target.parentNode.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center"><div style="text-align:center;color:white"><p style="font-size:14px;opacity:.85;margin-bottom:4px">Exclusively on</p><h2 style="font-size:3.5rem;font-weight:900;letter-spacing:6px">FLASH SALE</h2><p style="opacity:.8">ACTIVE ECOMMERCE CMS</p></div></div>'
            }}
          />
        </div>


        {/* Deal cards */}
        {!flashDeals.length ? (
          <div className="text-center py-16 text-gray-400">No flash deals available right now.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {flashDeals.slice(0, 3).map((deal, i) => (
                <FlashDealCard key={deal.id} deal={deal} offset={i * 3600000} />
              ))}
            </div>
            {flashDeals.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {flashDeals.slice(3).map((deal, i) => (
                  <FlashDealCard key={deal.id} deal={deal} offset={(i + 3) * 3600000} />
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  )
}