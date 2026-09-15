import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Breadcrumb from '../components/common/Breadcrumb'
import BlogCard from '../components/features/BlogCard'

const PH = '/src/images/Placeholder.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Blogs() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBlogs, setTotalBlogs] = useState(0)

  // Fetch blogs with filters
  const fetchBlogs = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/blogs?page=${currentPage}&limit=9`
      
      if (activeCategory) {
        url += `&category=${encodeURIComponent(activeCategory)}`
      }
      
      if (submittedSearch) {
        url += `&search=${encodeURIComponent(submittedSearch)}`
      }
      
      console.log('Fetching blogs from:', url) // Debug log
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      
      const data = await response.json()
      console.log('Blogs data received:', data) 
      
      setBlogs(data.blogs)
      setTotalPages(data.totalPages)
      setTotalBlogs(data.total)
    } catch (err) {
      console.error('Error fetching blogs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/categories`)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      console.log('Categories data:', data) // Debug log
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs/recent?limit=5`)
      if (!response.ok) {
        throw new Error('Failed to fetch recent posts')
      }
      const data = await response.json()
      setRecentPosts(data)
    } catch (err) {
      console.error('Error fetching recent posts:', err)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [currentPage, activeCategory, submittedSearch])

  useEffect(() => {
    fetchCategories()
    fetchRecentPosts()
  }, [])

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSubmittedSearch(searchTerm)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading && blogs.length === 0) {
    return (
      <div className="py-6">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0080FF]"></div>
              <p className="mt-2 text-[#6b7280]">Loading blogs...</p>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-6">
        <Container>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-[#0080FF] hover:underline"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="py-6">
      <Container>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-[#292933]">Blogs</h1>
          <Breadcrumb items={[{ label: 'Blog' }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex border border-[#e5e7eb] rounded overflow-hidden mb-5">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 text-[13px] outline-none"
              />
              <button type="submit" className="px-3 bg-[#f9fafb] border-l border-[#e5e7eb]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </form>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-[15px] font-bold text-[#1f2937] mb-3">Categories</h3>
              <ul className="space-y-1">
                {categories.map(cat => (
                  <li key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className={`flex items-center justify-between gap-2 text-[13px] w-full text-left py-1 transition-colors ${
                        activeCategory === cat.name ? 'text-[#0080FF] font-medium' : 'text-[#4b5563] hover:text-[#0080FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                          activeCategory === cat.name ? 'border-[#0080FF] bg-[#0080FF]' : 'border-[#d1d5db]'
                        }`} />
                        {cat.name}
                      </div>
                      <span className="text-[11px] text-[#9ca3af]">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div>
              <h3 className="text-[15px] font-bold text-[#1f2937] mb-3">Recent Posts</h3>
              <div className="space-y-3">
                {recentPosts.map(blog => (
                  <div 
                    key={blog._id} 
                    className="flex gap-3 cursor-pointer group"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-14 h-14 object-cover rounded flex-shrink-0"
                      onError={e => { e.target.src = PH }}
                    />
                    <div>
                      <p className="text-[12px] font-medium text-[#374151] line-clamp-2 group-hover:text-[#0080FF] transition-colors leading-tight">
                        {blog.title.split(' - ')[0]}...
                      </p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">{formatDate(blog.publishedAt)}</p>
                      <p className="text-[11px] text-[#0080FF] mt-0.5">{blog.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="lg:col-span-3">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#6b7280]">No blogs found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {blogs.map(blog => (
                    <BlogCard key={blog._id} blog={{
                      _id: blog._id,
                      title: blog.title,
                      excerpt: blog.excerpt,
                      date: formatDate(blog.publishedAt),
                      category: blog.category,
                      image: blog.featuredImage
                    }} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-[#e5e7eb] rounded text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9fafb]"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-[13px]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-[#e5e7eb] rounded text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f9fafb]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}