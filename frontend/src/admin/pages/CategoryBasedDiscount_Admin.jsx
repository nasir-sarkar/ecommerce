import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Card from '../components/Card'
import Switch from '../components/Switch'
import Pagination from '../components/Pagination'
import Badge from '../components/Badge'

// Icons
const SearchIconGray = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16.001 16">
    <path d="M8.248,14.642a6.394,6.394,0,1,1,6.394-6.394A6.4,6.4,0,0,1,8.248,14.642Zm0-11.509a5.115,5.115,0,1,0,5.115,5.115A5.121,5.121,0,0,0,8.248,3.133Z" transform="translate(-1.854 -1.854)" fill="#a5a5b8" />
    <path d="M23.011,23.651a.637.637,0,0,1-.452-.187l-4.92-4.92a.639.639,0,0,1,.9-.9l4.92,4.92a.639.639,0,0,1-.452,1.091Z" transform="translate(-7.651 -7.651)" fill="#a5a5b8" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
    <path d="M141.874-812.13a.706.706,0,0,1-.515-.21.7.7,0,0,1-.212-.514V-817.4h-4.553a.7.7,0,0,1-.514-.209.694.694,0,0,1-.21-.511.706.706,0,0,1,.21-.515.7.7,0,0,1,.514-.212h4.549v-4.557a.7.7,0,0,1,.209-.514.694.694,0,0,1,.511-.21.706.706,0,0,1,.515.21.7.7,0,0,1,.212.514v4.553h4.557a.7.7,0,0,1,.514.208.694.694,0,0,1,.21.511.706.706,0,0,1-.21.515.7.7,0,0,1-.514.212h-4.553v4.553a.7.7,0,0,1-.209.514A.694.694,0,0,1,141.874-812.13Z" transform="translate(-135.87 824.13)" fill="#fff" />
  </svg>
)

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const KebabIcon = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#9da3ae">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

function CategoryRow({ cat, onUpdate }) {
  const [checked, setChecked] = useState(false)
  const [featured, setFeatured] = useState(cat.featured || false)
  const [hot, setHot] = useState(cat.hot || false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleFeaturedChange = async (value) => {
    setFeatured(value)
    try {
      const response = await fetch(`${API_URL}/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, featured: value })
      })
      if (response.ok) {
        const updated = await response.json()
        onUpdate(updated)
      }
    } catch (error) {
      console.error('Error updating featured:', error)
    }
  }

  const handleHotChange = async (value) => {
    setHot(value)
    try {
      const response = await fetch(`${API_URL}/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, hot: value })
      })
      if (response.ok) {
        const updated = await response.json()
        onUpdate(updated)
      }
    } catch (error) {
      console.error('Error updating hot:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${cat.name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/categories/${cat._id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          onUpdate(null, cat._id)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  return (
    <tr className="border-b border-dashed border-[#f1f1f4] hover:bg-[#f9f9f9]">
      <td className="px-[16px] py-[14px] align-middle w-[40px]">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)}
          className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
      </td>
      <td className="px-[16px] py-[14px] align-middle w-[60px]">
        {cat.icon ? (
          <i className={`las ${cat.icon} text-[28px] text-[#232734]`}></i>
        ) : cat.img ? (
          <img src={cat.img} alt={cat.name} className="w-[28px] h-[28px] object-contain" />
        ) : (
          <span className="text-[14px] text-[#9da3ae]">—</span>
        )}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <div className="flex items-center gap-2">
          <span className="text-[13px] leading-[18px] text-[#232734]">{cat.name}</span>
          {cat.digital && <Badge variant="secondary">Digital</Badge>}
        </div>
      </td>
      <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">—</td>
      <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">
        {cat.order !== undefined && cat.order !== null ? cat.order : '-'}
      </td>
      <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">
        {cat.level !== undefined && cat.level !== null ? cat.level : '-'}
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <Switch checked={featured} onChange={handleFeaturedChange} color="success" />
      </td>
      <td className="px-[16px] py-[14px] align-middle">
        <Switch checked={hot} onChange={handleHotChange} color="success" />
      </td>
      <td className="px-[16px] py-[14px] align-middle text-right relative">
        <div className="inline-flex items-center gap-2">
          <NavLink to={`/admin/categories/edit/${cat._id}`} className="bg-[#f1fafd] text-[#009ef7] text-[12px] font-medium rounded-[4px] px-[12px] h-[28px] inline-flex items-center hover:bg-[#e3f4fc]">
            View More
          </NavLink>
          <button type="button" onClick={() => setMenuOpen((o) => !o)}
            className="w-[28px] h-[28px] rounded-[4px] hover:bg-[#f1f1f4] inline-flex items-center justify-center">
            <KebabIcon />
          </button>
        </div>
        {menuOpen && (
          <div className="absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1 text-left">
            <NavLink to={`/admin/categories/edit/${cat._id}`} className="block px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">Edit</NavLink>
            <button onClick={handleDelete} className="block w-full text-left px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">Delete</button>
          </div>
        )}
      </td>
    </tr>
  )
}

