import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
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

function BrowseFile({ onFileSelect, value = '' }) {
  const [fileName, setFileName] = useState(value ? value.split('/').pop() : 'Choose File')

  // Sync fileName when value changes externally (pre-fill)
  useEffect(() => {
    if (value) setFileName(value.split('/').pop())
  }, [value])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (data.url) {
        setFileName(file.name)
        onFileSelect(data.url)
      } else {
        alert('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    }
  }

  return (
    <div className="flex h-[40px] border border-[#f1f1f4] rounded-[6px] overflow-hidden bg-white">
      <label className="bg-[#f1f1f4] text-[#232734] text-[13px] font-medium px-[14px] hover:bg-[#e4e5eb] cursor-pointer flex items-center">
        Browse
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
      <span className="flex-1 px-[14px] flex items-center text-[13px] text-[#9da3ae] truncate">{fileName}</span>
    </div>
  )
}

export default function EditBrand_Admin() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [loadingBrand, setLoadingBrand] = useState(true)
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')
  const [order, setOrder] = useState(0)
  const [brandConfigId, setBrandConfigId] = useState(null)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  // Pre-fill from route state or fetch by ID
  useEffect(() => {
    const existingBrand = location.state?.brand
    if (existingBrand) {
      setName(existingBrand.name || '')
      setLogo(existingBrand.image || '')
      setMetaTitle(existingBrand.metaTitle || '')
      setMetaDescription(existingBrand.metaDescription || '')
      setMetaKeywords(existingBrand.metaKeywords || '')
      setOrder(existingBrand.order || 0)
      setLoadingBrand(false)
    } else if (id) {
      fetchBrandData(id)
    } else {
      setLoadingBrand(false)
    }
  }, [id, location.state])

  const fetchBrandData = async (brandId) => {
    setLoadingBrand(true)
    try {
      const response = await fetch(`${API}/brands`)
      const data = await response.json()
      if (data?.success && data?.data) {
        const brandConfig = data.data.find(config =>
          config.brands?.some(b => b._id === brandId)
        )
        if (brandConfig) {
          const brand = brandConfig.brands.find(b => b._id === brandId)
          if (brand) {
            setName(brand.name || '')
            setLogo(brand.image || '')
            setMetaTitle(brand.metaTitle || '')
            setMetaDescription(brand.metaDescription || '')
            setMetaKeywords(brand.metaKeywords || '')
            setOrder(brand.order || 0)
            setBrandConfigId(brandConfig._id)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
      setSaveErr('Failed to load brand data.')
    } finally {
      setLoadingBrand(false)
    }
  }

  // Get brand config (needed for save)
  const getBrandConfig = async () => {
    if (brandConfigId) return { _id: brandConfigId }
    try {
      const response = await fetch(`${API}/brands`)
      const data = await response.json()
      if (data?.success && data?.data) {
        const config = data.data.find(c => c.brands?.some(b => b._id === id))
        if (config) { setBrandConfigId(config._id); return config }
      }
    } catch (error) {
      console.error('Error getting brand config:', error)
    }
    return null
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveMsg('')
    setSaveErr('')

    if (!name.trim()) { setSaveErr('Brand name is required'); return }
    if (!logo.trim()) { setSaveErr('Brand logo is required'); return }

    setLoading(true)

    try {
      // Fetch the full config fresh to get current brands array
      const response = await fetch(`${API}/brands`)
      const data = await response.json()

      if (!data?.success || !data?.data) {
        setSaveErr('Failed to load brand configuration')
        setLoading(false)
        return
      }

      const config = data.data.find(c => c.brands?.some(b => b._id === id))
      if (!config) {
        setSaveErr('Brand configuration not found')
        setLoading(false)
        return
      }

      const updatedBrand = {
        name: name.trim(),
        image: logo,
        order,
        ...(metaTitle && { metaTitle }),
        ...(metaDescription && { metaDescription }),
        ...(metaKeywords && { metaKeywords }),
        updatedAt: new Date().toISOString(),
      }

      const updatedBrands = config.brands.map(brand =>
        brand._id === id ? { ...brand, ...updatedBrand } : brand
      )

      const updateResponse = await fetch(`${API}/brands/${config._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          brands: updatedBrands,
          updatedAt: new Date().toISOString(),
        })
      })

      const result = await updateResponse.json()

      if (result.success) {
        setSaveMsg('Brand updated successfully!')
        setTimeout(() => navigate('/admin/brands/all'), 1500)
      } else {
        setSaveErr(result.message || 'Failed to update brand')
      }
    } catch (error) {
      console.error('Error updating brand:', error)
      setSaveErr('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loadingBrand) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009ef7]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <Card>
          <CardHeader>
            <h5 className="text-[16px] leading-[22px] font-semibold text-[#232734] m-0">
              Edit Brand
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
              {/* Name */}
              <div className="mb-[16px]">
                <Label>Name</Label>
                <Input
                  placeholder="Name"
                  maxLength={100}
                  value={name}
                  onChange={setName}
                  required
                />
              </div>

              {/* Logo */}
              <div className="mb-[16px]">
                <Label>Logo <small className="text-[12px] text-[#9da3ae] font-normal">(120x80)</small></Label>
                <BrowseFile onFileSelect={setLogo} value={logo} />
                {logo && (
                  <div className="mt-2">
                    <img src={logo} alt="Brand logo" className="h-[60px] w-auto border border-[#f1f1f4] rounded-[4px] p-1" />
                  </div>
                )}
                <small className="block text-[12px] text-[#9da3ae] mt-1">Minimum dimensions required: 120px width X 80px height.</small>
              </div>

              {/* Meta Title */}
              <div className="mb-[16px]">
                <Label>Meta Title</Label>
                <Input
                  placeholder="Meta Title"
                  value={metaTitle}
                  onChange={setMetaTitle}
                />
              </div>

              {/* Meta description */}
              <div className="mb-[16px]">
                <Label>Meta description</Label>
                <textarea
                  rows={5}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7] resize-y"
                />
              </div>

              {/* Meta Keywords */}
              <div className="mb-[16px]">
                <Label>Meta Keywords</Label>
                <textarea
                  placeholder="Keyword, Keyword"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7] resize-none"
                  rows={3}
                />
                <small className="block text-[12px] text-[#9da3ae] mt-1">Separate with coma</small>
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