import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import SellerSidebar from './SellerSidebar'
import SellerHeader from './SellerHeader'

export default function SellerLayout() {
  
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      // Mobile: slide in/out overlay
      setSidebarOpen((o) => !o)
    } else {
      // Desktop: hide/show sidebar for full-screen effect
      setSidebarHidden((h) => !h)
    }
  }

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif] text-[12px] text-[#2E294E]">
      {/* Left Sidebar - hidden on desktop when sidebarHidden */}
      {!sidebarHidden && (
        <SellerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {/* Mobile overlay sidebar still works when sidebarHidden on desktop (shouldn't occur, but guard) */}
      {sidebarHidden && sidebarOpen && (
        <SellerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Right side: header + content + footer */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f5f5f7]">
        <SellerHeader onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1">
          <div className="px-[15px] lg:px-[25px] py-[20px]">
            <Outlet />
          </div>
        </main>

        <div className="bg-white text-center py-3 px-[15px] lg:px-[25px] mt-auto border-t border-[#f1f1f4]">
          <div className="flex justify-center flex-wrap">
            <a href="#" className="text-[#2E294E] no-underline mr-3 font-bold text-[12px] hover:text-[#009ef7]">
              Legal Notice
            </a>
            <a href="#" className="text-[#2E294E] no-underline mr-3 font-bold text-[12px] hover:text-[#009ef7]">
              Right of Withdrawal
            </a>
            <a href="#" className="text-[#2E294E] no-underline mr-3 font-bold text-[12px] hover:text-[#009ef7]">
              Terms &amp; conditions
            </a>
            <a href="#" className="text-[#2E294E] no-underline mr-3 font-bold text-[12px] hover:text-[#009ef7]">
              Seller Privacy Policy
            </a>
          </div>
          <p className="mb-0 mt-2 text-[11px] text-[#2E294E]">© Active eCommerce CMS v10.8.0</p>
        </div>
      </div>
    </div>
  )
}