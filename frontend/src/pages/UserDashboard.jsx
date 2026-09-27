import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH      = '/src/images/Placeholder.png'

const STATUS_BADGE = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100   text-blue-700',
  delivered: 'bg-green-100  text-green-700',
}

/* ── Star picker ── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width={24} height={24} viewBox="0 0 20 20" className="cursor-pointer"
          fill={(hovered || value) >= s ? '#f5a623' : '#d1d5db'}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

/* ── Review Modal ── */
function ReviewModal({ item, orderId, token, onClose, onSuccess }) {
  const [rating,  setRating]  = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async () => {
    if (!rating)         { setError('Please select a star rating'); return }
    if (!comment.trim()) { setError('Please write a comment'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch(`${API_URL}/product-reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ productId: item.productId, orderId, rating, comment }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed to submit review')
      onSuccess(item.productId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#292933]">Rate & Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <img src={item.image || PH} alt={item.name}
            className="w-12 h-12 object-cover rounded border border-gray-100 flex-shrink-0"
            onError={e => e.target.src = PH} />
          <p className="text-[13px] text-gray-700 line-clamp-2">{item.name}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">Your Rating</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">Your Review</p>
          <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[#0080FF] resize-none" />
        </div>
        {error && (
          <div className="mb-3 text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 text-[13px] font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className={`flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-colors
              ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0080FF] text-white hover:bg-blue-700'}`}>
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}


/* Sidebar */
function UserSidebar({ activeTab, onTabChange, user, onLogout }) {
  const navItems = [
    {
      key: 'orders',
      label: 'My Orders',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ]

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0080FF] to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-200 flex-shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-[14px] truncate">{user?.fullName}</p>
            {user?.email && <p className="text-[12px] text-gray-400 truncate">{user.email}</p>}
            {user?.phone && <p className="text-[12px] text-gray-400 truncate">{user.phone}</p>}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <nav className="p-2">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                activeTab === item.key
                  ? 'bg-[#0080FF] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-[#0080FF]'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
              </svg>
              <span className="text-[13px] font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-left"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[13px] font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}


/* Profile Panel */
function ProfilePanel({ user, token, onUserUpdate }) {
  const [tab,             setTab]             = useState('info')
  const [fullName,        setFullName]        = useState(user?.fullName || '')
  const [email,           setEmail]           = useState(user?.email || '')
  const [phone,           setPhone]           = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent,     setShowCurrent]     = useState(false)
  const [showNew,         setShowNew]         = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [saving,          setSaving]          = useState(false)
  const [success,         setSuccess]         = useState('')
  const [error,           setError]           = useState('')

  const clearMsgs = () => { setSuccess(''); setError('') }

  const handleProfileSave = async (e) => {
    e.preventDefault(); clearMsgs(); setSaving(true)
    try {
      const res  = await fetch(`${API_URL}/auth/update-profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ fullName, email, phone }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Update failed')
      onUserUpdate({ ...user, fullName, email, phone })
      setSuccess('Profile updated successfully!')
    } catch (err) { setError(err.message || 'Failed to update.') }
    finally { setSaving(false) }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault(); clearMsgs()
    if (newPassword.length < 6)         { setError('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    setSaving(true)
    try {
      const res  = await fetch(`${API_URL}/auth/change-password`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Password change failed')
      setSuccess('Password changed successfully!')
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
    } catch (err) { setError(err.message || 'Failed.') }
    finally { setSaving(false) }
  }

  const EyeBtn = ({ show, toggle }) => (
    <span onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600">
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.331 2.5 9.964 5.678a1.012 1.012 0 0 1 0 .644C20.33 15.5 16.348 18 12 18c-4.348 0-8.331-2.5-9.964-5.678Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      )}
    </span>
  )

  const inp = 'w-full border border-gray-200 px-3 py-2 text-[13px] rounded-lg outline-none focus:border-[#0080FF] focus:ring-1 focus:ring-blue-100 transition-colors'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-[14px] font-bold text-gray-800 mb-5 flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-[#0080FF]" />
        My Profile
      </h2>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-50 border border-gray-100 rounded-xl p-1 mb-5 w-fit">
        {[{ key: 'info', label: 'General Info' }, { key: 'password', label: 'Change Password' }].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); clearMsgs() }}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              tab === t.key ? 'bg-[#0080FF] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{t.label}</button>
        ))}
      </div>

      {success && (
        <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-xl flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl">{error}</div>
      )}

      {tab === 'info' && (
        <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required className={inp} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className={inp} />
            <p className="text-[11px] text-gray-400 mt-1">Leave blank if you registered with phone.</p>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01xxxxxxxxx" className={inp} />
            <p className="text-[11px] text-gray-400 mt-1">Leave blank if you registered with email.</p>
          </div>
          <button type="submit" disabled={saving}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-colors ${saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0080FF] text-white hover:bg-blue-700'}`}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" required className={inp + ' pr-10'} />
              <EyeBtn show={showCurrent} toggle={() => setShowCurrent(v => !v)} />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" required className={inp + ' pr-10'} />
              <EyeBtn show={showNew} toggle={() => setShowNew(v => !v)} />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-600 mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required className={inp + ' pr-10'} />
              <EyeBtn show={showConfirm} toggle={() => setShowConfirm(v => !v)} />
            </div>
          </div>
          <p className="text-[11px] text-gray-400">Password must be at least 6 characters.</p>
          <button type="submit" disabled={saving}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-colors ${saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0080FF] text-white hover:bg-blue-700'}`}>
            {saving ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function UserDashboard() {
  const { user, token, logout, login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [orders,  setOrders]  = useState([])
  const [counts,  setCounts]  = useState({ total: 0, confirmed: 0, pending: 0, delivered: 0 })
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('pending')      
  const [section, setSection] = useState('orders')       

  const [reviewed,    setReviewed]    = useState(new Set())
  const [reviewModal, setReviewModal] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetchOrders()
  }, [isLoggedIn])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.success) { setOrders(data.data.orders); setCounts(data.data.counts) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const handleUserUpdate = (updatedUser) => { login(token, updatedUser, 'user') }

  const filteredOrders = orders.filter(o => {
    if (tab === 'confirmed') return o.status === 'confirmed'
    if (tab === 'pending')   return o.status === 'pending'
    if (tab === 'delivered') return o.status === 'delivered'
    return true
  })

  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  const handleReviewSuccess = (productId) => {
    setReviewed(prev => new Set([...prev, productId + '_' + reviewModal.orderId]))
    setReviewModal(null)
  }

  const StatCard = ({ label, value, color, onClick, active }) => (
    <button onClick={onClick}
      className={`flex-1 min-w-[120px] rounded-2xl p-4 text-left border-2 transition-all duration-200 ${
        active ? `${color} border-current shadow-lg scale-[1.02]` : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
      }`}>
      <p className={`text-2xl font-extrabold leading-none ${active ? '' : 'text-gray-800'}`}>{value}</p>
      <p className={`text-xs mt-1.5 font-semibold tracking-wide ${active ? '' : 'text-gray-400'}`}>{label}</p>
    </button>
  )

  return (
    <div className="bg-[#f4f6fb] min-h-screen">
      {reviewModal && (
        <ReviewModal item={reviewModal.item} orderId={reviewModal.orderId} token={token}
          onClose={() => setReviewModal(null)} onSuccess={handleReviewSuccess} />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-[#0080FF] to-blue-600" />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Hello, {user?.fullName} 👋</h1>
          </div>
          <p className="text-gray-400 text-sm ml-4">Manage your orders and profile from your dashboard.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* ── SIDEBAR ── */}
          <UserSidebar
            activeTab={section}
            onTabChange={setSection}
            user={user}
            onLogout={handleLogout}
          />

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* ORDERS SECTION */}
            {section === 'orders' && (
              <>
                {/* Stat cards */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <StatCard label="All Orders"  value={counts.total}     color="bg-blue-50   text-blue-700   border-blue-400"
                    active={tab === 'all'}       onClick={() => setTab('all')} />
                  <StatCard label="Pending"     value={counts.pending}   color="bg-yellow-50 text-yellow-700 border-yellow-400"
                    active={tab === 'pending'}   onClick={() => setTab('pending')} />
                  <StatCard label="Confirmed"   value={counts.confirmed} color="bg-indigo-50 text-indigo-700 border-indigo-400"
                    active={tab === 'confirmed'} onClick={() => setTab('confirmed')} />
                  <StatCard label="Delivered"   value={counts.delivered} color="bg-green-50  text-green-700  border-green-400"
                    active={tab === 'delivered'} onClick={() => setTab('delivered')} />
                </div>

                {/* Delivered review list */}
                {tab === 'delivered' && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h2 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-1 h-5 rounded-full bg-green-500" />
                        Delivered Products — Rate &amp; Review
                      </h2>
                      <span className="text-xs text-gray-400">{deliveredOrders.length} order(s)</span>
                    </div>
                    {deliveredOrders.length === 0 ? (
                      <div className="p-10 text-center text-gray-400"><p className="text-sm">No delivered orders yet.</p></div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {deliveredOrders.map(order =>
                          order.items?.map((item, idx) => {
                            const reviewKey     = item.productId + '_' + order._id
                            const alreadyReviewed = reviewed.has(reviewKey)
                            return (
                              <div key={`${order._id}-${idx}`} className="flex items-center gap-4 px-5 py-4">
                                <img src={item.image || PH} alt={item.name}
                                  className="w-14 h-14 object-cover rounded border border-gray-100 flex-shrink-0"
                                  onError={e => e.target.src = PH} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-medium text-gray-800 line-clamp-1">{item.name}</p>
                                  {item.selectedVariant && <p className="text-[11px] text-gray-400">{item.selectedVariant}</p>}
                                  <p className="text-[11px] text-gray-400 mt-0.5">
                                    Qty: {item.qty} · ${item.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                  </p>
                                  <p className="text-[11px] text-gray-400">
                                    Order #{order._id.slice(-6).toUpperCase()} ·{' '}
                                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  {alreadyReviewed ? (
                                    <span className="flex items-center gap-1.5 text-[12px] text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                      Reviewed
                                    </span>
                                  ) : (
                                    <button onClick={() => setReviewModal({ item, orderId: order._id })}
                                      className="text-[12px] font-semibold text-[#0080FF] border border-[#0080FF] px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors">
                                      Rate & Review
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
                      <div className="w-1 h-5 rounded-full bg-[#0080FF]" />
                      {tab === 'all' ? 'All Orders' : tab === 'confirmed' ? 'Confirmed Orders' : tab === 'pending' ? 'Pending Orders' : 'Delivered Orders'}
                    </h2>
                    <span className="text-xs text-gray-400">{filteredOrders.length} order(s)</span>
                  </div>

                  {loading ? (
                    <div className="p-10 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-gray-200 border-t-[#0080FF]" />
                      <p className="text-sm text-gray-400 mt-2">Loading orders…</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">No orders found in this category.</p>
                      <Link to="/" className="inline-block mt-3 text-[#0080FF] text-sm font-medium hover:underline">Start Shopping →</Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                              <td className="px-5 py-4">
                                <div className="space-y-1">
                                  {order.items?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <img src={item.image || PH} alt={item.name}
                                        className="w-8 h-8 rounded object-cover border border-gray-100 flex-shrink-0"
                                        onError={e => e.target.src = PH} />
                                      <span className="text-[12px] text-gray-600 line-clamp-1">{item.name}</span>
                                      <span className="text-[11px] text-gray-400 flex-shrink-0">×{item.qty}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="px-5 py-4 font-semibold text-gray-800">
                                ${order.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-gray-500 text-xs">
                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* PROFILE SECTION */}
            {section === 'profile' && (
              <ProfilePanel user={user} token={token} onUserUpdate={handleUserUpdate} />
            )}

          </div>
        </div>

        <div className="mt-6">
          <Link to="/" className="text-[#0080FF] text-sm font-medium hover:underline flex items-center gap-1">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}