import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
export default function EditProduct_Seller() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth()

  const [loadingProduct, setLoadingProduct] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  const sellerName = user?.shopName || ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, catsRes, flashRes, prodRes] = await Promise.all([
          fetch(`${API}/brands`),
          fetch(`${API}/categories`),
          fetch(`${API}/flash-sales`),
          fetch(`${API}/products/${id}`),
        ])
        if (brandsRes.ok) { const d = await brandsRes.json(); setBrands(d.brands || d || []) }
        if (catsRes.ok) { const d = await catsRes.json(); setCategories(d.categories || d || []) }
        if (flashRes.ok) { const d = await flashRes.json(); setFlashDeals(d.flashSales || d || []) }
        if (!prodRes.ok) { setNotFound(true); return }
        const p = await prodRes.json()
        const prod = p.product || p

        setTitle(prod.title || '')
        setCategory(prod.category || '')
        setSubCategory(prod.subCategory || '')
        setBrand(prod.brand || '')
        setDescription(prod.description || '')
        setTags(prod.Tags || [])
        setImage(prod.image || '')
        setImage2(prod.image2 || '')
        setImage3(prod.image3 || '')
        setUnit(prod.unit || '')
        setWeight(String(prod.weight || 0))
        setMinQty(String(prod.minQty || 1))
        setPrice(String(prod.price || 0))
        setDiscount(String(prod.discount || 0))
        setDiscountType(prod.discountType || 'flat')
        if (prod.discountDateRange) {
          const parts = prod.discountDateRange.split(' - ')
          setDiscountDateStart(parts[0] || '')
          setDiscountDateEnd(parts[1] || '')
        }
        if (prod.variation) {
          if (prod.variation.colors?.length) { setColorEnabled(true); setColorInput(prod.variation.colors.join(', ')) }
          if (prod.variation.attributes?.length) { setAttrEnabled(true); setAttrInput(prod.variation.attributes.join(', ')) }
        }
        setStock(String(prod.stockCount || 0))
        setExternalLink(prod.externalLink || '')
        setLinkButtonText(prod.linkButtonText || '')
        setPublished(!!prod.published)
        setFeatured(!!prod.featured)
        setTodaysDeal(!!prod.todaysDeal)
        setFlashSaleId(prod.flashSaleId || '')
        setFlashSaleDiscount(String(prod.flashSaleDiscount || 0))
        setFlashSaleDiscountType(prod.flashSaleDiscountType || 'flat')
        setRefundable(prod.refundable !== false)
        setRefundNote(prod.refundNote || '')
        setWarranty(!!prod.warranty)
        setWarrantyNote(prod.warrantyNote || '')
        setShippingType(prod.shippingType || 'free')
        setShippingCost(String(prod.shippingCost || 0))
        setShippingDays(prod.shippingDays || '')
      } catch { setNotFound(true) }
      finally { setLoadingProduct(false) }
    }
    fetchData()
  }, [id])

  const brandList = brands.length > 0 ? brands : []
  const subCategoryOptions = category
    ? (categories.find(c => c.name === category)?.subCategories || []) : []

  const submit = async (publishedVal) => {
    if (!title || !category || !image) {
      setSaveErr('Product Name, Category and Thumbnail are required.')
      return
    }
    setSaving(true); setSaveMsg(''); setSaveErr('')
    try {
      const payload = {
        title, category, subCategory, brand, description,
        Tags: tags, image, image2, image3,
        unit, weight: parseFloat(weight) || 0,
        minQty: parseInt(minQty) || 1,
        price: parseFloat(price) || 0,
        discount: parseFloat(discount) || 0, discountType,
        discountDateRange: discountDateStart && discountDateEnd ? `${discountDateStart} - ${discountDateEnd}` : '',
        stockCount: parseInt(stock) || 0,
        externalLink, linkButtonText,
        published: publishedVal,
        featured, todaysDeal,
        flashSaleId, flashSaleDiscount: parseFloat(flashSaleDiscount) || 0, flashSaleDiscountType,
        refundable, refundNote,
        warranty, warrantyNote,
        shippingType, shippingCost: parseFloat(shippingCost) || 0, shippingDays,
        variation: (colorEnabled || attrEnabled) ? {
          colors: colorEnabled ? colorInput.split(',').map(s => s.trim()).filter(Boolean) : [],
          attributes: attrEnabled ? attrInput.split(',').map(s => s.trim()).filter(Boolean) : [],
        } : null,
        seller: sellerName,
      }
      const res = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || 'Save failed') }
      setSaveMsg('Product updated successfully!')
      setTimeout(() => navigate('/seller/products'), 1200)
    } catch (err) {
      setSaveErr(err.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  if (loadingProduct) {
    return <div className="text-center py-16 text-[#a5a5b8]">Loading product...</div>
  }

  if (notFound) {
    return (
      <div className="text-center py-16">
        <div className="text-[#f1416c] text-[16px] mb-4">Product not found or access denied.</div>
        <button onClick={() => navigate('/seller/products')} className="bg-[#2E294E] text-white px-6 py-2 rounded-[6px] text-[14px]">← Back to Products</button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-[16px] flex-wrap gap-2">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#2E294E] m-0">Edit Product</h1>
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

          <Section title="Files & Media">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <ImageUpload label="Add Thumbnail Image" note="300px × 300px" value={image} onChange={setImage} />
              <ImageUpload label="Gallery Image 2" note="800px × 800px" value={image2} onChange={setImage2} />
              <ImageUpload label="Gallery Image 3" note="800px × 800px" value={image3} onChange={setImage3} />
            </div>
          </Section>

          <Section title="Product Description">
            <EditorToolbar />
            <textarea rows={8} value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-[14px] py-[10px] text-[13px] border border-[#f1f1f4] border-t-0 rounded-b-[6px] focus:outline-none focus:border-[#624b95] resize-y" />
          </Section>

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
            {saving ? 'Saving…' : 'Update & Publish'}
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