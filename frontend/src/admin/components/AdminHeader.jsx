import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Topbar Inline Icons 

const IconHamburger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g transform="translate(0 16) rotate(-90)">
      <rect width="2" height="7" rx="1" fill="#9da3ae" />
      <rect width="2" height="11" rx="1" transform="translate(14)" fill="#9da3ae" />
      <rect width="2" height="16" rx="1" transform="translate(7)" fill="#9da3ae" />
    </g>
  </svg>
)

const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M56,48a8,8,0,1,0,8,8A8,8,0,0,0,56,48Zm-.829,14.808a6.858,6.858,0,0,1-4.39-11.256,7.6,7.6,0,0,1,.077.93,2.966,2.966,0,0,0,.382,2.26,3.729,3.729,0,0,1,.362,1.08c.1.341.5.519.77.729.552.423,1.081.916,1.666,1.288.387.246.628.368.515.84a2.98,2.98,0,0,1-.313.951,1.927,1.927,0,0,0,.321.861c.288.288.575.553.889.813C55.938,61.706,55.4,62.229,55.171,62.808Zm5.678-1.959a6.808,6.808,0,0,1-3.56,1.888,2.844,2.844,0,0,1,.842-1.129,2.865,2.865,0,0,0,.757-.937,6.506,6.506,0,0,1,.522-.893c.272-.419-.67-1.051-.975-1.184a10.052,10.052,0,0,1-1.814-1.13c-.435-.306-1.318.16-1.808-.054A9.462,9.462,0,0,1,53,56.166c-.6-.454-.574-.984-.574-1.654.472.017,1.144-.131,1.458.249.1.12.439.655.667.465.186-.155-.138-.779-.2-.925-.193-.451.439-.626.762-.932.422-.4,1.326-1.024,1.254-1.309s-.9-1.1-1.394-.969c-.073.019-.719.7-.844.8q0-.332.01-.663c0-.14-.26-.283-.248-.373.031-.227.664-.64.821-.821-.11-.069-.487-.392-.6-.345-.276.115-.588.194-.863.309a1.756,1.756,0,0,0-.025-.274,6.792,6.792,0,0,1,1.743-.506l.542.218.382.454.382.394.334.108.53-.5L57,49.536v-.321a6.782,6.782,0,0,1,2.9,1.146c-.155.014-.326.037-.518.061a1.723,1.723,0,0,0-.268-.1c.251.54.513,1.073.779,1.606.284.569.915,1.18,1.026,1.781.131.708.04,1.352.111,2.185a3.732,3.732,0,0,0,.9,1.714,1.812,1.812,0,0,0,.707.086A6.815,6.815,0,0,1,60.849,60.849Z" transform="translate(-48 -48)" fill="#717580" />
  </svg>
)

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// US flag
const FLAG_EN = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/en.png'
const FLAG_BD = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/bd.png'
const FLAG_SA = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/sa.png'

const AVATAR_PLACEHOLDER = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/avatar-place.png'

function useOutsideClose(setOpen) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setOpen])
  return ref
}

// AdminHeader

