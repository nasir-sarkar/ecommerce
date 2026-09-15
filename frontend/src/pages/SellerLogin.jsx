import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SELLER_LIST = [
  { name: 'Fashion Store',  initial: 'F', color: '#8B7FF8' },
  { name: 'All for Men',    initial: 'A', color: '#4ECDC4' },
  { name: 'Home Store',     initial: 'H', color: '#C8D89A' },
  { name: 'Tech Store',     initial: 'T', color: '#7BC8F0' },
  { name: 'Beauty Shop',    initial: 'B', color: '#E8A898' },
  { name: 'Baby Shop',      initial: 'B', color: '#F4B8D1' },
  { name: 'Toy Store',      initial: 'T', color: '#9BC49A' },
]
 
export default function SellerLogin() {
  const navigate = useNavigate()
  const [sellerName, setSellerName] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [error, setError] = useState('')
 
  const handleLogin = e => {
    e.preventDefault()
    if (!sellerName.trim()) return setError('Please enter your name.')
    if (!selectedStore)     return setError('Please select your store.')
    localStorage.setItem('sellerName',  sellerName.trim())
    localStorage.setItem('sellerStore', selectedStore)
    navigate('/seller/dashboard')
  }
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
 
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B7FF8] to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800">Seller Panel</span>
          </div>
          <p className="text-sm text-gray-500">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={sellerName}
              onChange={e => setSellerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B7FF8] focus:ring-1 focus:ring-[#8B7FF8]/20"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Store</label>
            <div className="grid grid-cols-1 gap-2">
              {SELLER_LIST.map(s => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedStore(s.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    selectedStore === s.name
                      ? 'border-[#8B7FF8] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.initial}
                  </div>
                  <span className={`text-sm font-medium ${selectedStore === s.name ? 'text-[#8B7FF8]' : 'text-gray-700'}`}>
                    {s.name}
                  </span>
                  {selectedStore === s.name && (
                    <svg className="w-4 h-4 text-[#8B7FF8] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}
 
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-[#8B7FF8] to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all"
          >
            Enter Seller Panel
          </button>
 
          <p className="text-center text-xs text-gray-400">
            Not a seller?{' '}
            <Link to="/" className="text-[#8B7FF8] hover:underline">Go to Store</Link>
          </p>
        </form>
      </div>
    </div>
  )
}