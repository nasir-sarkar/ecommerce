// BlogCategories_Admin.jsx
import { useState, useEffect } from 'react'
import Card, { CardHeader, CardBody } from '../components/Card'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

function CategoryRow({ cat, index, onEdit, onDelete }) {
  return (
    <tr className="border-b border-dashed border-[#f1f1f4] hover:bg-[#f9f9f9]">
      <td className="px-[12px] py-[18px] align-middle text-[13px] text-[#009ef7] w-[5%]">{index + 1}</td>
      <td className="px-[12px] py-[18px] align-middle text-[13px] text-[#232734]">{cat.name}</td>
      <td className="px-[12px] py-[18px] align-middle text-[13px] text-[#9da3ae] text-center w-[80px]">{cat.count}</td>
      <td className="px-[12px] py-[18px] align-middle text-right w-[10%]">
        <div className="inline-flex items-center gap-[6px]">
          <button onClick={() => onEdit(cat)} title="Edit"
            className="w-[28px] h-[28px] rounded-full bg-[#f1fafd] hover:bg-[#e3f4fc] inline-flex items-center justify-center cursor-pointer border-0">
            <PenIcon />
          </button>
          <button onClick={() => onDelete(cat)} title="Delete"
            className="w-[28px] h-[28px] rounded-full bg-[#fff4f8] hover:bg-[#ffe6ef] inline-flex items-center justify-center cursor-pointer border-0">
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function BlogCategories_Admin() {
  const [categories,         setCategories]         = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading,            setLoading]            = useState(true)
  const [error,              setError]              = useState(null)
  const [searchInput,        setSearchInput]        = useState('')

  // Add modal
  const [isAdding,         setIsAdding]         = useState(false)
  const [newCategoryName,  setNewCategoryName]  = useState('')
  const [addSaving,        setAddSaving]        = useState(false)

  // Inline edit
  const [editingCategory, setEditingCategory] = useState(null)  // { _id, name, count }
  const [editName,        setEditName]        = useState('')
  const [editSaving,      setEditSaving]      = useState(false)

 
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const [standaloneRes, mergedRes] = await Promise.all([
        fetch(`${API}/blog-categories`),
        fetch(`${API}/blogs/categories`),
      ])
      if (!standaloneRes.ok || !mergedRes.ok) throw new Error('Failed to load categories')

      const standalone = await standaloneRes.json()   
      const merged     = await mergedRes.json()      

      // Build _id map from standalone
      const idMap = {}
      standalone.forEach(c => { idMap[c.name] = c._id })

      // Combine
      const combined = merged.map(c => ({
        _id:   idMap[c.name] || null,
        name:  c.name,
        count: c.count,
      }))

      setCategories(combined)
      setFilteredCategories(combined)
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    if (!searchInput.trim()) {
      setFilteredCategories(categories)
    } else {
      setFilteredCategories(
        categories.filter(c => c.name.toLowerCase().includes(searchInput.toLowerCase()))
      )
    }
  }, [searchInput, categories])

  // Add
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) { alert('Please enter a category name'); return }
    setAddSaving(true)
    try {
      const res  = await fetch(`${API}/blog-categories`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: newCategoryName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to add category'); return }
      alert('Saved!')
      setNewCategoryName('')
      setIsAdding(false)
      fetchCategories()
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setAddSaving(false)
    }
  }

  // Edit
  const startEdit = (cat) => {
    setEditingCategory(cat)
    setEditName(cat.name)
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditName('')
  }

  const handleEditCategory = async (cat) => {
    if (!editName.trim()) { alert('Please enter a category name'); return }
    if (editName.trim() === cat.name) { cancelEdit(); return }

    
    if (!cat._id) {
      // Create standalone entry then rename
      try {
        const createRes = await fetch(`${API}/blog-categories`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ name: cat.name }),
        })
        if (!createRes.ok) {
          const d = await createRes.json()
          if (d.message !== 'Category already exists') {
            alert(d.message || 'Failed to save'); return
          }
        }
        // Now fetch to get the _id
        const listRes = await fetch(`${API}/blog-categories`)
        const list    = await listRes.json()
        const found   = list.find(c => c.name === cat.name)
        if (found) cat = { ...cat, _id: found._id }
      } catch {
        alert('Network error. Please try again.'); return
      }
    }

    setEditSaving(true)
    try {
      const res  = await fetch(`${API}/blog-categories/${cat._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: editName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to rename category'); return }
      alert('Saved!')
      cancelEdit()
      fetchCategories()
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setEditSaving(false)
    }
  }

  // Delete
  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return

   
    if (!cat._id) {
      if (cat.count > 0) {
        alert(`Cannot delete "${cat.name}" — ${cat.count} post(s) still use this category. Reassign or delete those posts first.`)
        return
      }
      
      alert('Category removed.')
      fetchCategories()
      return
    }

    try {
      const res  = await fetch(`${API}/blog-categories/${cat._id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) { alert(data.message || 'Failed to delete category'); return }
      fetchCategories()
    } catch {
      alert('Network error. Please try again.')
    }
  }

  // Render 
  return (
    <>
      <div className="mt-2 mb-3 flex items-center justify-between flex-wrap">
        <h1 className="text-[20px] leading-[28px] font-medium text-[#232734] m-0">All Blog Categories</h1>
        <button
          onClick={() => { setNewCategoryName(''); setIsAdding(true) }}
          className="inline-flex items-center justify-center bg-[#8f60ee] hover:bg-[#7a4fe0] text-white text-[14px] font-medium h-[40px] px-[24px] rounded-full border-0 cursor-pointer"
        >
          <span>Add New Category</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsAdding(false)}>
          <div className="bg-white rounded-lg p-6 w-[400px]" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-medium text-[#232734] mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full h-[40px] px-[12px] border border-[#e4e6ef] rounded-[4px] text-[13px] mb-4 outline-none focus:border-[#009ef7]"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && !addSaving && handleAddCategory()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-[13px] border border-[#e4e6ef] rounded-[4px] bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={addSaving}
                className="px-4 py-2 text-[13px] bg-[#8f60ee] hover:bg-[#7a4fe0] text-white rounded-[4px] border-0 cursor-pointer disabled:opacity-50"
              >
                {addSaving ? 'Saving…' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h5 className="text-[15px] leading-[22px] font-medium text-[#232734] m-0">Blog Categories</h5>
            <div style={{ minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search categories…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-[36px] px-[12px] border border-[#e4e6ef] rounded-[4px] text-[13px] text-[#232734] placeholder-[#a5a5b8] outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="text-center py-8 text-[#a5a5b8]">Loading categories...</div>
          ) : error ? (
            <div className="text-center py-8 text-[#f1416c]">Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#f1f1f4]">
                    <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734] w-[5%]">#</th>
                    <th className="px-[12px] py-[12px] text-left text-[13px] font-semibold text-[#232734]">Name</th>
                    <th className="px-[12px] py-[12px] text-center text-[13px] font-semibold text-[#232734] w-[80px]">Posts</th>
                    <th className="px-[12px] py-[12px] text-right text-[13px] font-semibold text-[#232734] w-[10%]">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, idx) => (
                    editingCategory?.name === cat.name ? (
                      <tr key={cat.name} className="border-b border-dashed border-[#f1f1f4]">
                        <td className="px-[12px] py-[14px] text-[13px] text-[#009ef7]">{idx + 1}</td>
                        <td className="px-[12px] py-[14px]" colSpan="3">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-[34px] px-[12px] border border-[#e4e6ef] rounded-[4px] text-[13px] flex-1 outline-none focus:border-[#009ef7]"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && !editSaving && handleEditCategory(editingCategory)}
                            />
                            <button
                              onClick={() => handleEditCategory(editingCategory)}
                              disabled={editSaving}
                              className="px-3 py-1 text-[12px] bg-[#8f60ee] hover:bg-[#7a4fe0] text-white rounded-[4px] border-0 cursor-pointer disabled:opacity-50"
                            >
                              {editSaving ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-[12px] border border-[#e4e6ef] rounded-[4px] bg-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <CategoryRow
                        key={cat.name}
                        cat={cat}
                        index={idx}
                        onEdit={startEdit}
                        onDelete={handleDeleteCategory}
                      />
                    )
                  ))}
                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-[#a5a5b8]">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  )
}