export default function AdminHeader({ onToggleSidebar }) {
  const [addOpen,  setAddOpen]  = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const addRef  = useOutsideClose(setAddOpen)
  const langRef = useOutsideClose(setLangOpen)
  const userRef = useOutsideClose(setUserOpen)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navMenuLinks = [
    { label: 'Dashboard',          to: '/admin/dashboard', exact: true },
    { label: 'Orders',             to: '/admin/sales/all' },
    { label: 'Homepage Settings',  to: '/admin/homepage-settings' },
  ]

  const handleLogout = () => {
    setUserOpen(false)
    logout()
    navigate('/admin/pages/login')
  }

  const handleProfile = () => {
    setUserOpen(false)
    navigate('/admin/profile')
  }

  // Resolve display name and avatar from auth context
  const displayName = user?.fullName || 'Admin'
  const avatarSrc   = user?.avatar   || AVATAR_PLACEHOLDER

  return (
    <header className="bg-white border-b border-[#f1f1f4] flex items-stretch justify-between px-[15px] lg:px-[25px] min-h-[60px]">
      {/* Left: hamburger */}
      <div className="flex">
        <div className="flex items-center justify-start ml-0 mr-2">
          <button
            onClick={onToggleSidebar}
            type="button"
            className="w-[34px] h-[34px] rounded-[6px] bg-[#f1f1f4] flex items-center justify-center hover:bg-[#e4e5eb] transition-colors"
            aria-label="Toggle sidebar"
          >
            <IconHamburger />
          </button>
        </div>
      </div>

      {/* Right side container */}
      <div className="flex justify-between items-stretch flex-grow">
        {/* Left group: globe icon + nav menu + add new */}
        <div className="flex items-center gap-0">
          {/* Browse Website */}
          <div className="mr-3 flex items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Browse Website"
              className="w-[34px] h-[34px] rounded-full bg-[#f1f1f4] hover:bg-[#009ef7] [&:hover_svg_path]:fill-white flex items-center justify-center transition-colors"
            >
              <IconGlobe />
            </button>
          </div>

          {/* Topbar Nav Menus */}
          <div className="mr-2 hidden xl:block">
            <div className="flex items-center h-full">
              {navMenuLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `text-[13px] leading-[20px] font-semibold flex items-center justify-center px-[14px] h-[60px] border-b-[2px] transition-colors ${
                      isActive
                        ? 'text-[#009ef7] border-[#009ef7]'
                        : 'text-[#232734] border-transparent hover:text-[#009ef7]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Add New Button */}
          <div className="hidden sm:block">
            <div className="flex items-center h-full relative" ref={addRef}>
              <button
                onClick={() => setAddOpen((o) => !o)}
                type="button"
                className="bg-[#f1fafd] text-[#009ef7] hover:bg-[#009ef7] hover:text-white text-[12px] leading-[18px] font-medium flex items-center rounded-[6px] px-[10px] py-[7px] transition-colors"
              >
                <span className="mx-2 mr-0 hidden md:block">Add New</span>
                <span className="ml-2 flex items-center">
                  <IconPlus />
                </span>
              </button>
              {addOpen && (
                <div className="absolute top-full right-0 mt-[15px] w-[200px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 z-50">
                  <NavLink to="/admin/products/create" onClick={() => setAddOpen(false)}
                    className="flex items-center gap-2 px-[15px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                    <IconPlus /><span>New Product</span>
                  </NavLink>
                  <NavLink to="/admin/categories/create" onClick={() => setAddOpen(false)}
                    className="flex items-center gap-2 px-[15px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                    <IconPlus /><span>New Category</span>
                  </NavLink>
                  <NavLink to="/admin/brands/create" onClick={() => setAddOpen(false)}
                    className="flex items-center gap-2 px-[15px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                    <IconPlus /><span>New Brand</span>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right group: language, user */}
        <div className="flex items-center">
          {/* Language */}
          <div className="mr-3 flex items-center relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              title="Language"
              className="w-[34px] h-[34px] rounded-full bg-[#f1f1f4] flex items-center justify-center hover:bg-[#e4e5eb] transition-colors overflow-hidden"
            >
              <img src={FLAG_EN} height="11" alt="en" className="h-[11px]" />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-[150px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 z-50">
                <a href="#" className="flex items-center gap-2 px-[15px] py-[7px] text-[13px] text-[#009ef7] bg-[#f1fafd]">
                  <img src={FLAG_EN} alt="en" className="h-[11px]" />
                  <span>English</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-[15px] py-[7px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                  <img src={FLAG_BD} alt="bd" className="h-[11px]" />
                  <span>Bangla</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-[15px] py-[7px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                  <img src={FLAG_SA} alt="sa" className="h-[11px]" />
                  <span>Arabic</span>
                </a>
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((o) => !o)}
              className="flex items-center text-[#232734]"
            >
              <span className="hidden md:block">
                <span className="block font-medium text-[13px] leading-[18px]">{displayName}</span>
                <span className="block text-[11px] leading-[14px] opacity-60 text-right">admin</span>
              </span>
              <span className="w-[40px] h-[40px] rounded-full overflow-hidden ml-0 md:ml-2 flex-shrink-0">
                <img
                  src={avatarSrc}
                  className="w-full h-full object-cover"
                  alt={displayName}
                  onError={(e) => { e.target.onerror = null; e.target.src = AVATAR_PLACEHOLDER }}
                />
              </span>
            </button>
            {userOpen && (
              <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 z-50">
                <button
                  type="button"
                  onClick={handleProfile}
                  className="w-full flex items-center gap-2 px-[15px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                >
                  <span>👤</span><span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-[15px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                >
                  <span>↗</span><span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}