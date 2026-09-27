import { Link } from 'react-router-dom'

// Static data 
const REFUND_REQUESTS = [
  {
    id: '2',
    productImg:
      'https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/3OHZkcxYcNmGJf2SWAJzPhiauyquXtIMFgfzCQKv.webp',
    productName:
      'iPhone 17 Pro Max - Demo content for Active eCommerce CMS by Active IT zone Limited - Premium Item of codecanyon',
    appliedDate: '18-12-2025',
    orderCode: '20251218-13480837',
    orderDetailsUrl: '#',
    amount: '$1,018.98',
    channel: 'Wallet',
    status: 'Approved', // 'Approved' | 'Pending' | 'Rejected'
  },
]

const PLACEHOLDER =
  'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'

// Status badge styles

const STATUS_CLASS = {
  Approved: 'bg-[#85b567] hover:bg-[#6fa052]',
  Pending: 'bg-[#f3af3d] hover:bg-[#dc9b29]',
  Rejected: 'bg-[#dc3545] hover:bg-[#bb2d3b]',
}

// Refund Request Row

function RefundRow({ request }) {
  const btnClass = STATUS_CLASS[request.status] || 'bg-[#919199] hover:bg-[#5d5d62]'

  const handleView = () => {
    console.log('View refund:', request.id)
  }

  return (
    <>
      <div className="flex flex-wrap items-center mb-[1rem] -mx-[15px]">
        <div className="w-full md:w-12/12 px-[15px]">
          <div className="flex flex-wrap -mx-[15px]">
            {/* Product image + name */}
            <div className="w-full md:w-3/12 xl:w-4/12 px-[15px] flex items-center mb-[0.25rem] md:mb-0">
              <div className="border border-[#dfdfe6] rounded-none mr-[1rem]">
                <img
                  src={request.productImg}
                  className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] md:w-[48px] md:h-[48px] object-cover overflow-hidden"
                  alt={request.productName}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = PLACEHOLDER
                  }}
                />
              </div>
              <div className="w-full">
                <div
                  className="font-semibold text-[14px] text-[#292933] overflow-hidden"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                  title={request.productName}
                >
                  {request.productName}
                </div>
              </div>
            </div>

            {/* Applied date + order code */}
            <div className="w-full md:w-3/12 xl:w-3/12 px-[15px]">
              <div>
                <span className="text-[#6c757d]">Applied:</span>{' '}
                <span className="font-bold">{request.appliedDate}</span>
              </div>
              <div className="text-[#6c757d]">Order Code:</div>
              <div className="font-bold">
                <Link className="text-[#3490f3] no-underline hover:underline" to={request.orderDetailsUrl}>
                  {request.orderCode}
                </Link>
              </div>
            </div>

            {/* Amount */}
            <div className="w-full md:w-2/12 xl:w-2/12 px-[15px]">
              <div className="text-[#6c757d]">Amount</div>
              <div className="font-bold">{request.amount}</div>
            </div>

            {/* Channel */}
            <div className="w-full md:w-3/12 lg:w-2/12 xl:w-1/12 px-[15px]">
              <div className="text-[#6c757d]">Channel</div>
              <div className="font-bold">{request.channel}</div>
            </div>

            {/* Status / Action */}
            <div className="w-full md:w-3/12 lg:w-2/12 px-[15px] mt-[0.25rem] lg:mt-0">
              <div className="flex flex-wrap -mx-[15px]">
                <div className="w-full md:w-12/12 px-[15px] text-right">
                  <button
                    type="button"
                    className={`${btnClass} text-white border-0 px-[0.5rem] py-[0.25rem] text-[12px] rounded-[0.25rem] w-[100px]`}
                    onClick={handleView}
                  >
                    {request.status}
                    <i className="las la-arrow-right ml-[0.25rem]"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-[1rem] border-0 border-t border-[#dfdfe6]" />
        </div>
      </div>
    </>
  )
}

// Page Component

export default function RefundRequests_User() {
  return (
    <div className="bg-white shadow-none rounded-none border border-[#dfdfe6] p-[1.5rem]">
      <h5 className="mb-[0.5rem] text-[20px] font-bold text-[#292933]">Applied Refund Requests</h5>
      <hr className="my-[1rem] border-0 border-t border-[#dfdfe6]" />
      <div className="py-0 pt-[1rem] px-0">
        <div className="mb-[1.5rem]">
          {REFUND_REQUESTS.length === 0 ? (
            <div className="text-center py-[3rem]">
              <i className="las la-inbox" style={{ fontSize: 64, color: '#dfdfe6' }}></i>
              <p className="text-[#919199] mt-[1rem] text-[14px]">No refund requests found.</p>
            </div>
          ) : (
            REFUND_REQUESTS.map((req) => (
              <RefundRow key={req.id} request={req} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}