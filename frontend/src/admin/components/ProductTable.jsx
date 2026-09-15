import { useState, useEffect } from 'react'
import Switch from './Switch'

// Helper to get image URL 
const getImageUrl = (product) => {
  return product.image || product.image2 || product.image3 || 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'
}

// Helper to format price 
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price)
}

// Helper to format discount
const formatDiscount = (product) => {
  if (!product.discount || product.discount === 0) return null
  const value = product.discountType === 'percent' ? `${product.discount}%` : formatPrice(product.discount)
  return value
}

// Star rating display
function Stars({ rating = 0, max = 5 }) {
  const stars = []
  for (let i = 1; i <= max; i++) {
    stars.push(
      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= rating ? '#ffc700' : '#e5e7eb'}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    )
  }
  return <span className="inline-flex items-center gap-[1px]">{stars}</span>
}

// Kebab menu (3 dots)
function KebabIcon() {
  return (
    <svg width="4" height="16" viewBox="0 0 4 16" fill="#9da3ae">
      <circle cx="2" cy="2" r="2" />
      <circle cx="2" cy="8" r="2" />
      <circle cx="2" cy="14" r="2" />
    </svg>
  )
}

// Single product row 
function ProductRow({ product, checked, onCheck, onTogglePublished, onToggleFeatured, onToggleTodaysDeal, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reviewData, setReviewData] = useState({ avgRating: 0, total: 0 })

  // Fetch review data for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/product-reviews/${product._id}`)
        if (response.ok) {
          const data = await response.json()
          setReviewData({ avgRating: data.avgRating || 0, total: data.total || 0 })
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      }
    }
    fetchReviews()
  }, [product._id])

  const handleEdit = () => {
    window.location.href = `/admin/products/edit/${product._id}`
  }

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`)
      const original = await response.json()
      
      const duplicated = {
        ...original,
        title: `${original.title} (Copy)`,
        slug: undefined,
        _id: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        views: 0,
        likes: 0,
        comments: 0
      }
      
      const createResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      })
      
      if (createResponse.ok) {
        alert('Product duplicated successfully')
        window.location.reload()
      }
    } catch (err) {
      console.error('Error duplicating product:', err)
      alert('Failed to duplicate product')
    }
  }

  return (
    <tr className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
      <td className="px-[12px] py-[12px] text-center align-middle">
        <input type="checkbox" checked={checked} onChange={(e) => onCheck?.(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="w-[60px] h-[60px] rounded-[4px] overflow-hidden bg-[#f5f5f7] border border-[#f1f1f4]">
          <img src={getImageUrl(product)} alt={product.title} className="w-full h-full object-contain"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg' }} />
        </div>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="text-[12px] leading-[16px] text-[#232734] line-clamp-2 max-w-[280px]">{product.title}</div>
        <a href="#" className="text-[12px] leading-[16px] text-[#009ef7] font-semibold mt-1 inline-block">{product.brand || 'No Brand'}</a>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <a href="#" className="text-[12px] leading-[16px] text-[#009ef7] font-semibold block">{product.seller || 'In-House'}</a>
        <div className="text-[11px] leading-[15px] text-[#9da3ae] mt-1">{product.category || 'Uncategorized'}</div>
        {product.subCategory && <div className="text-[11px] leading-[15px] text-[#9da3ae]">{product.subCategory}</div>}
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <Stars rating={Math.round(reviewData.avgRating)} />
        <div className="text-[12px] leading-[16px] text-[#232734] mt-1">{reviewData.avgRating.toFixed(1)} out of 5.0</div>
        <div className="text-[12px] leading-[16px] text-[#9da3ae]">{reviewData.total} reviews</div>
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="border-l-[3px] border-[#009ef7] pl-2">
          <div className="text-[11px] leading-[15px] text-[#9da3ae]">Price</div>
          <div className="text-[13px] leading-[18px] text-[#232734] font-semibold">{formatPrice(product.price)}</div>
        </div>
        {formatDiscount(product) && (
          <div className="border-l-[3px] border-[#f1416c] pl-2 mt-2">
            <div className="text-[11px] leading-[15px] text-[#9da3ae]">Discount <span className="text-[#f1416c] font-semibold ml-1">{formatDiscount(product)}</span></div>
          </div>
        )}
      </td>
      <td className="px-[12px] py-[12px] align-middle">
        <div className="text-[11px] leading-[15px] text-[#9da3ae]">Number of Stock</div>
        <div className="text-[13px] leading-[18px] text-[#232734] font-semibold">{product.stockCount || 0}</div>
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <Switch checked={product.published} onChange={(val) => onTogglePublished(product._id, val)} color="blue" />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <Switch checked={product.featured} onChange={(val) => onToggleFeatured(product._id, val)} color="blue" />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle">
        <Switch checked={product.todaysDeal} onChange={(val) => onToggleTodaysDeal(product._id, val)} color="blue" />
      </td>
      <td className="px-[12px] py-[12px] text-center align-middle relative">
        <button type="button" onClick={() => setMenuOpen((o) => !o)}
          className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] flex items-center justify-center mx-auto">
          <KebabIcon />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] border border-[#f1f1f4] py-1 text-left">
              <button onClick={handleEdit} className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">Edit</button>
              <button onClick={handleDuplicate} className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">Duplicate</button>
              <button onClick={() => window.open(`/product/${product._id}`, '_blank')} className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#232734] hover:bg-[#f1fafd]">View</button>
              <button onClick={() => { onDelete(product._id); setMenuOpen(false) }} className="w-full text-left px-[12px] py-[6px] text-[12px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</button>
            </div>
          </>
        )}
      </td>
    </tr>
  )
}

// Main table component
export default function ProductTable({ 
  products = [], 
  selectedProducts = [],
  onSelectProduct,
  onSelectAll,
  onTogglePublished,
  onToggleFeatured,
  onToggleTodaysDeal,
  onDeleteProduct 
}) {
  const allChecked = products.length > 0 && selectedProducts.length === products.length

  const toggleAll = (checked) => {
    const productIds = products.map(p => p._id)
    onSelectAll(checked, productIds)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#f1f1f4]">
            <th className="px-[12px] py-[10px] text-center w-[40px]">
              <input type="checkbox" checked={allChecked} onChange={(e) => toggleAll(e.target.checked)}
                className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
            </th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">THUMB</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">NAME / BRAND</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">OWNER / CATEGORY</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">RATINGS</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">PRICE DETAILS</th>
            <th className="px-[12px] py-[10px] text-left text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">INFO</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">PUBLISHED</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">FEATURED</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">TODAYS DEAL</th>
            <th className="px-[12px] py-[10px] text-center text-[11px] leading-[15px] font-semibold text-[#9da3ae] uppercase">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow 
              key={product._id} 
              product={product}
              checked={selectedProducts.includes(product._id)}
              onCheck={(checked) => onSelectProduct(product._id, checked)}
              onTogglePublished={onTogglePublished}
              onToggleFeatured={onToggleFeatured}
              onToggleTodaysDeal={onToggleTodaysDeal}
              onDelete={onDeleteProduct}
            />
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="11" className="text-center py-8 text-[#a5a5b8]">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}