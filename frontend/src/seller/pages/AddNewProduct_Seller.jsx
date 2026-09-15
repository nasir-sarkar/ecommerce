import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Seller Panel themed primitives

function Section({ title, children, className = '' }) {
  return (
    <div className={`border border-[#f1f1f4] rounded-[6px] bg-white px-[16px] lg:px-[24px] py-[16px] lg:py-[20px] ${className}`}>
      <div className="mb-[14px] pb-[6px] border-b border-dashed border-[#f1f1f4]">
        <h5 className="text-[16px] leading-[22px] font-bold text-[#2E294E] m-0">{title}</h5>
      </div>
      {children}
    </div>
  )
}

function Label({ children, required = false, className = '' }) {
  return (
    <label className={`block text-[14px] leading-[20px] font-medium text-[#2E294E] mb-[6px] ${className}`}>
      {children}
      {required && <span className="text-[#f1416c] ml-1">*</span>}
    </label>
  )
}

function Input({ type = 'text', placeholder = '', value, onChange, className = '', disabled = false, ...props }) {
  return (
    <input type={type} placeholder={placeholder} value={value ?? ''} disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full h-[40px] px-[14px] text-[13px] text-[#2E294E] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#624b95] ${disabled ? 'bg-[#f5f5f7] opacity-70' : ''} ${className}`}
      {...props} />
  )
}

function Select({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select value={value ?? ''} onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-[40px] pl-[14px] pr-[34px] text-[13px] text-[#2E294E] border border-[#f1f1f4] rounded-[6px] bg-white appearance-none focus:outline-none focus:border-[#624b95]">
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
        className="w-[18px] h-[18px] rounded-[3px]" style={{ accentColor: '#624b95' }} />
      <span className="text-[13px] leading-[18px] text-[#2E294E]">{children}</span>
    </label>
  )
}

function NotePreset({ text }) {
  return (
    <div className="border-2 border-[#f1f1f4] rounded-[6px] p-[12px]">
      <p className="text-[13px] leading-[18px] text-[#2E294E] m-0 line-clamp-3">{text}</p>
    </div>
  )
}

function AddPresetButton({ children }) {
  return (
    <button type="button"
      className="w-full mt-[12px] flex items-center justify-center gap-2 border border-dashed border-[#cbd0db] rounded-[6px] py-[10px] text-[13px] text-[#2E294E] hover:bg-[#f3f0ff] transition-colors">
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
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#2E294E] hover:bg-white rounded">
          {c === 'B' && <b>B</b>}
          {c === 'i' && <i>I</i>}
          {c === 'U' && <u>U</u>}
          {c === 'S' && <s>S</s>}
        </button>
      ))}
      <span className="w-px h-[18px] bg-[#dbdfe9] mx-1" />
      {['≣','≡','⫶','⫵','⌬','▦','✎','▤','🔗','📷','◀','▶','⌧'].map((c, i) => (
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#2E294E] hover:bg-white rounded text-[13px]">{c}</button>
      ))}
      <span className="w-px h-[18px] bg-[#dbdfe9] mx-1" />
      <button type="button" className="w-[26px] h-[26px] flex items-center justify-center bg-[#ffe88c] text-[#2E294E] hover:bg-[#ffdf6e] rounded font-bold">A</button>
      {['◐','⇄','✕','✖','↺','↻'].map((c, i) => (
        <button key={i} type="button" className="w-[26px] h-[26px] flex items-center justify-center text-[#2E294E] hover:bg-white rounded text-[13px]">{c}</button>
      ))}
    </div>
  )
}

function SellerSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-block w-[40px] h-[22px] cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
      <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? 'bg-[#624b95]' : 'bg-[#e5e7eb]'}`} />
      <span className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`} />
    </label>
  )
}

