import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const navLinks = [
  { label: 'Home',           path: '/' },
  { label: 'Flash Sale',    path: '/flash-sale' },
  { label: 'Blogs',         path: '/blogs' },
  { label: 'All Brands',    path: '/brands' },
  { label: 'All categories',path: '/categories' },
  { label: 'Sellers',       path: '/seller' },
  { label: 'Contact Us',    path: '/contact' },
]

const encodeCategoryName = (name) => encodeURIComponent(name)

export default function Navbar() {
  const navigate = useNavigate()
  const { user, role, isLoggedIn, logout } = useAuth()

  const [mobileOpen,        setMobileOpen]        = useState(false)
  const [bannerVisible,     setBannerVisible]     = useState(true)
  const [categoryOpen,      setCategoryOpen]      = useState(false)
  const [dbCategories,      setDbCategories]      = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [searchQuery,       setSearchQuery]       = useState('')
  const [userMenuOpen,      setUserMenuOpen]      = useState(false)
  const [cartCount,         setCartCount]         = useState(0)
  const [headlineMessages,  setHeadlineMessages]  = useState([])

  const categoryRef = useRef(null)
  const userMenuRef = useRef(null)

  const [avatarError, setAvatarError] = useState(false)
  useEffect(() => { setAvatarError(false) }, [user?.avatar])

  useEffect(() => {
    const loadCartCount = () => {
      const raw = localStorage.getItem('cart')
      const arr = raw ? JSON.parse(raw) : []
      const count = arr.reduce((sum, item) => sum + (item.quantity || 1), 0)
      setCartCount(count)
    }
    loadCartCount()
    window.addEventListener('cartUpdated', loadCartCount)
    return () => window.removeEventListener('cartUpdated', loadCartCount)
  }, [])

  useEffect(() => {
    const fetchHeadline = async () => {
      try {
        const res  = await fetch(`${API_URL}/home`)
        const data = await res.json()
        if (Array.isArray(data.headlineBanner) && data.headlineBanner.length > 0) {
          setHeadlineMessages(data.headlineBanner.map(h => h.text).filter(Boolean))
        }
      } catch { /* keep default empty — banner just won't show */ }
    }
    fetchHeadline()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const res  = await fetch(`${API_URL}/categories`)
        const data = await res.json()
        setDbCategories(Array.isArray(data) ? data : [])
      } catch { setDbCategories([]) }
      finally  { setLoadingCategories(false) }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))  setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') { setCategoryOpen(false); setUserMenuOpen(false) }
    }
    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      if (mobileOpen) setMobileOpen(false)
    }
  }

  const handleUserDpClick = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (role === 'admin')       navigate('/admin/dashboard')
    else if (role === 'seller') navigate('/seller/dashboard')
    else                        navigate('/user/dashboard')
    setUserMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  const toggleUserMenu = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    setUserMenuOpen(prev => !prev)
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {bannerVisible && headlineMessages.length > 0 && (
        <div className="bg-black text-white h-10 flex items-center overflow-hidden relative">
          <div className="flex-1 overflow-hidden">
            <div className="top-banner-scroll text-[13px] whitespace-nowrap">
              {/* Render messages twice for seamless infinite scroll */}
              {[...headlineMessages, ...headlineMessages].map((msg, i) => (
                <span key={i} className="px-8">{msg}</span>
              ))}
            </div>
          </div>
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xl px-1" onClick={() => setBannerVisible(false)}>×</button>
        </div>
      )}

      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="container mx-auto max-w-[1280px] px-4">
          <div className="flex items-center h-[60px] gap-3">
            <button className="lg:hidden p-1 flex-shrink-0" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <rect width="16" height="2" transform="translate(0 7)" fill="#919199"/>
                <rect width="16" height="2" fill="#919199"/>
                <rect width="16" height="2" transform="translate(0 14)" fill="#919199"/>
              </svg>
            </button>

            <Link to="/" className="flex-shrink-0 py-3 mr-2">
              <img src="/src/images/HeaderLogo.png"
                alt="Active eCommerce CMS" className="h-[30px] md:h-[40px] w-auto" onError={e => { e.target.style.display='none' }}/>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 hidden lg:flex xl:mx-5">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="flex w-full border border-[#d1d5db] rounded-full overflow-hidden">
                  <input
                    type="text"
                    placeholder="I am shopping for..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-5 py-2.5 text-[14px] outline-none text-[#4b5563]"
                  />
                  <button type="submit" className="px-5 bg-white hover:bg-[#f9fafb] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20.001 20">
                      <path d="M9.847,17.839a7.993,7.993,0,1,1,7.993-7.993A8,8,0,0,1,9.847,17.839Zm0-14.387a6.394,6.394,0,1,0,6.394,6.394A6.4,6.4,0,0,0,9.847,3.453Z" transform="translate(-1.854 -1.854)" fill="#b5b5bf"/>
                      <path d="M24.4,25.2a.8.8,0,0,1-.565-.234l-6.15-6.15a.8.8,0,0,1,1.13-1.13l6.15,6.15A.8.8,0,0,1,24.4,25.2Z" transform="translate(-5.2 -5.2)" fill="#b5b5bf"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Right — User DP + login/register or user name */}
            <div className="hidden xl:flex items-center ml-auto gap-2">
              {/* Filter Button Removed From Here */}

              <div className="flex items-center gap-1 ml-1 relative" ref={userMenuRef}>
                {/* ── USER DP ICON ── clicking opens dropdown if logged in */}
                <button
                  onClick={toggleUserMenu}
                  title={isLoggedIn ? user?.fullName : 'Login'}
                  className="w-[40px] h-[40px] rounded-full border border-[#e5e7eb] flex items-center justify-center text-[#4b5563] flex-shrink-0 hover:bg-[#f9fafb] transition-colors overflow-hidden relative"
                >
                  {isLoggedIn && user?.avatar && !avatarError ? (
                    <img
                      src={user.avatar}
                      alt={user?.fullName || 'User'}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : isLoggedIn ? (
                    <span className="w-full h-full flex items-center justify-center bg-[#0080FF] text-white font-bold text-sm">
                      {user?.fullName?.[0]?.toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 19.902 20.012">
                      <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1.006,1.006,0,1,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1,10,10,0,0,0-6.25-8.19ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z" transform="translate(-2.064 -1.995)" fill="currentColor"/>
                    </svg>
                  )}
                </button>

                {/* Dropdown when logged in */}
                {isLoggedIn && userMenuOpen && (
                  <div className="absolute top-[48px] left-0 w-[200px] bg-white border border-[#e5e7eb] shadow-xl z-[60] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#f3f4f6]">
                      <p className="text-sm font-semibold text-[#1f2937] truncate">{user?.fullName}</p>
                      <p className="text-xs text-[#9ca3af] capitalize">{role}</p>
                    </div>
                    <button
                      onClick={handleUserDpClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#f9fafb] flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}

                {/* Login / Register links when not logged in */}
                {!isLoggedIn && (
                  <>
                    <a href="/Login" className="text-[12px] text-black/60 hover:text-black border-r border-[#d1d5db] pr-2 ml-2">Login</a>
                    <a href="/Registration" className="text-[12px] text-black/60 hover:text-black pl-1">Registration</a>
                  </>
                )}

                {/* Logged-in name chip — clicking also opens dropdown */}
                {isLoggedIn && (
                  <button
                    onClick={toggleUserMenu}
                    className="text-[12px] font-medium text-[#374151] ml-2 max-w-[100px] truncate hidden 2xl:block hover:text-[#0080FF] transition-colors"
                  >
                    {user?.fullName}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile right icons */}
            <div className="flex items-center gap-3 ml-auto xl:hidden">
              <button className="p-1" onClick={() => navigate('/search')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
              {/* Mobile user DP */}
              <button onClick={handleUserDpClick} className="w-8 h-8 rounded-full border border-[#e5e7eb] flex items-center justify-center overflow-hidden">
                {isLoggedIn && user?.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user?.fullName || 'User'}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : isLoggedIn ? (
                  <span className="w-full h-full flex items-center justify-center bg-[#0080FF] text-white text-xs font-bold">
                    {user?.fullName?.[0]?.toUpperCase() || 'U'}
                  </span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
              <Link to="/cart" className="flex items-center gap-1 text-[13px] font-bold text-[#1f2937]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 6V5a5 5 0 0 0-10 0v1H4v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6h-3zM9 5a3 3 0 0 1 6 0v1H9V5z"/>
                </svg>
                <span>Cart ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:block border-b border-[#f3f4f6] bg-white" style={{ boxShadow:'0 8px 8px rgba(0,0,0,0.05)' }}>
        <div className="container mx-auto max-w-[1280px] px-4 h-[50px] flex items-center relative">

          <div className="relative h-full flex items-center" ref={categoryRef}>
            <div
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="bg-black/5 rounded-sm h-[38px] flex items-center px-2.5 mr-2 cursor-pointer hover:bg-black/10 transition-colors flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </div>

            {categoryOpen && (
              <div className="absolute top-full left-0 w-[280px] bg-white shadow-xl border border-[#f3f4f6] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white px-4 py-2.5 border-b border-[#e5e7eb]">
                  <h3 className="text-[#374151] font-medium text-xs flex items-center gap-1.5 tracking-wide">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    ALL CATEGORIES
                  </h3>
                </div>
                <div className="max-h-[380px] overflow-y-auto thin-scrollbar">
                  {loadingCategories ? (
                    <div className="px-4 py-6 text-center">
                      <div className="inline-block w-4 h-4 border-2 border-[#e5e7eb] border-t-[#0080FF] rounded-full animate-spin"></div>
                      <p className="text-[11px] text-[#9ca3af] mt-2">Loading...</p>
                    </div>
                  ) : dbCategories.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-[11px] text-[#9ca3af]">No categories found</p>
                    </div>
                  ) : (
                    dbCategories.map((cat, index) => (
                      <Link
                        key={cat._id || index}
                        to={`/category/${encodeCategoryName(cat.name)}`}
                        className="group flex items-center justify-between px-4 py-2.5 text-[13px] text-[#374151] hover:bg-[#f9fafb] hover:text-[#0080FF] transition-all duration-150 border-b border-[#f9fafb] last:border-0"
                        onClick={() => setCategoryOpen(false)}
                      >
                        <div className="flex items-center gap-2.5">
                          {cat.img && (
                            <img src={cat.img} alt={cat.name} className="w-4 h-4 object-contain opacity-60 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.style.display = 'none'} />
                          )}
                          <span className="group-hover:font-medium transition-all">{cat.name}</span>
                        </div>
                        <svg className="w-3 h-3 text-[#9ca3af] group-hover:text-[#0080FF] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))
                  )}
                </div>
                {dbCategories.length > 0 && !loadingCategories && (
                  <div className="border-t border-[#f3f4f6] bg-[#f9fafb]/30 px-4 py-2">
                    <Link to="/categories" className="flex items-center justify-center gap-1 text-[11px] text-[#0080FF] font-medium hover:gap-1.5 transition-all" onClick={() => setCategoryOpen(false)}>
                      <span>View All Categories</span>
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <ul className="flex items-center overflow-hidden flex-1 xl:ml-4">
            {navLinks.map(link => (
              <li key={link.path} className="flex-shrink-0">
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `text-[13px] px-3 py-[14px] inline-block font-bold hover:bg-black/5 transition-colors ${isActive ? 'text-[#0080FF]' : 'text-black'}`
                  }
                >{link.label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto pl-5 flex-shrink-0">
            <Link to="/cart" className="flex items-center gap-1.5 py-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M17 6V5a5 5 0 0 0-10 0v1H4v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6h-3zM9 5a3 3 0 0 1 6 0v1H9V5z"/>
                <rect x="9" y="10" width="6" height="2" fill="#fff" rx="0.3"/>
              </svg>
              <span className="text-[14px] font-bold">Cart ({cartCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#e5e7eb] shadow-lg">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="flex border border-[#d1d5db] rounded-full overflow-hidden mb-3">
              <input
                type="text"
                placeholder="I am shopping for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="px-3 bg-[#f9fafb]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </form>
            <ul className="divide-y divide-[#f9fafb]">
              {navLinks.map(link => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) => `block text-[13px] px-2 py-3 font-bold w-full ${isActive ? 'text-[#0080FF]' : 'text-[#1f2937]'}`}
                    onClick={() => setMobileOpen(false)}
                  >{link.label}</NavLink>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 py-3 text-sm text-[#4b5563] border-t border-[#f3f4f6] mt-1">
              {isLoggedIn ? (
                <>
                  <button onClick={() => { handleUserDpClick(); setMobileOpen(false) }} className="hover:text-[#0080FF]">Dashboard</button>
                  <button onClick={handleLogout} className="hover:text-red-500">Logout</button>
                </>
              ) : (
                <>
                  <a href="/Login"        className="hover:text-[#0080FF]">Login</a>
                  <a href="/Registration" className="hover:text-[#0080FF]">Registration</a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .thin-scrollbar::-webkit-scrollbar { width: 3px; }
        .thin-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .thin-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
        .thin-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
      `}</style>
    </header>
  )
}