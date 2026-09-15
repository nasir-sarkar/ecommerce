import { useState, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Line Awesome icons recreated via inline SVGs to match source visually
const LaIcon = ({ name }) => {
  const icons = {
    'la-home': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M261 64L48 256v224h128V352h160v128h128V256z" />
      </svg>
    ),
    'la-shopping-cart': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24M128 464a48 48 0 1 1 96 0 48 48 0 1 1-96 0m336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96" />
      </svg>
    ),
    'la-clock': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512m-24 120v136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24" />
      </svg>
    ),
    'la-edit': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2zM291.1 122.9 99.6 314.5c-10.5 10.5-18 23.7-21.7 38.3l-23.4 87.9c-1.7 6.4-.8 13.2 2.5 19c1.7 3 3.9 5.7 6.7 7.9c2.7 2.2 5.9 3.8 9.4 4.7c5.8 1.5 12 .8 17.3-1.9l84.4-25.7c14.2-4.3 27.2-12 37.7-22.5l191.6-191.5z" />
      </svg>
    ),
    'la-folder-open': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
        <path d="M384 480h48c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224H144c-11.4 0-21.9 6-27.6 15.9L48 357.1V96c0-8.8 7.2-16 16-16h117.5c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8H416c8.8 0 16 7.2 16 16v32h48v-32c0-35.3-28.7-64-64-64H298.5c-17 0-33.3-6.7-45.3-18.7l-26.5-26.5C214.7 38.7 198.5 32 181.5 32H64C28.7 32 0 60.7 0 96v320c0 35.3 28.7 64 64 64z" />
      </svg>
    ),
    'la-bullhorn': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6S434 0 425 9.2L381.7 53C337 97.7 276.3 122.9 213 122.9H192 160 64C28.7 122.9 0 151.6 0 186.9v32c0 35.3 28.7 64 64 64l0 96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V282.9h21c63.3 0 124 25.2 168.7 69.9l43.4 43.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V253.1c18.6-8.8 32-32.5 32-61.1s-13.4-52.3-32-61.1V32z" />
      </svg>
    ),
    'la-luggage-cart': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 640 512" fill="currentColor">
        <path d="M0 32C0 14.3 14.3 0 32 0H72c30.6 0 56.8 21.7 62.7 51.7L162.4 192H584c30.4 0 52.5 28.9 44.4 58.2l-41.1 152c-5.8 21.5-25.4 36.6-47.7 36.6H191.3l5.7 30.7c.8 4.5 4.7 7.8 9.4 7.8H536c17.7 0 32 14.3 32 32s-14.3 32-32 32H206.4c-26.6 0-49.6-19-54.4-45.2L99.1 64c-.4-1.7-2.1-2.7-3.7-2.7L32 64C14.3 64 0 49.7 0 32m200 408a40 40 0 1 1 80 0 40 40 0 1 1-80 0m336-40a40 40 0 1 1 0 80 40 40 0 1 1 0-80" />
      </svg>
    ),
    'la-gavel': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3zM27.3 484.7c12.5 12.5 32.8 12.5 45.3 0L226.7 330.7l-45.3-45.3L27.3 439.3c-12.5 12.5-12.5 32.8 0 45.3z" />
      </svg>
    ),
    'la-tasks': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M152.1 38.2c4.7 4.7 4.7 12.3 0 17l-72 72c-4.7 4.7-12.3 4.7-17 0l-32-32c-4.7-4.7-4.7-12.3 0-17s12.3-4.7 17 0L71.6 101.6 135 38.2c4.7-4.7 12.3-4.7 17 0zm0 128c4.7 4.7 4.7 12.3 0 17l-72 72c-4.7 4.7-12.3 4.7-17 0l-32-32c-4.7-4.7-4.7-12.3 0-17s12.3-4.7 17 0l23.4 23.4 63.4-63.4c4.7-4.7 12.3-4.7 17 0M48 312c0-13.3 10.7-24 24-24h208c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24m0-128c0-13.3 10.7-24 24-24h208c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24m0-128c0-13.3 10.7-24 24-24h208c13.3 0 24 10.7 24 24s-10.7 24-24 24H72c-13.3 0-24-10.7-24-24z" />
      </svg>
    ),
    'la-percentage': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
        <path d="M374.6 73.4c12.5 12.5 12.5 32.8 0 45.3l-320 320c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l320-320c12.5-12.5 32.8-12.5 45.3 0M88 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80m208 240a40 40 0 1 1 80 0 40 40 0 1 1-80 0" />
      </svg>
    ),
    'la-money-bill': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
        <path d="M64 64C28.7 64 0 92.7 0 128v256c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64m64 320H64v-64c35.3 0 64 28.7 64 64m-64-192v-64h64c0 35.3-28.7 64-64 64m384 192c0-35.3 28.7-64 64-64v64h-64m64-192c-35.3 0-64-28.7-64-64h64v64m-256 32a96 96 0 1 1 192 0 96 96 0 1 1-192 0" />
      </svg>
    ),
    'la-backward': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160-32 26.7v-58.5-128c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C3.9 213.1 0 215.6 0 222.6c0 7 3.9 9.5 11 16.7l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29v-128-58.5l32 26.7z" />
      </svg>
    ),
    'la-cog': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3M256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160" />
      </svg>
    ),
    'la-history': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M75 75 41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24h110.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75m181 53c-13.3 0-24 10.7-24 24v104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L280 246.1V152c0-13.3-10.7-24-24-24" />
      </svg>
    ),
    'la-money-bill-wave-alt': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512" fill="currentColor">
        <path d="M0 112.5v309.8c0 18 16.7 31.6 35 28.5c75.6-13 158.5-9.5 235.7 21.3 0 1.3 13 1.7 19.6 1.7 0-77 0-114-7-198.5L0 112.5m565 309.8V112.5c-23.7-.4-47.5-2.4-71.4-6.5C475 102.4 432 90 396 75.7v0c-26.7-9-58-12.7-91-12.7v0c-46.7 0-92 7.7-130.6 22 5 56 9 95.6 9 137 49 12 86 36 86 70c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-21-50-50-100-50C82 442 39 478 16 538.5L0 112.5" />
      </svg>
    ),
    'la-file-alt': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
        <path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v288c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64m384 64H256V0L384 128M88 304c-13 0-24 11-24 24s11 24 24 24h208c13 0 24-11 24-24s-11-24-24-24H88m0 96c-13 0-24 11-24 24s11 24 24 24h160c13 0 24-11 24-24s-11-24-24-24H88" />
      </svg>
    ),
    'la-comment': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 49.6 21.4 95.1 57 130.7c-3.5 13-9.6 28-15.8 39.7C30.7 425.6 23.5 437.9 21 442c-1.6 2.6-3.5 5.1-5.6 7.5c-3.7 4.2-4.5 9.4-1.7 14.4s8.4 8 14.5 8c41.4 0 75.5-12.5 99.5-26.4c8 1.2 16.2 1.9 24.6 1.9z" />
      </svg>
    ),
    'la-question-circle': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512m-87.6-228.6c-2.7 8.4-13.6 14.6-22 14.6c-13.4 0-21.9-12.4-19.4-25c.7-3.5 1.5-7 2.5-10.4c1.5-5.1 2.4-9.6 2.4-13.4c0-23.5-14.7-43.6-39.5-43.6c-8.7 0-15.7-7-15.7-15.7s7-15.7 15.7-15.7c41.9 0 71 32 71 75.1c0 6.7-1 13.5-2.4 18.5l-.1.4c-1.1 3.6-2 7.7-2.5 12.5c-.6 4.5-.7 9.6-.4 12.7c.3 3.5 1.2 6.5 2.4 9.1c1.2 2.6 3.7 6.7 3.7 6.7c5 7.9 5 17.7 0 25.7c-3.7 5.8-9 8-14.4 8c-5.4 0-10.7-2.2-14.4-8c-3.8-6-3.8-13.4 0-19.4M256 384a32 32 0 1 1 0-64 32 32 0 1 1 0 64" />
      </svg>
    ),
    'la-atom': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 144a112 112 0 1 1 0 224 112 112 0 1 1 0-224m0 80a32 32 0 1 0 0 64 32 32 0 1 0 0-64M76.7 76.7c39.7-39.7 105.6-26.5 179.3 24.6c73.7-51.1 139.6-64.3 179.3-24.6s26.5 105.6-24.6 179.3c51.1 73.7 64.3 139.6 24.6 179.3s-105.6 26.5-179.3-24.6c-73.7 51.1-139.6 64.3-179.3 24.6s-26.5-105.6 24.6-179.3C25.5 182.3 12.3 116.4 52 76.7m31.4 138.7c-37.4 56.6-50.1 105.4-30.7 124.8s68.2 6.7 124.8-30.7c-22.7-19.6-44-40.9-63.6-63.6c-22.7-19.6-44-40.9-63.6-63.6c-37.4 56.6-50.1 105.4-30.7 124.8m345-124.8c-19.4-19.4-68.2-6.7-124.8 30.7c22.7 19.6 44 40.9 63.6 63.6c19.6 22.7 40.9 44 63.6 63.6c37.4-56.6 50.1-105.4 30.7-124.8z" />
      </svg>
    ),
    'la-fax': (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
        <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h64v-128h160v128h160c35.3 0 64-28.7 64-64V224h-32c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h32V64c0-35.3-28.7-64-64-64H64M128 384V160h160v224H128z" />
      </svg>
    ),
  }
  return <span className="aiz-side-nav-icon-wrap">{icons[name] || null}</span>
}

