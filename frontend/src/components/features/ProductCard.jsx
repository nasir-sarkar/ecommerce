import { useNavigate } from 'react-router-dom'

const PH = '/src/images/Placeholder.png'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  
  
  const {
    _id,        
    id,         
    images,     
    image,      
    img,        
    name,       
    title,      
    price,
    originalPrice,
    rating = 0,
    badge,
    storeName,
    soldBy,     
    brand       
  } = product

  
  const productImage = images?.[0] || image || img || PH
  
  const productName = name || title || 'Product Name'
  
  const sellerName = storeName || soldBy || brand || ''

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating))

  return (
    <div
      className="product-card bg-white border border-gray-100 rounded p-2 group cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${_id || id}`)}
    >
      <div className="relative overflow-hidden mb-2">
        {badge && (
          <span className={`absolute top-1.5 left-1.5 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
            badge === 'NEW' ? 'bg-[#85b567]' :
            badge === 'SALE' ? 'bg-[#f3af3d]' :
            badge === 'HOT' ? 'bg-[#ff4c0d]' : 'bg-[#0080FF]'
          }`}>
            {badge}
          </span>
        )}
        <div className="aspect-square overflow-hidden bg-gray-50 rounded">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = PH }}
          />
        </div>
      </div>
      <div>
        {sellerName && <p className="text-[11px] text-gray-400 mb-0.5 truncate">{sellerName}</p>}
        <h3 className="text-[12px] font-medium text-gray-800 line-clamp-2 leading-tight mb-1 hover:text-[#0080FF] transition-colors min-h-[32px]">
          {productName}
        </h3>
        {rating > 0 && (
          <div className="flex items-center gap-0.5 mb-1">
            {stars.map((filled, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 ${filled ? 'text-[#f3af3d]' : 'text-gray-200'}`}
                viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-gray-900">
            ${typeof price === 'number' ? price.toFixed(2) : price}
          </span>
          {originalPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              ${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}