export default function AllCategories_Admin() {
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [allChecked, setAllChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    filterCategories()
  }, [activeTab, searchTerm, categories])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
      setFilteredCategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterCategories = () => {
    let filtered = [...categories]
    
    if (activeTab === 'physical') {
      filtered = filtered.filter(cat => !cat.digital)
    } else if (activeTab === 'digital') {
      filtered = filtered.filter(cat => cat.digital)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredCategories(filtered)
    setPage(1)
  }

  const handleUpdateCategory = (updatedCat, deletedId) => {
    if (deletedId) {
      setCategories(categories.filter(c => c._id !== deletedId))
      setFilteredCategories(filteredCategories.filter(c => c._id !== deletedId))
    } else if (updatedCat) {
      const updatedCategories = categories.map(c => 
        c._id === updatedCat._id ? updatedCat : c
      )
      setCategories(updatedCategories)
      setFilteredCategories(prev => 
        prev.map(c => c._id === updatedCat._id ? updatedCat : c)
      )
    }
  }

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  if (loading) {
    return (
      <>
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">All categories</h1>
        <Card>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#009ef7]"></div>
            <p className="mt-2 text-[#7e8299]">Loading categories...</p>
          </div>
        </Card>
      </>
    )
  }

  if (error) {
    return (
      <>
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">All categories</h1>
        <Card>
          <div className="text-center py-8">
            <p className="text-[#f1416c]">Error: {error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-[#009ef7] text-white rounded text-sm"
            >
              Retry
            </button>
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] mb-[16px]">All categories</h1>

      <Card>
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[20px] py-[16px]">
          <div className="flex-grow">
            <ul className="flex items-center gap-[24px] m-0 p-0 list-none">
              <li>
                <button type="button" onClick={() => setActiveTab('all')}
                  className={`px-0 pb-[15px] text-[14px] font-medium border-b-2 ${activeTab === 'all' ? 'border-[#009ef7] text-[#009ef7]' : 'border-transparent text-[#9da3ae]'}`}>
                  All categories
                </button>
              </li>
            </ul>
          </div>

          <div>
            <NavLink to="/admin/categories/create"
              className="relative overflow-hidden inline-flex items-center h-[36px] pl-[20px] pr-[50px] rounded-full">
              <span className="relative z-[2] text-[14px] font-medium text-[#009ef7]">Add New category</span>
              <span className="absolute top-0 right-0 h-full w-[40px] bg-[#009ef7] flex items-center justify-center z-[1] rounded-full">
                <PlusIcon />
              </span>
            </NavLink>
          </div>
        </div>

        <div className="px-[16px] md:px-[24px] pt-[16px] flex flex-wrap items-center gap-[10px]">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px] h-[38px]">
              <span className="flex items-center pr-2"><SearchIconGray /></span>
              <input 
                type="text" 
                placeholder="Search Categories ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none text-[13px] text-[#232734] placeholder-[#a5a5b8]" />
            </div>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setBulkOpen((o) => !o)}
              className="bg-[#f5f5f7] border border-[#f1f1f4] rounded-[4px] h-[38px] px-[14px] flex items-center gap-2 text-[14px] text-[#7e8299]">
              Bulk Action <CaretIcon />
            </button>
            {bulkOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-[160px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-[#7e8299] hover:bg-[#f1fafd] hover:text-[#009ef7]">Mark Featured</a>
                <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-[#7e8299] hover:bg-[#f1fafd] hover:text-[#009ef7]">Mark Hot</a>
                <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-[#f1416c] hover:bg-[#fff4f8]">Delete</a>
              </div>
            )}
          </div>
        </div>

        <div className="px-[8px] md:px-[16px] pt-[16px] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4] bg-[#f9f9f9]">
                <th className="px-[16px] py-[12px] text-left w-[40px]">
                  <input type="checkbox" checked={allChecked} onChange={(e) => setAllChecked(e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">ICON</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">NAME</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">PARENT CATEGORY</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">ORDER LEVEL</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">LEVEL</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">FEATURED</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">HOT CATEGORY</th>
                <th className="px-[16px] py-[12px] text-right text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((cat) => (
                <CategoryRow key={cat._id} cat={cat} onUpdate={handleUpdateCategory} />
              ))}
              {paginatedCategories.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-[#7e8299]">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCategories.length > 0 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </Card>
    </>
  )
}