const ChevronArrow = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" className={`ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
    <path d="M2,1 L6,4 L2,7" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AddonBadge = () => (
  <span className="bg-[#dc3545] text-white rounded-[4px] px-[6px] py-[2px] text-[10px] leading-[14px] font-medium ml-auto mr-2">Addon</span>
)

const SuccessBadge = ({ children }) => (
  <span className="bg-[#28a745] text-white rounded-[4px] px-[6px] py-[2px] text-[10px] leading-[14px] font-medium ml-auto mr-2">{children}</span>
)

// All menu items definition

const MENU_ITEMS = [
  { icon: 'la-home',          label: 'Dashboard',              to: '/seller/dashboard', exact: true },
  {
    icon: 'la-shopping-cart', label: 'Products', hasSubmenu: true,
    subItems: [{ label: 'Products', to: '/seller/products' }],
  },
  { icon: 'la-money-bill',    label: 'Orders',                 to: '/seller/orders' },
  { icon: 'la-luggage-cart',  label: 'Pickup Point Orders',    to: '/seller/pickup-point' },
  { icon: 'la-clock',         label: 'Unpaid Orders',          to: '/seller/unpaid' },
  { icon: 'la-atom',          label: 'Rating and Followers',   to: '/seller/rating' },
]

// Single nav item with optional submenu

