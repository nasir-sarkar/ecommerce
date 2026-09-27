import { useState } from 'react'

// Static data
const WALLET_BALANCE = '$11,018.98'

const RECHARGE_HISTORY = [
  {
    id: 1,
    serial: '01',
    date: '18-12-2025',
    amount: '$1,018.98',
    method: 'Refund',
    status: null,
  },
  {
    id: 2,
    serial: '02',
    date: '16-12-2025',
    amount: '$10,000.00',
    method: 'U.S. Bank',
    status: 'Approved',
  },
]

// Recharge Modal

function RechargeModal({ show, onClose }) {
  const [amount, setAmount] = useState('')

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[1050] block overflow-x-hidden overflow-y-auto"
      tabIndex="-1"
      role="dialog"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative w-auto mx-auto my-[1.75rem] max-w-[500px] flex items-center min-h-[calc(100%-3.5rem)] pointer-events-none" role="document">
        <div className="relative flex flex-col w-full bg-white pointer-events-auto border-0 rounded-none">
          <div className="flex items-start justify-between p-[1rem] border-b border-[#dfdfe6]">
            <h5 className="mb-0 text-[18px] font-medium leading-normal">Recharge Wallet</h5>
            <button type="button" className="p-0 m-[-1rem_-1rem_-1rem_auto] bg-transparent border-0 text-[1.5rem] font-bold leading-none" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="p-[1rem] flex-1">
            <div className="mb-[1rem]">
              <label className="text-[14px] font-semibold mb-[0.5rem] block">Amount</label>
              <input
                type="number"
                className="block w-full h-[calc(1.5em+0.75rem+2px)] px-[0.75rem] py-[0.375rem] text-[14px] font-normal text-[#292933] bg-white bg-clip-padding border border-[#dfdfe6] rounded-none focus:outline-none focus:border-[#0080ff]"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end p-[0.75rem] border-t border-[#dfdfe6]">
            <button type="button" className="bg-[#919199] hover:bg-[#5d5d62] text-white border-0 rounded-none py-[0.375rem] px-[0.75rem] text-[14px] mr-[0.25rem]" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="bg-[#0080ff] hover:bg-[#0066cc] text-white border-0 rounded-none py-[0.375rem] px-[0.75rem] text-[14px]">
              Recharge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Recharge History Table

function RechargeHistoryTable() {
  return (
    <div className="bg-white rounded-none shadow-none border border-[#dfdfe6]">
      <div className="px-[1.25rem] py-[0.75rem] border-b-0">
        <h5 className="mb-0 text-[20px] font-bold text-[#292933] text-center md:text-left">
          Wallet Recharge History
        </h5>
      </div>
      <div className="px-[1.25rem] py-0">
        <table className="w-full mb-[1.5rem] border-collapse">
          <thead className="text-[#9d9da6] text-[12px]">
            <tr>
              <th className="pl-0 pr-[0.75rem] py-[0.75rem] text-left font-semibold border-b-2 border-[#dfdfe6] align-bottom">#</th>
              <th className="px-[0.75rem] py-[0.75rem] text-left font-semibold border-b-2 border-[#dfdfe6] align-bottom hidden lg:table-cell">Date</th>
              <th className="px-[0.75rem] py-[0.75rem] text-left font-semibold border-b-2 border-[#dfdfe6] align-bottom">Amount</th>
              <th className="px-[0.75rem] py-[0.75rem] text-left font-semibold border-b-2 border-[#dfdfe6] align-bottom hidden lg:table-cell">Payment method</th>
              <th className="text-right pr-0 pl-[0.75rem] py-[0.75rem] font-semibold border-b-2 border-[#dfdfe6] align-bottom">Status</th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {RECHARGE_HISTORY.map((row) => (
              <tr key={row.id}>
                <td className="pl-0 pr-[0.75rem] py-[0.75rem] border-t border-[#dfdfe6] align-top">{row.serial}</td>
                <td className="px-[0.75rem] py-[0.75rem] border-t border-[#dfdfe6] align-top hidden lg:table-cell">{row.date}</td>
                <td className="px-[0.75rem] py-[0.75rem] border-t border-[#dfdfe6] align-top font-bold">{row.amount}</td>
                <td className="px-[0.75rem] py-[0.75rem] border-t border-[#dfdfe6] align-top hidden lg:table-cell">{row.method}</td>
                <td className="text-right pr-0 pl-[0.75rem] py-[0.75rem] border-t border-[#dfdfe6] align-top">
                  {row.status ? (
                    <div className="inline-block relative">
                      <button
                        type="button"
                        className="bg-[#85b567] hover:bg-[#6fa052] text-white border-0 px-[1rem] py-[0.25rem] text-[12px] rounded-none w-[165px] font-medium"
                      >
                        {row.status}
                      </button>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="mb-[1.5rem]"></div>
      </div>
    </div>
  )
}

// Main Export

export default function MyWallet_User() {
  const [showRechargeModal, setShowRechargeModal] = useState(false)

  return (
    <div>
      {/* Title */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-[20px] font-bold text-[#292933]">My Wallet</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap -mx-[8px] mb-[0.5rem]">
        {/* Wallet Balance */}
        <div className="w-full md:w-1/3 mx-auto px-[8px] mb-[1.5rem]">
          <div className="bg-[#292933] text-white overflow-hidden text-center p-[1.5rem] h-full">
            <img
              src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/wallet-icon.png"
              alt=""
              className="inline-block"
            />
            <div className="py-[0.5rem]">
              <div className="text-[14px] font-normal text-center">Wallet Balance</div>
              <div className="text-[30px] font-bold text-center">{WALLET_BALANCE}</div>
            </div>
          </div>
        </div>

        {/* Recharge Wallet */}
        <div className="w-full md:w-1/3 mx-auto px-[8px] mb-[1.5rem]">
          <div
            className="p-[1.5rem] mb-[1rem] cursor-pointer text-center bg-[#f5f5f5] transition border border-[#dfdfe6] h-full hover:bg-[#dfdfe6]"
            onClick={() => setShowRechargeModal(true)}
          >
            <span className="w-[60px] h-[60px] rounded-full mx-auto bg-[#292933] flex items-center justify-center mb-[1rem]">
              <i className="las la-plus la-3x text-white"></i>
            </span>
            <div className="text-[14px] font-semibold text-[#292933]">Recharge Wallet</div>
          </div>
        </div>

        {/* Offline Recharge Wallet */}
        <div className="w-full md:w-1/3 mx-auto px-[8px] mb-[1.5rem]">
          <div
            className="p-[1.5rem] mb-[1rem] cursor-pointer text-center bg-[#f5f5f5] transition border border-[#dfdfe6] h-full hover:bg-[#dfdfe6]"
          >
            <span className="w-[60px] h-[60px] rounded-full mx-auto bg-[#292933] flex items-center justify-center mb-[1rem]">
              <i className="las la-plus la-3x text-white"></i>
            </span>
            <div className="text-[14px] font-semibold text-[#292933]">Offline Recharge Wallet</div>
          </div>
        </div>
      </div>

      {/* Recharge History */}
      <RechargeHistoryTable />

      {/* Recharge Modal */}
      <RechargeModal show={showRechargeModal} onClose={() => setShowRechargeModal(false)} />
    </div>
  )
}