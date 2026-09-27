import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Pagination from '../components/Pagination'

const API = import.meta.env.VITE_API_URL

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
  <svg width="4" height="16" viewBox="0 0 4 16" fill="#009ef7">
    <circle cx="2" cy="2" r="2" />
    <circle cx="2" cy="8" r="2" />
    <circle cx="2" cy="14" r="2" />
  </svg>
)

function BrandLogo({ text, color }) {
  return (
    <div className="w-[60px] h-[40px] bg-white border border-[#f1f1f4] rounded-[3px] flex items-center justify-center overflow-hidden">
      {text.startsWith('http') ? (
        <img src={text} alt="brand logo" className="w-full h-full object-contain p-1" />
      ) : (
        <span className="text-[10px] font-bold tracking-tight text-center leading-none px-[2px]" style={{ color }}>{text}</span>
      )}
    </div>
  )
}

export default function AllBrands_Admin() {
  const navigate = useNavigate()
  const [brands, setBrands] = useState([])
  const [filteredBrands, setFilteredBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [allChecked, setAllChecked] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState([])
  const itemsPerPage = 10

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API}/brands/active`)
      const data = await response.json()

      if (data?.success && data?.data?.brands) {
        const brandsWithCounts = await Promise.all(
          data.data.brands.map(async (brand) => {
            try {
              const productRes = await fetch(`${API}/products?brand=${encodeURIComponent(brand.name)}`)
              const productData = await productRes.json()
              return { ...brand, productCount: productData.total || 0 }
            } catch {
              return { ...brand, productCount: 0 }
            }
          })
        )
        setBrands(brandsWithCounts)
        setFilteredBrands(brandsWithCounts)
      } else {
        setBrands([])
        setFilteredBrands([])
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      setBrands([])
      setFilteredBrands([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBrands() }, [])

  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBrands(filtered)
    } else {
      setFilteredBrands(brands)
    }
    setPage(1)
    setAllChecked(false)
    setSelectedBrands([])
  }, [searchTerm, brands])

  // Handle delete brand
  const handleDelete = async (brandId) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return

    try {
      const response = await fetch(`${API}/brands`)
      const data = await response.json()

      if (data?.success && data?.data) {
        const brandConfig = data.data.find(config =>
          config.brands?.some(b => b._id === brandId)
        )

        if (brandConfig) {
          const updatedBrands = brandConfig.brands.filter(b => b._id !== brandId)
          const updateRes = await fetch(`${API}/brands/${brandConfig._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...brandConfig, brands: updatedBrands })
          })

          if (updateRes.ok) await fetchBrands()
        }
      }
    } catch (error) {
      console.error('Error deleting brand:', error)
      alert('Failed to delete brand')
    }
  }

  // Edit brand 
  const handleEdit = (brand) => {
    navigate(`/admin/brands/edit/${brand._id}`, { state: { brand } })
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedBrands.length === 0) { alert('Please select brands to delete'); return }
    if (!window.confirm(`Delete ${selectedBrands.length} brand(s)?`)) return

    try {
      const response = await fetch(`${API}/brands`)
      const data = await response.json()

      if (data?.success && data?.data) {
        const brandConfig = data.data[0]
        if (brandConfig) {
          const updatedBrands = brandConfig.brands.filter(b => !selectedBrands.includes(b._id))
          const updateRes = await fetch(`${API}/brands/${brandConfig._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...brandConfig, brands: updatedBrands })
          })

          if (updateRes.ok) {
            await fetchBrands()
            setSelectedBrands([])
            setAllChecked(false)
          }
        }
      }
    } catch (error) {
      console.error('Error bulk deleting brands:', error)
      alert('Failed to delete brands')
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage)
  const paginatedBrands = filteredBrands.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const handleSelectAll = (checked) => {
    setAllChecked(checked)
    setSelectedBrands(checked ? paginatedBrands.map(b => b._id) : [])
  }

  const handleSelectBrand = (brandId, checked) => {
    if (checked) setSelectedBrands([...selectedBrands, brandId])
    else setSelectedBrands(selectedBrands.filter(id => id !== brandId))
  }

  if (loading) {
    return (
      <>
        <div className="pb-[5px]">
          <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Brands</h1>
        </div>
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#009ef7]" />
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      {/* Page title */}
      <div className="pb-[5px]">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Brands</h1>
      </div>

      <Card>
        {/* Nav Tabs + Add Button */}
        <div className="flex items-center justify-between flex-wrap border-b border-[#f1f1f4] px-[25px] pb-3 pb-xl-0">
          <div className="flex-grow">
            <ul className="flex items-center gap-[24px] m-0 p-0 list-none">
              <li>
                <button type="button"
                  className="px-0 pb-[15px] text-[14px] font-medium border-b-2 border-[#009ef7] text-[#009ef7]">
                  All Brands
                </button>
              </li>
            </ul>
          </div>

          {/* Right Side - Add New Button */}
          <div className="mb-3 mb-md-0">
            <NavLink to="/admin/brands/create"
              className="relative overflow-hidden inline-flex items-center h-[36px] pl-[20px] pr-[50px] rounded-full">
              <span className="relative z-[2] text-[14px] font-medium text-[#009ef7]">Add New Brand</span>
              <span className="absolute top-0 right-0 h-full w-[40px] bg-[#009ef7] flex items-center justify-center z-[1] rounded-full">
                <PlusIcon />
              </span>
            </NavLink>
          </div>
        </div>

        {/* Search + Bulk Action */}
        <div className="px-[16px] md:px-[24px] pt-[16px] flex flex-wrap items-center gap-[10px]">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center border border-[#f1f1f4] px-3 bg-[#f5f5f7] rounded-[4px] h-[38px]">
              <span className="flex items-center pr-2"><SearchIconGray /></span>
              <input
                type="text"
                placeholder="Search Brands ..."
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
              <div className="absolute right-0 top-full mt-1 z-30 w-[140px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                <button onClick={handleBulkDelete}
                  className="block w-full text-left px-[12px] py-[8px] text-[14px] font-medium text-[#f1416c] hover:bg-[#fff4f8]">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="px-[8px] md:px-[16px] pt-[16px] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="px-[16px] py-[12px] text-left w-[40px]">
                  <input
                    type="checkbox"
                    checked={allChecked && paginatedBrands.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
                </th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide w-[100px]">LOGO</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide">NAME</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide w-[130px]">QTY PRODUCTS</th>
                <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide w-[120px]">CREATED</th>
                <th className="px-[16px] py-[12px] text-right text-[12px] font-semibold text-[#7e8299] uppercase tracking-wide w-[80px]">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand) => (
                  <tr key={brand._id} className="border-b border-dashed border-[#f1f1f4] hover:bg-[#f9f9f9]">
                    <td className="px-[16px] py-[14px] align-middle">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand._id)}
                        onChange={(e) => handleSelectBrand(brand._id, e.target.checked)}
                        className="w-[16px] h-[16px] rounded-[3px] accent-[#009ef7]" />
                    </td>
                    <td className="px-[16px] py-[14px] align-middle">
                      <BrandLogo
                        text={brand.image || brand.name?.slice(0, 2).toUpperCase() || 'BR'}
                        color={brand.image ? '#000' : '#666'}
                      />
                    </td>
                    <td className="px-[16px] py-[14px] align-middle text-[13px] leading-[18px] text-[#232734] font-medium">
                      {brand.name}
                    </td>
                    <td className="px-[16px] py-[14px] align-middle text-[13px] font-semibold text-[#232734]">
                      {brand.productCount || 0}
                    </td>
                    <td className="px-[16px] py-[14px] align-middle text-[13px] text-[#232734]">
                      {new Date(brand.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-[16px] py-[14px] align-middle text-right relative">
                      <button
                        type="button"
                        onClick={() => {
                          const menu = document.getElementById(`menu-${brand._id}`)
                          if (menu) menu.classList.toggle('hidden')
                        }}
                        className="w-[28px] h-[28px] rounded-full bg-[#f1fafd] hover:bg-[#e3f4fc] inline-flex items-center justify-center">
                        <KebabIcon />
                      </button>
                      <div id={`menu-${brand._id}`} className="hidden absolute right-2 top-full mt-1 z-20 w-[140px] bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1 text-left">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="block w-full text-left px-[12px] py-[8px] text-[13px] text-[#232734] hover:bg-[#f1fafd]">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="block w-full text-left px-[12px] py-[8px] text-[13px] text-[#f1416c] hover:bg-[#fff4f8]">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[13px] text-gray-500">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
      </Card>
    </>
  )
}