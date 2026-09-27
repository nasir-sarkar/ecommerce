import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Card, { CardHeader, CardBody } from '../components/Card'

const API = import.meta.env.VITE_API_URL

// Reusable form bits
function Label({ children, className = '' }) {
  return (
    <label className={`block text-[14px] leading-[20px] font-medium text-[#232734] mb-[6px] ${className}`}>
      {children}
    </label>
  )
}

function Input({ type = 'text', placeholder = '', value, onChange, className = '', ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full h-[40px] px-[14px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7] ${className}`}
      {...props}
    />
  )
}

function Select({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-[40px] pl-[14px] pr-[34px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] bg-white appearance-none focus:outline-none focus:border-[#009ef7]"
      >
        {children}
      </select>
      <span className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  )
}

export default function AddNewCategory_Admin() {
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  const [name, setName]       = useState('')   
  const [parent, setParent]   = useState('')   
  const [segment, setSegment] = useState('')   

  const [allCategories, setAllCategories] = useState([])

  // Selected parent category object
  const selectedParentCat = allCategories.find((cat) => cat._id === parent)

  // Segment options = cols[].title of the selected parent
  const segmentOptions = selectedParentCat
    ? (selectedParentCat.cols || []).map((c) => c.title).filter(Boolean)
    : []

  // Load all categories 
  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  // Submit: push item into the selected segment's items[]
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveMsg('')
    setSaveErr('')

    if (!name.trim())    { setSaveErr('Name is required.');             return }
    if (!parent)         { setSaveErr('Parent Category is required.');  return }
    if (!segment)        { setSaveErr('Segment is required.');          return }

    setLoading(true)

    try {
      // Build updated cols: append new item to the matching segment
      const updatedCols = (selectedParentCat.cols || []).map((col) =>
        col.title === segment
          ? { ...col, items: [...col.items, name.trim()] }
          : col
      )

      const res  = await fetch(`${API}/categories/${parent}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedParentCat, cols: updatedCols }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Save failed')

      // Refresh categories so the updated cols are reflected
      const refreshed = await fetch(`${API}/categories`).then((r) => r.json())
      setAllCategories(Array.isArray(refreshed) ? refreshed : [])

      setSaveMsg(`"${name.trim()}" added to "${segment}" successfully.`)
      setName('')
    } catch (err) {
      setSaveErr(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <Card>
          <CardHeader>
            <h5 className="text-[16px] leading-[22px] font-semibold text-[#232734] m-0">
              Category Information
            </h5>
          </CardHeader>
          <CardBody>
            {saveMsg && (
              <div className="mb-[16px] px-[14px] py-[10px] bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-[6px]">
                {saveMsg}
              </div>
            )}
            {saveErr && (
              <div className="mb-[16px] px-[14px] py-[10px] bg-red-50 border border-red-200 text-[#f1416c] text-[13px] rounded-[6px]">
                {saveErr}
              </div>
            )}
            <form onSubmit={handleSubmit}>

              {/* Parent Category */}
              <div className="mb-[16px]">
                <Label>Parent Category</Label>
                <Select value={parent} onChange={(v) => { setParent(v); setSegment('') }}>
                  <option value="">— Select Category —</option>
                  {allCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Segment */}
              <div className="mb-[16px]">
                <Label>Segment</Label>
                <Select value={segment} onChange={setSegment}>
                  <option value="">
                    {parent ? '— Select Segment —' : '— Select a Parent Category first —'}
                  </option>
                  {segmentOptions.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </Select>
              </div>

              {/* Name (item to add) */}
              <div className="mb-[16px]">
                <Label>Name</Label>
                <Input placeholder="e.g. Party Dress" maxLength={255} value={name} onChange={setName} required />
              </div>

              {/* Save */}
              <div className="flex justify-end mb-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#009ef7] hover:bg-[#0088d6] text-white text-[14px] font-semibold rounded-[6px] px-[24px] h-[38px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>

            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}