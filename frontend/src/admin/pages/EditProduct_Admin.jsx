import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Switch from '../components/Switch'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Reusable form primitives 

function Section({ title, children, className = '' }) {
  return (
    <div className={`border border-[#f1f1f4] rounded-[6px] bg-white px-[16px] lg:px-[24px] py-[16px] lg:py-[20px] ${className}`}>
      <div className="mb-[14px] pb-[6px] border-b border-dashed border-[#f1f1f4]">
        <h5 className="text-[16px] leading-[22px] font-bold text-[#232734] m-0">{title}</h5>
      </div>
      {children}
    </div>
  )
}

function Label({ children, required = false, className = '' }) {
  return (
    <label className={`block text-[14px] leading-[20px] font-medium text-[#232734] mb-[6px] ${className}`}>
      {children}
      {required && <span className="text-[#f1416c] ml-1">*</span>}
    </label>
  )
}

function Input({ type = 'text', placeholder = '', value, onChange, className = '', ...props }) {
  return (
    <input type={type} placeholder={placeholder} value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full h-[40px] px-[14px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7] ${className}`}
      {...props} />
  )
}

function Select({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-[40px] pl-[14px] pr-[34px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] bg-white appearance-none focus:outline-none focus:border-[#009ef7]">
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

function CheckboxRow({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer mt-[10px]">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)}
        className="w-[18px] h-[18px] rounded-[3px] accent-[#009ef7]" />
      <span className="text-[13px] leading-[18px] text-[#232734]">{children}</span>
    </label>
  )
}

function NotePreset({ text }) {
  return (
    <div className="border-2 border-[#f1f1f4] rounded-[6px] p-[12px]">
      <p className="text-[13px] leading-[18px] text-[#232734] m-0 line-clamp-3">{text}</p>
    </div>
  )
}

function AddPresetButton({ children }) {
  return (
    <button type="button"
      className="w-full mt-[12px] flex items-center justify-center gap-2 border border-dashed border-[#cbd0db] rounded-[6px] py-[10px] text-[13px] text-[#232734] hover:bg-[#f5f5f7] transition-colors">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {children}
    </button>
  )
}

function EditorToolbar() {
  return (
    <div className="flex items-center gap-[2px] flex-wrap bg-[#f5f5f7] border border-[#f1f1f4] rounded-t-[6px] px-[8px] py-[6px]">
      {['B', 'i', 'U', 'S'].map((c, i) => (
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#232734] hover:bg-white rounded">
          {c === 'B' && <b>B</b>}
          {c === 'i' && <i>I</i>}
          {c === 'U' && <u>U</u>}
          {c === 'S' && <s>S</s>}
        </button>
      ))}
      <span className="w-px h-[18px] bg-[#dbdfe9] mx-1" />
      {['≣','≡','⫶','⫵','⌬','▦','✎','▤','🔗','📷','◀','▶','⌧'].map((c, i) => (
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#232734] hover:bg-white rounded text-[13px]">{c}</button>
      ))}
      <span className="w-px h-[18px] bg-[#dbdfe9] mx-1" />
      <button type="button" className="w-[26px] h-[26px] flex items-center justify-center bg-[#ffe88c] text-[#232734] hover:bg-[#ffdf6e] rounded font-bold">A</button>
      {['◐','⇄','✕','✖','↺','↻'].map((c, i) => (
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#232734] hover:bg-white rounded text-[13px]">{c}</button>
      ))}
    </div>
  )
}

// Image upload zone

function ImageUpload({ label, note, value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res  = await fetch(`${API}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
      else setError('Upload failed')
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <Label className="mb-[2px]">{label}</Label>
      {note && <small className="block text-[12px] text-[#9da3ae] mb-[8px]">{note}</small>}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="w-[120px] h-[120px] border border-dashed border-[#cbd0db] rounded-[6px] flex items-center justify-center bg-white cursor-pointer hover:border-[#009ef7] overflow-hidden relative"
      >
        {uploading ? (
          <span className="text-[11px] text-[#9da3ae]">Uploading…</span>
        ) : value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#9da3ae" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange('') }}
            className="absolute top-[4px] right-[4px] w-[20px] h-[20px] bg-[#f1416c] text-white rounded-full text-[11px] flex items-center justify-center"
          >✕</button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => handleFile(e.target.files[0])} />
      {error && <small className="block text-[12px] text-[#f1416c] mt-1">{error}</small>}
    </div>
  )
}

