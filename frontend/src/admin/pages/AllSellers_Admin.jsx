import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Switch from '../components/Switch'
import Badge from '../components/Badge'
import Pagination from '../components/Pagination'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons 
const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const KebabIcon = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#009ef7">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

// Helpers
function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

const AVATAR_COLORS = [
  '#c4c885', '#d199c8', '#8fb1c9', '#8fc8c9',
  '#d8c89d', '#a5c096', '#d6a3c4', '#c9a08f',
  '#a08fc9', '#8fc9a0',
]
function avatarProps(seller) {
  const name = seller.shopName || seller.fullName || '?'
  const idx  = name.charCodeAt(0) % AVATAR_COLORS.length
  return { letter: name.charAt(0).toUpperCase(), bg: AVATAR_COLORS[idx] }
}

const PER_PAGE = 15

// Single seller row
function SellerRow({ seller, checked, onCheck, onDelete, onToggle, productCountMap }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { letter, bg } = avatarProps(seller)
  const approved = seller.isVerified

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleToggle = async (val) => {
    try {
      const res  = await fetch(`${API}/manage/sellers/${seller._id}/approve`, {
        method: 'PATCH', headers: getAuthHeader(),
        body: JSON.stringify({ isVerified: val }),
      })
      const data = await res.json()
      if (data.success) onToggle(seller._id, val)
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    setMenuOpen(false)
    if (!window.confirm(`Delete seller "${seller.shopName || seller.fullName}"?`)) return
    try {
      const res  = await fetch(`${API}/manage/sellers/${seller._id}`, {
        method: 'DELETE', headers: getAuthHeader(),
      })
      const data = await res.json()
      if (data.success) onDelete(seller._id)
    } catch (err) { console.error(err) }
  }

  const productCount = productCountMap[seller.shopName] || productCountMap[seller.fullName] || 0

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
      <td className="px-[16px] py-[14px] align-middle w-[40px]">
        <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] flex items-center justify-center text-white text-[18px] font-semibold flex-shrink-0"
               style={{ backgroundColor: bg }}>
            {letter}
          </div>
          <a href="#" className="text-[13px] leading-[18px] text-[#009ef7] hover:underline">
            {seller.shopName || seller.fullName}
          </a>
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="text-[13px] leading-[18px] text-[#232734]">{seller.phone}</div>
        <div className="text-[13px] leading-[18px] text-[#232734]">{seller.email}</div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <Badge variant="success">Regular</Badge>
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
        {productCount}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <Badge variant="success">Verified</Badge>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex flex-col items-start gap-[4px]">
          {approved ? (
            <>
              <Badge variant="success">Verified</Badge>
              <Badge variant="secondary">By Admin</Badge>
            </>
          ) : (
            <Badge variant="danger">Unverified</Badge>
          )}
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <Switch checked={approved} onChange={handleToggle} color="success" />
      </td>
      <td className="px-[16px] py-[14px] align-middle relative" ref={menuRef}>
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="w-[28px] h-[28px] rounded-full bg-[#f1fafd] hover:bg-[#e3f4fc] flex items-center justify-center">
          <KebabIcon />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 text-left">
            <button type="button"
              onClick={() => { setMenuOpen(false); navigate(`/admin/sellers/edit/${seller._id}`) }}
              className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">
              Edit
            </button>
            <button type="button" onClick={handleDelete}
              className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  )
}

// Page 
const VERIFY_OPTIONS  = ['All', 'Verified', 'Unverified']
const APPROVE_OPTIONS = ['All', 'Approved', 'Non-Approved']

