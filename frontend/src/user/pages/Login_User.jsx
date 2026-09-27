import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login_User() {
  const [showPass, setShowPass] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const autoFillCustomer = () => {
    setIdentifier('customer@example.com')
    setPassword('123456')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message || 'Login failed'); setLoading(false); return }
      login(data.token, data.user, data.role)
      navigate('/user/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="aiz-main-wrapper flex flex-col md:justify-center bg-white min-h-screen"
      style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}
    >
      <section className="bg-white overflow-hidden">
        <div className="flex flex-wrap">
          <div className="w-full md:w-[58.333333%] lg:w-[83.333333%] xl:w-[75%] 2xl:w-1/2 mx-auto lg:py-[1.5rem]">
            <div className="bg-white shadow-none rounded-none border-0">
              <div className="flex flex-wrap">

                {/* Left Side Image */}
                <div className="w-full lg:w-1/2">
                  <img
                    src="https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/K5Of8nagCJ7ovYcaY0W20xudCFKJhMhGsWtjlfiQ.webp"
                    alt="Customer Login Page Image"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Side */}
                <div
                  className="w-full lg:w-1/2 p-[1.5rem] lg:p-[3rem] flex flex-col justify-center border border-[#e9e9ef]"
                  style={{ height: 'auto' }}
                >
                  {/* Site Icon */}
                  <div className="w-[48px] h-[48px] mb-[1rem] mx-auto lg:mx-0">
                    <img
                      src="https://demo.activeitzone.com/ecommerce_repo/public/uploads/all/aJoc2n9sVxuGpMbB2Qf42Cjz9R2lxZ7Md3vMIbXy.svg"
                      alt="Site Icon"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Titles */}
                  <div className="text-center lg:text-left">
                    <h1
                      className="text-[20px] font-bold"
                      style={{ color: '#1b84ff', textTransform: 'uppercase' }}
                    >
                      Welcome Back !
                    </h1>
                    <h5 className="text-[14px] font-normal text-[#292933]">Login to your account.</h5>
                  </div>

                  {/* Login form */}
                  <div className="pt-[1rem]">
                    <div>
                      <form className="form-default loginForm" onSubmit={handleSubmit}>

                        {/* Email or Phone */}
                        <div className="mb-[1rem]">
                          <label htmlFor="identifier" className="text-[12px] font-bold block mb-[0.5rem]" style={{ color: '#3f4254' }}>
                            Email or Phone
                          </label>
                          <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="johndoe@example.com or phone number"
                            name="identifier"
                            id="identifier"
                            autoComplete="off"
                            className="w-full rounded-none border border-[#e4e6ef] px-[0.75rem] py-[0.55rem] text-[14px] text-[#3f4254] placeholder-[#a1a5b3] outline-none focus:border-[#1b84ff]"
                          />
                        </div>

                        <div className="password-login-block">
                          {/* password */}
                          <div className="mb-[1rem]">
                            <label htmlFor="password" className="text-[12px] font-bold block mb-[0.5rem]" style={{ color: '#3f4254' }}>
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                name="password"
                                id="password"
                                className="w-full rounded-none border border-[#e4e6ef] px-[0.75rem] py-[0.55rem] pr-[2.5rem] text-[14px] text-[#3f4254] placeholder-[#a1a5b3] outline-none focus:border-[#1b84ff]"
                              />
                              <span
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 cursor-pointer text-[#3f4254] flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 6.5c-3.79 0-7.17 2.13-8.82 5.5C4.83 15.37 8.21 17.5 12 17.5s7.17-2.13 8.82-5.5C19.17 8.63 15.79 6.5 12 6.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm0-5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Error */}
                        {error && (
                          <div className="mb-[1rem] px-[0.75rem] py-[0.5rem] bg-red-50 border border-red-200 text-red-600 text-[13px] rounded">
                            {error}
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="mb-[1.5rem] mt-[1.5rem]">
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-none font-bold text-[14px] text-white py-[0.65rem] disabled:opacity-60"
                            style={{ backgroundColor: '#1b84ff' }}
                          >
                            {loading ? 'Logging in...' : 'Login'}
                          </button>
                        </div>
                      </form>

                      {/* DEMO MODE */}
                      <div className="mb-[1.5rem]">
                        <table className="w-full border-collapse" style={{ border: '1px solid #e4e6ef' }}>
                          <tbody>
                            <tr>
                              <td className="px-[0.75rem] py-[0.65rem] text-[14px] text-[#3f4254] whitespace-nowrap" style={{ border: '1px solid #e4e6ef' }}>
                                Customer Account
                              </td>
                              <td className="px-[0.75rem] py-[0.65rem] text-center" style={{ border: '1px solid #e4e6ef' }}>
                                <button
                                  type="button"
                                  onClick={autoFillCustomer}
                                  className="text-white text-[12px] px-[0.85rem] py-[0.4rem] rounded-[0.25rem] whitespace-nowrap"
                                  style={{ backgroundColor: '#17c3f5' }}
                                >
                                  Copy credentials
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Register Now */}
                    <p className="text-[12px] text-[#9d9da6] mb-0">
                      Dont have an account?
                      <Link
                        to="/registration"
                        className="ml-[0.5rem] text-[14px] font-bold hover:underline"
                        style={{ color: '#1b84ff' }}
                      >
                        Register Now
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Go Back */}
              <div className="mt-[1rem] mr-[1.5rem] md:mr-0">
                <Link
                  to="/login"
                  className="ml-auto text-[14px] font-bold flex items-center"
                  style={{ color: '#1b84ff', maxWidth: 'fit-content' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-[0.25rem]">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Previous Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}