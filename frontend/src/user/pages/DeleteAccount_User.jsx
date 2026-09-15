import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Confirmation Modal

function DeleteAccountModal({ show, onClose, onConfirm, deleting, avatar }) {
  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[1050] block overflow-x-hidden overflow-y-auto"
      tabIndex="-1"
      role="dialog"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative w-auto mx-auto my-[1.75rem] max-w-[800px] pointer-events-none" role="document">
        <div className="relative flex flex-col w-full bg-white pointer-events-auto border-0 rounded-none">
          <div className="block py-[1.5rem] px-[1rem] border-b border-[#dfdfe6]">
            <div className="flex justify-center">
              <span className="inline-block w-[64px] h-[64px] rounded-full overflow-hidden mb-[0.5rem] mt-[0.5rem]">
                <img
                  src={avatar || 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/avatar-place.png'}
                  className="m-auto w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src =
                      'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/avatar-place.png'
                  }}
                  alt="Avatar"
                />
              </span>
            </div>
            <h4
              className="text-center font-bold text-[18px] leading-[1.5] mb-[0.5rem]"
              style={{ color: '#ff9819' }}
            >
              Delete Your Account
            </h4>
            <p className="text-[16px] font-semibold text-center mb-0" style={{ color: '#8d8d8d' }}>
              Warning: You cannot undo this action
            </p>
          </div>

          <div className="pt-[1rem] pb-[3rem] px-[1rem] xl:px-[3rem] flex-1">
            <p className="text-[#dc3545] mt-[1rem] font-extrabold">
              <i>
                Note:&nbsp;Don't Click to any button or don't do any action during account
                Deletion, it may takes some times.
              </i>
            </p>
            <p className="text-[14px] font-bold" style={{ color: '#8d8d8d' }}>
              Deleting Account Means:
            </p>
            <div className="flex flex-wrap py-[0.5rem] mb-[0.5rem] ml-0 mr-0 border-l-2 border-[#dc3545]" style={{ background: 'rgba(243, 175, 61, 0.15)' }}>
              <div className="w-[8.333333%] flex-shrink-0 max-w-[8.333333%] px-[15px]">
                <img
                  src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/warning.png"
                  className="h-[20px]"
                  alt="warning"
                />
              </div>
              <div className="flex-1 px-[15px]">
                <p className="font-semibold mb-0">
                  If you create any classified products, after deleting your account, those
                  products will no longer in our system
                </p>
              </div>
            </div>
            <div className="flex flex-wrap py-[1rem] ml-0 mr-0 border-l-2 border-[#dc3545]" style={{ background: 'rgba(243, 175, 61, 0.15)' }}>
              <div className="w-[8.333333%] flex-shrink-0 max-w-[8.333333%] px-[15px]">
                <img
                  src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/warning.png"
                  className="h-[20px]"
                  alt="warning"
                />
              </div>
              <div className="flex-1 px-[15px]">
                <p className="font-semibold mb-0">
                  After deleting your account, wallet balance will no longer in our system
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end p-[1rem] border-t border-[#dfdfe6]">
            <button
              type="button"
              disabled={deleting}
              className="bg-[#919199] hover:bg-[#5d5d62] text-white border-0 rounded-none w-[150px] py-[0.375rem] px-[0.75rem] text-[14px] mr-[0.25rem] disabled:opacity-60"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              className="bg-[#dc3545] hover:bg-[#bb2d3b] text-white border-0 rounded-none w-[150px] py-[0.375rem] px-[0.75rem] text-[14px] disabled:opacity-60"
              onClick={onConfirm}
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Export

export default function DeleteAccount_User() {
  const navigate  = useNavigate()
  const { token, logout, user } = useAuth()

  const [showModal, setShowModal] = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [error,     setError]     = useState('')

  
  useEffect(() => {
    setShowModal(true)
  }, [])

  const handleConfirm = async () => {
    setDeleting(true)
    setError('')
    try {
      const res  = await fetch(`${API_URL}/auth/account`, {
        method:  'DELETE',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        logout()               
        navigate('/')         
      } else {
        setError(data.message || 'Failed to delete account. Please try again.')
        setDeleting(false)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Title bar kept for layout consistency */}
      <div className="mb-[1.5rem]">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2">
            <h1 className="text-[20px] font-bold text-[#292933]">Delete My Account</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-[15px]">
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <DeleteAccountModal
        show={showModal}
        onClose={() => !deleting && navigate(-1)}
        onConfirm={handleConfirm}
        deleting={deleting}
        avatar={user?.avatar}
      />
    </div>
  )
}