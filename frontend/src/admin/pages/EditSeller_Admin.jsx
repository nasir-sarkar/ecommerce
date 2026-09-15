import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getAuthHeader() {
  const token = localStorage.getItem('ec_token') || ''
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export default function EditSeller_Admin() {
  const navigate = useNavigate()
  const { id }   = useParams()

  const [form, setForm] = useState({
    fullName: '',
    email:    '',
    shopName: '',
    address:  '',
    phone:    '',
    password: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  // Fetch existing seller data
  useEffect(() => {
    const fetchSeller = async () => {
      setLoading(true)
      try {
        const res  = await fetch(`${API}/manage/sellers`, { headers: getAuthHeader() })
        const data = await res.json()
        if (data.success) {
          const seller = data.data.find((s) => s._id === id)
          if (seller) {
            setForm({
              fullName: seller.fullName || '',
              email:    seller.email    || '',
              shopName: seller.shopName || '',
              address:  seller.address  || '',
              phone:    seller.phone    || '',
              password: '',
            })
          }
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchSeller()
  }, [id])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      alert('Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      const body = { ...form }
      if (!body.password) delete body.password

      const res  = await fetch(`${API}/manage/sellers/${id}`, {
        method:  'PUT',
        headers: getAuthHeader(),
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        alert('Saved!')
        navigate('/admin/sellers/list')
      } else {
        alert(data.message || 'Failed to update seller.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred.')
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
      {/* Page title */}
      <h1 className="text-[20px] leading-[28px] font-semibold text-[#232734] mb-[20px]">Edit Seller</h1>

      {/* Centered card */}
      <div className="max-w-[600px] mx-auto bg-white border border-[#e1e3ea] rounded-[8px] shadow-[0px_2px_6px_rgba(35,39,52,0.06)]">
        <div className="px-[30px] py-[24px]">

          {/* Card section title */}
          <p className="text-[15px] font-semibold text-[#232734] mb-[20px]">Seller Information</p>

          <div className="flex flex-col gap-[14px]">

            {/* Name */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">
                Name <span className="text-[#f1416c]">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Name"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

            {/* Email */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">
                Email <span className="text-[#f1416c]">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

            {/* Shop Name */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                placeholder="Shop Name"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

            {/* Address */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">
                Phone <span className="text-[#f1416c]">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

            {/* Password */}
            <div className="flex items-center">
              <label className="w-[120px] flex-shrink-0 text-[13px] text-[#232734]">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                className="flex-1 h-[38px] px-[12px] border border-[#e1e3ea] rounded-[4px] text-[13px] text-[#232734] placeholder:text-[#b5b5c3] focus:outline-none focus:border-[#009ef7] bg-white"
              />
            </div>

          </div>

          {/* Save button */}
          <div className="flex justify-end mt-[20px]">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-[38px] px-[22px] bg-[#009ef7] hover:bg-[#0095e8] text-white text-[13px] font-medium rounded-[4px] disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}