import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PH = '/src/images/Placeholder.png';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRight({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function buildCategoryTreeFromDB(dbCategories, products) {
  const catCount = {};
  const subCount = {};

  products.forEach(p => {
    const cat = p.category;
    const sub = p.subCategory;
    catCount[cat] = (catCount[cat] || 0) + 1;
    if (sub) {
      const key = `${cat}::${sub}`;
      subCount[key] = (subCount[key] || 0) + 1;
    }
  });

  return dbCategories.map(dbCat => {
    const children = (dbCat.cols || []).flatMap(col =>
      (col.items || []).map(subName => ({
        name:     subName,
        count:    subCount[`${dbCat.name}::${subName}`] || 0,
        children: [],
      }))
    );

    return {
      name:     dbCat.name,
      count:    catCount[dbCat.name] || 0,
      children,
    };
  });
}

function TreeItem({ node, depth = 0, selectedCategory, onCategoryChange }) {
  const [open, setOpen] = useState(depth === 0 ? true : false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedCategory === node.name;

  return (
    <li>
      <div
        className="flex items-center justify-between py-1 cursor-pointer group"
        style={{ paddingLeft: depth === 0 ? 0 : depth === 1 ? 12 : 24 }}
        onClick={() => hasChildren && setOpen(o => !o)}
      >
        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onCategoryChange(node.name)}
            className="flex-shrink-0"
            style={{
              width: 15, height: 15, accentColor: "#0080FF",
              borderRadius: 2, cursor: "pointer",
            }}
            onClick={e => e.stopPropagation()}
          />
          <span
            className={`text-[13px] truncate ${isSelected ? "font-bold text-[#292933]" : "text-[#292933]"} group-hover:text-[#0080FF] transition-colors`}
          >
            {node.name}
            <span className="text-[#919199] ml-1">({node.count})</span>
          </span>
        </label>
        {hasChildren && (
          <span className="text-[#919199] flex-shrink-0 ml-1">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
      </div>
      {hasChildren && open && (
        <ul className="list-none m-0 p-0">
          {node.children.map((child, i) => (
            <TreeItem
              key={i}
              node={child}
              depth={depth + 1}
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e5e7eb]">
      <button
        className="w-full flex items-center justify-between p-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-[15px] font-bold text-[#292933]">{title}</span>
        <span className={`text-[#919199] transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function PriceRangeFilter({ minPrice, maxPrice, onPriceChange, absoluteMax }) {
  const [min, setMin] = useState(minPrice || 0);
  const [max, setMax] = useState(maxPrice || absoluteMax || 5000);
  const ABS_MAX = absoluteMax || 5000;

  useEffect(() => {
    setMin(minPrice || 0);
    setMax(maxPrice || absoluteMax || 5000);
  }, [minPrice, maxPrice, absoluteMax]);

  const handleMinChange = (value) => {
    const newMin = Math.min(value, max - 1);
    setMin(newMin);
    onPriceChange(newMin, max);
  };

  const handleMaxChange = (value) => {
    const newMax = Math.max(value, min + 1);
    setMax(newMax);
    onPriceChange(min, newMax);
  };

  return (
    <FilterSection title="Price range">
      <div className="space-y-3">
        <div className="relative h-4 flex items-center">
          <div className="absolute w-full h-1 bg-[#e5e7eb] rounded" />
          <div
            className="absolute h-1 bg-[#0080FF] rounded"
            style={{ left: `${(min / ABS_MAX) * 100}%`, right: `${100 - (max / ABS_MAX) * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={ABS_MAX}
            value={min}
            onChange={e => handleMinChange(Number(e.target.value))}
            className="absolute w-full appearance-none bg-transparent cursor-pointer"
            style={{ height: 4, zIndex: 3 }}
          />
          <input
            type="range"
            min={0}
            max={ABS_MAX}
            value={max}
            onChange={e => handleMaxChange(Number(e.target.value))}
            className="absolute w-full appearance-none bg-transparent cursor-pointer"
            style={{ height: 4, zIndex: 4 }}
          />
        </div>
        <div className="flex justify-between text-[13px] font-semibold text-[#292933] opacity-70">
          <span>${min.toLocaleString()}</span>
          <span>${max.toLocaleString()}</span>
        </div>
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: #0080FF;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #0080FF;
        }
      `}</style>
    </FilterSection>
  );
}

function ProductCard({ product, cols, wishlistedIds, onWishlistToggle }) {
  const [hovered, setHovered] = useState(false);
  const isSmall = cols >= 4;
  const navigate = useNavigate();

  const productImage = product.image || (product.images?.[0]) || PH;
  const hoverImage   = product.image2 || null;
  const productName  = product.title || product.name || 'Product';
  const productId    = product._id || product.id;
  const productPrice = product.price || 0;
  const productBadge = product.badge || product.Product_Condition;

  const wished = wishlistedIds.has(productId);

  return (
    <div
      className="border border-[#e5e7eb] border-t-0 border-l-0 bg-white group relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/product/${productId}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {productBadge && (
        <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
          {productBadge === 'New' ? 'NEW' : productBadge}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onWishlistToggle(productId, wished); }}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "#d43533" : "none"} stroke={wished ? "#d43533" : "#919199"} strokeWidth="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/product/${productId}`); }}
        className="absolute bottom-10 left-0 right-0 z-10 bg-[#0080FF] text-white text-[12px] font-bold py-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-200"
      >
        Add to cart
      </button>

      <div className={`overflow-hidden bg-[#f9fafb] flex items-center justify-center ${isSmall ? "h-36" : "h-48"}`}>
        <img
          src={(hovered && hoverImage) ? hoverImage : productImage}
          alt={productName}
          className="object-contain h-full w-full p-2 group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PH; }}
        />
      </div>
      <div className="p-2">
        <p className="text-[12px] text-[#292933] leading-snug line-clamp-2 mb-1 min-h-[2.5rem]">
          {productName}
        </p>
        <p className="text-[14px] font-bold text-[#0080FF]">
          ${typeof productPrice === 'number' ? productPrice.toFixed(2) : productPrice}
        </p>
      </div>
    </div>
  );
}

export default function CategoryProducts() {
  const { categoryName = "" } = useParams();
  const { token, isLoggedIn } = useAuth();

  const [products,      setProducts]      = useState([]);
  const [allProducts,   setAllProducts]   = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [totalPages,    setTotalPages]    = useState(1);
  const [sortBy,        setSortBy]        = useState("");
  const [cols,          setCols]          = useState(4);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // Filter states
  const [selectedCategory,  setSelectedCategory]  = useState(categoryName);
  const [minPrice,          setMinPrice]           = useState(0);
  const [maxPrice,          setMaxPrice]           = useState(5000);
  const [maxPossiblePrice,  setMaxPossiblePrice]   = useState(5000);

  // Category tree
  const [categoryTree, setCategoryTree] = useState([]);

  // Wishlist state: Set of product IDs
  const [wishlistedIds, setWishlistedIds] = useState(new Set());

  // Fetch wishlist IDs (only if logged in)
  const fetchWishlistIds = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    try {
      const res = await fetch(`${API_URL}/wishlist/ids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setWishlistedIds(new Set(data.ids));
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    fetchWishlistIds();
  }, [fetchWishlistIds]);

  const handleWishlistToggle = async (productId, currentlyWished) => {
    if (!isLoggedIn || !token) {
      alert('Please login to use wishlist.');
      return;
    }

    // Optimistic update
    setWishlistedIds(prev => {
      const next = new Set(prev);
      if (currentlyWished) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      const method = currentlyWished ? 'DELETE' : 'POST';
      await fetch(`${API_URL}/wishlist/${productId}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      // Revert on error
      setWishlistedIds(prev => {
        const next = new Set(prev);
        if (currentlyWished) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/products?limit=1000`),
        ]);

        const dbCategories = catRes.ok ? await catRes.json() : [];
        const prodData     = await prodRes.json();
        const productsList = prodData.products || prodData || [];

        setAllProducts(productsList);

        const tree = buildCategoryTreeFromDB(
          Array.isArray(dbCategories) ? dbCategories : [],
          productsList
        );
        setCategoryTree(tree);

        const maxPriceValue = Math.max(...productsList.map(p => p.price || 0), 0);
        setMaxPossiblePrice(Math.ceil(maxPriceValue));
        setMaxPrice(Math.ceil(maxPriceValue));

        setProducts(productsList);
        setTotalProducts(productsList.length);
        setTotalPages(Math.ceil(productsList.length / 12));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];

    if (selectedCategory) {
      filtered = filtered.filter(
        p => p.category === selectedCategory || p.subCategory === selectedCategory
      );
    }

    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    if (sortBy === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    const itemsPerPage = 12;
    const start = (currentPage - 1) * itemsPerPage;
    setProducts(filtered.slice(start, start + itemsPerPage));
    setTotalProducts(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [selectedCategory, minPrice, maxPrice, sortBy, currentPage, allProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(2);
      else if (window.innerWidth < 1280) setCols(3);
      else setCols(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleCategoryChange = (name) => {
    setSelectedCategory(name === selectedCategory ? "" : name);
  };

  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
    6: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6",
  }[cols] || "grid-cols-2 sm:grid-cols-3";

  if (error) {
    return (
      <div className="py-4 mb-5">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            Error: {error}. Make sure your backend server is running.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 mb-5">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex gap-0">

          {/* Sidebar */}
          <aside
            className={`
              fixed xl:static top-0 left-0 h-full xl:h-auto z-50 xl:z-auto
              w-72 xl:w-64 bg-white xl:bg-transparent
              transform transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
              xl:flex-shrink-0 overflow-y-auto xl:overflow-visible
              border-r border-[#e5e7eb] xl:border-r-0
            `}
            style={{ maxHeight: "100vh" }}
          >
            <div className="flex xl:hidden justify-between items-center p-3 border-b border-[#e5e7eb]">
              <span className="text-[15px] font-bold text-[#292933]">Filters</span>
              <button onClick={() => setSidebarOpen(false)} className="text-[#292933]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Categories filter */}
            <div className="border-b border-[#e5e7eb]">
              <div className="p-3">
                <span className="text-[15px] font-bold text-[#292933]">Categories</span>
              </div>
              <div className="px-3 pb-3 max-h-[300px] overflow-y-auto">
                {categoryTree.length > 0 ? (
                  <ul className="list-none m-0 p-0">
                    {categoryTree.map((node, i) => (
                      <TreeItem
                        key={i}
                        node={node}
                        depth={0}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="text-[13px] text-[#919199]">Loading categories...</div>
                )}
              </div>
            </div>

            {/* Price range */}
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              absoluteMax={maxPossiblePrice}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 xl:pl-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-[12px] text-[#292933] mb-3">
              <a href="#" className="opacity-50 hover:opacity-100 hover:text-[#0080FF] transition-colors">Home</a>
              <ChevronRight />
              <a href="#" className="opacity-50 hover:opacity-100 hover:text-[#0080FF] transition-colors">All categories</a>
              <ChevronRight />
              <span className="font-bold">"{selectedCategory || "All Products"}"</span>
            </nav>

            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-[18px] md:text-[20px] font-bold text-[#292933] leading-tight">
                  Showing results
                </h1>
                <div className="text-[12px] text-[#919199] mt-0.5">
                  <span className="font-bold text-[#292933]">{totalProducts}</span> Products Found
                </div>
              </div>

              <button
                className="xl:hidden p-2 text-[#292933]"
                onClick={() => setSidebarOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M7 12h10M11 18h2"/>
                </svg>
              </button>

              {/* Sort by */}
              <div className="flex items-center gap-2">
                <svg width="16" height="14" viewBox="0 0 17.5 13.5" className="flex-shrink-0">
                  <g transform="translate(-3444 2590)">
                    <path d="M3464.522-2581.337a.75.75,0,0,0-1.061.016l-2.712,2.8V-2589a.75.75,0,0,0-1.5,0v10.149l-2.712-2.8a.75.75,0,0,0-1.075,1.047l4,4.125a.75.75,0,0,0,1.077,0l4-4.125a.75.75,0,0,0-.017-1.073Z" fill="#aaa" fillRule="evenodd"/>
                    <path d="M3452.522-2585.663a.75.75,0,0,1-1.061-.016l-2.712-2.8V-2578a.75.75,0,0,1-1.5,0v-10.149l-2.712,2.8a.75.75,0,1,1-1.075-1.047l4-4.125a.75.75,0,0,1,1.077,0l4,4.125a.75.75,0,0,1-.017,1.073Z" fill="#111" fillRule="evenodd"/>
                  </g>
                </svg>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border-0 text-[13px] text-[#292933] font-semibold bg-transparent cursor-pointer focus:outline-none"
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">Price low to high</option>
                  <option value="price-desc">Price high to low</option>
                </select>
              </div>

              {/* Column toggles */}
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 6].map(n => (
                  <button
                    key={n}
                    onClick={() => setCols(n)}
                    title={`${n} columns`}
                    className={`flex gap-0.5 p-1 border rounded transition-colors ${cols === n ? "border-[#0080FF]" : "border-[#e5e7eb] hover:border-[#9ca3af]"}`}
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <div
                        key={i}
                        style={{ width: n === 2 ? 7 : n === 3 ? 5 : n === 4 ? 4 : 3, height: 10 }}
                        className={`rounded-sm ${cols === n ? "bg-[#0080FF]" : "bg-[#d1d5db]"}`}
                      />
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-[#0080FF]">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-[#919199]">No products found</div>
              </div>
            ) : (
              <div className={`grid ${gridClass} border-t border-l border-[#e5e7eb]`}>
                {products.map(product => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    cols={cols}
                    wishlistedIds={wishlistedIds}
                    onWishlistToggle={handleWishlistToggle}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`
                    relative flex items-center justify-center min-w-[90px] h-9 px-3 text-[13px] font-medium
                    rounded-md transition-all duration-200 ease-out
                    ${currentPage === 1
                      ? "text-[#d1d5db] cursor-not-allowed bg-[#f9fafb] border border-[#f3f4f6]"
                      : "text-[#292933] bg-white border border-[#e5e7eb] hover:border-[#0080FF] hover:text-[#0080FF] hover:shadow-sm active:scale-95"
                    }
                  `}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mr-1.5">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => {
                    const isActive = p === currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`
                          relative flex items-center justify-center w-9 h-9 text-[13px] font-medium
                          rounded-md transition-all duration-200 ease-out
                          ${isActive
                            ? "bg-[#0080FF] text-white shadow-md shadow-blue-200 scale-105"
                            : "bg-white text-[#292933] border border-[#e5e7eb] hover:border-[#0080FF] hover:text-[#0080FF] hover:shadow-sm hover:scale-105"
                          }
                        `}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`
                    relative flex items-center justify-center min-w-[90px] h-9 px-3 text-[13px] font-medium
                    rounded-md transition-all duration-200 ease-out
                    ${currentPage === totalPages
                      ? "text-[#d1d5db] cursor-not-allowed bg-[#f9fafb] border border-[#f3f4f6]"
                      : "text-[#292933] bg-white border border-[#e5e7eb] hover:border-[#0080FF] hover:text-[#0080FF] hover:shadow-sm active:scale-95"
                    }
                  `}
                >
                  Next
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-1.5">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}