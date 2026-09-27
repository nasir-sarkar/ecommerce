import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Stars({ value = 0, max = 5 }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
          fill={i < Math.round(value) ? '#ffc700' : '#e5e7eb'}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </span>
  )
}

const AVATAR_COLORS = [
  '#c4c885', '#d199c8', '#8fb1c9', '#8fc8c9',
  '#d8c89d', '#a5c096', '#d6a3c4', '#c9a08f',
  '#a08fc9', '#8fc9a0',
]
function avatarProps(shopName) {
  const name = shopName || '?'
  const idx  = name.charCodeAt(0) % AVATAR_COLORS.length
  return { letter: name.charAt(0).toUpperCase(), bg: AVATAR_COLORS[idx] }
}

export default function SellerRating_Seller() {
  const [seller,  setSeller]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // Decode JWT payload without a library (standard base64url)
  function decodeToken(token) {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      return JSON.parse(atob(base64))
    } catch {
      return null
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('ec_token')
    setLoading(true)
    setError('')

    // Identify the current seller from the JWT payload
    const payload = decodeToken(token)
    const myId       = payload?.id
    const myEmail    = payload?.email

    fetch(`${API_URL}/sellers/ratings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then((ratingData) => {
        if (!ratingData.success) { setError(ratingData.message || 'Failed to load data'); return }

        // Match by _id first, fall back to email
        const found = (ratingData.data || []).find(
          s => (myId && s._id === myId) || (myEmail && s.email === myEmail)
        )
        setSeller(found || null)
        if (!found) setError('Seller profile not found.')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div>
      <div className="text-left pb-[5px]">
        <h1 className="text-[20px] font-bold text-[#2E294E]">Rating &amp; Followers</h1>
      </div>
      <div className="bg-white rounded-[6px] mt-3 px-5 py-10 text-center text-[14px] text-[#a1a5b3]">Loading…</div>
    </div>
  )

  if (error) return (
    <div>
      <div className="text-left pb-[5px]">
        <h1 className="text-[20px] font-bold text-[#2E294E]">Rating &amp; Followers</h1>
      </div>
      <div className="bg-white rounded-[6px] mt-3 px-5 py-10 text-center text-[14px] text-[#dc3545]">{error}</div>
    </div>
  )

  if (!seller) return null

  const { letter, bg } = avatarProps(seller.shopName)
  const totalFollowers = (seller.followers || 0) + (seller.customFollowers || 0)

  return (
    <div>
      {/* Title */}
      <div className="text-left pb-[5px]">
        <div className="flex items-center">
          <div className="flex-1">
            <h1 className="text-[20px] font-bold text-[#2E294E]">Rating &amp; Followers</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[6px] mt-3">
        {/* Card header */}
        <div className="px-5 py-4 border-b border-[#f1f1f4]">
          <h2 className="text-[14px] font-semibold text-[#2E294E] m-0">My Reviews &amp; Followers</h2>
        </div>

        {/* Seller profile card */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[56px] h-[56px] flex items-center justify-center text-white text-[24px] font-semibold flex-shrink-0 rounded-[4px]"
              style={{ backgroundColor: bg }}>
              {letter}
            </div>
            <div>
              <div className="text-[16px] font-semibold text-[#2E294E]">{seller.shopName}</div>
              <div className="text-[13px] text-[#a1a5b3]">{seller.email}</div>
              {seller.phone && <div className="text-[13px] text-[#a1a5b3]">{seller.phone}</div>}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Rating */}
            <div className="bg-[#f5f5f7] rounded-[6px] p-4 text-center">
              <div className="text-[28px] font-bold text-[#2E294E] leading-none mb-1">
                {seller.avgRating > 0 ? seller.avgRating : '0'}
              </div>
              <div className="flex justify-center mb-1">
                <Stars value={seller.avgRating} />
              </div>
              <div className="text-[12px] text-[#a1a5b3] font-medium uppercase tracking-wide">Avg Rating</div>
            </div>

            {/* Total Reviews */}
            <div className="bg-[#f5f5f7] rounded-[6px] p-4 text-center">
              <div className="text-[28px] font-bold text-[#2E294E] leading-none mb-2">
                {seller.totalReviews || 0}
              </div>
              <div className="text-[12px] text-[#a1a5b3] font-medium uppercase tracking-wide">Total Reviews</div>
            </div>

            {/* Real Followers */}
            <div className="bg-[#f5f5f7] rounded-[6px] p-4 text-center">
              <div className="text-[28px] font-bold text-[#2E294E] leading-none mb-2">
                {seller.followers || 0}
              </div>
              <div className="text-[12px] text-[#a1a5b3] font-medium uppercase tracking-wide">Followers</div>
            </div>

            {/* Total Followers */}
            <div className="bg-[#2E294E] rounded-[6px] p-4 text-center">
              <div className="text-[28px] font-bold text-white leading-none mb-2">
                {totalFollowers}
              </div>
              <div className="text-[12px] text-white font-medium uppercase tracking-wide opacity-80">Total Followers</div>
            </div>
          </div>

          {/* Details table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#a1a5b3] text-[12px] font-semibold uppercase border-b border-[#f1f1f4]">
                  <th className="text-left py-3">Shop Name</th>
                  <th className="text-left py-3">Contact</th>
                  <th className="text-left py-3">Rating</th>
                  <th className="text-left py-3">Reviews</th>
                  <th className="text-left py-3">Followers</th>
                  <th className="text-left py-3">Custom Followers</th>
                  <th className="text-left py-3">Total Followers</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#f1f1f4]">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[36px] h-[36px] flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0 rounded-[4px]"
                        style={{ backgroundColor: bg }}>
                        {letter}
                      </div>
                      <span className="text-[14px] font-semibold text-[#2E294E]">{seller.shopName}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-[13px] text-[#2E294E]">{seller.phone || '—'}</div>
                    <div className="text-[13px] text-[#2E294E]">{seller.email}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-[#2E294E]">{seller.avgRating > 0 ? seller.avgRating : 0}</span>
                      <Stars value={seller.avgRating} />
                    </div>
                  </td>
                  <td className="py-4 text-[14px] text-[#2E294E]">{seller.totalReviews || 0}</td>
                  <td className="py-4 text-[14px] text-[#2E294E]">{seller.followers || 0}</td>
                  <td className="py-4 text-[14px] text-[#2E294E]">{seller.customFollowers || 0}</td>
                  <td className="py-4">
                    <span className="inline-block bg-[#2E294E] text-white text-[12px] font-semibold px-3 py-[3px] rounded-[3px]">
                      {totalFollowers}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}