export default function AllSellers_Admin() {
  const navigate = useNavigate()
  const [sellers, setSellers]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [verifyFilter, setVerifyFilter]   = useState('All')
  const [approveFilter, setApproveFilter] = useState('All')
  const [page, setPage]             = useState(1)
  const [bulkOpen, setBulkOpen]     = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [allChecked, setAllChecked] = useState(false)
  const [checks, setChecks]         = useState({})
  const [productCountMap, setProductCountMap] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [sellersRes, productsRes] = await Promise.all([
          fetch(`${API}/manage/sellers?verified=true`, { headers: getAuthHeader() }),
          fetch(`${API}/products?limit=9999`, { headers: getAuthHeader() }),
        ])
        const sellersData  = await sellersRes.json()
        const productsData = await productsRes.json()

        if (sellersData.success) setSellers(sellersData.data)

        
        const countMap = {}
        const products = productsData.data || productsData.products || []
        products.forEach((p) => {
          if (p.seller) {
            countMap[p.seller] = (countMap[p.seller] || 0) + 1
          }
        })
        setProductCountMap(countMap)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleDelete = (id) => {
    setSellers((prev) => prev.filter((s) => s._id !== id))
  }

  const handleToggle = (id, val) => {
    
    if (!val) {
      setSellers((prev) => prev.filter((s) => s._id !== id))
    } else {
      setSellers((prev) => prev.map((s) => s._id === id ? { ...s, isVerified: val } : s))
    }
  }

  const filtered = sellers.filter((s) => {
    const q = search.toLowerCase()
    return (
      (s.shopName  || '').toLowerCase().includes(q) ||
      (s.fullName  || '').toLowerCase().includes(q) ||
      (s.email     || '').toLowerCase().includes(q) ||
      (s.phone     || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleAll = (v) => {
    setAllChecked(v)
    const next = {}
    paginated.forEach((s) => { next[s._id] = v })
    setChecks(next)
  }

  useEffect(() => { setPage(1); setAllChecked(false); setChecks({}) }, [search, verifyFilter, approveFilter])

  const handleSearchKey = (e) => { if (e.key === 'Enter') setPage(1) }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-[16px] flex-wrap gap-2">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Sellers</h1>
        <button type="button"
          onClick={() => navigate('/admin/sellers/create')}
          className="inline-flex items-center justify-center h-[38px] px-[20px] rounded-full bg-[#8f60ee] text-white text-[13px] font-medium hover:bg-[#7d50dc]">
          Add New Seller
        </button>
      </div>

      <Card>
        {/* Card header / toolbar */}
        <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-[10px] items-center border-b border-[#f1f1f4]">
          <h2 className="text-[14px] leading-[20px] font-semibold text-[#232734] m-0 flex-shrink-0 mr-auto">Sellers</h2>

          {/* Bulk Action */}
          <div className="relative">
            <button type="button" onClick={() => setBulkOpen((o) => !o)}
              className="bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]">
              Bulk Action <CaretIcon />
            </button>
            {bulkOpen && (
              <div className="absolute left-0 top-full mt-1 z-30 w-[200px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Delete selection</a>
                <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Set Bulk Commission</a>
              </div>
            )}
          </div>

          {/* Filter by Verification Status */}
          <div className="relative w-[230px]">
            <button type="button" onClick={() => setVerifyOpen((o) => !o)}
              className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
              <span>{verifyFilter === 'All' ? 'Filter by Verification Status' : verifyFilter}</span><CaretIcon />
            </button>
            {verifyOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                {VERIFY_OPTIONS.map((o) => (
                  <button key={o} type="button"
                    onClick={() => { setVerifyFilter(o); setVerifyOpen(false) }}
                    className="block w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter by Approval */}
          <div className="relative w-[180px]">
            <button type="button" onClick={() => setApproveOpen((o) => !o)}
              className="w-full bg-white border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center justify-between text-[13px] text-[#9da3ae]">
              <span>{approveFilter === 'All' ? 'Filter by Approval' : approveFilter}</span><CaretIcon />
            </button>
            {approveOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                {APPROVE_OPTIONS.map((o) => (
                  <button key={o} type="button"
                    onClick={() => { setApproveFilter(o); setApproveOpen(false) }}
                    className="block w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="w-[300px]">
            <input type="text" placeholder="Type name or email or mobile number & Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="w-full h-[38px] px-[14px] bg-white border border-[#f1f1f4] rounded-[6px] text-[13px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="px-[16px] py-[12px] text-left w-[40px]">
                  <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
                </th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Name</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Contact</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Status</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Num. of Products</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Email Verification</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Seller verification</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Verification Approval</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Options</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">No sellers found.</td>
                </tr>
              ) : paginated.map((s) => (
                <SellerRow key={s._id} seller={s}
                  checked={!!checks[s._id]}
                  onCheck={(v) => setChecks((prev) => ({ ...prev, [s._id]: v }))}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  productCountMap={productCountMap} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </Card>
    </>
  )
}