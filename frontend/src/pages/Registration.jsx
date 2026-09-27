import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import { useAuth } from '../context/AuthContext'

const LOGO  = '/src/images/Logo.png'
const IMAGE = '/src/images/Reg.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Register() {
  const [usePhone,    setUsePhone]    = useState(true)
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fullName,    setFullName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [phone,       setPhone]       = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [agreed,      setAgreed]      = useState(false)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    if (!agreed)              { setError('Please accept the terms and conditions'); return }

    setLoading(true)
    try {
      const res  = await fetch(`${API_URL}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          fullName,
          email:    usePhone ? '' : email,
          phone:    usePhone ? phone : '',
          password,
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Registration failed'); return }
      login(data.token, data.user, 'user')
      navigate('/user-dashboard')
    } catch {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
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
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

            {/* LOGO */}
            <div className="w-12 mb-3">
              <img src={LOGO} alt="logo" className="w-full h-full object-contain" />
            </div>

            {/* TITLE */}
            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#0080FF] uppercase mb-4">
              Create an account.
            </h1>

            {error && (
              <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded">
                {error}
              </div>
            )}

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* NAME */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-3 py-2 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                />
              </div>

              {/* PHONE / EMAIL */}
              {usePhone ? (
                <div>
                  <label className="text-[12px] font-bold text-gray-700">Phone</label>
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-3 py-2 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[12px] font-bold text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-3 py-2 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                  />
                </div>
              )}

              {/* TOGGLE */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setUsePhone(!usePhone)}
                  className="text-[13px] text-[#0080FF] hover:underline"
                >
                  {usePhone ? '*Use Email Instead' : '*Use Phone Number Instead'}
                </button>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-3 py-2 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                  />
                  <span onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 select-none flex items-center">
                    {showPass ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.331 2.5 9.964 5.678a1.012 1.012 0 0 1 0 .644C20.33 15.5 16.348 18 12 18c-4.348 0-8.331-2.5-9.964-5.678Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    )}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 mt-1 text-right">Password must contain at least 6 digits</p>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-[12px] font-bold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-3 py-2 mt-1 text-[14px] outline-none focus:border-[#0080FF]"
                  />
                  <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 select-none flex items-center">
                    {showConfirm ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.331 2.5 9.964 5.678a1.012 1.012 0 0 1 0 .644C20.33 15.5 16.348 18 12 18c-4.348 0-8.331-2.5-9.964-5.678Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    )}
                  </span>
                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-2 text-[13px]">
                <input type="checkbox" className="mt-1" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <p>
                  By signing up you agree to our{' '}
                  <Link to="/terms-conditions" className="font-medium text-[#0080FF] hover:underline">terms and conditions</Link>
                </p>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0080FF] text-white py-2.5 text-[14px] font-semibold hover:bg-[#0066CC] transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* LOGIN */}
            <p className="text-[13px] text-gray-500 mt-4">
              Already have an account?
              <Link to="/login" className="ml-1 text-[14px] font-bold text-[#0080FF] hover:underline">Log In</Link>
            </p>

            {/* BACK */}
            <div className="mt-4">
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