function NavItem({ icon, label, to, addon, successBadge, hasSubmenu, subItems, exact, forceOpen }) {
  
  const [open, setOpen] = useState(true)
  const location = useLocation()

  if (hasSubmenu) {
    const childActive = Array.isArray(subItems) && subItems.some((s) => s.to && location.pathname.toLowerCase().startsWith(s.to.toLowerCase()))
    const isOpen = forceOpen !== undefined ? forceOpen : (open || childActive)

    return (
      <li className="aiz-side-nav-item">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); setOpen((o) => !o) }}
          className={`flex items-center px-[20px] py-[10px] text-[13px] leading-[20px] font-normal cursor-pointer hover:text-[#2E294E] ${isOpen || childActive ? 'text-[#2E294E] font-semibold' : 'text-[#2E294E]'}`}
        >
          <LaIcon name={icon} />
          <span className="text-[13px] leading-[20px] flex-1 ml-[12px]">{label}</span>
          {addon && <AddonBadge />}
          {successBadge && <SuccessBadge>{successBadge}</SuccessBadge>}
          <ChevronArrow open={isOpen} />
        </a>
        {isOpen && subItems && (
          <ul className="py-1">
            {subItems.map((s) => (
              <li key={s.label} className="aiz-side-nav-item">
                {s.to ? (
                  <NavLink to={s.to}
                    className={({ isActive }) =>
                      `block pl-[44px] pr-[20px] py-[7px] text-[12px] leading-[18px] hover:text-[#2E294E] ${isActive ? 'text-[#2E294E] font-semibold' : 'text-[#2E294E]'}`
                    }
                  >
                    {s.label}
                  </NavLink>
                ) : (
                  <a href="#" onClick={(e) => e.preventDefault()} className="block pl-[44px] pr-[20px] py-[7px] text-[12px] leading-[18px] text-[#2E294E] hover:text-[#2E294E]">
                    {s.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li className="aiz-side-nav-item">
      <NavLink
        to={to}
        end={exact}
        className={({ isActive }) =>
          `flex items-center px-[20px] py-[10px] text-[13px] leading-[20px] font-normal hover:text-[#2E294E] ${
            isActive ? 'text-[#2E294E] font-semibold' : 'text-[#2E294E]'
          }`
        }
      >
        <LaIcon name={icon} />
        <span className="text-[13px] leading-[20px] flex-1 ml-[12px]">{label}</span>
        {addon && <AddonBadge />}
        {successBadge && <SuccessBadge>{successBadge}</SuccessBadge>}
      </NavLink>
    </li>
  )
}

// Search-filtered menu renderer

function FilteredMenu({ query }) {
  const q = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!q) return MENU_ITEMS

    return MENU_ITEMS.reduce((acc, item) => {
      // Parent label matches
      if (item.label.toLowerCase().includes(q)) {
        acc.push({ ...item, _forceOpen: true })
        return acc
      }
      // Check children
      if (item.hasSubmenu) {
        const matchedSubs = (item.subItems || []).filter(s =>
          s.label.toLowerCase().includes(q)
        )
        if (matchedSubs.length > 0) {
          acc.push({ ...item, subItems: matchedSubs, _forceOpen: true })
        }
      }
      return acc
    }, [])
  }, [q])

  if (filtered.length === 0) {
    return (
      <li className="px-[20px] py-[12px] text-[12px] text-[#a5a5b8]">No results found.</li>
    )
  }

  return filtered.map((item) => (
    <NavItem
      key={item.label}
      icon={item.icon}
      label={item.label}
      to={item.to}
      addon={item.addon}
      successBadge={item.successBadge}
      hasSubmenu={item.hasSubmenu}
      subItems={item.subItems}
      exact={item.exact}
      forceOpen={item._forceOpen}
    />
  ))
}

// Main Sidebar Export

export default function SellerSidebar({ open = true, onClose }) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const shopName = user?.shopName || 'Seller'
  const email    = user?.email    || ''

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-[230px] bg-white flex flex-col flex-shrink-0 border-r border-[#e4e5eb] transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Header */}
        <div className="text-center my-3 px-3">
          <img
            className="max-w-full mx-auto mb-3"
            src="https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/3AbqdTE8u5a8GRgaMqLoEW7xLz7MTGugch2B67gB.webp"
            alt="Active eCommerce CMS"
            style={{ maxWidth: '50px' }}
          />
          <h3 className="text-[16px] m-0 text-[#2E294E] font-medium leading-[1.4]">{shopName}</h3>
          <p className="text-[#2E294E] text-[12px] mt-1 mb-0">{email}</p>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[#d5d6db] [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Search */}
          <div className="px-[20px] mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in menu"
              className="w-full bg-[#f5f5f7] border-0 rounded-[6px] text-[#2E294E] text-[13px] leading-[20px] placeholder:text-[#a5a5b8] px-[12px] py-[7px] focus:outline-none"
            />
          </div>

          {/* Menu */}
          <ul className="list-none p-0 m-0">
            <FilteredMenu query={searchQuery} />
          </ul>
        </div>
      </aside>
    </>
  )
}