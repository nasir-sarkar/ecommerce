import { useState } from 'react'
import { sampleRefunds } from '../data/sampleSellerData'

const SearchSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16.001" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const KebabIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 128 512" fill="#a1a5b3">
    <path d="M64 360a56 56 0 1 1 0 112 56 56 0 1 1 0-112m0-160a56 56 0 1 1 0 112 56 56 0 1 1 0-112M120 96A56 56 0 1 1 8 96a56 56 0 1 1 112 0" />
  </svg>
)

const TABS = [
  { id: 'all-refunds', label: 'All Refunds' },
  { id: 'pending',     label: 'Pending' },
  { id: 'approved',    label: 'Approved' },
  { id: 'rejected',    label: 'Rejected' },
  { id: 'wallet',      label: 'Wallet' },
  { id: 'offline',     label: 'Offline' },
]

function StatusBadge({ status }) {
  const map = {
    'Approved': 'bg-[#28a745] text-white',
    'Rejected': 'bg-[#dc3545] text-white',
    'Pending':  'bg-[#ffc107] text-white',
    'N/A':      'bg-[#17a2b8] text-white',
    'Non-Paid': 'bg-[#ffc107] text-white',
    'Paid':     'bg-[#28a745] text-white',
  }
  const cls = map[status] || 'bg-[#a1a5b3] text-white'
  return <span className={`px-2 py-[2px] text-[12px] rounded-[3px] ${cls}`}>{status}</span>
}

export default function Refund_Seller() {
  const [activeTab, setActiveTab] = useState('all-refunds')

  return (
    <div>
      <div className="text-left pb-[5px]">
        <div className="flex items-center">
          <div>
            <h1 className="text-[20px] font-bold text-[#2E294E]">All Refund Requests</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[6px] mt-3">
        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[25px]">
          <div className="">
            <ul className="flex border-0 list-none p-0 m-0 gap-6 flex-wrap">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveTab(t.id)}
                    type="button"
                    className={`px-0 pb-[15px] pt-3 text-[14px] font-medium border-b-2 ${
                      activeTab === t.id ? 'text-[#009ef7] border-[#009ef7]' : 'text-[#2E294E] border-transparent'
                    }`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 mt-3 pt-3">
          <div className="flex flex-1 items-center mb-0 border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px]">
            <span className="px-0 mr-2"><SearchSvg /></span>
            <input type="text" className="border-0 px-2 bg-transparent flex-1 py-2 text-[14px] focus:outline-none" placeholder="Search Request ..." />
          </div>
        </div>

        {/* Table */}
        <div className="px-3 py-3 mt-3">
          <table className="w-full">
            <thead>
              <tr className="text-[#a1a5b3] text-[12px] font-semibold uppercase">
                <th className="text-left py-3 pl-3 w-[40px]">#</th>
                <th className="text-left py-3">Refund Code</th>
                <th className="text-left py-3">Product</th>
                <th className="text-left py-3">Refund Amount</th>
                <th className="text-left py-3">Approval Status</th>
                <th className="text-left py-3">Dispute Status</th>
                <th className="text-left py-3">Payment Status</th>
                <th className="text-left py-3">Options</th>
              </tr>
            </thead>
            <tbody>
              {sampleRefunds.map((r, i) => (
                <tr key={i} className="border-t border-[#f1f1f4]">
                  <td className="py-4 pl-3 text-[#2E294E] text-[14px]">{i + 1}</td>
                  <td className="py-4">
                    <div className="text-[#2E294E] text-[14px] font-semibold">{r.refundCode}</div>
                    <div className="text-[#2E294E] text-[13px]">{r.refundUser}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={r.productImage} alt={r.productName} className="w-[40px] h-[40px] object-contain rounded" />
                      <span className="text-[#009ef7] text-[14px]">{r.productName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#2E294E] text-[14px]">{r.refundAmount}</td>
                  <td className="py-4">
                    <div className="flex items-center mb-1">
                      <span className="text-[#2E294E] text-[13px] mr-2">Seller</span>
                      <StatusBadge status={r.sellerStatus} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-[#2E294E] text-[13px] mr-2">Admin</span>
                      <StatusBadge status={r.adminStatus} />
                    </div>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={r.disputeStatus} />
                  </td>
                  <td className="py-4">
                    <div className="text-[#2E294E] text-[13px] mb-1">{r.paymentMode}</div>
                    <StatusBadge status={r.paymentStatus} />
                  </td>
                  <td className="py-4">
                    <button className="p-2 hover:bg-[#f5f5f7] rounded-full"><KebabIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}