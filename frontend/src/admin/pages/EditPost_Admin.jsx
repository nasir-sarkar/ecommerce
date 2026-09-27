// EditPost_Admin.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card, { CardHeader, CardBody } from '../components/Card'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Sub-components

function FormRow({ label, hint, required, children }) {
  return (
    <div className="flex flex-wrap mb-[20px]">
      <div className="w-full md:w-[25%] pr-[12px] mb-[6px] md:mb-0 flex items-start pt-[10px]">
        <label className="text-[14px] font-medium text-[#232734] leading-[20px]">
          {label}
          {hint && <small className="text-[12px] text-[#9da3ae] font-normal ml-1">{hint}</small>}
          {required && <span className="text-[#f1416c] ml-[2px]">*</span>}
        </label>
      </div>
      <div className="w-full md:w-[75%]">
        {children}
      </div>
    </div>
  )
}

function Input({ placeholder, value, onChange, id, ...props }) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[40px] px-[14px] text-[13px] text-[#232734] border border-[#e4e5eb] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7]"
      {...props}
    />
  )
}

function Textarea({ placeholder = '', value, onChange, rows = 5 }) {
  return (
    <textarea
      placeholder={placeholder}
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-[14px] py-[10px] text-[13px] text-[#232734] border border-[#e4e5eb] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7] resize-y"
    />
  )
}

function BrowseFile({ onFileSelect, previewUrl = '' }) {
  const [fileName,  setFileName]  = useState(previewUrl ? previewUrl.split('/').pop() : 'Choose File')
  const [uploading, setUploading] = useState(false)

  // Sync filename label when previewUrl changes
  useEffect(() => {
    if (previewUrl) setFileName(previewUrl.split('/').pop())
  }, [previewUrl])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res  = await fetch(`${API}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setFileName(file.name)
        onFileSelect(data.url)
      } else {
        alert('Upload failed')
      }
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex h-[40px] border border-[#e4e5eb] rounded-[6px] overflow-hidden bg-white">
      <label className="bg-[#f1f1f4] text-[#232734] text-[13px] font-medium px-[14px] hover:bg-[#e4e5eb] cursor-pointer flex items-center whitespace-nowrap">
        {uploading ? 'Uploading…' : 'Browse'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
      </label>
      <span className="flex-1 px-[14px] flex items-center text-[13px] text-[#9da3ae] truncate">{fileName}</span>
    </div>
  )
}

// Main Component

export default function EditPost_Admin() {
  const navigate = useNavigate()
  const { id }   = useParams()

  // Form state
  const [title,         setTitle]         = useState('')
  const [excerpt,       setExcerpt]       = useState('')
  const [content,       setContent]       = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [category,      setCategory]      = useState('')
  const [tags,          setTags]          = useState('')

  // UI state
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [fetching,   setFetching]   = useState(true)
  const [saveMsg,    setSaveMsg]    = useState('')
  const [saveErr,    setSaveErr]    = useState('')

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res  = await fetch(`${API}/blogs/categories`)
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch post from DB and pre-fill
  useEffect(() => {
    if (!id) return
    const fetchPost = async () => {
      setFetching(true)
      try {
        const res  = await fetch(`${API}/blogs/${id}`)
        if (!res.ok) throw new Error('Post not found')
        const data = await res.json()
        const post = data.blog || data
        setTitle(post.title || '')
        setExcerpt(post.excerpt || '')
        setContent(post.content || '')
        setFeaturedImage(post.featuredImage || '')
        setCategory(post.category || '')
        setTags(Array.isArray(post.tags) ? post.tags.join(', ') : '')
      } catch {
        setSaveErr('Failed to load post data.')
      } finally {
        setFetching(false)
      }
    }
    fetchPost()
  }, [id])

  // Submit (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveMsg('')
    setSaveErr('')

    if (!title.trim())         { setSaveErr('Blog Title is required');        return }
    if (!category.trim())      { setSaveErr('Category is required');          return }
    if (!excerpt.trim())       { setSaveErr('Short Description is required'); return }
    if (!content.trim())       { setSaveErr('Description is required');       return }
    if (!featuredImage.trim()) { setSaveErr('Banner image is required');      return }

    setLoading(true)

    const tagsArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      title:         title.trim(),
      excerpt:       excerpt.trim(),
      content:       content.trim(),
      featuredImage: featuredImage.trim(),
      category:      category.trim(),
      tags:          tagsArray,
    }

    try {
      const res    = await fetch(`${API}/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (res.ok) {
        alert('Saved!')
        navigate('/admin/blog/posts')
      } else {
        setSaveErr(result.message || 'Failed to save post')
      }
    } catch {
      setSaveErr('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading skeleton while fetching post
  if (fetching) {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3">
          <Card>
            <CardHeader>
              <h5 className="text-[16px] leading-[22px] font-semibold text-[#232734] m-0">
                Blog Information
              </h5>
            </CardHeader>
            <CardBody>
              <div className="text-center py-10 text-[#9da3ae] text-[14px]">Loading post data…</div>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  // Render
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8 lg:col-start-3">
        <Card>
          <CardHeader>
            <h5 className="text-[16px] leading-[22px] font-semibold text-[#232734] m-0">
              Blog Information
            </h5>
          </CardHeader>
          <CardBody>

            {/* Alerts */}
            {saveMsg && (
              <div className="mb-[16px] px-[14px] py-[10px] bg-green-50 border border-green-200 text-green-700 text-[13px] rounded-[6px]">
                {saveMsg}
              </div>
            )}
            {saveErr && (
              <div className="mb-[16px] px-[14px] py-[10px] bg-red-50 border border-red-200 text-[#f1416c] text-[13px] rounded-[6px]">
                {saveErr}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Blog Title */}
              <FormRow label="Blog Title" required>
                <Input
                  id="title"
                  placeholder="Blog Title"
                  value={title}
                  onChange={setTitle}
                  required
                />
              </FormRow>

              {/* Category */}
              <FormRow label="Category" required>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full h-[40px] px-[14px] text-[13px] text-[#232734] border border-[#e4e5eb] rounded-[6px] focus:outline-none focus:border-[#009ef7] bg-white"
                >
                  <option key="placeholder" value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
                <small className="block text-[12px] text-[#9da3ae] mt-1">
                  Categories are derived from existing posts. Manage them in{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/admin/blog/categories')}
                    className="text-[#009ef7] underline bg-transparent border-0 cursor-pointer p-0 text-[12px]"
                  >
                    Blog Categories
                  </button>.
                </small>
              </FormRow>

              {/* Banner */}
              <FormRow label="Banner" hint="(1300x650)" required>
                <BrowseFile
                  onFileSelect={setFeaturedImage}
                  previewUrl={featuredImage}
                />
                {featuredImage && (
                  <div className="mt-2">
                    <img
                      src={featuredImage}
                      alt="Banner preview"
                      className="h-[80px] w-auto border border-[#f1f1f4] rounded-[4px] p-1 object-cover"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
              </FormRow>

              {/* Short Description */}
              <FormRow label="Short Description" required>
                <Textarea
                  placeholder="Brief summary shown on blog listing page..."
                  value={excerpt}
                  onChange={setExcerpt}
                  rows={5}
                />
              </FormRow>

              {/* Description */}
              <FormRow label="Description" required>
                <Textarea
                  placeholder="Full blog post content..."
                  value={content}
                  onChange={setContent}
                  rows={10}
                />
              </FormRow>

              {/* Tags */}
              <FormRow label="Tags">
                <Input
                  id="tags"
                  placeholder="fashion, lifestyle, tips"
                  value={tags}
                  onChange={setTags}
                />
                <small className="block text-[12px] text-[#9da3ae] mt-1">Separate with comma</small>
              </FormRow>

              {/* Actions */}
              <div className="flex justify-end gap-[10px] mt-[8px]">
                <button
                  type="button"
                  onClick={() => navigate('/admin/blog/posts')}
                  className="bg-white hover:bg-[#f1f1f4] text-[#232734] text-[14px] font-medium rounded-[6px] px-[20px] h-[38px] border border-[#e4e5eb] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#009ef7] hover:bg-[#0088d6] text-white text-[14px] font-semibold rounded-[6px] px-[28px] h-[38px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </div>

            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}