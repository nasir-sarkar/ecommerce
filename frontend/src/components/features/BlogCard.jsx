import { useNavigate } from 'react-router-dom'

const PH = '/src/images/Placeholder.png'

export default function BlogCard({ blog }) {
  const navigate = useNavigate()
  const { _id, image, title, excerpt, date, category } = blog

  const handleReadMore = (e) => {
    e.stopPropagation() 
    navigate(`/blog/${_id}`)
  }

  const handleCardClick = () => {
    navigate(`/blog/${_id}`)
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-100 rounded overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PH }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-2 hover:text-[#0080FF] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-gray-400">{date}</span>
          {category && (
            <span className="text-[12px] text-[#0080FF] font-medium">{category}</span>
          )}
        </div>
        <button 
          onClick={handleReadMore}
          className="inline-flex items-center gap-1 text-[13px] text-[#0080FF] font-medium hover:gap-2 transition-all"
        >
          Read Full Blog
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}