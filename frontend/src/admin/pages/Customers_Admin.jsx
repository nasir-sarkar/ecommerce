import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Pagination from '../components/Pagination'

const API = import.meta.env.VITE_API_URL

// Icons
const IconSearchGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const IconPlusWhite = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <path d="M6 0v12M0 6h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconCaret = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#19c553" strokeWidth="1.6" />
    <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#19c553" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const IconWarning = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#ffc700" strokeWidth="1.6" />
    <path d="M12 7v6" stroke="#ffc700" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1" fill="#ffc700" />
  </svg>
)

const IconBanned = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block mr-1">
    <circle cx="12" cy="12" r="10" stroke="#f1416c" strokeWidth="1.6" />
    <path d="M12 7v6" stroke="#f1416c" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1" fill="#f1416c" />
  </svg>
)

const IconKebab = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#9da3ae">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

// Add New Customer button
function AddNewCustomerButton() {
  return (
    <NavLink to="/admin/customers/create"
      className="relative inline-flex items-center pl-[16px] pr-[44px] h-[34px] rounded-full text-[#009ef7] text-[13px] font-semibold hover:opacity-90 group">
      <span className="relative z-10">Add New Customer</span>
      <span className="absolute top-0 right-0 h-full w-[34px] rounded-full bg-[#009ef7] flex items-center justify-center">
        <IconPlusWhite />
      </span>
    </NavLink>
  )
}

// Helpers
function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}


function resolveVerified(user) {
  if (!user.verificationStatus) return 'verified'
  return user.verificationStatus
}

