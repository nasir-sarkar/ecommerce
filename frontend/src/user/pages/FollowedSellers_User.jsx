import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


function getFollowerId() {
  let id = localStorage.getItem('ec_follower_id')
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + Date.now()
    localStorage.setItem('ec_follower_id', id)
  }
  return id
}

// Derive initials + avatar colour from shopName
const SELLER_META = {
  'Fashion Store': { initial: 'F', color: '#8B7FF8' },
  'All for Men':   { initial: 'A', color: '#4ECDC4' },
  'Home Store':    { initial: 'H', color: '#C8D89A' },
  'Tech Store':    { initial: 'T', color: '#7BC8F0' },
  'Beauty Shop':   { initial: 'B', color: '#E8A898' },
  'Baby Shop':     { initial: 'B', color: '#F4B8D1' },
  'Toy Store':     { initial: 'T', color: '#9BC49A' },
}
const FALLBACK_COLORS = ['#8B7FF8','#4ECDC4','#7BC8F0','#E8A898','#9BC49A','#f3af3d','#0080FF']

function getSellerMeta(shopName = '') {
  if (SELLER_META[shopName]) return SELLER_META[shopName]
  const color = FALLBACK_COLORS[shopName.charCodeAt(0) % FALLBACK_COLORS.length]
  return { initial: shopName.charAt(0).toUpperCase() || '?', color }
}

// Main Export

export default function FollowedSellers_User() {
  const navigate = useNavigate()

  const [sellers,  setSellers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [unfollowingId, setUnfollowingId] = useState(null) 


  useEffect(() => {
    const followerId = getFollowerId()
    fetch(`${API_URL}/sellers/followed-by/${encodeURIComponent(followerId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setSellers(data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Unfollow a seller and remove from list
  const handleUnfollow = async (seller) => {
    setUnfollowingId(seller._id)
    try {
      const res  = await fetch(`${API_URL}/sellers/${seller._id}/follow`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ followerId: getFollowerId() }),
      })
      const data = await res.json()
      if (data.success && !data.following) {
        // Remove from local list immediately
        setSellers(prev => prev.filter(s => s._id !== seller._id))
      }
    } catch (err) {
      console.error('Unfollow failed:', err)
    } finally {
      setUnfollowingId(null)
    }
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-[20px] font-bold text-[#292933]">Followed Sellers</h1>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-wrap">
          <div className="flex-1 px-[15px]">
            <div
              className="bg-white p-[1.5rem] border border-[#dfdfe6]"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
            >
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      ) : sellers.length === 0 ? (
        <>
          <div className="flex flex-wrap">
            <div className="flex-1 px-[15px]">
              <div
                className="bg-white p-[1.5rem] border border-[#dfdfe6]"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  className="max-w-full"
                  style={{ height: '200px' }}
                  src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/nothing.svg"
                  alt="Image"
                />
                <h5 className="mb-0 mt-[1rem] text-[20px] font-medium">There isn&#039;t anything added yet</h5>
              </div>
            </div>
          </div>
          <div></div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap">
            {sellers.map((seller) => {
              const meta        = getSellerMeta(seller.shopName)
              const totalFollowers = (seller.followers || 0) + (seller.customFollowers || 0)

              return (
                <div key={seller._id} className="w-full md:w-1/4 px-[15px] mb-[1.5rem]">
                  {/* Seller card */}
                  <div className="bg-white border border-[#dfdfe6] p-[1.2rem] flex flex-col items-center text-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: meta.color }}
                      onClick={() => navigate(`/seller/${encodeURIComponent(seller.shopName)}`)}
                    >
                      {seller.avatar
                        ? <img src={seller.avatar} alt={seller.shopName} className="w-full h-full rounded-full object-cover" />
                        : meta.initial
                      }
                    </div>

                    {/* Info */}
                    <div>
                      <p
                        className="text-[14px] font-semibold text-[#292933] cursor-pointer hover:text-[#0080FF] transition-colors"
                        onClick={() => navigate(`/seller/${encodeURIComponent(seller.shopName)}`)}
                      >
                        {seller.shopName}
                      </p>
                      <p className="text-[12px] text-gray-400 mt-0.5">
                        {totalFollowers} follower{totalFollowers !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Unfollow button */}
                    <button
                      type="button"
                      disabled={unfollowingId === seller._id}
                      onClick={() => handleUnfollow(seller)}
                      className="h-[32px] px-[18px] rounded-full text-[12px] font-semibold bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all disabled:opacity-60"
                    >
                      {unfollowingId === seller._id ? '...' : 'Following'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div></div>
        </>
      )}
    </div>
  )
}