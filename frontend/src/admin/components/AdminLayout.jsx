import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout() {
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen((o) => !o)
    } else {
      setSidebarHidden((h) => !h)
    }
  }

  return (
    <div className="flex min-h-screen bg-white font-['Inter',sans-serif] text-[12px] text-[#232734]">
      {/* Left Sidebar */}
      {!sidebarHidden && (
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      {sidebarHidden && sidebarOpen && (
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      {/* Right side: header + content + footer */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <AdminHeader onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1">
          <div className="px-[15px] lg:px-[25px] py-[20px]">
            <Outlet />
          </div>
        </main>

        <div className="bg-white text-center py-3 px-[15px] lg:px-[25px] mt-auto border-t border-[#f1f1f4]">
          <p className="mb-0 text-[12px] text-[#232734]">© Active eCommerce CMS v10.8.0</p>
        </div>
      </div>
    </div>
  )
}