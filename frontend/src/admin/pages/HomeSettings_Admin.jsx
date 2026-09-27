import { useState, useEffect, useRef } from 'react'

// SVG Icons (verbatim from source)

const InfoSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M8,16a8,8,0,1,1,8-8A8.024,8.024,0,0,1,8,16ZM8,1.333A6.667,6.667,0,1,0,14.667,8,6.686,6.686,0,0,0,8,1.333Z" fill="#9da3ae"/>
    <path d="M10.6,15a.926.926,0,0,1-.667-.333c-.333-.467-.067-1.133.667-2.933.133-.267.267-.6.4-.867a.714.714,0,0,1-.933-.067.644.644,0,0,1,0-.933A3.408,3.408,0,0,1,11.929,9a.926.926,0,0,1,.667.333c.333.467.067,1.133-.667,2.933-.133.267-.267.6-.4.867a.714.714,0,0,1,.933.067.644.644,0,0,1,0,.933A3.408,3.408,0,0,1,10.6,15Z" transform="translate(-3.262 -3)" fill="#9da3ae"/>
    <circle cx="1" cy="1" r="1" transform="translate(8 3.333)" fill="#9da3ae"/>
    <path d="M12.833,7.167a1.333,1.333,0,1,1,1.333-1.333A1.337,1.337,0,0,1,12.833,7.167Zm0-2a.63.63,0,0,0-.667.667.667.667,0,1,0,1.333,0A.63.63,0,0,0,12.833,5.167Z" transform="translate(-3.833 -1.5)" fill="#9da3ae"/>
  </svg>
)

const PlusCircleSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#19c553" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

const TimesSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#f1416c" strokeWidth="2" strokeLinecap="round">
    <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
  </svg>
)

const FLAG_EN = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/en.png'
const FLAG_BD = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/bd.png'
const FLAG_SA = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/flags/sa.png'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

// Side nav tabs
const SIDE_TABS = [
  { id: 'home_slider',      label: 'Home Slider' },
  { id: 'flash_sale',       label: 'Flash Sale' },
  { id: 'flash_deal_2',     label: 'Flash Sale Deal' },
  { id: 'banner_1',         label: 'Banner Level 1' },
  { id: 'banner_2',         label: 'Banner Level 2' },
  { id: 'auction',          label: 'Auction Products', badge: 'Addon' },
  { id: 'classifieds',      label: 'Classifieds' },
  { id: 'newestPreorder',   label: 'Newest Preorder Products' },
  { id: 'all_products',     label: 'More Products' },
]

// Spinner
const Spin = () => (
  <svg className="w-4 h-4 animate-spin inline" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

// Image upload helper with working file input
function ImgUpload({ value, onFileChange, onRemove, uploading, label }) {
  const fileInputRef = useRef(null)

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[13px] font-medium text-[#232734] mb-[6px]">
          {label}
        </label>
      )}
      <div className="flex" style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}>
        <button
          type="button"
          onClick={handleBrowseClick}
          className="flex items-center px-3 text-[12px] font-medium text-[#575b6a] shrink-0"
          style={{ background: 'rgba(143,151,171,0.15)', borderRight: '1px solid #e4e5eb', borderRadius: '4px 0 0 4px' }}
        >
          Browse
        </button>
        <div
          className="flex-1 px-3 py-[6px] text-[12px] text-[#575b6a] truncate"
          style={{ background: '#fff', borderRadius: '0 4px 4px 0' }}
        >
          {value ? (value.split('/').pop() || 'image selected') : 'Choose File'}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      {uploading && (
        <p className="text-xs text-blue-600 flex items-center gap-1"><Spin /> Uploading…</p>
      )}
      {!uploading && value && (
        <div className="flex items-center gap-3 mt-2">
          <img src={value} alt="preview"
            className="w-24 h-16 object-cover rounded-lg border border-gray-200"
            onError={e => { e.target.src = PH }} />
          <button type="button" onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 hover:underline">
            Remove
          </button>
        </div>
      )}
    </div>
  )
}


function SliderRow({ imgUrl, linkUrl, onImgChange, onLinkChange, onRemove, uploading }) {
  return (
    <div className="p-3 mb-3 remove-parent" style={{ border: '1px dashed #e4e5eb' }}>
      <div className="flex flex-wrap gap-[5px]">
        <div className="flex-[0_0_auto] w-full md:w-[41.6667%]">
          <ImgUpload
            value={imgUrl}
            uploading={uploading}
            onFileChange={onImgChange}
            onRemove={onRemove}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-0">
            <input
              type="text"
              className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]"
              style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}
              placeholder="http://"
              value={linkUrl}
              onChange={onLinkChange}
            />
          </div>
        </div>
        <div className="shrink-0 flex items-start pt-[2px]">
          <button
            type="button"
            onClick={onRemove}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
            style={{ background: '#fff4f8', border: 'none', marginTop: 2 }}
          >
            <TimesSvg />
          </button>
        </div>
      </div>
    </div>
  )
}

// Product Selector Row with image
function ProductSelectorRow({ product, onRemove }) {
  return (
    <div className="p-3 mb-3 flex items-center justify-between" style={{ border: '1px dashed #e4e5eb', background: '#f8f9fa' }}>
      <div className="flex items-center gap-3 flex-1">
        <img src={product.image || PH} alt={product.title} className="w-10 h-10 object-cover rounded" onError={e => { e.target.src = PH }} />
        <div className="flex-1">
          <div className="text-[13px] font-medium">{product.title}</div>
          <div className="text-[11px] text-gray-500">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</div>
        </div>
      </div>
      <button type="button" onClick={onRemove} className="w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: '#fff4f8', border: 'none' }}>
        <TimesSvg />
      </button>
    </div>
  )
}

