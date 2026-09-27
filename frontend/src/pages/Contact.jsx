import { useState, useEffect } from 'react'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', query: '' })
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    email: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/info`)
      const data = await response.json()

      if (data.success) {
        setContactInfo({
          address: data.data?.contactInfo?.address || '',
          phone: data.data?.contactInfo?.phone || '',
          email: data.data?.contactInfo?.email || '',
          description: data.data?.description || ''
        })
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    // Validate form
    if (!form.name || !form.email || !form.query) {
      alert('Please fill in all required fields (Name, Email, and Query)')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        setForm({ name: '', email: '', phone: '', query: '' })
      } else {
        alert(data.message || 'Error submitting form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="py-6">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Contact Us</h1>
            <Breadcrumb items={[{ label: 'Contact Us' }]} />
          </div>
          <div className="text-center py-12">Loading contact information...</div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">Contact Us</h1>
          <Breadcrumb items={[{ label: 'Contact Us' }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left - Info */}
          <div>
            <h2 className="text-[26px] font-bold text-gray-800 mb-3">Contact us</h2>
            <p className="text-[14px] text-gray-600 mb-6">
              {contactInfo.description}
            </p>


            {/* Address */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-[15px] mb-0.5">Address</h4>
                <p className="text-[14px] text-gray-600">{contactInfo.address}</p>
              </div>
            </div>


            {/* Phone */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-[15px] mb-0.5">Phone</h4>
                <p className="text-[14px] text-gray-600">{contactInfo.phone}</p>
              </div>
            </div>


            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-[15px] mb-0.5">Email Address</h4>
                <p className="text-[14px] text-gray-600">{contactInfo.email}</p>
              </div>
            </div>
          </div>


          {/* Right - Form */}
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-primary focus:border-2 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-primary focus:border-2 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone no. (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-primary focus:border-2 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Tell us about your query</label>
                <textarea
                  name="query"
                  placeholder="Type here.."
                  value={form.query}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] outline-none focus:border-primary focus:border-2 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-primary text-white py-2.5 rounded text-[14px] font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}