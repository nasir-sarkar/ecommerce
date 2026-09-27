import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const PH = '/src/images/Placeholder.png'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


export default function BlogDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentBlog, setCurrentBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // Reset state when navigating between blog posts
    setCurrentBlog(null)
    setRelatedBlogs([])
    setError(null)
    setImgError(false)

    const fetchBlogDetails = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${API_URL}/blogs/${id}`)

        const text = await response.text()

        if (!response.ok) {
          let message = `Server error: ${response.status}`
          try {
            const parsed = JSON.parse(text)
            message = parsed.message || message
          } catch {
            console.error('Non-JSON error response:', text)
          }
          throw new Error(message)
        }

        const data = JSON.parse(text)
        setCurrentBlog(data.blog)
        setRelatedBlogs(data.relatedBlogs || [])
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs/recent?limit=5`)
        if (!response.ok) return
        const data = await response.json()
        setRecentPosts(data)
      } catch (err) {
        console.error('Error fetching recent posts:', err)
      }
    }

    if (id) {
      fetchBlogDetails()
      fetchRecentPosts()
    }
  }, [id])

  const handleBackToBlogs = () => navigate('/blogs')

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${String(blogId)}`)
    window.scrollTo(0, 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }


  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0080FF]"></div>
          <p className="mt-2 text-[#6b7280]">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (error || !currentBlog) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Blog not found'}</p>
          <button onClick={handleBackToBlogs} className="text-[#0080FF] hover:underline">
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <section className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 justify-center">

            {/* Blog Detail */}
            <div className="w-full lg:w-[58%] xl:w-[55%]">
              <div className="mb-6">
                <h2 className="text-[20px] md:text-[22px] font-bold text-[#1b1b28] mb-3 leading-snug">
                  <span className="hover:text-[#0080FF] transition-colors cursor-pointer">
                    {currentBlog.title}
                  </span>
                </h2>

                <div className="mb-3">
                  <p className="text-[12px] text-[#9ca3af] mb-0.5">{formatDate(currentBlog.publishedAt)}</p>
                  {currentBlog.category && (
                    <p className="text-[12px] text-[#3490f3] font-normal">{currentBlog.category}</p>
                  )}
                </div>

                <img
                  src={imgError ? PH : currentBlog.featuredImage}
                  alt={currentBlog.title}
                  className="w-full mt-3 mb-5 object-cover"
                  style={{ maxHeight: '380px' }}
                  onError={() => setImgError(true)}
                />

                {currentBlog.excerpt && (
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#1b1b28] mb-4 leading-snug">
                    {currentBlog.excerpt}
                  </h3>
                )}

                <div
                  className="mb-6 overflow-hidden text-[#1b1b28] blog-content whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: currentBlog.content }}
                />

                {currentBlog.tags && currentBlog.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#e5e7eb]">
                    <h4 className="text-[13px] font-bold text-[#292933] mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentBlog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-[11px] text-[#4b5563] bg-[#f3f4f6] px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBackToBlogs}
                  className="inline-flex items-center gap-2 text-[13px] text-[#0080FF] font-medium hover:gap-3 transition-all mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                  Back to Blogs
                </button>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="w-full lg:w-[30%] xl:w-[28%]">
              <div className="border border-[#e5e7eb] p-3">
                <h3 className="text-[15px] font-bold text-[#292933] mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((blog) => (
                    <RecentPostItem
                      key={String(blog._id)}
                      blog={blog}
                      onBlogClick={() => handleBlogClick(blog._id)}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </div>

              {relatedBlogs.length > 0 && (
                <div className="border border-[#e5e7eb] p-3 mt-4">
                  <h3 className="text-[15px] font-bold text-[#292933] mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((blog) => (
                      <RecentPostItem
                        key={String(blog._id)}
                        blog={blog}
                        onBlogClick={() => handleBlogClick(blog._id)}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

function RecentPostItem({ blog, onBlogClick, formatDate }) {
  const [imgErr, setImgErr] = useState(false)
  const PH = '/src/images/Placeholder.png'

  return (
    <div className="flex gap-2 group cursor-pointer" onClick={onBlogClick}>
      <div className="flex-shrink-0 w-[80px] h-[80px] overflow-hidden">
        <img
          src={imgErr ? PH : blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgErr(true)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2
          className="text-[13px] font-bold text-[#292933] mb-1 leading-snug group-hover:text-[#0080FF] transition-colors"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {blog.title}
        </h2>
        <p className="text-[11px] text-[#9ca3af] mb-0.5">{formatDate(blog.publishedAt)}</p>
        {blog.category && (
          <p className="text-[11px] text-[#3490f3]">{blog.category}</p>
        )}
      </div>
    </div>
  )
}