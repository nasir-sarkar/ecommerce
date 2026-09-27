import { useState, useEffect } from 'react'
import Card from '../components/Card'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
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

// Star rating display
function Stars({ value = 0, max = 5 }) {
  return (
    <span className="inline-flex items-center gap-[1px]">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.round(value) ? '#ffc700' : '#e5e7eb'}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </span>
  )
}

// Custom Followers Edit Modal
function EditCustomFollowerModal({ seller, onClose, onSave }) {
  const [value, setValue] = useState(String(seller.customFollowers || 0))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res  = await fetch(`${API}/sellers/${seller._id}/custom-followers`, {
        method:  'PATCH',
        headers: getAuthHeader(),
        body:    JSON.stringify({ customFollowers: Number(value) }),
      })
      const data = await res.json()
      if (data.success) onSave(seller._id, Number(value))
    } catch (err) { console.error(err) }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_rgba(35,39,52,0.18)] w-[340px] p-[24px]">
        <h3 className="text-[15px] font-semibold text-[#232734] mb-[16px]">Edit Custom Followers</h3>
        <p className="text-[13px] text-[#9da3ae] mb-[12px]">{seller.shopName}</p>
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full h-[38px] px-[14px] border border-[#f1f1f4] rounded-[6px] text-[13px] text-[#232734] focus:outline-none mb-[16px]"
        />
        <div className="flex gap-[10px] justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-[34px] px-[16px] rounded-[4px] border border-[#f1f1f4] text-[13px] text-[#232734] hover:bg-[#fafafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-[34px] px-[16px] rounded-[4px] bg-[#009ef7] hover:bg-[#0091e5] text-white text-[13px] font-medium disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Single seller row
function SellerRow({ index, seller, onEditCustomFollower }) {
  const { letter, bg } = avatarProps(seller.shopName)

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">{index}</td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] flex items-center justify-center text-white text-[18px] font-semibold flex-shrink-0"
               style={{ backgroundColor: bg }}>
            {letter}
          </div>
          <a href="#" className="text-[13px] leading-[18px] text-[#009ef7] hover:underline">
            {seller.shopName}
          </a>
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="text-[13px] leading-[18px] text-[#232734]">{seller.phone}</div>
        <div className="text-[13px] leading-[18px] text-[#232734]">{seller.email}</div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-[6px]">
          <span className="text-[13px] text-[#232734]">{seller.avgRating > 0 ? seller.avgRating : 0}</span>
          <Stars value={seller.avgRating} />
        </div>
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">{seller.followers}</td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">{seller.customFollowers}</td>
      <td className="px-[16px] py-[14px] align-middle">
        <button
          type="button"
          onClick={() => onEditCustomFollower(seller)}
          className="inline-flex items-center justify-center h-[28px] px-[12px] rounded-[4px] bg-[#009ef7] hover:bg-[#0091e5] text-white text-[10px] font-bold uppercase tracking-wide"
        >
          Edit Custom Follower
        </button>
      </td>
    </tr>
  )
}

// Page
export default function SellerRating_Admin() {
  const [sellers,  setSellers]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [editing,  setEditing]  = useState(null)   // seller being edited

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/sellers/ratings`, { headers: getAuthHeader() })
        const data = await res.json()
        if (data.success) setSellers(data.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchRatings()
  }, [])

  const handleSaveCustomFollower = (id, value) => {
    setSellers(prev => prev.map(s => s._id === id ? { ...s, customFollowers: value } : s))
    setEditing(null)
  }

  const filtered = sellers.filter(s => {
    const q = search.toLowerCase()
    return (
      (s.shopName || '').toLowerCase().includes(q) ||
      (s.email    || '').toLowerCase().includes(q) ||
      (s.phone    || '').toLowerCase().includes(q)
    )
  })

  const handleSearchKey = (e) => { if (e.key === 'Enter') {} }

  return (
    <>
      {/* Page header */}
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">Sellers Review &amp; Followers</h1>

      <Card>
        {/* Card header / toolbar */}
        <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-[10px] items-center border-b border-[#f1f1f4]">
          <h2 className="text-[14px] leading-[20px] font-semibold text-[#232734] m-0 flex-shrink-0 mr-auto">Sellers Review &amp; Followers</h2>

          {/* Search */}
          <div className="w-[300px]">
            <input
              type="text"
              placeholder="Type name or email or mobile number & Enter"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="w-full h-[38px] px-[14px] bg-white border border-[#f1f1f4] rounded-[6px] text-[13px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">#</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Name</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Contact</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Rating</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Followers</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Custom Followers</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Options</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">No sellers found.</td>
                </tr>
              ) : filtered.map((s, i) => (
                <SellerRow
                  key={s._id}
                  index={i + 1}
                  seller={s}
                  onEditCustomFollower={setEditing}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editing && (
        <EditCustomFollowerModal
          seller={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveCustomFollower}
        />
      )}
    </>
  )
}