function ImageUpload({ label, note, value, onChange }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${API}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
      else setError('Upload failed')
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <Label className="mb-[2px]">{label}</Label>
      {note && <small className="block text-[12px] text-[#9da3ae] mb-[8px]">{note}</small>}
      <div
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="w-[120px] h-[120px] border border-dashed border-[#624b95]/50 rounded-[6px] flex items-center justify-center bg-white cursor-pointer hover:border-[#624b95] overflow-hidden relative"
      >
        {uploading ? (
          <span className="text-[11px] text-[#9da3ae]">Uploading…</span>
        ) : value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#624b95" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {value && !uploading && (
          <button type="button" onClick={e => { e.stopPropagation(); onChange('') }}
            className="absolute top-[4px] right-[4px] w-[20px] h-[20px] bg-[#f1416c] text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      {error && <small className="block text-[12px] text-[#f1416c] mt-1">{error}</small>}
    </div>
  )
}

// Main Page
export default function AddNewProduct_Seller() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // DB data
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [flashDeals, setFlashDeals] = useState([])

  // Core fields
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState([])

  // Images
  const [image, setImage] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')

  // Config
  const [unit, setUnit] = useState('')
  const [weight, setWeight] = useState('0')
  const [minQty, setMinQty] = useState('1')

  // Pricing
  const [price, setPrice] = useState('0')
  const [discount, setDiscount] = useState('0')
  const [discountType, setDiscountType] = useState('flat')
  const [discountDateStart, setDiscountDateStart] = useState('')
  const [discountDateEnd, setDiscountDateEnd] = useState('')

  // Variation
  const [colorEnabled, setColorEnabled] = useState(false)
  const [colorInput, setColorInput] = useState('')
  const [attrEnabled, setAttrEnabled] = useState(false)
  const [attrInput, setAttrInput] = useState('')

  // Stock
  const [stock, setStock] = useState('0')

  // External link
  const [externalLink, setExternalLink] = useState('')
  const [linkButtonText, setLinkButtonText] = useState('')

  // Settings
  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [todaysDeal, setTodaysDeal] = useState(false)

  // Flash Sale
  const [flashSaleId, setFlashSaleId] = useState('')
  const [flashSaleDiscount, setFlashSaleDiscount] = useState('0')
  const [flashSaleDiscountType, setFlashSaleDiscountType] = useState('flat')

  // Refund
  const [refundable, setRefundable] = useState(true)
  const [showRefundNotes, setShowRefundNotes] = useState(false)
  const [refundNote, setRefundNote] = useState('')

  // Warranty
  const [warranty, setWarranty] = useState(false)
  const [showWarrantyNote, setShowWarrantyNote] = useState(false)
  const [warrantyNote, setWarrantyNote] = useState('')

  // Shipping
  const [shippingType, setShippingType] = useState('free')
  const [shippingCost, setShippingCost] = useState('0')
  const [shippingDays, setShippingDays] = useState('')
  const [showShipTime, setShowShipTime] = useState(false)
  const [showShipNote, setShowShipNote] = useState(false)

  // Save state
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  // Seller is auto-set from logged-in user
  const sellerName = user?.shopName || ''

  // Reset subCategory when category changes
  useEffect(() => { setSubCategory('') }, [category])

  // Fetch DB data
  useEffect(() => {
    // Brands - use /active endpoint
    fetch(`${API}/brands/active`)
      .then(r => r.json())
      .then(data => {
        let brandList = []
        if (data?.success && data?.data?.brands) {
          brandList = data.data.brands
        } else if (Array.isArray(data)) {
          brandList = data
        } else if (data?.brands && Array.isArray(data.brands)) {
          brandList = data.brands
        }
        setBrands(brandList)
      })
      .catch(() => {})

    // Categories
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(data => {
        let categoriesData = Array.isArray(data) ? data : (data?.categories || [])
        setCategories(categoriesData)
      })
      .catch(() => {})

    // Flash sales
    fetch(`${API}/flash-sale`)
      .then(r => r.json())
      .then(data => {
        let deals = []
        if (data?.deals && Array.isArray(data.deals)) {
          deals = data.deals
        } else if (Array.isArray(data)) {
          deals = data
        }
        setFlashDeals(deals)
      })
      .catch(() => {})
  }, [])

  // Brand list: filter valid brands
  const brandList = (() => {
    if (!Array.isArray(brands)) return []
    return brands.filter(b => b && b.name)
  })()

  // SubCategory options using cols[].items
  const subCategoryOptions = (() => {
    const cat = categories.find(c => c.name === category)
    if (!cat) return []
    return cat.cols?.flatMap(col => col.items || []) || []
  })()

  
  const submit = async (publishedVal) => {
    setSaveMsg(''); setSaveErr('')
    
    
    const errors = []
    if (!title || title.trim() === '') errors.push('Product Name')
    if (!category || category.trim() === '') errors.push('Category')
    if (!price || parseFloat(price) <= 0) errors.push('Valid Unit Price')
    if (!image || image.trim() === '') errors.push('Thumbnail Image')
    
    if (errors.length > 0) {
      setSaveErr(`Missing required fields: ${errors.join(', ')}`)
      return
    }
    
    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        category: category.trim(),
        subCategory: subCategory || '',
        brand: brand || '',
        description: description || '',
        Tags: Array.isArray(tags) ? tags : [],
        image: image || '',
        image2: image2 || '',
        image3: image3 || '',
        unit: unit || '',
        weight: parseFloat(weight) || 0,
        minQty: parseInt(minQty) || 1,
        price: parseFloat(price) || 0,
        discount: parseFloat(discount) || 0,
        discountType: discountType || 'flat',
        discountDateRange: discountDateStart && discountDateEnd ? `${discountDateStart} - ${discountDateEnd}` : '',
        stockCount: parseInt(stock) || 0,
        externalLink: externalLink || '',
        linkButtonText: linkButtonText || '',
        published: publishedVal,
        featured: featured || false,
        todaysDeal: todaysDeal || false,
        flashSaleId: flashSaleId || '',
        flashSaleDiscount: parseFloat(flashSaleDiscount) || 0,
        flashSaleDiscountType: flashSaleDiscountType || 'flat',
        refundable: refundable !== undefined ? refundable : true,
        refundNote: refundNote || '',
        warranty: warranty || false,
        warrantyNote: warrantyNote || '',
        shippingType: shippingType || 'free',
        shippingCost: parseFloat(shippingCost) || 0,
        shippingDays: shippingDays || '',
        variation: (colorEnabled || attrEnabled) ? {
          colors: colorEnabled && colorInput ? colorInput.split(',').map(s => s.trim()).filter(Boolean) : [],
          attributes: attrEnabled && attrInput ? attrInput.split(',').map(s => s.trim()).filter(Boolean) : [],
        } : null,
        seller: sellerName || '',
      }
      
      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Save failed')
      }
      
      setSaveMsg('Product saved successfully!')
      setTimeout(() => navigate('/seller/products'), 1200)
    } catch (err) {
      console.error('Save error:', err)
      setSaveErr(err.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-[16px] flex-wrap gap-2">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#2E294E] m-0">Add New Product</h1>
        <div className="flex items-center gap-[8px]">
          <button type="button" onClick={() => navigate('/seller/products')}
            className="bg-[#f3f0ff] text-[#624b95] hover:bg-[#624b95] hover:text-white text-[12px] font-medium rounded-[6px] px-[12px] h-[28px] transition-colors">
            ← Back to Products
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <div>
                <Label required>Select Main Category</Label>
                <Select value={category} onChange={v => { setCategory(v); setSubCategory('') }}>
                  <option value="" disabled>Select Main Category</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </Select>
              </div>
              <div>
                <Label>Brand</Label>
                <Select value={brand} onChange={setBrand}>
                  <option value="">Select Brand</option>
                  {brandList.map((b, i) => <option key={i} value={b.name}>{b.name}</option>)}
                </Select>
              </div>
            </div>
            <div className="mb-[12px]">
              <Label>Store / Seller Name</Label>
              <Input value={sellerName} disabled placeholder="Auto-filled from your account" />
              <small className="block text-[12px] text-[#9da3ae] mt-1">Automatically set to your store name.</small>
            </div>
          </Section>

          {/* Product Configuration */}
          <Section title="Product Configuration">
            <div className="mb-[12px]">
              <Label>Sub Category</Label>
              <Select value={subCategory} onChange={setSubCategory}>
                <option value="">Select Sub Category</option>
                {subCategoryOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
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
              <Label>Tags</Label>
              <div className="border border-[#f1f1f4] rounded-[6px] p-[10px] bg-white focus-within:border-[#624b95]">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mb-[8px]">
                    {tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-[10px] py-[3px] bg-[#f3f0ff] text-[#624b95] text-[12px] rounded-full border border-[#624b95]/30">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="text-[#624b95] hover:text-[#f1416c] leading-none">✕</button>
                      </span>
                    ))}
                  </div>
                )}
                <select value="" onChange={e => { const v = e.target.value; if (v && !tags.includes(v)) setTags([...tags, v]) }}
                  className="w-full text-[13px] text-[#2E294E] bg-transparent border-none outline-none">
                  <option value="">-- Select tag --</option>
                  {brandList.map((b, i) => <option key={i} value={b.name} disabled={tags.includes(b.name)}>{b.name}</option>)}
                </select>
              </div>
              <small className="block text-[12px] text-[#9da3ae] mt-1">Select one or more brand tags.</small>
            </div>
          </Section>

          {/* Files & Media */}
          <Section title="Files & Media">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <ImageUpload label="Add Thumbnail Image" note="300px × 300px" value={image} onChange={setImage} />
              <ImageUpload label="Gallery Image 2" note="800px × 800px" value={image2} onChange={setImage2} />
              <ImageUpload label="Gallery Image 3" note="800px × 800px" value={image3} onChange={setImage3} />
            </div>
          </Section>

          {/* Product Description */}
          <Section title="Product Description">
            <EditorToolbar />
            <textarea rows={8} value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] border-t-0 rounded-b-[6px] focus:outline-none focus:border-[#624b95] resize-y" />
          </Section>

          {/* Product price + stock */}
          <Section title="Product price + stock">
            <h6 className="text-[14px] font-bold text-[#2E294E] mb-[12px]">Product Variation Configuration</h6>

            <div className="grid grid-cols-12 gap-[12px] mb-[8px] items-center">
              <div className="col-span-3"><Input value="Colors" disabled className="bg-[#f5f5f7]" /></div>
              <div className="col-span-8">
                <Input placeholder="red, blue, green" value={colorInput} onChange={setColorInput}
                  disabled={!colorEnabled} className={!colorEnabled ? 'bg-[#f5f5f7] opacity-50' : ''} />
              </div>
              <div className="col-span-1 flex justify-center">
                <SellerSwitch checked={colorEnabled} onChange={setColorEnabled} />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-[12px] items-center mb-[16px]">
              <div className="col-span-3"><Input value="Attributes" disabled className="bg-[#f5f5f7]" /></div>
              <div className="col-span-8">
                <Input placeholder="S, M, XL, XXL" value={attrInput} onChange={setAttrInput}
                  disabled={!attrEnabled} className={!attrEnabled ? 'bg-[#f5f5f7] opacity-50' : ''} />
              </div>
              <div className="col-span-1 flex justify-center">
                <SellerSwitch checked={attrEnabled} onChange={setAttrEnabled} />
              </div>
            </div>

            <div className="mb-[12px]">
              <Label required>Unit price</Label>
              <Input type="number" value={price} onChange={setPrice} step="0.01" placeholder="Unit price" />
              {price === '0' && <small className="text-[12px] text-[#f1416c] mt-1 block">Price must be greater than 0</small>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <div>
                <Label>Discount Date Range</Label>
                <div className="flex items-center gap-[8px]">
                  <input type="date" value={discountDateStart} onChange={e => setDiscountDateStart(e.target.value)}
                    className="flex-1 h-[40px] px-[10px] text-[13px] text-[#2E294E] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#624b95]" />
                  <span className="text-[13px] text-[#9da3ae] flex-shrink-0">to</span>
                  <input type="date" value={discountDateEnd} onChange={e => setDiscountDateEnd(e.target.value)} min={discountDateStart}
                    className="flex-1 h-[40px] px-[10px] text-[13px] text-[#2E294E] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#624b95]" />
                </div>
              </div>
              <div>
                <Label>Discount</Label>
                <div className="flex">
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0.00"
                    className="flex-1 h-[40px] px-[14px] text-[13px] border border-[#f1f1f4] rounded-l-[6px] focus:outline-none focus:border-[#624b95]" />
                  <Select value={discountType} onChange={setDiscountType} className="w-[120px] [&>select]:rounded-l-none [&>select]:border-l-0">
                    <option value="flat">Flat</option>
                    <option value="percent">Percent</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
              <div>
                <Label>Stock</Label>
                <Input type="number" value={stock} onChange={setStock} step="1" placeholder="10" />
              </div>
            </div>

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
                <SellerSwitch checked={published} onChange={setPublished} />
                <span className="text-[14px] text-[#2E294E]">Published</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <SellerSwitch checked={featured} onChange={setFeatured} />
                <span className="text-[14px] text-[#2E294E]">Featured</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <SellerSwitch checked={todaysDeal} onChange={setTodaysDeal} />
                <span className="text-[14px] text-[#2E294E]">Todays Deal</span>
              </div>
            </div>

            <div className="mt-[16px]">
              <Label className="text-[16px] font-bold">Flash Sale</Label>
              <Select value={flashSaleId} onChange={setFlashSaleId} className="mt-[6px]">
                <option value="">Choose Flash Title</option>
                {flashDeals.map((deal, i) => (
                  <option key={i} value={String(deal._id || deal.id)}>{deal.title || `Deal #${i + 1}`}</option>
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
              <SellerSwitch checked={refundable} onChange={setRefundable} />
              <span className="text-[14px] text-[#2E294E]">Refundable</span>
            </div>
            <CheckboxRow checked={showRefundNotes} onChange={setShowRefundNotes}>
              Show notes in refund section in product description page
            </CheckboxRow>
            {showRefundNotes && (
              <div className="mt-[10px]">
                <Label>Refund Note</Label>
                <textarea rows={3} value={refundNote} onChange={e => setRefundNote(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#624b95] resize-y"
                  placeholder="Enter refund note..." />
              </div>
            )}
            {!showRefundNotes && (
              <div className="mt-[16px]">
                <h6 className="text-[14px] font-bold text-[#2E294E] mb-[10px]">Note (Add from preset)</h6>
                <NotePreset text="This product is eligible for a refund within 7 days of delivery. Contact support to initiate a return." />
                <AddPresetButton>Add New Preset</AddPresetButton>
              </div>
            )}
          </Section>

          {/* Warranty */}
          <Section title="Warranty">
            <div className="flex items-center gap-[12px]">
              <SellerSwitch checked={warranty} onChange={setWarranty} />
              <span className="text-[14px] text-[#2E294E]">Enable warranty for this product</span>
            </div>
            <CheckboxRow checked={showWarrantyNote} onChange={setShowWarrantyNote}>
              Show notes in warranty section in product page
            </CheckboxRow>
            {showWarrantyNote && (
              <div className="mt-[10px]">
                <Label>Warranty Note</Label>
                <textarea rows={3} value={warrantyNote} onChange={e => setWarrantyNote(e.target.value)}
                  className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#624b95] resize-y"
                  placeholder="Enter warranty note..." />
              </div>
            )}
            {!showWarrantyNote && (
              <div className="mt-[16px]">
                <h6 className="text-[14px] font-bold text-[#2E294E] mb-[10px]">Notes (Add from Preset)</h6>
                <NotePreset text="This product carries a manufacturer warranty. Contact us for warranty claims." />
                <AddPresetButton>Add New Notes</AddPresetButton>
              </div>
            )}
          </Section>

          {/* Shipping */}
          <Section title="Shipping">
            <h6 className="text-[14px] font-bold text-[#2E294E] mb-[6px]">Shipping Configuration</h6>
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[12px]">
                <SellerSwitch checked={shippingType === 'free'} onChange={() => setShippingType('free')} />
                <span className="text-[14px] text-[#2E294E]">Free Shipping</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <SellerSwitch checked={shippingType === 'flat_rate'} onChange={() => setShippingType('flat_rate')} />
                <span className="text-[14px] text-[#2E294E]">Flat Rate</span>
              </div>
              {shippingType === 'flat_rate' && (
                <div>
                  <Label>Shipping cost</Label>
                  <Input type="number" value={shippingCost} onChange={setShippingCost} min="0" step="0.01" placeholder="Shipping cost" />
                </div>
              )}
            </div>

            <div className="mt-[16px]">
              <h6 className="text-[14px] font-bold text-[#2E294E] mb-[8px]">Estimated Shipping Time</h6>
              <Label className="font-normal">Shipping Days</Label>
              <div className="flex">
                <input type="text" value={shippingDays} onChange={e => setShippingDays(e.target.value)} placeholder="e.g. 7-15"
                  className="flex-1 h-[40px] px-[14px] text-[13px] border border-[#f1f1f4] rounded-l-[6px] focus:outline-none focus:border-[#624b95]" />
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
                <h6 className="text-[14px] font-bold text-[#2E294E] mb-[10px]">Notes (Add from Preset)</h6>
                <NotePreset text="Delivery times may vary based on your location. Express shipping available at checkout." />
                <AddPresetButton>Add New Notes</AddPresetButton>
              </div>
            )}
          </Section>

        </div>

        {/* Bottom action bar */}
        <div className="col-span-12 mt-[8px] flex justify-end gap-[12px] flex-wrap">
          <button type="button" disabled={saving} onClick={() => submit(false)}
            className="bg-[#f5f5f7] hover:bg-[#e4e5eb] text-[#2E294E] text-[14px] font-bold rounded-[6px] w-[230px] h-[44px] border border-[#f1f1f4] transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save & Unpublish'}
          </button>
          <button type="button" disabled={saving} onClick={() => submit(true)}
            className="bg-[#2E294E] hover:bg-[#624b95] text-white text-[14px] font-bold rounded-[6px] w-[230px] h-[44px] shadow-[0_4px_8px_rgba(46,41,78,0.25)] transition-colors disabled:opacity-60">
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