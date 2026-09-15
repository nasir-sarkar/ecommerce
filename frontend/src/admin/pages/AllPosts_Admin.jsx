// AllPosts_Admin.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card, { CardHeader, CardBody } from '../components/Card'
import Switch from '../components/Switch'

// API Base URL 
const API_BASE_URL = 'http://localhost:5000/api'

// Icons
const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#009ef7">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f1416c">
    <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
)

function PostRow({ post, onToggleStatus, onDelete, onEdit }) {
  const [status, setStatus] = useState(post.isPublished)

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    onToggleStatus(post._id, newStatus)
  }

  return (
    <tr className="border-b border-dashed border-[#f1f1f4] hover:bg-[#f9f9f9]">
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734]">{post.sno}</td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734]">{post.title}</td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734]">{post.category}</td>
      <td className="px-[12px] py-[14px] align-middle text-[13px] text-[#232734]">{post.excerpt?.substring(0, 100)}{post.excerpt?.length > 100 ? '...' : ''}</td>
      <td className="px-[12px] py-[14px] align-middle">
        <Switch checked={status} onChange={handleStatusChange} color="success" />
      </td>
      <td className="px-[12px] py-[14px] align-middle text-right">
        <div className="inline-flex items-center gap-[6px]">
          <button onClick={() => onEdit(post)} title="Edit"
            className="w-[28px] h-[28px] rounded-full bg-[#f1fafd] hover:bg-[#e3f4fc] inline-flex items-center justify-center cursor-pointer border-0">
            <PenIcon />
          </button>
          <button onClick={() => onDelete(post._id)} title="Delete"
            className="w-[28px] h-[28px] rounded-full bg-[#fff4f8] hover:bg-[#ffe6ef] inline-flex items-center justify-center cursor-pointer border-0">
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AllPosts_Admin() {
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const limit = 10

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        admin: 'true',
        page: page.toString(),
        limit: limit.toString()
      })
      if (search) params.append('search', search)

      const response = await fetch(`${API_BASE_URL}/blogs?${params}`)
      
      if (!response.ok) {
        const text = await response.text()
        console.error('Response:', text)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()

      // Add serial number
      const postsWithSno = (data.blogs || []).map((post, idx) => ({
        ...post,
        sno: (page - 1) * limit + idx + 1
      }))

      setPosts(postsWithSno)
      setTotal(data.total)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page, search])

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearch(searchInput)
      setPage(1)
    }
  }

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      // Refresh the list
      fetchPosts()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update post status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete post')
      fetchPosts()
    } catch (err) {
      console.error('Error deleting post:', err)
      alert('Failed to delete post')
    }
  }

  const handleEdit = (post) => {
    navigate(`/admin/blog/edit/${post._id}`)
  }

  const handleAddNew = () => {
    navigate('/admin/blog/create')
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      {/* Page title bar */}
      <div className="mt-2 mb-3 flex items-center justify-between">
        <h1 className="text-[20px] leading-[28px] font-medium text-[#232734] m-0">All Posts</h1>
        <button onClick={handleAddNew}
          className="inline-flex items-center justify-center bg-[#8f60ee] hover:bg-[#7a4fe0] text-white text-[14px] font-medium h-[40px] px-[24px] rounded-full border-0 cursor-pointer">
          <span>Add New Post</span>
        </button>
      </div>
      <br />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 text-left">
              <h5 className="text-[15px] leading-[22px] font-medium text-[#232734] m-0">All blog posts</h5>
            </div>
            <div className="w-[200px]">
              <input
                type="text"
                placeholder="Type & Enter"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full h-[34px] px-[12px] border border-[#e4e6ef] rounded-[4px] text-[13px] text-[#232734] placeholder-[#a5a5b8] outline-none" />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8 text-[#a5a5b8]">Loading posts...</div>
          ) : error ? (
            <div className="text-center py-8 text-[#f1416c]">Error: {error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#f1f1f4]">
                      <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734] w-[40px]">#</th>
                      <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Title</th>
                      <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Category</th>
                      <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Short Description</th>
                      <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Status</th>
                      <th className="px-[12px] py-[12px] text-right text-[13px] font-semibold text-[#232734]">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <PostRow
                        key={post._id}
                        post={post}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-[#a5a5b8]">
                          No posts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-[#f1f1f4]">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-[13px] border border-[#e4e6ef] rounded-[4px] disabled:opacity-50 cursor-pointer bg-white"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-[13px] text-[#232734]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-[13px] border border-[#e4e6ef] rounded-[4px] disabled:opacity-50 cursor-pointer bg-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </>
  )
}