// Single customer row
function CustomerRow({ customer, checked, onCheck, onUpdate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef   = useRef(null)
  const navigate  = useNavigate()
  const isBanned  = customer.isBanned
  const verStatus = resolveVerified(customer)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const nameClass = isBanned ? 'text-[#f1416c]' : 'text-[#232734]'

  const handleBan = async () => {
    setMenuOpen(false)
    try {
      const res  = await fetch(`${API}/manage/users/${customer._id}/ban`, {
        method: 'PATCH', headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) onUpdate(data.data)
    } catch (err) { console.error(err) }
  }

  const handleVerification = async (status) => {
    setMenuOpen(false)
    try {
      const res  = await fetch(`${API}/manage/users/${customer._id}/verification`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.success) onUpdate(data.data)
    } catch (err) { console.error(err) }
  }

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
      <td className="px-[16px] py-[14px] align-middle w-[40px]">
        <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <span className={`text-[13px] font-bold flex items-center ${nameClass}`}>
          {isBanned && <IconBanned />}
          {customer.fullName}
        </span>
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle break-all max-w-[220px]">
        {customer.email}
      </td>
      <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
        {customer.phone}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        {verStatus === 'verified' ? (
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#19c553]">
            <IconCheck /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#ffc700]">
            <IconWarning /> Unverified
          </span>
        )}
      </td>
      <td className="px-[16px] py-[14px] text-right align-middle relative" ref={menuRef}>
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] flex items-center justify-center ml-auto">
          <IconKebab />
        </button>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[160px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 text-left">
            <button type="button" onClick={() => { setMenuOpen(false); navigate(`/admin/customers/edit/${customer._id}`) }}
              className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">Edit</button>
            <button type="button" onClick={handleBan}
              className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">
              {isBanned ? 'Unban Customer' : 'Ban Customer'}
            </button>
            {verStatus !== 'verified' && (
              <button type="button" onClick={() => handleVerification('verified')}
                className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">
                Make Verified
              </button>
            )}
            {verStatus !== 'unverified' && (
              <button type="button" onClick={() => handleVerification('unverified')}
                className="block w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">
                Make Unverified
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}

// Page
const TABS     = ['All Customers', 'Banned', 'Verified', 'Unverified']
const PER_PAGE = 15

export default function Customers_Admin() {
  const [activeTab, setActiveTab]   = useState(TABS[0])
  const [page, setPage]             = useState(1)
  const [bulkOpen, setBulkOpen]     = useState(false)
  const [allChecked, setAllChecked] = useState(false)
  const [checks, setChecks]         = useState({})
  const [customers, setCustomers]   = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)

  // Fetch all users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/manage/users`, { headers: getAuthHeader() })
        const data = await res.json()
        if (data.success) setCustomers(data.data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  // Update a single row in state after a PATCH
  const handleUpdate = (updated) => {
    setCustomers((prev) => prev.map((c) => c._id === updated._id ? updated : c))
  }

  // Tab filter
  const tabFiltered = customers.filter((c) => {
    const vs = resolveVerified(c)
    if (activeTab === 'Banned')     return c.isBanned
    if (activeTab === 'Verified')   return !c.isBanned && vs === 'verified'
    if (activeTab === 'Unverified') return !c.isBanned && vs === 'unverified'
    return true
  })

  // Search filter
  const searchFiltered = tabFiltered.filter((c) => {
    const q = search.toLowerCase()
    return (
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.email    || '').toLowerCase().includes(q) ||
      (c.phone    || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.max(1, Math.ceil(searchFiltered.length / PER_PAGE))
  const paginated  = searchFiltered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const toggleAll = (v) => {
    setAllChecked(v)
    const next = {}
    paginated.forEach((c) => { next[c._id] = v })
    setChecks(next)
  }

  // Reset page when tab or search changes
  useEffect(() => {
    setPage(1)
    setAllChecked(false)
    setChecks({})
  }, [activeTab, search])

  return (
    <>
      {/* Page header */}
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[8px]">All Customers</h1>

      {/* Helper notes */}
      <p className="text-[13px] leading-[20px] text-[#232734] mb-[16px]">
        <span className="inline-block w-[10px] h-[10px] rounded-[3px] bg-[#f1416c] mr-2 align-middle"></span>
        This color indicates that the customer is marked as blocked.
      </p>

      <Card>
        {/* Tabs row + Add New */}
        <div className="flex items-center justify-between border-b border-[#f1f1f4] px-[20px] flex-wrap gap-2">
          <div className="flex items-center">
            {TABS.map((t) => (
              <button key={t} type="button" onClick={() => setActiveTab(t)}
                className={`px-0 mr-[28px] pt-[16px] pb-[14px] text-[14px] font-medium transition-colors border-b-[2px] ${
                  activeTab === t
                    ? 'text-[#009ef7] border-[#009ef7]'
                    : 'text-[#232734] border-transparent hover:text-[#009ef7]'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <AddNewCustomerButton />
        </div>

        {/* Toolbar: Search + Bulk Action */}
        <div className="px-[20px] pt-[16px] pb-[16px] flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[280px] flex items-center bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] px-[12px] h-[38px]">
            <span className="mr-2"><IconSearchGray /></span>
            <input type="text" placeholder="Search Customers ..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] leading-[18px] text-[#232734] placeholder:text-[#9da3ae] focus:outline-none" />
          </div>

          <div className="relative">
            <button type="button" onClick={() => setBulkOpen((o) => !o)}
              className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[6px] h-[38px] px-[14px] flex items-center gap-2 text-[13px] text-[#9da3ae] hover:text-[#232734]">
              Bulk Action <IconCaret />
            </button>
            {bulkOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-[160px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                <a href="#" className="block px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</a>
              </div>
            )}
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
                <th className="px-[16px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">Name</th>
                <th className="px-[16px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">Email Address</th>
                <th className="px-[16px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">Phone</th>
                <th className="px-[16px] py-[12px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">Verification Status</th>
                <th className="px-[16px] py-[12px] text-right text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">Options</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">Loading...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[24px] text-center text-[13px] text-[#9da3ae]">No customers found.</td>
                </tr>
              ) : paginated.map((c) => (
                <CustomerRow key={c._id} customer={c}
                  checked={!!checks[c._id]}
                  onCheck={(v) => setChecks((prev) => ({ ...prev, [c._id]: v }))}
                  onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination current={page} total={totalPages} onChange={setPage} />
      </Card>
    </>
  )
}