// Product Add Dropdown with image preview
function ProductAddDropdown({ products, selectedIds, onAdd, placeholder }) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const filteredProducts = products.filter(p =>
    !selectedIds.includes(p._id) &&
    (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (product) => {
    onAdd(product._id)
    setSearch('')
    setIsOpen(false)
  }

  return (
    <div className="mt-3" ref={dropdownRef}>
      <div className="relative">
        <div
          className="w-full px-3 py-[6px] text-[12px] text-[#575b6a] cursor-pointer flex items-center justify-between"
          style={{ border: '1px solid #e4e5eb', borderRadius: 4, background: '#fff' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{search || placeholder}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <div className="sticky top-0 bg-white p-2 border-b">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {filteredProducts.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">No products found</div>
            ) : (
              filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer border-b"
                  onClick={() => handleSelect(product)}
                >
                  <img src={product.image || PH} alt={product.title} className="w-8 h-8 object-cover rounded" onError={e => { e.target.src = PH }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{product.title}</div>
                    <div className="text-[10px] text-gray-500">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Banner2 specific row
function Banner2Row({ imgUrl, imgSmallUrl, linkUrl, onImgChange, onImgSmallChange, onLinkChange, onRemove, uploadingImg, uploadingImgSmall }) {
  return (
    <div className="p-3 mb-3" style={{ border: '1px dashed #e4e5eb' }}>
      <div className="flex flex-wrap gap-[5px]">
        <div className="flex-[0_0_auto] w-full md:w-[33%]">
          <ImgUpload
            label="Banner"
            value={imgUrl}
            uploading={uploadingImg}
            onFileChange={onImgChange}
            onRemove={() => onImgChange(null, true)}
          />
        </div>
        <div className="flex-[0_0_auto] w-full md:w-[33%]">
          <ImgUpload
            label="Banner for Small device"
            value={imgSmallUrl}
            uploading={uploadingImgSmall}
            onFileChange={onImgSmallChange}
            onRemove={() => onImgSmallChange(null, true)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-[13px] font-medium text-[#232734] mb-2 block">Links</label>
          <input type="text" className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]" style={{ border: '1px solid #e4e5eb', borderRadius: 4 }} placeholder="http://" value={linkUrl} onChange={onLinkChange} />
        </div>
        <div className="shrink-0 flex items-end pb-[2px]">
          <button type="button" onClick={onRemove} className="w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: '#fff4f8', border: 'none' }}>
            <TimesSvg />
          </button>
        </div>
      </div>
    </div>
  )
}

// Add New button
function AddNewBtn({ onClick, disabled = false }) {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-2 py-3 text-[14px] text-[#232734] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ border: '1px solid #e4e5eb', background: '#fcfcfc', borderRadius: 0 }}
      >
        <PlusCircleSvg />
        <span>Add New</span>
      </button>
    </div>
  )
}

// Save button
function SaveBtn({ saving, onClick }) {
  return (
    <div className="mt-4 text-right">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="text-white text-[14px] font-bold px-6 py-[10px] rounded-[6px] disabled:opacity-60"
        style={{ background: '#19c553', boxShadow: '0 4px 12px rgba(25,197,83,0.3)', minWidth: 230 }}
      >
        {saving ? <><Spin /> Saving...</> : 'Save'}
      </button>
    </div>
  )
}

// TAB CONTENTS

function HomeSliderTab({ data, onUpdate, saving }) {
  const [uploading, setUploading] = useState({})

  const uploadImg = async (file, index) => {
    setUploading(p => ({ ...p, [index]: true }))
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      const newData = [...data]
      newData[index] = { ...newData[index], img: url }
      onUpdate(newData, false)
    } catch {
      alert('Image upload failed')
    } finally {
      setUploading(p => ({ ...p, [index]: false }))
    }
  }

  const updateLink = (index, link) => {
    const newData = [...data]
    newData[index] = { ...newData[index], link }
    onUpdate(newData, false)
  }

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onUpdate(newData, false)
  }

  const addRow = () => {
    onUpdate([...data, { img: '', link: 'https://codecanyon.net/item/active-ecommerce-cms/23471405' }], false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <div className="flex gap-2 mb-8 text-[11px]">
          <div className="shrink-0 mt-[1px]"><InfoSvg /></div>
          <div className="text-[#9da3ae]">
            <div className="mb-[6px]">Minimum dimensions required: 554px width X 516px height.</div>
            <div>We have limited banner height to maintain UI. We had to crop from both left &amp; right side in view for different devices to make it responsive. Before designing banner keep these points in mind.</div>
          </div>
        </div>

        <div>
          {data.map((row, idx) => (
            <SliderRow
              key={idx}
              imgUrl={row.img}
              linkUrl={row.link}
              uploading={uploading[idx]}
              onImgChange={e => e.target.files[0] && uploadImg(e.target.files[0], idx)}
              onLinkChange={e => updateLink(idx, e.target.value)}
              onRemove={() => removeRow(idx)}
            />
          ))}
        </div>

        <AddNewBtn onClick={addRow} />
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(data, true)} />
    </div>
  )
}

function FlashSaleTab({ selectedDealId, flashDeals, onSelect, saving }) {
  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#232734] mb-[6px]">
            Select Flash Sale
          </label>
          <div className="relative">
            <select
              className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]"
              style={{ 
                border: '1px solid #e4e5eb', 
                borderRadius: 4,
                background: '#fff',
                cursor: 'pointer'
              }}
              value={selectedDealId ?? ''}
              onChange={(e) => onSelect(e.target.value === '' ? null : Number(e.target.value), false)}
            >
              <option value="">Select Flash Sale</option>
              {flashDeals.map(deal => (
                <option key={deal.id} value={deal.id}>
                  Deal #{deal.id} — ends {new Date(deal.end).toLocaleString()} ({deal.discountPercent}% off)
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] text-[#9da3ae] mt-1">
            Choose a flash sale to display on the homepage.
          </div>
          {selectedDealId !== null && (() => {
            const deal = flashDeals.find(d => d.id === selectedDealId)
            if (!deal) return null
            return (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs font-semibold text-blue-700">Selected Deal Preview</p>
                <div className="flex items-center gap-3 mt-2">
                  {deal.img ? (
                    <img src={deal.img} alt={`Deal #${deal.id}`} className="w-24 h-16 object-cover rounded-lg" onError={e => { e.target.src = PH }} />
                  ) : (
                    <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center"><span className="text-xs text-gray-400">No image</span></div>
                  )}
                  <div className="text-xs text-gray-600">
                    <p><span className="font-medium">Ends:</span> {new Date(deal.end).toLocaleString()}</p>
                    <p><span className="font-medium">Discount:</span> {deal.discountPercent}%</p>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
      <SaveBtn saving={saving} onClick={() => onSelect(selectedDealId, true)} />
    </div>
  )
}

function Banner1Tab({ data, onUpdate, saving }) {
  const [uploading, setUploading] = useState({})

  const uploadImg = async (file, index) => {
    setUploading(p => ({ ...p, [index]: true }))
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      const newData = [...data]
      newData[index] = { ...newData[index], img: url }
      onUpdate(newData, false)
    } catch {
      alert('Image upload failed')
    } finally {
      setUploading(p => ({ ...p, [index]: false }))
    }
  }

  const updateLink = (index, link) => {
    const newData = [...data]
    newData[index] = { ...newData[index], link }
    onUpdate(newData, false)
  }

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onUpdate(newData, false)
  }

  const addRow = () => {
    if (data.length >= 3) return
    onUpdate([...data, { img: '', link: 'https://demo.activeitzone.com/ecommerce/flash-deals' }], false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <label className="text-[13px] font-medium text-[#232734] mb-0 block">Banner &amp; Links (Max 3)</label>
        <div className="text-[12px] text-[#9da3ae] mb-3">Minimum dimensions required: 436px width X 240px height.</div>
        {data.map((row, idx) => (
          <SliderRow
            key={idx}
            imgUrl={row.img}
            linkUrl={row.link}
            uploading={uploading[idx]}
            onImgChange={e => e.target.files[0] && uploadImg(e.target.files[0], idx)}
            onLinkChange={e => updateLink(idx, e.target.value)}
            onRemove={() => removeRow(idx)}
          />
        ))}
        {data.length < 3 && <AddNewBtn onClick={addRow} />}
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(data, true)} />
    </div>
  )
}

function Banner2Tab({ data, onUpdate, saving }) {
  const [uploading, setUploading] = useState({ img: {}, imgSmall: {} })

  const uploadImg = async (file, index, type) => {
    setUploading(p => ({ ...p, [type]: { ...p[type], [index]: true } }))
    const fd = new FormData()
    fd.append('image', file)
    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      const newData = [...data]
      newData[index] = { ...newData[index], [type === 'img' ? 'img' : 'imgSmall']: url }
      onUpdate(newData, false)
    } catch {
      alert('Image upload failed')
    } finally {
      setUploading(p => ({ ...p, [type]: { ...p[type], [index]: false } }))
    }
  }

  const updateLink = (index, link) => {
    const newData = [...data]
    newData[index] = { ...newData[index], link }
    onUpdate(newData, false)
  }

  const removeImg = (index, type) => {
    const newData = [...data]
    newData[index] = { ...newData[index], [type === 'img' ? 'img' : 'imgSmall']: '' }
    onUpdate(newData, false)
  }

  const removeRow = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onUpdate(newData, false)
  }

  const addRow = () => {
    onUpdate([...data, { img: '', imgSmall: '', link: '' }], false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <label className="text-[13px] font-medium text-[#232734] mb-0 block">Banner &amp; Links (Max 3)</label>
        <div className="text-[12px] text-[#9da3ae]">Minimum dimensions required For Large Screen: 1370px width X 420px height (If use a single banner).</div>
        <div className="text-[12px] text-[#9da3ae] mb-3">Minimum dimensions required For Small Screen: 436px width X 443px height. (If use a single banner).</div>
        {data.map((row, idx) => (
          <Banner2Row
            key={idx}
            imgUrl={row.img}
            imgSmallUrl={row.imgSmall}
            linkUrl={row.link}
            uploadingImg={uploading.img[idx]}
            uploadingImgSmall={uploading.imgSmall[idx]}
            onImgChange={(e, isRemove) => isRemove ? removeImg(idx, 'img') : e.target.files[0] && uploadImg(e.target.files[0], idx, 'img')}
            onImgSmallChange={(e, isRemove) => isRemove ? removeImg(idx, 'imgSmall') : e.target.files[0] && uploadImg(e.target.files[0], idx, 'imgSmall')}
            onLinkChange={e => updateLink(idx, e.target.value)}
            onRemove={() => removeRow(idx)}
          />
        ))}
        <AddNewBtn onClick={addRow} />
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(data, true)} />
    </div>
  )
}

function AuctionTab({ selectedIds, products, onUpdate, saving }) {
  const selectedProducts = selectedIds.map(id => products.find(p => p._id === id)).filter(p => p)

  const addProduct = (productId) => {
    if (!selectedIds.includes(productId)) {
      onUpdate([...selectedIds, productId], false)
    }
  }

  const removeProduct = (productId) => {
    onUpdate(selectedIds.filter(id => id !== productId), false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <label className="text-[13px] font-medium text-[#232734] mb-2 block">Select Auction Products</label>
        
        {selectedProducts.map(product => (
          <ProductSelectorRow key={product._id} product={product} onRemove={() => removeProduct(product._id)} />
        ))}

        <ProductAddDropdown
          products={products}
          selectedIds={selectedIds}
          onAdd={addProduct}
          placeholder="Add Auction Product"
        />
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(selectedIds, true)} />
    </div>
  )
}

function ClassifiedsTab({ selectedIds, products, onUpdate, saving }) {
  const selectedProducts = selectedIds.map(id => products.find(p => p._id === id)).filter(p => p)

  const addProduct = (productId) => {
    if (!selectedIds.includes(productId)) {
      onUpdate([...selectedIds, productId], false)
    }
  }

  const removeProduct = (productId) => {
    onUpdate(selectedIds.filter(id => id !== productId), false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <label className="text-[13px] font-medium text-[#232734] mb-2 block">Select Classifieds</label>
        
        {selectedProducts.map(product => (
          <ProductSelectorRow key={product._id} product={product} onRemove={() => removeProduct(product._id)} />
        ))}

        <ProductAddDropdown
          products={products}
          selectedIds={selectedIds}
          onAdd={addProduct}
          placeholder="Add Classified Product"
        />
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(selectedIds, true)} />
    </div>
  )
}

function NewestPreorderTab({ selectedIds, products, onUpdate, saving }) {
  const selectedProducts = selectedIds.map(id => products.find(p => p._id === id)).filter(p => p)

  const addProduct = (productId) => {
    if (!selectedIds.includes(productId)) {
      onUpdate([...selectedIds, productId], false)
    }
  }

  const removeProduct = (productId) => {
    onUpdate(selectedIds.filter(id => id !== productId), false)
  }

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <label className="text-[13px] font-medium text-[#232734] mb-2 block">Select Newest Preorder Products</label>
        
        {selectedProducts.map(product => (
          <ProductSelectorRow key={product._id} product={product} onRemove={() => removeProduct(product._id)} />
        ))}

        <ProductAddDropdown
          products={products}
          selectedIds={selectedIds}
          onAdd={addProduct}
          placeholder="Add Preorder Product"
        />
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(selectedIds, true)} />
    </div>
  )
}

function AllProductsTab({ selectedIds, products, onUpdate, saving }) {
  const [search, setSearch] = useState('')
  const [maxItems, setMaxItems] = useState(24)

  const filteredProducts = products.filter(p =>
    (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleProduct = (productId) => {
    if (selectedIds.includes(productId)) {
      onUpdate(selectedIds.filter(id => id !== productId), false)
    } else {
      if (selectedIds.length >= maxItems) {
        alert(`Maximum ${maxItems} products allowed`)
        return
      }
      onUpdate([...selectedIds, productId], false)
    }
  }

  const isSelected = (productId) => selectedIds.includes(productId)

  return (
    <div className="bg-white p-3 md:p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[13px] font-medium text-[#232734]">
            All Products Grid <span className="text-gray-400">({selectedIds.length} / {maxItems} selected)</span>
          </label>
          <div>
            <label className="text-[12px] text-gray-500 mr-2">Max items:</label>
            <select
              value={maxItems}
              onChange={(e) => setMaxItems(Number(e.target.value))}
              className="px-2 py-1 text-xs border border-gray-200 rounded"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title..."
            className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]"
            style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">No products found</div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product._id}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${isSelected(product._id) ? 'border-[#19c553] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => toggleProduct(product._id)}
              >
                <div className="flex gap-2">
                  <img src={product.image || PH} alt={product.title} className="w-12 h-12 object-cover rounded" onError={e => { e.target.src = PH }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{product.title}</div>
                    <div className="text-[11px] text-gray-500">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</div>
                    {product.category && <div className="text-[10px] text-gray-400 truncate">{product.category}</div>}
                  </div>
                  {isSelected(product._id) && (
                    <div className="text-[#19c553]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <SaveBtn saving={saving} onClick={() => onUpdate(selectedIds, true)} />
    </div>
  )
}


function FlashDeal2Tab({ saving, onSave }) {
  const [data, setData]               = useState(null)
  const [tabLoading, setTabLoading]   = useState(true)
  const [allProducts, setAllProducts] = useState([])

  /* deal modal */
  const [showDealModal, setShowDealModal]     = useState(false)
  const [editingDeal, setEditingDeal]         = useState(null)
  const [dealForm, setDealForm]               = useState({ img: '', end: '', discountPercent: 0 })
  const [dealImgUploading, setDealImgUploading] = useState(false)
  const [savingDeal, setSavingDeal]           = useState(false)

  /* product panels */
  const [openDealId, setOpenDealId]           = useState(null)
  const [selectedIds, setSelectedIds]         = useState({})
  const [productSearch, setProductSearch]     = useState({})
  const [toggling, setToggling]               = useState(null)
  const [savingProducts, setSavingProducts]   = useState({})

  /* banner */
  const [bannerImg, setBannerImg]             = useState('')
  const [bannerUploading, setBannerUploading] = useState(false)
  const [savingBanner, setSavingBanner]       = useState(false)

  const fetchData = async () => {
    try {
      setTabLoading(true)
      const [saleRes, prodRes] = await Promise.all([
        fetch(`${API_URL}/flash-sale`),
        fetch(`${API_URL}/products?limit=500`),
      ])
      const saleJson = await saleRes.json()
      const prodJson = await prodRes.json()
      setData(saleJson)
      setBannerImg(saleJson.bannerImage || '')
      setAllProducts(Array.isArray(prodJson) ? prodJson : prodJson.products || [])
      const ids = {}
      for (const deal of saleJson.deals || []) {
        ids[deal.id] = (deal.products || []).map(p => p.productId)
      }
      setSelectedIds(ids)
    } catch (err) { console.error(err) }
    finally { setTabLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const uploadImage = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Upload failed')
    return (await res.json()).url
  }

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setBannerUploading(true)
    try { const url = await uploadImage(file); setBannerImg(url) }
    catch { alert('Upload failed') }
    finally { setBannerUploading(false) }
  }

  const saveBannerFn = async () => {
    setSavingBanner(true)
    try {
      const res = await fetch(`${API_URL}/flash-sale/banner`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bannerImage: bannerImg }),
      })
      if (!res.ok) throw new Error()
      alert('Banner updated!')
      fetchData()
    } catch { alert('Failed to save banner') }
    finally { setSavingBanner(false) }
  }

  const openCreate = () => {
    setEditingDeal(null)
    setDealForm({ img: '', end: '', discountPercent: 0 })
    setShowDealModal(true)
  }

  const openEdit = (deal) => {
    setEditingDeal(deal)
    const normalizeEnd = (s) => s ? s.replace(' ', 'T').replace(/\//g, '-') : ''
    setDealForm({ img: deal.img, end: normalizeEnd(deal.end), discountPercent: deal.discountPercent || 0 })
    setShowDealModal(true)
  }

  const handleDealImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setDealImgUploading(true)
    try { const url = await uploadImage(file); setDealForm(prev => ({ ...prev, img: url })) }
    catch { alert('Upload failed') }
    finally { setDealImgUploading(false) }
  }

  const saveDeal = async () => {
    if (!dealForm.img || !dealForm.end) { alert('Image and End Date/Time are required'); return }
    setSavingDeal(true)
    try {
      const body   = { img: dealForm.img, end: dealForm.end, discountPercent: Number(dealForm.discountPercent) || 0 }
      const url    = editingDeal ? `${API_URL}/flash-sale/deals/${editingDeal.id}` : `${API_URL}/flash-sale/deals`
      const method = editingDeal ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      alert(editingDeal ? 'Deal updated!' : 'Deal added!')
      setShowDealModal(false)
      fetchData()
    } catch { alert('Failed to save deal') }
    finally { setSavingDeal(false) }
  }

  const deleteDeal = async (deal) => {
    if (!window.confirm(`Delete Deal #${deal.id}?`)) return
    try {
      const res = await fetch(`${API_URL}/flash-sale/deals/${deal.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      if (openDealId === deal.id) setOpenDealId(null)
      fetchData()
    } catch { alert('Failed to delete deal') }
  }

  const toggleProduct = async (dealId, productId) => {
    const cur    = selectedIds[dealId] || []
    const inDeal = cur.includes(productId)
    const key    = `${dealId}-${productId}`
    setSelectedIds(prev => ({
      ...prev,
      [dealId]: inDeal ? prev[dealId].filter(id => id !== productId) : [...(prev[dealId] || []), productId],
    }))
    setToggling(key)
    try {
      let res
      if (inDeal) {
        res = await fetch(`${API_URL}/flash-sale/deals/${dealId}/products/${productId}`, { method: 'DELETE' })
      } else {
        res = await fetch(`${API_URL}/flash-sale/deals/${dealId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })
        if (res.status === 409) return
      }
      if (!res.ok) throw new Error()
    } catch {
      setSelectedIds(prev => ({
        ...prev,
        [dealId]: inDeal ? [...(prev[dealId] || []), productId] : (prev[dealId] || []).filter(id => id !== productId),
      }))
      alert('Failed to update product')
    } finally { setToggling(null) }
  }

  const saveAllProductsFn = async (dealId) => {
    const ids = selectedIds[dealId] || []
    setSavingProducts(prev => ({ ...prev, [dealId]: true }))
    try {
      const res      = await fetch(`${API_URL}/flash-sale/deals/${dealId}/products`)
      const json     = await res.json()
      const existing = (json.products || []).map(p => String(p._id))
      for (const id of ids) {
        if (!existing.includes(id)) {
          await fetch(`${API_URL}/flash-sale/deals/${dealId}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: id }),
          })
        }
      }
      for (const id of existing) {
        if (!ids.includes(id)) {
          await fetch(`${API_URL}/flash-sale/deals/${dealId}/products/${id}`, { method: 'DELETE' })
        }
      }
      alert('Products saved!')
      fetchData()
    } catch { alert('Failed to save products') }
    finally { setSavingProducts(prev => ({ ...prev, [dealId]: false })) }
  }

  const getProductLists = (dealId) => {
    const sel  = selectedIds[dealId] || []
    const term = (productSearch[dealId] || '').toLowerCase()
    const filter = p => !term || p.title?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term)
    const selected   = sel.map(id => allProducts.find(p => String(p._id) === id)).filter(p => p && filter(p))
    const unselected = allProducts.filter(p => !sel.includes(String(p._id)) && filter(p))
    return { selected, unselected }
  }

  if (tabLoading) return <div className="bg-white p-3 md:p-8 text-sm text-gray-400 flex items-center gap-2"><Spin /> Loading…</div>

  const deals = data?.deals || []

  return (
    <div className="bg-white p-3 md:p-8">

      {/* Banner Section */}
      <div className="mb-6">
        <label className="block text-[13px] font-medium text-[#232734] mb-2">Hero Banner Image</label>
        <div className="p-3 mb-3" style={{ border: '1px dashed #e4e5eb' }}>
          <div className="flex flex-wrap gap-[5px]">
            <div className="flex-[0_0_auto] w-full md:w-[41.6667%]">
              <ImgUpload
                value={bannerImg}
                uploading={bannerUploading}
                onFileChange={handleBannerUpload}
                onRemove={() => setBannerImg('')}
              />
            </div>
            <div className="shrink-0 flex items-end pb-[2px]">
              <button
                type="button"
                onClick={saveBannerFn}
                disabled={savingBanner}
                className="text-white text-[13px] font-semibold px-4 py-[6px] rounded-[4px] disabled:opacity-60"
                style={{ background: '#19c553' }}
              >
                {savingBanner ? <><Spin /> Saving…</> : 'Save Banner'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Header */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-[13px] font-medium text-[#232734]">
          Flash Deals <span className="text-[#9da3ae] font-normal">({deals.length} / 5)</span>
        </label>
        <button
          type="button"
          onClick={openCreate}
          disabled={deals.length >= 5}
          className="flex items-center gap-2 py-[6px] px-4 text-[13px] text-white rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: '#009ef7' }}
        >
          <PlusCircleSvg />
          Add New Deal
        </button>
      </div>

      {/* Deals List */}
      <div className="space-y-3">
        {!deals.length ? (
          <div className="text-center py-10 text-[13px] text-[#9da3ae]" style={{ border: '1px dashed #e4e5eb' }}>
            No deals yet. Click "Add New Deal" to create your first flash deal.
          </div>
        ) : (
          deals.map((deal, idx) => {
            const isOpen   = openDealId === deal.id
            const discount = deal.discountPercent || 0
            const sel      = selectedIds[deal.id] || []
            const { selected, unselected } = getProductLists(deal.id)

            return (
              <div key={deal.id} style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}>

                {/* Deal header row */}
                <div className="flex items-center gap-3 p-3">
                  <div className="shrink-0 w-20 h-14 rounded overflow-hidden bg-gray-50" style={{ border: '1px solid #e4e5eb' }}>
                    <img src={deal.img} alt={`Deal ${deal.id}`} className="w-full h-full object-cover" onError={e => { e.target.src = PH }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#232734]">Deal #{deal.id} {discount > 0 && <span className="text-[11px] text-[#f1416c] font-semibold ml-1">{discount}% OFF</span>}</div>
                    <div className="text-[11px] text-[#9da3ae] mt-0.5">{deal.end}</div>
                    <div className="text-[11px] text-[#9da3ae]">{sel.length} product{sel.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => { setOpenDealId(prev => prev === deal.id ? null : deal.id); setProductSearch(prev => ({ ...prev, [deal.id]: '' })) }}
                      className="px-3 py-[5px] text-[12px] rounded-[4px]"
                      style={{ background: isOpen ? '#e8f4fe' : '#f1f1f4', color: isOpen ? '#009ef7' : '#575b6a', border: 'none', cursor: 'pointer' }}
                    >
                      {isOpen ? 'Hide' : 'Products'}
                    </button>
                    <button type="button" onClick={() => openEdit(deal)} className="px-2 py-[5px] text-[12px] rounded-[4px]" style={{ background: '#f1f1f4', border: 'none', cursor: 'pointer', color: '#009ef7' }}>Edit</button>
                    <button type="button" onClick={() => deleteDeal(deal)} className="w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: '#fff4f8', border: 'none', cursor: 'pointer' }}><TimesSvg /></button>
                  </div>
                </div>

                {/* Product Panel */}
                {isOpen && (
                  <div className="p-3" style={{ borderTop: '1px solid #e4e5eb', background: '#fafafa' }}>

                    {/* Search */}
                    <div className="mb-3">
                      <input
                        type="text"
                        value={productSearch[deal.id] || ''}
                        onChange={e => setProductSearch(prev => ({ ...prev, [deal.id]: e.target.value }))}
                        placeholder="Search by title, category or brand…"
                        className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]"
                        style={{ border: '1px solid #e4e5eb', borderRadius: 4, background: '#fff' }}
                      />
                    </div>

                    {/* Selected */}
                    {selected.length > 0 && (
                      <div className="mb-2" style={{ border: '1px solid #d1e9ff', borderRadius: 4, overflow: 'hidden' }}>
                        <div className="px-3 py-[5px] text-[11px] font-semibold text-[#009ef7]" style={{ background: '#e8f4fe' }}>
                          ✓ Selected ({selected.length}){discount > 0 && <span className="ml-2 text-[#f1416c]">— {discount}% off</span>}
                        </div>
                        <div>
                          {selected.map(product => {
                            const pid        = String(product._id)
                            const isToggling = toggling === `${deal.id}-${pid}`
                            const discPrice  = discount > 0 ? (product.price * (1 - discount / 100)).toFixed(2) : null
                            return (
                              <label key={pid} className="flex items-center gap-3 px-3 py-2 cursor-pointer" style={{ background: '#f0f9ff', borderBottom: '1px solid #e4e5eb' }}>
                                <input type="checkbox" checked={true} onChange={() => toggleProduct(deal.id, pid)} disabled={isToggling} className="w-4 h-4 shrink-0" style={{ accentColor: '#009ef7' }} />
                                <img src={product.image || PH} alt={product.title} className="w-9 h-9 object-cover rounded shrink-0" style={{ border: '1px solid #e4e5eb' }} onError={e => { e.target.src = PH }} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-medium text-[#232734] truncate">{product.title}</p>
                                  <p className="text-[11px] text-[#9da3ae] truncate">
                                    {product.category} ·{' '}
                                    {discPrice ? <><span className="text-[#009ef7] font-semibold">${discPrice}</span>{' '}<span style={{ textDecoration: 'line-through' }}>${product.price?.toFixed(2)}</span></> : `$${product.price?.toFixed(2)}`}
                                  </p>
                                </div>
                                {isToggling ? <Spin /> : <span className="text-[10px] text-[#009ef7] px-1.5 py-0.5 rounded shrink-0" style={{ background: '#e8f4fe' }}>#{sel.indexOf(pid) + 1}</span>}
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Unselected */}
                    <div className="mb-3" style={{ border: '1px solid #e4e5eb', borderRadius: 4, overflow: 'hidden' }}>
                      <div className="px-3 py-[5px] text-[11px] font-semibold text-[#575b6a]" style={{ background: '#f1f1f4' }}>
                        {productSearch[deal.id] ? `Results for "${productSearch[deal.id]}"` : 'All products'}
                      </div>
                      <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                        {unselected.length === 0 ? (
                          <p className="text-center text-[12px] text-[#9da3ae] py-6">
                            {productSearch[deal.id] ? 'No matching products' : 'All products are selected'}
                          </p>
                        ) : (
                          unselected.map(product => {
                            const pid        = String(product._id)
                            const isToggling = toggling === `${deal.id}-${pid}`
                            return (
                              <label key={pid} className="flex items-center gap-3 px-3 py-2 cursor-pointer" style={{ borderBottom: '1px solid #f1f1f4', background: '#fff' }}>
                                <input type="checkbox" checked={false} onChange={() => toggleProduct(deal.id, pid)} disabled={isToggling} className="w-4 h-4 shrink-0" style={{ accentColor: '#009ef7' }} />
                                <img src={product.image || PH} alt={product.title} className="w-9 h-9 object-cover rounded shrink-0" style={{ border: '1px solid #e4e5eb' }} onError={e => { e.target.src = PH }} />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-medium text-[#232734] truncate">{product.title}</p>
                                  <p className="text-[11px] text-[#9da3ae] truncate">{product.category} · ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
                                </div>
                                {isToggling && <Spin />}
                              </label>
                            )
                          })
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => saveAllProductsFn(deal.id)}
                      disabled={savingProducts[deal.id]}
                      className="text-white text-[13px] font-semibold px-4 py-[6px] rounded-[4px] disabled:opacity-60"
                      style={{ background: '#19c553' }}
                    >
                      {savingProducts[deal.id] ? <><Spin /> Saving…</> : 'Save Products'}
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Deal Modal */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDealModal(false)} />
            <div className="relative bg-white rounded-[8px] shadow-xl max-w-lg w-full" style={{ border: '1px solid #e4e5eb' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e4e5eb' }}>
                <h2 className="text-[16px] font-semibold text-[#232734]">{editingDeal ? `Edit Deal #${editingDeal.id}` : 'Add New Deal'}</h2>
                <button type="button" onClick={() => setShowDealModal(false)} className="w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ background: '#fff4f8' }}><TimesSvg /></button>
              </div>
              <div className="p-6 space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-[13px] font-medium text-[#232734] mb-[6px]">Deal Banner Image <span className="text-[#f1416c]">*</span></label>
                  <ImgUpload value={dealForm.img} uploading={dealImgUploading} onFileChange={handleDealImageUpload} onRemove={() => setDealForm(prev => ({ ...prev, img: '' }))} />
                </div>
                {/* End Date */}
                <div>
                  <label className="block text-[13px] font-medium text-[#232734] mb-[6px]">Countdown End Date & Time <span className="text-[#f1416c]">*</span></label>
                  <input
                    type="datetime-local"
                    value={dealForm.end ? dealForm.end.slice(0, 16) : ''}
                    onChange={e => { const v = e.target.value; setDealForm(prev => ({ ...prev, end: v ? v + ':00' : '' })) }}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-3 py-[6px] text-[12px] text-[#575b6a]"
                    style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}
                  />
                  {dealForm.end && <p className="text-[11px] text-[#19c553] mt-1">Set to: {new Date(dealForm.end).toLocaleString()}</p>}
                </div>
                {/* Discount */}
                <div>
                  <label className="block text-[13px] font-medium text-[#232734] mb-[6px]">Discount Percentage (0–100)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" max="100" value={dealForm.discountPercent}
                      onChange={e => setDealForm(prev => ({ ...prev, discountPercent: Math.min(100, Math.max(0, Number(e.target.value))) }))}
                      className="w-28 px-3 py-[6px] text-[12px] text-[#575b6a]"
                      style={{ border: '1px solid #e4e5eb', borderRadius: 4 }}
                      placeholder="0" />
                    <span className="text-[#575b6a] text-[13px] font-semibold">%</span>
                    {dealForm.discountPercent > 0 && <span className="text-[11px] text-[#f1416c] font-semibold px-2 py-0.5 rounded" style={{ background: '#fff5f8' }}>{dealForm.discountPercent}% off all products</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #e4e5eb' }}>
                <button type="button" onClick={() => setShowDealModal(false)} className="px-4 py-[6px] text-[13px] text-[#575b6a] rounded-[4px]" style={{ background: '#f1f1f4', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <button type="button" onClick={saveDeal} disabled={savingDeal} className="px-4 py-[6px] text-[13px] font-semibold text-white rounded-[4px] disabled:opacity-60" style={{ background: '#009ef7', border: 'none', cursor: 'pointer' }}>
                  {savingDeal ? 'Saving…' : editingDeal ? 'Update Deal' : 'Add Deal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main Page 
export default function HomeSettings_Admin() {
  const [activeTab, setActiveTab] = useState('home_slider')
  const [activeLang, setActiveLang] = useState('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})

  // Data states
  const [heroBanners, setHeroBanners] = useState([])
  const [flashDealId, setFlashDealId] = useState(null)
  const [flashDeals, setFlashDeals] = useState([])
  const [promotionBanners, setPromotionBanners] = useState([])
  const [banner2Data, setBanner2Data] = useState([])
  const [auctionProducts, setAuctionProducts] = useState([])
  const [classifiedProducts, setClassifiedProducts] = useState([])
  const [preorderProducts, setPreorderProducts] = useState([])
  const [allProductsGrid, setAllProductsGrid] = useState([])
  const [allProducts, setAllProducts] = useState([])

  const fetchHome = async () => {
    try {
      const res = await fetch(`${API_URL}/home`)
      const json = await res.json()
      setHeroBanners(json.heroBanners?.map(url => ({ img: url, link: '' })) || [])
      setPromotionBanners(json.promotionBanners?.map(b => ({ img: b.img, link: b.alt || '' })) || [])
      setAuctionProducts(json.auctionProducts?.map(p => p._id) || [])
      setClassifiedProducts(json.classifiedAds?.map(p => p._id) || [])
      setPreorderProducts(json.preOrderProducts?.map(p => p._id) || [])
      setAllProductsGrid(json.allProducts?.map(p => p._id) || [])
      
      if (json.shopsLongBanner) {
        setBanner2Data([{ img: json.shopsLongBanner, imgSmall: '', link: '/categories' }])
      } else {
        setBanner2Data([])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFlashDeals = async () => {
    try {
      const res = await fetch(`${API_URL}/flash-sale`)
      const json = await res.json()
      setFlashDeals(json.deals || [])
      
      const homeRes = await fetch(`${API_URL}/home`)
      const homeJson = await homeRes.json()
      if (homeJson.flashDealBanner && homeJson.flashDealEnd) {
        const matched = json.deals?.find(d => d.img === homeJson.flashDealBanner && d.end === homeJson.flashDealEnd)
        setFlashDealId(matched ? matched.id : null)
      }
    } catch (err) { console.error(err) }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?limit=500`)
      const json = await res.json()
      setAllProducts(json.products || [])
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    Promise.all([fetchHome(), fetchFlashDeals(), fetchProducts()]).finally(() => setLoading(false))
  }, [])

  // Save handlers
  const saveHeroBanners = async (newData, shouldSave) => {
    if (!shouldSave) { setHeroBanners(newData); return }
    setSaving(p => ({ ...p, home_slider: true }))
    try {
      const res = await fetch(`${API_URL}/home/hero-banners`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroBanners: newData.map(d => d.img) }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setHeroBanners(newData)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, home_slider: false })) }
  }

  const saveFlashDeal = async (dealId, shouldSave) => {
    if (!shouldSave) { setFlashDealId(dealId); return }
    setSaving(p => ({ ...p, flash_sale: true }))
    try {
      const deal = flashDeals.find(d => d.id === dealId)
      const body = { flashDealBanner: deal?.img || '', flashDealEnd: deal?.end || '' }
      const res = await fetch(`${API_URL}/home/flash-deal-banner`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setFlashDealId(dealId)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, flash_sale: false })) }
  }

  const savePromotionBanners = async (newData, shouldSave) => {
    if (!shouldSave) { setPromotionBanners(newData); return }
    setSaving(p => ({ ...p, banner_1: true }))
    try {
      const banners = newData.map(d => ({ img: d.img, alt: d.link }))
      const res = await fetch(`${API_URL}/home/promotion-banners`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotionBanners: banners }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setPromotionBanners(newData)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, banner_1: false })) }
  }

  const saveBanner2 = async (newData, shouldSave) => {
    if (!shouldSave) { setBanner2Data(newData); return }
    setSaving(p => ({ ...p, banner_2: true }))
    try {
      const shopsLongBanner = newData[0]?.img || ''
      const res = await fetch(`${API_URL}/home/shops-long-banner`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopsLongBanner }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setBanner2Data(newData)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, banner_2: false })) }
  }

  const saveAuction = async (newIds, shouldSave) => {
    if (!shouldSave) { setAuctionProducts(newIds); return }
    setSaving(p => ({ ...p, auction: true }))
    try {
      const products = newIds.map(id => allProducts.find(p => p._id === id)).filter(p => p)
      const res = await fetch(`${API_URL}/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionProducts: products }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setAuctionProducts(newIds)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, auction: false })) }
  }

  const saveClassifieds = async (newIds, shouldSave) => {
    if (!shouldSave) { setClassifiedProducts(newIds); return }
    setSaving(p => ({ ...p, classifieds: true }))
    try {
      const products = newIds.map(id => allProducts.find(p => p._id === id)).filter(p => p)
      const res = await fetch(`${API_URL}/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classifiedAds: products }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setClassifiedProducts(newIds)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, classifieds: false })) }
  }

  const savePreorder = async (newIds, shouldSave) => {
    if (!shouldSave) { setPreorderProducts(newIds); return }
    setSaving(p => ({ ...p, newestPreorder: true }))
    try {
      const products = newIds.map(id => allProducts.find(p => p._id === id)).filter(p => p)
      const res = await fetch(`${API_URL}/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preOrderProducts: products }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setPreorderProducts(newIds)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, newestPreorder: false })) }
  }

  const saveAllProducts = async (newIds, shouldSave) => {
    if (!shouldSave) { setAllProductsGrid(newIds); return }
    setSaving(p => ({ ...p, all_products: true }))
    try {
      const products = newIds.map(id => allProducts.find(p => p._id === id)).filter(p => p)
      const res = await fetch(`${API_URL}/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allProducts: products }),
      })
      if (!res.ok) throw new Error()
      alert('Saved!')
      setAllProductsGrid(newIds)
    } catch { alert('Save failed') } finally { setSaving(p => ({ ...p, all_products: false })) }
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="mt-2 pb-2 px-3 text-left border-b" style={{ borderColor: '#e4e5eb' }}>
          <h1 className="text-[20px] font-semibold text-[#232734] m-0">Homepage Settings (Thecore)</h1>
        </div>
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-content">

      <div className="mt-2 pb-2 px-3 text-left border-b" style={{ borderColor: '#e4e5eb', paddingLeft: '12px', paddingRight: '32px' }}>
        <h1 className="text-[20px] font-semibold text-[#232734] m-0">Homepage Settings (Thecore)</h1>
      </div>

      <div className="flex">

        <div className="shrink-0 px-3 py-2 overflow-y-auto" style={{ width: 200, borderRight: '1px solid #f1f1f4' }}>
          <ul className="list-none m-0 p-0 flex flex-col">
            {SIDE_TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full text-left px-3 py-[8px] text-[13px] flex items-center gap-[6px] rounded"
                    style={{
                      background: isActive ? '#f1fafd' : 'transparent',
                      color: isActive ? '#009ef7' : '#575b6a',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span className="text-[10px] font-semibold text-white px-[5px] py-[1px] rounded-full" style={{ background: '#a1a5b3', marginLeft: 2 }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="flex-1 p-3 md:p-8 mb-8 min-w-0">

          <ul className="list-none m-0 p-0 flex border-b mb-0" style={{ borderColor: '#dee2e6' }}>
            {[
              { code: 'en', flag: FLAG_EN, label: 'English' },
              { code: 'bd', flag: FLAG_BD, label: 'Bangla' },
              { code: 'sa', flag: FLAG_SA, label: 'Arabic' },
            ].map(lang => {
              const isActive = activeLang === lang.code
              return (
                <li key={lang.code} className="flex-1 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveLang(lang.code)}
                    className="w-full py-3 text-[13px] text-[#232734] flex items-center justify-center gap-1 border-b-[2px] transition-colors"
                    style={{
                      borderBottomColor: isActive ? '#009ef7' : 'transparent',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${isActive ? '#009ef7' : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={lang.flag} height="11" alt={lang.code} className="mr-1" />
                    <span>{lang.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {activeTab === 'home_slider' && (
            <HomeSliderTab data={heroBanners} onUpdate={saveHeroBanners} saving={saving.home_slider} />
          )}
          {activeTab === 'flash_sale' && (
            <FlashSaleTab selectedDealId={flashDealId} flashDeals={flashDeals} onSelect={saveFlashDeal} saving={saving.flash_sale} />
          )}
          {activeTab === 'banner_1' && (
            <Banner1Tab data={promotionBanners} onUpdate={savePromotionBanners} saving={saving.banner_1} />
          )}
          {activeTab === 'banner_2' && (
            <Banner2Tab data={banner2Data} onUpdate={saveBanner2} saving={saving.banner_2} />
          )}
          {activeTab === 'flash_deal_2' && (
            <FlashDeal2Tab saving={saving.flash_deal_2} onSave={() => {}} />
          )}
          {activeTab === 'auction' && (
            <AuctionTab selectedIds={auctionProducts} products={allProducts} onUpdate={saveAuction} saving={saving.auction} />
          )}
          {activeTab === 'classifieds' && (
            <ClassifiedsTab selectedIds={classifiedProducts} products={allProducts} onUpdate={saveClassifieds} saving={saving.classifieds} />
          )}
          {activeTab === 'newestPreorder' && (
            <NewestPreorderTab selectedIds={preorderProducts} products={allProducts} onUpdate={savePreorder} saving={saving.newestPreorder} />
          )}
          {activeTab === 'all_products' && (
            <AllProductsTab selectedIds={allProductsGrid} products={allProducts} onUpdate={saveAllProducts} saving={saving.all_products} />
          )}

        </div>
      </div>
    </div>
  )
}