import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Pagination from '../components/Pagination'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons
const SadFaceIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
)

// Helpers
function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PER_PAGE = 15

// Single row
function SellerRow({ index, seller, onDelete, onApprove }) {
  const [approved, setApproved] = useState(false)

  const handleApprove = async () => {
    const newVal = !approved
    try {
      const res  = await fetch(`${API}/manage/sellers/${seller._id}/approve`, {
        method: 'PATCH', headers: getAuthHeader(),
        body: JSON.stringify({ isVerified: newVal }),
      })
      const data = await res.json()
      if (data.success) {
        setApproved(newVal)
        if (newVal) onApprove(seller._id)
      }
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete seller "${seller.shopName || seller.fullName}"?`)) return
    try {
      const res  = await fetch(`${API}/manage/sellers/${seller._id}`, {
        method: 'DELETE', headers: getAuthHeader(),
      })
      const data = await res.json()
      if (data.success) onDelete(seller._id)
    } catch (err) { console.error(err) }
  }

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
        {index}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="text-[13px] font-medium text-[#232734]">{seller.fullName}</div>
        <div className="text-[12px] text-[#9da3ae]">{seller.shopName}</div>
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
        {seller.phone || '—'}
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle break-all">
        {seller.email || '—'}
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
        {formatDate(seller.createdAt)}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        {approved
          ? <Badge variant="success">Approved</Badge>
          : <Badge variant="warning">Pending</Badge>
        }
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <button
          type="button"
          onClick={handleApprove}
          className="h-[30px] px-[14px] rounded-[4px] bg-[#009ef7] hover:bg-[#0095e8] text-white text-[12px] font-medium"
        >
          {approved ? 'Revoke' : 'Approve'}
        </button>
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <button
          type="button"
          onClick={handleDelete}
          className="h-[30px] px-[14px] rounded-[4px] bg-[#f1416c] hover:bg-[#d9365e] text-white text-[12px] font-medium"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}

// Page
export default function AppliedSeller_Admin() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/manage/sellers?verified=false`, { headers: getAuthHeader() })
        const data = await res.json()
        if (data.success) setSellers(data.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchSellers()
  }, [])

  const handleDelete = (id) => {
    setSellers((prev) => prev.filter((s) => s._id !== id))
  }

  const handleApprove = (id) => {
    
    setSellers((prev) => prev.filter((s) => s._id !== id))
  }

  const filtered = sellers.filter((s) => {
    const q = search.toLowerCase()
    return (
      (s.fullName || '').toLowerCase().includes(q) ||
      (s.shopName || '').toLowerCase().includes(q) ||
      (s.email    || '').toLowerCase().includes(q) ||
      (s.phone    || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  useEffect(() => { setPage(1) }, [search])

  const handleSearchKey = (e) => { if (e.key === 'Enter') setPage(1) }

  return (
    <>
      {/* Page header */}
      <h1 className="text-[20px] leading-[28px] font-bold text-[#d97706] mb-[16px]">Pending Sellers</h1>

      <Card>
        {/* Card header / toolbar */}
        <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-[10px] items-center border-b border-[#f1f1f4]">
          <h2 className="text-[14px] leading-[20px] font-semibold text-[#232734] m-0 flex-shrink-0 mr-auto">Pending Seller List</h2>

          {/* Search */}
          <div className="w-[300px]">
            <input
              type="text"
              placeholder="Type name or email or mobile number & Enter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Phone</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Email</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Registration Date</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Status</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Action</th>
                <th className="px-[16px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">Loading...</td>
                </tr>
              ) : paginated.length > 0 ? (
                paginated.map((s, i) => (
                  <SellerRow
                    key={s._id}
                    index={(page - 1) * PER_PAGE + i + 1}
                    seller={s}
                    onDelete={handleDelete}
                    onApprove={handleApprove}
                  />
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[60px]">
            <SadFaceIcon />
            <p className="text-[14px] text-[#9da3ae] mt-[12px] m-0">Nothing found</p>
          </div>
        )}

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </Card>
    </>
  )
}