import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../components/Card'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export default function EditCustomer_Admin() {
  const navigate    = useNavigate()
  const { id }      = useParams()

  const [fullName,  setFullName]  = useState('')
  const [phone,     setPhone]     = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [useEmail,  setUseEmail]  = useState(false)
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  // Fetch existing customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/manage/users`, { headers: getAuthHeader() })
        const data = await res.json()
        if (data.success) {
          const customer = data.data.find((u) => u._id === id)
          if (customer) {
            setFullName(customer.fullName || '')
            setPhone(customer.phone || '')
            setEmail(customer.email || '')
            // If customer has email but no phone, default to email mode
            if (customer.email && !customer.phone) setUseEmail(true)
          }
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchCustomer()
  }, [id])

  const handleSave = async () => {
    setError('')
    if (!fullName.trim()) { setError('Name is required.'); return }
    if (useEmail && !email.trim()) { setError('Email is required.'); return }
    if (!useEmail && !phone.trim()) { setError('Phone is required.'); return }

    setSaving(true)
    try {
      const body = {
        fullName: fullName.trim(),
        email:    useEmail  ? email.trim() : email.trim(),
        phone:    !useEmail ? phone.trim() : phone.trim(),
      }
      if (password.trim()) body.password = password.trim()

      const res  = await fetch(`${API}/manage/users/${id}`, {
        method:  'PUT',
        headers: getAuthHeader(),
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        alert('Saved!')
        navigate('/admin/customers/list')
      } else {
        setError(data.message || 'Failed to update customer.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <p className="text-[13px] text-[#9da3ae] mt-[24px]">Loading...</p>
    )
  }

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[24px]">
        Edit Customer
      </h1>

      <div className="flex justify-center">
        <div className="w-full max-w-[600px]">
          <Card>
            <div className="px-[30px] py-[30px]">
              <h2 className="text-[16px] font-semibold text-[#232734] mb-[24px]">
                Customer Information
              </h2>

              {/* Error */}
              {error && (
                <div className="mb-[16px] text-[13px] text-[#f1416c]">{error}</div>
              )}

              {/* Name */}
              <div className="flex items-start mb-[16px]">
                <label className="w-[120px] shrink-0 text-[14px] font-medium text-[#232734] pt-[10px]">
                  Name <span className="text-[#f1416c]">*</span>
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-[42px] px-[14px] text-[13px] text-[#232734] border border-[#e4e6ef] rounded-[6px] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7]"
                  />
                </div>
              </div>

              {/* Phone or Email (toggled) */}
              <div className="flex items-start mb-[4px]">
                <label className="w-[120px] shrink-0 text-[14px] font-medium text-[#232734] pt-[10px]">
                  {useEmail ? 'Email' : 'Phone'} <span className="text-[#f1416c]">*</span>
                </label>
                <div className="flex-1">
                  {useEmail ? (
                    <input
                      type="email"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[42px] px-[14px] text-[13px] text-[#232734] border border-[#e4e6ef] rounded-[6px] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7]"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder=""
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-[42px] px-[14px] text-[13px] text-[#232734] border border-[#e4e6ef] rounded-[6px] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7]"
                    />
                  )}
                </div>
              </div>

              {/* *Use Email Instead / *Use Phone Instead */}
              <div className="flex mb-[16px]">
                <div className="w-[120px] shrink-0" />
                <div className="flex-1 text-right">
                  <button
                    type="button"
                    onClick={() => setUseEmail((v) => !v)}
                    className="text-[13px] text-[#009ef7] hover:underline focus:outline-none"
                  >
                    {useEmail ? '*Use Phone Instead' : '*Use Email Instead'}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="flex items-start mb-[24px]">
                <label className="w-[120px] shrink-0 text-[14px] font-medium text-[#232734] pt-[10px]">
                  Password
                </label>
                <div className="flex-1">
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[42px] px-[14px] text-[13px] text-[#232734] border border-[#e4e6ef] rounded-[6px] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7]"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="h-[38px] px-[24px] rounded-[6px] bg-[#009ef7] hover:bg-[#0095e8] text-white text-[13px] font-semibold disabled:opacity-60 focus:outline-none"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}