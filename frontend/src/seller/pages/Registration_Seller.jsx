import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/common/Container'

const LOGO  = '/src/images/Logo.png'
const IMAGE = '/src/images/Reg.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Registration_Seller() {
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    shopName: '',
    address: '',
    phone: '',
    password: '',
  })
  const [error,  setError]  = useState('')
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName || !form.email || !form.shopName || !form.phone || !form.password) {
      setError('Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      const res  = await fetch(`${API_URL}/auth/register/seller`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Registration failed'); return }
      navigate('/seller/pages/login')
    } catch {
      setError('Server error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white min-h-screen flex items-center">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto border border-gray-200">

          {/* LEFT IMAGE */}
          <div className="hidden lg:block">
            <img src={IMAGE} alt="register" className="w-full h-full object-cover" />
          </div>

          {/* RIGHT FORM */}
          <div className="p-4 sm:p-5 lg:p-5 flex flex-col justify-center">

            {/* LOGO */}
            <div className="w-12 mb-1">
              <img src={LOGO} alt="logo" className="w-full h-full object-contain" />
            </div>

            {/* TITLE */}
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0080FF] uppercase mb-2">
              Become a seller.
            </h1>

            {error && (
              <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded">
                {error}
              </div>
            )}

            {/* FORM */}
            <form className="space-y-1" onSubmit={handleSubmit}>

              {/* NAME */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* SHOP NAME */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  placeholder="Shop Name"
                  value={form.shopName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="01xxxxxxxxx"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-1 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                  />
                  <span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 select-none flex items-center">
                    {showPass ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.331 2.5 9.964 5.678a1.012 1.012 0 0 1 0 .644C20.33 15.5 16.348 18 12 18c-4.348 0-8.331-2.5-9.964-5.678Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    )}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#0080FF] text-white py-2.5 text-[14px] font-semibold hover:bg-[#0066CC] transition-colors disabled:opacity-60"
              >
                {saving ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* LOGIN */}
            <p className="text-[13px] text-gray-500 mt-2">
              Already have an account?
              <Link to="/seller/pages/login" className="ml-1 text-[14px] font-bold text-[#0080FF] hover:underline">Log In</Link>
            </p>

            {/* BACK */}
            <div className="mt-2">
              <Link to="/" className="flex items-center gap-1 text-[14px] font-bold text-[#0080FF] hover:underline">
                ← Back to Previous Page
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}