// Main page 

export default function EditProduct_Admin() {
  const { id } = useParams()
  const navigate = useNavigate()

  // DB data
  const [brands,     setBrands]     = useState([])
  const [categories, setCategories] = useState([])
  const [flashDeals, setFlashDeals] = useState([])

  // Core fields
  const [title,       setTitle]       = useState('')
  const [category,    setCategory]    = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [brand,       setBrand]       = useState('')
  const [description, setDescription] = useState('')
  const [tags,        setTags]        = useState([])

  // Images
  const [image,  setImage]  = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')

  // Config
  const [unit,   setUnit]   = useState('')
  const [weight, setWeight] = useState('0')
  const [minQty, setMinQty] = useState('1')

  // Pricing
  const [price,             setPrice]             = useState('0')
  const [discount,          setDiscount]          = useState('0')
  const [discountType,      setDiscountType]      = useState('flat')
  const [discountDateStart, setDiscountDateStart] = useState('')
  const [discountDateEnd,   setDiscountDateEnd]   = useState('')
  const discountDateRange = discountDateStart && discountDateEnd
    ? `${discountDateStart} to ${discountDateEnd}` : ''
  const [stock,           setStock]           = useState('0')
  const [externalLink,    setExternalLink]    = useState('')
  const [linkButtonText,  setLinkButtonText]  = useState('')

  // Product Settings
  const [published,  setPublished]  = useState(false)
  const [featured,   setFeatured]   = useState(false)
  const [todaysDeal, setTodaysDeal] = useState(false)

  // Flash Sale
  const [flashSaleId,           setFlashSaleId]           = useState('')
  const [flashSaleDiscount,     setFlashSaleDiscount]     = useState('0')
  const [flashSaleDiscountType, setFlashSaleDiscountType] = useState('flat')

  // Refund
  const [refundable,      setRefundable]      = useState(true)
  const [refundNote,      setRefundNote]      = useState('')
  const [showRefundNotes, setShowRefundNotes] = useState(false)

  // Warranty
  const [warranty,        setWarranty]        = useState(false)
  const [warrantyNote,    setWarrantyNote]    = useState('')
  const [showWarrantyNote, setShowWarrantyNote] = useState(false)

  // Shipping
  const [shippingType,    setShippingType]    = useState('free')
  const [shippingCost,    setShippingCost]    = useState('0')
  const [shippingDays,    setShippingDays]    = useState('')
  const [showShipTime,    setShowShipTime]    = useState(false)
  const [showShipNote,    setShowShipNote]    = useState(false)
  const [isQtyMultiplied, setIsQtyMultiplied] = useState(false)

  // Variations
  const [colorEnabled, setColorEnabled] = useState(false)
  const [attrEnabled,  setAttrEnabled]  = useState(false)
  const [colorInput,   setColorInput]   = useState('')
  const [attrInput,    setAttrInput]    = useState('')

  // UI state
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState('')
  const [saveErr,  setSaveErr]  = useState('')

  // subCategory options from selected category
  const subCategoryOptions = (() => {
    const cat = categories.find(c => c.name === category)
    if (!cat) return []
    return cat.cols?.flatMap(col => col.items || []) || []
  })()

  // Fetch reference data

  useEffect(() => {
    fetch(`${API}/brands/active`)
      .then(r => r.json())
      .then(data => {
        let brandList = []
        if (data?.success && data?.data?.brands) brandList = data.data.brands
        else if (Array.isArray(data)) brandList = data
        else if (data?.brands && Array.isArray(data.brands)) brandList = data.brands
        setBrands(brandList)
      })
      .catch(() => {})

    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})

    fetch(`${API}/flash-sale`)
      .then(r => r.json())
      .then(data => {
        let deals = []
        if (data?.deals && Array.isArray(data.deals)) deals = data.deals
        else if (Array.isArray(data)) deals = data
        setFlashDeals(deals)
      })
      .catch(() => {})
  }, [])

  // Fetch product to edit

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoadingProduct(true)
      try {
        const res = await fetch(`${API}/products/${id}`)
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setSaveErr(err.message || `Failed to load product (HTTP ${res.status})`)
          return
        }
        // Backend returns the product document directly
        const p = await res.json()
        setTitle(p.title || '')
        setCategory(p.category || '')
        setSubCategory(p.subCategory || '')
        setBrand(p.brand || '')
        setDescription(p.description || '')
        
        setTags(Array.isArray(p.Tags) ? p.Tags : (p.Tags ? p.Tags.split(',').map(t => t.trim()).filter(Boolean) : []))
        setImage(p.image || '')
        setImage2(p.image2 || '')
        setImage3(p.image3 || '')
        setUnit(p.unit || '')
        setWeight(String(p.weight ?? '0'))
        setMinQty(String(p.minQty ?? '1'))
        setPrice(String(p.price ?? '0'))
        setDiscount(String(p.discount ?? '0'))
        setDiscountType(p.discountType || 'flat')
        if (p.discountDateRange && p.discountDateRange.includes(' to ')) {
          const [start, end] = p.discountDateRange.split(' to ')
          setDiscountDateStart(start.trim())
          setDiscountDateEnd(end.trim())
        }
        setStock(String(p.stockCount ?? '0'))
        setExternalLink(p.externalLink || '')
        setLinkButtonText(p.linkButtonText || '')
        setPublished(!!p.published)
        setFeatured(!!p.featured)
        setTodaysDeal(!!p.todaysDeal)
        setFlashSaleId(p.flashSaleId ? String(p.flashSaleId) : '')
        setFlashSaleDiscount(String(p.flashSaleDiscount ?? '0'))
        setFlashSaleDiscountType(p.flashSaleDiscountType || 'flat')
        setRefundable(p.refundable !== false)
        setRefundNote(p.refundNote || '')
        setWarranty(!!p.warranty)
        setWarrantyNote(p.warrantyNote || '')
        setShippingType(p.shippingType || 'free')
        setShippingCost(String(p.shippingCost ?? '0'))
        setShippingDays(p.shippingDays || '')
        
        if (p.variation) {
          if (p.variation.colors && p.variation.colors.length > 0) { 
            setColorInput(p.variation.colors.join(', ')); 
            setColorEnabled(true)
          }
          if (p.variation.attributes && p.variation.attributes.length > 0) { 
            setAttrInput(p.variation.attributes.join(', ')); 
            setAttrEnabled(true)
          }
        }
      } catch (e) {
        console.error('EditProduct fetch error:', e)
        setSaveErr('Network error — could not load product data.')
      } finally {
        setLoadingProduct(false)
      }
    }
    load()
  }, [id])

  // Reset subCategory when category changes
  useEffect(() => { setSubCategory('') }, [category])

  // Submit

  const buildPayload = (publishedVal) => ({
    title,
    category,
    subCategory,
    brand,
    description,
    Tags: tags.join(','),
    image,
    image2,
    image3,
    unit,
    weight,
    minQty,
    price,
    discount,
    discountType,
    discountDateRange,
    stockCount: stock,
    externalLink,
    linkButtonText,
    published: publishedVal,
    featured,
    todaysDeal,
    flashSaleId,
    flashSaleDiscount,
    flashSaleDiscountType,
    refundable,
    refundNote,
    warranty,
    warrantyNote,
    shippingType,
    shippingCost,
    shippingDays,
    'variation.colors':     colorEnabled ? colorInput : '',
    'variation.attributes': attrEnabled  ? attrInput  : '',
  })

  const submit = async (publishedVal) => {
    setSaveMsg(''); setSaveErr('')
    if (!title.trim())  return setSaveErr('Product name is required')
    if (!category)      return setSaveErr('Category is required')
    if (!subCategory)   return setSaveErr('Sub Category is required')
    if (!image)         return setSaveErr('Thumbnail image is required')
    if (!price || Number(price) <= 0) return setSaveErr('Valid unit price is required')

    setSaving(true)
    try {
      const res  = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(publishedVal)),
      })
      const data = await res.json()
      if (!res.ok) { setSaveErr(data.message || 'Save failed'); setSaving(false); return }
      setSaveMsg('Product updated successfully!')
      setTimeout(() => navigate('/admin/products/all'), 1500)
    } catch {
      setSaveErr('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const brandList = Array.isArray(brands) ? brands.filter(b => b && b.name) : []

  // Render

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009ef7]" />
      </div>
    )
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-[16px] flex-wrap gap-2">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">Edit Product</h1>
        <div className="flex items-center gap-[8px]">
          <button type="button"
            className="bg-[#f1fafd] text-[#009ef7] hover:bg-[#009ef7] hover:text-white text-[12px] font-medium rounded-[6px] px-[12px] h-[28px] transition-colors">
            Clear Tempdata
          </button>
          <button type="button"
            className="bg-[#fff9e3] text-[#b08800] hover:bg-[#ffc700] hover:text-white text-[12px] font-medium rounded-[6px] px-[12px] h-[28px] transition-colors">
            Import Product
          </button>
        </div>
      </div>

      {saveMsg && <div className="mb-[12px] px-[14px] py-[10px] bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-[6px]">{saveMsg}</div>}
      {saveErr && <div className="mb-[12px] px-[14px] py-[10px] bg-red-50 border border-red-200 text-[#f1416c] text-[13px] rounded-[6px]">{saveErr}</div>}

      <div className="grid grid-cols-12 gap-[16px]">

        {/* LEFT column */}
        <div className="col-span-12 xl:col-span-8 space-y-[16px]">

          {/* Product Basic Information */}
          <Section title="Product Basic Information">
            <div className="mb-[12px]">
              <Label required>Product Name</Label>
              <Input placeholder="Product Name" value={title} onChange={setTitle} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <Label required>Select Main Category</Label>
                <Select value={category} onChange={setCategory}>
                  <option value="" disabled>Select Main Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Select value={brand} onChange={setBrand}>
                  <option value="">Select Brand</option>
                  {brandList.map((b, i) => (
                    <option key={i} value={b.name}>{b.name}</option>
                  ))}
                </Select>
              </div>
            </div>
          </Section>

          {/* Product Configuration */}
          <Section title="Product Configuration">
            <div className="mb-[12px]">
              <Label required>Sub Category</Label>
              <Select value={subCategory} onChange={setSubCategory}>
                <option value="" disabled>Select Sub Category</option>
                {subCategoryOptions.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mb-[12px]">
              <div>
                <Label>Unit (e.g. KG, PC etc)</Label>
                <Input placeholder="Unit" value={unit} onChange={setUnit} />
              </div>
              <div>
                <Label>Weight (In Kg)</Label>
                <Input type="number" placeholder="0.00" value={weight} onChange={setWeight} step="0.001" />
              </div>
              <div>
                <Label required>Minimum Purchase Qty</Label>
                <Input type="number" placeholder="1" value={minQty} onChange={setMinQty} min="1" step="1" />
              </div>
            </div>
            <div>
              <Label required>Tags</Label>
              <div className="border border-[#f1f1f4] rounded-[6px] p-[10px] bg-white focus-within:border-[#009ef7]">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mb-[8px]">
                    {tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-[10px] py-[3px] bg-[#f1fafd] text-[#009ef7] text-[12px] rounded-full border border-[#009ef7]/30">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-[#009ef7] hover:text-[#f1416c] leading-none">✕</button>
                      </span>
                    ))}
                  </div>
                )}
                <select
                  value=""
                  onChange={e => { const v = e.target.value; if (v && !tags.includes(v)) setTags([...tags, v]) }}
                  className="w-full text-[13px] text-[#232734] bg-transparent border-none outline-none"
                >
                  <option value="">-- Select tag --</option>
                  {brandList.map((b, i) => (
                    <option key={i} value={b.name} disabled={tags.includes(b.name)}>{b.name}</option>
                  ))}
                </select>
              </div>
              <small className="block text-[12px] text-[#9da3ae] mt-1">Select one or more brand tags.</small>
            </div>
          </Section>

          {/* Files & Media */}
          <Section title="Files & Media">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <ImageUpload label="Add Thumbnail Image" note="300px × 300px" value={image}  onChange={setImage}  />
              <ImageUpload label="Gallery Image 2"     note="800px × 800px" value={image2} onChange={setImage2} />
              <ImageUpload label="Gallery Image 3"     note="800px × 800px" value={image3} onChange={setImage3} />
            </div>
          </Section>

          {/* Product Description */}
          <Section title="Product Description">
            <EditorToolbar />
            <textarea rows={8} value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] border-t-0 rounded-b-[6px] focus:outline-none focus:border-[#009ef7] resize-y" />
          </Section>

          {/* Product price + stock */}
          <Section title="Product price + stock">
            <h6 className="text-[14px] font-bold text-[#232734] mb-[12px]">Product Variation Configuration</h6>

            {/* Colors */}
            <div className="grid grid-cols-12 gap-[12px] mb-[8px] items-center">
              <div className="col-span-3">
                <Input value="Colors" disabled className="bg-[#f5f5f7]" />
              </div>
              <div className="col-span-8">
                <Input
                  placeholder="red, blue, green"
                  value={colorInput}
                  onChange={setColorInput}
                  disabled={!colorEnabled}
                  className={!colorEnabled ? 'bg-[#f5f5f7] opacity-50' : ''}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Switch checked={colorEnabled} onChange={setColorEnabled} color="blue" />
              </div>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-12 gap-[12px] items-center mb-[16px]">
              <div className="col-span-3">
                <Input value="Attributes" disabled className="bg-[#f5f5f7]" />
              </div>
              <div className="col-span-8">
                <Input
                  placeholder="S, M, XL, XXL"
                  value={attrInput}
                  onChange={setAttrInput}
                  disabled={!attrEnabled}
                  className={!attrEnabled ? 'bg-[#f5f5f7] opacity-50' : ''}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Switch checked={attrEnabled} onChange={setAttrEnabled} color="blue" />
              </div>
            </div>

            {/* Unit price */}
            <div className="mb-[12px]">
              <Label required>Unit price</Label>
              <Input type="number" value={price} onChange={setPrice} step="0.01" placeholder="Unit price" />
            </div>

            {/* Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <div>
                <Label>Discount Date Range</Label>
                <div className="flex items-center gap-[8px]">
                  <input type="date" value={discountDateStart} onChange={e => setDiscountDateStart(e.target.value)}
                    className="flex-1 h-[40px] px-[10px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7]" />
                  <span className="text-[13px] text-[#9da3ae] flex-shrink-0">to</span>
                  <input type="date" value={discountDateEnd} onChange={e => setDiscountDateEnd(e.target.value)}
                    min={discountDateStart}
                    className="flex-1 h-[40px] px-[10px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7]" />
                </div>
              </div>
              <div>
                <Label>Discount</Label>
                <div className="flex">
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0.00"
                    className="flex-1 h-[40px] px-[14px] text-[13px] border border-[#f1f1f4] rounded-l-[6px] focus:outline-none focus:border-[#009ef7]" />
                  <Select value={discountType} onChange={setDiscountType} className="w-[120px] [&>select]:rounded-l-none [&>select]:border-l-0">
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <div>
                <Label>Stock</Label>
                <Input type="number" value={stock} onChange={setStock} step="1" placeholder="10" />
              </div>
            </div>

            {/* External link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div>
                <Label>Product External Link</Label>
                <Input placeholder="https://..." value={externalLink} onChange={setExternalLink} />
              </div>
              <div>
                <Label>Link Button Text</Label>
                <Input placeholder="Buy Now" value={linkButtonText} onChange={setLinkButtonText} />
              </div>
            </div>
          </Section>
        </div>

        {/* RIGHT column */}
        <div className="col-span-12 xl:col-span-4 space-y-[16px]">

          {/* Product Settings */}
          <Section title="Product Settings">
            <div className="space-y-[14px]">
              <div className="flex items-center gap-[12px]">
                <Switch checked={published} onChange={setPublished} color="blue" />
                <span className="text-[14px] text-[#232734]">Published</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <Switch checked={featured} onChange={setFeatured} color="blue" />
                <span className="text-[14px] text-[#232734]">Featured</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <Switch checked={todaysDeal} onChange={setTodaysDeal} color="blue" />
                <span className="text-[14px] text-[#232734]">Todays Deal</span>
              </div>
            </div>

            {/* Flash Sale */}
            <div className="mt-[16px]">
              <Label className="text-[16px] font-bold">Flash Sale</Label>
              <Select value={flashSaleId} onChange={setFlashSaleId} className="mt-[6px]">
                <option value="">Choose Flash Title</option>
                {flashDeals.map(deal => (
                  <option key={deal.id} value={String(deal.id)}>
                    {deal.img ? `Deal: ${deal.img.substring(0, 30)}` : `Deal #${deal.id}`}
                  </option>
                ))}
              </Select>
              <div className="mt-[10px]">
                <Label>Discount</Label>
                <Input type="number" value={flashSaleDiscount} onChange={setFlashSaleDiscount} min="0" step="0.01" />
              </div>
              <div className="mt-[10px]">
                <Label>Discount Type</Label>
                <Select value={flashSaleDiscountType} onChange={setFlashSaleDiscountType}>
                  <option value="">Choose Discount Type</option>
                  <option value="flat">Flat</option>
                  <option value="percent">Percent</option>
                </Select>
              </div>
            </div>
          </Section>

          {/* Refund */}
          <Section title="Refund">
            <div className="flex items-center gap-[12px]">
              <Switch checked={refundable} onChange={setRefundable} color="blue" />
              <span className="text-[14px] text-[#232734]">Refundable</span>
            </div>
            <CheckboxRow checked={showRefundNotes} onChange={setShowRefundNotes}>
              Show notes in refund section in product description page
            </CheckboxRow>
            {showRefundNotes && (
              <div className="mt-[10px]">
                <Label>Refund Note</Label>
                <textarea rows={3} value={refundNote} onChange={e => setRefundNote(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7] resize-y"
                  placeholder="Enter refund note..." />
              </div>
            )}
            {!showRefundNotes && (
              <div className="mt-[16px]">
                <h6 className="text-[14px] font-bold text-[#232734] mb-[10px]">Note (Add from preset)</h6>
                <NotePreset text="This product is eligible for a refund within 7 days of delivery. Contact support to initiate a return." />
                <AddPresetButton>Add New Preset</AddPresetButton>
              </div>
            )}
          </Section>

          {/* Warranty */}
          <Section title="Warranty">
            <div className="flex items-center gap-[12px]">
              <Switch checked={warranty} onChange={setWarranty} color="blue" />
              <span className="text-[14px] text-[#232734]">Enable warranty for this product</span>
            </div>
            <CheckboxRow checked={showWarrantyNote} onChange={setShowWarrantyNote}>
              Show notes in warranty section in product page
            </CheckboxRow>
            {showWarrantyNote && (
              <div className="mt-[10px]">
                <Label>Warranty Note</Label>
                <textarea rows={3} value={warrantyNote} onChange={e => setWarrantyNote(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7] resize-y"
                  placeholder="Enter warranty note..." />
              </div>
            )}
            {!showWarrantyNote && (
              <div className="mt-[16px]">
                <h6 className="text-[14px] font-bold text-[#232734] mb-[10px]">Notes (Add from Preset)</h6>
                <NotePreset text="This product carries a manufacturer warranty. Contact us for warranty claims." />
                <AddPresetButton>Add New Notes</AddPresetButton>
              </div>
            )}
          </Section>

          {/* Shipping */}
          <Section title="Shipping">
            <h6 className="text-[14px] font-bold text-[#232734] mb-[6px]">Shipping Configuration</h6>
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[12px]">
                <Switch checked={shippingType === 'free'} onChange={() => setShippingType('free')} color="blue" />
                <span className="text-[14px] text-[#232734]">Free Shipping</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <Switch checked={shippingType === 'flat_rate'} onChange={() => setShippingType('flat_rate')} color="blue" />
                <span className="text-[14px] text-[#232734]">Flat Rate</span>
              </div>
              {shippingType === 'flat_rate' && (
                <div>
                  <Label>Shipping cost</Label>
                  <Input type="number" value={shippingCost} onChange={setShippingCost} min="0" step="0.01" placeholder="Shipping cost" />
                </div>
              )}
              <div className="flex items-center gap-[12px]">
                <Switch checked={isQtyMultiplied} onChange={setIsQtyMultiplied} color="blue" />
                <span className="text-[14px] text-[#232734]">Is Product Quantity Multiply</span>
              </div>
            </div>

            <div className="mt-[16px]">
              <h6 className="text-[14px] font-bold text-[#232734] mb-[8px]">Estimated Shipping Time</h6>
              <Label className="font-normal">Shipping Days</Label>
              <div className="flex">
                <input type="text" value={shippingDays} onChange={e => setShippingDays(e.target.value)}
                  placeholder="e.g. 7-15"
                  className="flex-1 h-[40px] px-[14px] text-[13px] border border-[#f1f1f4] rounded-l-[6px] focus:outline-none focus:border-[#009ef7]" />
                <span className="h-[40px] px-[16px] flex items-center text-[13px] text-[#9da3ae] bg-[#f5f5f7] border border-l-0 border-[#f1f1f4] rounded-r-[6px]">Days</span>
              </div>
              <CheckboxRow checked={showShipTime} onChange={setShowShipTime}>
                Show estimated shipping time in product description page
              </CheckboxRow>
              <CheckboxRow checked={showShipNote} onChange={setShowShipNote}>
                Show notes in shipping time section
              </CheckboxRow>
            </div>

            {showShipNote && (
              <div className="mt-[16px]">
                <h6 className="text-[14px] font-bold text-[#232734] mb-[10px]">Notes (Add from Preset)</h6>
                <NotePreset text="Delivery times may vary based on your location. Express shipping available at checkout." />
                <AddPresetButton>Add New Notes</AddPresetButton>
              </div>
            )}
          </Section>

        </div>

        {/* Bottom action bar */}
        <div className="col-span-12 mt-[8px] flex justify-end gap-[12px] flex-wrap">
          <button type="button" disabled={saving} onClick={() => submit(false)}
            className="bg-[#f5f5f7] hover:bg-[#e4e5eb] text-[#232734] text-[14px] font-bold rounded-[6px] w-[230px] h-[44px] border border-[#f1f1f4] transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save & Unpublish'}
          </button>
          <button type="button" disabled={saving} onClick={() => submit(true)}
            className="bg-[#19c553] hover:bg-[#15a847] text-white text-[14px] font-bold rounded-[6px] w-[230px] h-[44px] shadow-[0_4px_8px_rgba(25,197,83,0.25)] transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save & Publish'}
          </button>
          <button type="button" disabled={saving} onClick={() => submit(false)}
            className="bg-[#a1a5b3] hover:bg-[#888d9a] text-white text-[14px] font-bold rounded-[6px] w-[230px] h-[44px] shadow-[0_4px_8px_rgba(161,165,179,0.25)] transition-colors disabled:opacity-60">
            Save As Draft
          </button>
        </div>

      </div>
    </>
  )
}