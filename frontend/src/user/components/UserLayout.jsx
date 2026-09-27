import { Outlet } from 'react-router-dom'
import UserSidebar from './UserSidebar'

export default function UserLayout() {
  return (
    <section
      className="bg-white py-[1.5rem]"
      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
    >
      <div className="w-full max-w-[1140px] mx-auto px-[15px]">
        <div className="flex items-start">
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0 pl-[15px]">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}