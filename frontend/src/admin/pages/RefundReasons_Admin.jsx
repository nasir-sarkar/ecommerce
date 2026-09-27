import { useState } from 'react'
import Card from '../components/Card'

// Icons
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <path d="M141.874-812.13a.706.706,0,0,1-.515-.21.7.7,0,0,1-.212-.514V-817.4h-4.553a.7.7,0,0,1-.514-.209.694.694,0,0,1-.21-.511.706.706,0,0,1,.21-.515.7.7,0,0,1,.514-.212h4.549v-4.557a.7.7,0,0,1,.209-.514.694.694,0,0,1,.511-.21.706.706,0,0,1,.515.21.7.7,0,0,1,.212.514v4.553h4.557a.7.7,0,0,1,.514.208.694.694,0,0,1,.21.511.706.706,0,0,1-.21.515.7.7,0,0,1-.514.212h-4.553v4.553a.7.7,0,0,1-.209.514A.694.694,0,0,1,141.874-812.13Z" transform="translate(-135.87 824.13)" fill="#fff" />
  </svg>
)

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SadFaceIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a5a5b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/>
    <line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
)

export default function RefundReasons_Admin() {
  const [activeTab, setActiveTab] = useState('customer')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [allChecked, setAllChecked] = useState(false)

  return (
    <>
      {/* Page title */}
      <div className="pb-[5px]">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Refund Reasons</h1>
      </div>

      <Card>
        {/* Nav Tabs + Add Button */}
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[25px] pb-3 pb-xl-0">
          <div className="flex-grow">
            <ul className="flex items-center gap-[24px] m-0 p-0 list-none">
              <li>
                <button type="button" onClick={() => setActiveTab('customer')}
                  className={`px-0 pb-[15px] text-[14px] font-medium border-b-2 ${activeTab === 'customer' ? 'border-[#009ef7] text-[#009ef7]' : 'border-transparent text-[#9da3ae]'}`}>
                  Customer Refund Reason
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setActiveTab('reject')}
                  className={`px-0 pb-[15px] text-[14px] font-medium border-b-2 ${activeTab === 'reject' ? 'border-[#009ef7] text-[#009ef7]' : 'border-transparent text-[#9da3ae]'}`}>
                  Admin/Seller Reject Refund Reason
                </button>
              </li>
            </ul>
          </div>

          {/* Right Side - Add New Button */}
          <div className="mb-3 mb-md-0">
            <a href="#" className="relative overflow-hidden inline-flex items-center h-[36px] pl-[20px] pr-[50px] rounded-full">
              <span className="relative z-[2] text-[14px] font-medium text-[#009ef7]">Add New Refund Reason</span>
              <span className="absolute top-0 right-0 h-full w-[40px] bg-[#009ef7] flex items-center justify-center z-[1] rounded-full">
                <PlusIcon />
              </span>
            </a>
          </div>
        </div>

        {/* Search + Bulk Action */}
        <div className="px-[16px] md:px-[24px] pt-[16px] flex flex-wrap items-center gap-[10px]">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px] h-[38px]">
              <span className="flex items-center pr-2"><SearchIconGray /></span>
              <input type="text" placeholder="Search Refund Reason ..."
                className="flex-1 bg-transparent border-0 outline-none text-[13px] text-[#232734] placeholder-[#a5a5b8]" />
            </div>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setBulkOpen((o) => !o)}
              className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[4px] h-[38px] px-[14px] flex items-center gap-2 text-[14px] text-[#7e8299]">
              Bulk Action <CaretIcon />
            </button>
            {bulkOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-[160px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-[#f1416c] hover:bg-[#fff4f8]">Update Status</a>
              </div>
            )}
          </div>
        </div>

        {/* Table header */}
        <div className="px-[8px] md:px-[16px] pt-[16px] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="px-[16px] py-[12px] text-left w-[40px]">
                  <input type="checkbox" checked={allChecked} onChange={(e) => setAllChecked(e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">TYPE</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">REASON</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">STATUS</th>
                <th className="px-[16px] py-[12px] text-right text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">OPTIONS</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-[60px]">
          <p className="text-[14px] text-[#232734] mb-[16px] m-0 font-medium">No Data found!</p>
          <SadFaceIcon />
        </div>
      </Card>
    </>
  )
}