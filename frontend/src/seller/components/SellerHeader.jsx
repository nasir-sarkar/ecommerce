import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const FLAG_EN = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/en.png'
const FLAG_BD = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/bd.png'
const FLAG_SA = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/sa.png'

const AVATAR_PLACEHOLDER = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/avatar-place.png'

const IconHamburger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512" fill="#717580">
    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96M0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32m448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32" />
  </svg>
)

const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 496 512" fill="#717580">
    <path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152zM152 256c0 22.2 1.2 43.5 3.3 64H340.7c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64m324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6zm-209.4-141.6C195.8 39.6 137.9 92.1 109.3 160h108c8.8-56.9 25.6-107.8 50-141.6M487.4 192H354.8c2.1 21 3.2 42.5 3.2 64s-1.1 43-3.2 64h132.6c5.6-20.4 8.6-41.8 8.6-64s-3-43.6-8.6-64M120 256c0-21.5 1.2-43 3.2-64H8.6C3 212.4 0 233.8 0 256s3 43.6 8.6 64h114.6c-2-21-3.2-42.5-3.2-64m39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152zm159.4 141.6c71.5-21.2 129.4-73.7 158-141.6H368.9c-8.8 56.9-25.6 107.8-50 141.6M19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6z" />
  </svg>
)

function useOutsideClose(setOpen) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setOpen])
  return ref
}

export default function SellerHeader({ onToggleSidebar }) {
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const langRef = useOutsideClose(setLangOpen)
  const userRef = useOutsideClose(setUserOpen)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.fullName || 'Seller'
  const avatarSrc   = user?.avatar   || AVATAR_PLACEHOLDER

  const handleLogout = () => {
    setUserOpen(false)
    logout()
    navigate('/seller/pages/login')
  }

  const handleProfile = () => {
    setUserOpen(false)
    navigate('/seller/profile')
  }

  return (
    <header className="bg-white flex items-stretch justify-between px-[15px] lg:px-[25px] min-h-[60px]">
      {/* Left: hamburger */}
      <div className="flex">
        <div className="flex items-center justify-start ml-0 mr-2 md:mr-3">
          <button
            onClick={onToggleSidebar}
            type="button"
            className="w-[34px] h-[34px] rounded-[6px] flex items-center justify-center hover:bg-[#f1f1f4] transition-colors"
            aria-label="Toggle sidebar"
          >
            <IconHamburger />
          </button>
        </div>
      </div>

      {/* Right side container */}
      <div className="flex justify-between items-stretch flex-grow">
        {/* Left group: globe icon */}
        <div className="flex items-center gap-0">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Browse Website"
              className="w-[34px] h-[34px] rounded-full bg-[#f1f1f4] hover:bg-[#009ef7] [&:hover_svg_path]:fill-white flex items-center justify-center transition-colors"
            >
              <IconGlobe />
            </button>
          </div>
        </div>

        {/* Right group: language, user */}
        <div className="flex items-center">
          {/* Language */}
          <div className="ml-2 flex items-center relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              title="Language"
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center hover:bg-[#f1f1f4] transition-colors overflow-hidden"
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
          <div className="ml-2 flex items-center relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserOpen((o) => !o)}
              className="flex items-center text-[#232734]"
            >
              <span className="w-[40px] h-[40px] rounded-full overflow-hidden md:mr-2 flex-shrink-0">
                <img
                  src={avatarSrc}
                  className="w-full h-full object-cover"
                  alt={displayName}
                  onError={(e) => { e.target.onerror = null; e.target.src = AVATAR_PLACEHOLDER }}
                />
              </span>
              <span className="hidden md:block text-left">
                <span className="block font-medium text-[13px] leading-[18px]">{displayName}</span>
                <span className="block text-[11px] leading-[14px] opacity-60">seller</span>
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