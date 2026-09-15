import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Container from '../components/common/Container'
import SectionHeader from '../components/common/SectionHeader'
import ProductCard from '../components/features/ProductCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PH = '/src/images/Placeholder.png'

const encodeCategoryName = (name) => encodeURIComponent(name)

/* Hero Slider */
function HeroSlider({ heroBanners = [] }) {
  const [cur, setCur] = useState(0)
  useEffect(() => {
    if (!heroBanners.length) return
    const t = setInterval(() => setCur(c => (c + 1) % heroBanners.length), 4000)
    return () => clearInterval(t)
  }, [heroBanners.length])
  if (!heroBanners.length) return <div className="relative overflow-hidden rounded-[6px] h-[400px] xl:h-[516px] bg-[#f3f4f6]" />
  return (
    <div className="relative overflow-hidden rounded-[6px] h-[400px] xl:h-[516px] bg-[#f3f4f6]">
      {heroBanners.map((src, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? 'opacity-100' : 'opacity-0'}`}>
          <img src={src} alt={`Slide ${i+1}`} className="w-full h-full object-cover rounded-[6px]"
            onError={e => { e.target.src = PH }} />
        </div>
      ))}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {heroBanners.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            className={`h-2 rounded-full transition-all ${i === cur ? 'bg-primary w-4' : 'bg-white/70 w-2'}`} />
        ))}
      </div>
    </div>
  )
}


/* Countdown */
function CountdownTimer({ endTime }) {
  const calcRemaining = () => {
    if (!endTime) return { d: 0, h: 0, m: 0, s: 0 }
    const diff = Math.max(0, Math.floor((new Date(endTime) - Date.now()) / 1000))
    const d = Math.floor(diff / 86400)
    const h = Math.floor((diff % 86400) / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = diff % 60
    return { d, h, m, s }
  }

  const [t, setT] = useState(calcRemaining)
  useEffect(() => {
    const id = setInterval(() => setT(calcRemaining), 1000)
    return () => clearInterval(id)
  }, [endTime])
  const p2 = n => String(n).padStart(2,'0')
  return (
    <div className="flex gap-1 justify-center">
      {[['d',t.d,'days'],['h',t.h,'hrs'],['m',t.m,'mins'],['s',t.s,'secs']].map(([k,v,l]) => (
        <div key={k} className="bg-white rounded shadow text-center px-1.5 py-1 min-w-[40px]">
          <div className="text-[14px] font-bold text-[#1f2937] leading-none">{p2(v)}</div>
          <div className="text-[8px] text-[#6b7280] uppercase mt-0.5">{l}</div>
        </div>
      ))}
    </div>
  )
}

// Helper to get badge color based on label
function getBadgeColor(badgeLabel) {
  if (!badgeLabel) return 'bg-[#0080FF]' 
  const label = badgeLabel.toLowerCase()
  if (label === 'new') return 'bg-green-500'
  if (label === 'flash sale' || label === 'flash') return 'bg-orange-500'
  if (label === 'hot sale' || label === 'hot') return 'bg-red-500'
  return 'bg-[#0080FF]' 
}

function ProductCardWithBadge({ product, showBadge = true }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const badgeColor = product.badge ? getBadgeColor(product.badge) : null
  const hoverImage = product.image2 || null
  
  return (
    <div className="cursor-pointer group" onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative bg-white rounded-lg overflow-hidden border border-[#f3f4f6] group-hover:border-[#0080FF]/30 transition-all">
        {showBadge && product.badge && (
          <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-1 text-white rounded ${badgeColor}`}>
            {product.badge}
          </span>
        )}
        <div className="aspect-square overflow-hidden bg-[#f9fafb]">
          <img 
            src={(hovered && hoverImage) ? hoverImage : (product.image || PH)} 
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = PH }}
          />
        </div>
        <div className="p-3">
          <p className="text-[13px] font-medium text-[#374151] line-clamp-2 min-h-[40px]">{product.title}</p>
          <p className="text-[15px] font-bold text-[#111827] mt-1">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
          {product.oldPrice && (
            <p className="text-[11px] text-[#9ca3af] line-through">${typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice}</p>
          )}
        </div>
      </div>
    </div>
  )
}


/* Featured Products Row */
function FeaturedProductsRow({ products, navigate }) {
  const rowRef = useRef(null)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!rowRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }

  useEffect(() => {
    const el = rowRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [products])

  const scrollRight = () => {
    if (rowRef.current) rowRef.current.scrollBy({ left: 220, behavior: 'smooth' })
  }

  return (
    <div className="md:col-span-2">
      <div className="bg-white border border-[#f3f4f6] rounded p-3 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-bold text-[#1f2937]">Featured Products</h3>
        </div>
        <div className="relative flex items-center">
          <div
            ref={rowRef}
            className="flex gap-2 overflow-x-auto no-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {products.map(p => (
              <FeaturedProductItem key={p._id} p={p} navigate={navigate} />
            ))}
          </div>
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white border border-[#e5e7eb] shadow flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all z-10 flex-shrink-0"
              style={{ marginLeft: 4 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


/* Featured Product Item */
function FeaturedProductItem({ p, navigate }) {
  const [hovered, setHovered] = useState(false)
  const hoverImage = p.image2 || null
  return (
    <div
      className="flex items-center gap-2 p-2 border border-[#f3f4f6] rounded hover:border-[#0080FF]/30 transition-colors cursor-pointer flex-shrink-0"
      style={{ minWidth: 195, maxWidth: 210 }}
      onClick={() => navigate(`/product/${p._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-[50px] h-[50px] flex-shrink-0 bg-[#f9fafb] rounded overflow-hidden">
        <img
          src={(hovered && hoverImage) ? hoverImage : (p.image || PH)}
          alt={p.title}
          className="w-full h-full object-contain transition-transform duration-300"
          onError={e => { e.target.src = PH }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#374151] font-medium leading-tight line-clamp-2" style={{ maxWidth: 120 }}>
          {p.title}
        </p>
        <p className="text-[13px] font-bold text-[#111827] mt-0.5">
          ${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
        </p>
        {p.oldPrice && (
          <p className="text-[10px] text-[#9ca3af] line-through">
            ${typeof p.oldPrice === 'number' ? p.oldPrice.toFixed(2) : p.oldPrice}
          </p>
        )}
      </div>
    </div>
  )
}


/* Classified Ad Card */
function ClassifiedAdCard({ item, navigate }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex-shrink-0 w-[160px] cursor-pointer group"
      onClick={() => navigate(`/product/${item._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="relative w-full aspect-square rounded-[6px] overflow-hidden bg-white border border-[#e5e7eb] group-hover:border-[#0080FF]/30 transition-colors mx-auto">
        {item.badge && (
          <span className={`absolute top-1.5 left-1.5 z-10 text-[10px] font-bold px-1.5 py-0.5 text-white rounded ${getBadgeColor(item.badge)}`}>
            {item.badge}
          </span>
        )}
        <img src={(hovered && item.image2) ? item.image2 : (item.image || PH)} alt={item.title}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
          onError={e => { e.target.src = PH }} />
      </div>
      <div className="text-center mt-1.5">
        <p className="text-[11px] font-normal text-[#374151] line-clamp-2 leading-tight mb-1">{item.title}</p>
        <p className="text-[13px] font-bold text-[#111827]">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
      </div>
    </div>
  )
}


/* PreOrder Card */
function PreOrderCard({ p, navigate }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="cursor-pointer group border border-[#f3f4f6] rounded p-2 hover:border-[#0080FF]/30 transition-colors"
      onClick={() => navigate(`/product/${p._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="relative">
        {p.badge && (
          <span className={`absolute top-0 left-0 z-10 text-[10px] font-bold px-1.5 py-0.5 text-white rounded ${getBadgeColor(p.badge)}`}>
            {p.badge}
          </span>
        )}
        <div className="aspect-square overflow-hidden bg-[#f9fafb] rounded mb-2">
          <img src={(hovered && p.image2) ? p.image2 : (p.image || PH)} alt={p.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            onError={e => { e.target.src = PH }} />
        </div>
      </div>
      <p className="text-[11px] text-[#4b5563] line-clamp-2 leading-tight">{p.title}</p>
      <p className="text-[13px] font-bold text-[#111827] mt-1">${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}</p>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [home, setHome]       = useState(null)
  const [loading, setLoading] = useState(true)

  /* refs for scrollable rows */
  const auctionRef    = useRef(null)
  const classifiedRef = useRef(null)
  
  const [todayDealIndex, setTodayDealIndex] = useState(0)

  useEffect(() => {
    fetch(`${API_URL}/home`)
      .then(r => r.json())
      .then(json => { setHome(json); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null  

  /* destructure with safe fallbacks */
  const {
    heroBanners        = [],
    flashDealBanner    = '',
    flashDealEnd       = '',
    hotCategories      = [],
    featuredCategories = [],
    promotionBanners   = [],
    shopsLongBanner    = '',
    featuredProductsSmall = [],
    bestSellingProducts   = [],
    todayDealProducts     = [],
    auctionProducts       = [],
    classifiedAds         = [],
    preOrderProducts      = [],
    allProducts           = [],
  } = home || {}

  // Best Selling products 
  const bestSellingRow = bestSellingProducts.slice(0, 5)
  
  // All Products
  const allProductsDisplay = allProducts.slice(0, 12)

  /* scroll helpers */
  const scrollBy = (ref, amount) => {
    if (ref.current) ref.current.scrollBy({ left: amount, behavior: 'smooth' })
  }


  /* Today's Deal navigation handlers */
  const handlePrevDeal = () => {
    setTodayDealIndex(prev => (prev === 0 ? todayDealProducts.length - 1 : prev - 1))
  }
  
  const handleNextDeal = () => {
    setTodayDealIndex(prev => (prev === todayDealProducts.length - 1 ? 0 : prev + 1))
  }

  return (
    <div>
      {/* HERO */}
      <div className="py-8 bg-[#f5f5f5]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:items-stretch">
            {/* Hero Slider */}
            <div className="lg:col-span-2">
              <HeroSlider heroBanners={heroBanners} />
            </div>

            {/* Right panel */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flash Deal Banner */}
                <div className="relative rounded-[6px] overflow-hidden bg-[#f3f4f6]" style={{ minHeight: 220 }}>
                  <a href="/flash-sale" className="block h-full" onClick={e => { e.preventDefault(); navigate('/flash-sale') }}>
                    <img src={flashDealBanner} alt="Flash Sale"
                      className="w-full h-full object-cover rounded-[6px] min-h-[220px]"
                      style={{ minHeight: 220 }}
                      onError={e => { e.target.src = PH }} />
                    <div className="absolute bottom-0 w-full py-3 px-2">
                      <CountdownTimer endTime={flashDealEnd} />
                    </div>
                  </a>
                </div>


                {/* Hot Categories */}
                <div>
                  <div className="flex items-center gap-2 mb-3 pl-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="20" viewBox="0 0 188 255">
                      <path d="M187.899,164.809C185.803,214.868,144.574,254.812,94,254.812,42.085,254.812,0,211.312,0,160.812,0,154.062-.121,140.572,10,117.812c6.057-13.621,9.856-22.178,12-30,1.178-4.299,3.469-11.129,10,0,3.851,6.562,4,16,4,16s14.328-10.995,24-32c14.179-30.793,2.866-49.2-1-62-1.338-4.428-2.178-12.386,7,0,9.352,3.451,34.076,20.758,47,39,18.445,26.035,25,51,25,51s5.906-7.33,8-15c2.365-8.661,2.4-17.239,10-8.999,7.227,8.787,17.96,25.3,24,41C190.969,137.321,187.899,164.809,187.899,164.809Z" fill="#ff4c0d"/>
                      <path d="M94,254.812C58.101,254.812,29,225.711,29,189.812c0-21.661,8.729-34.812,26.896-52.646C67.528,125.747,78.415,111.722,83.042,102.172c.911-1.88,2.984-11.677,10.977-.206,4.193,6.016,10.766,16.715,14.981,25.846,7.266,15.743,9,31,9,31s7.121-4.196,12-15c1.573-3.482,4.753-16.664,13.643-3.484,6.523,9.672,15.484,27.062,15.357,49.484C159,225.711,129.898,254.812,94,254.812Z" fill="#fc9502"/>
                      <path d="M95,183.812c9.25,0,9.25,17.129,21,40,7.824,15.229-3.879,31-21,31s-26-13.879-26-31S85.75,183.812,95,183.812Z" fill="#fce202"/>
                    </svg>
                    <span className="text-[16px] font-bold">Hot Categories</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {hotCategories.map((cat, i) => (
                      <div key={i}
                        className="flex flex-col items-center cursor-pointer group"
                        onClick={() => navigate(`/category/${encodeCategoryName(cat.name)}`)}
                      >
                        <div className="w-[70px] h-[70px] md:w-[58px] md:h-[58px] xl:w-[80px] xl:h-[80px] rounded-[6px] overflow-hidden bg-white border border-[#f3f4f6] group-hover:border-[#0080FF]/30 transition-colors">
                          <img src={cat.img} alt={cat.name}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                            onError={e => { e.target.src = PH }} />
                        </div>
                        <p className="text-[10px] text-center mt-1 text-[#4b5563] line-clamp-2 group-hover:text-[#0080FF] transition-colors leading-tight">
                          {cat.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Products small list */}
              {featuredProductsSmall.length > 0 && (
                <div className="mt-auto">
                  <FeaturedProductsRow products={featuredProductsSmall} navigate={navigate} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>


      {/* FEATURED CATEGORIES */}
      {featuredCategories.length > 0 && (
        <div className="py-5 bg-white">
          <Container>
            <div className="border border-[#e8f4ff] rounded-[6px] p-4 bg-[#f0f7ff]">
              <div className="flex items-stretch gap-3">
                <div className="flex-shrink-0 bg-[#0080FF] text-white rounded px-3 py-3 min-w-[160px]">
                  <p className="text-sm font-bold leading-tight mb-1">Featured Categories</p>
                  <p className="text-[10px] text-white/80 mb-3 leading-tight">Categorize clothing & shining Hearts across our marketplace</p>
                  <Link to="/categories" className="w-full">
                    <button className="bg-white text-[#0080FF] text-[11px] px-3 py-1 rounded font-medium w-full">
                      All categories
                    </button>
                  </Link>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {featuredCategories.map((cat, i) => (
                      <div key={i}
                        className="flex-shrink-0 w-[110px] cursor-pointer group"
                        onClick={() => navigate(`/category/${encodeCategoryName(cat.name)}`)}
                      >
                        <div className="bg-white rounded-[6px] overflow-hidden aspect-[4/3] border border-[#f3f4f6] group-hover:border-[#0080FF]/30 transition-colors">
                          <img src={cat.img} alt={cat.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                            onError={e => { e.target.src = PH }} />
                        </div>
                        <p className="text-[11px] text-center mt-1 text-[#4b5563] group-hover:text-[#0080FF] transition-colors font-medium leading-tight">
                          {cat.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}


      {/* BEST SELLING + TODAY'S DEAL */}
      {(bestSellingRow.length > 0 || todayDealProducts.length > 0) && (
        <div className="py-5 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {bestSellingRow.length > 0 && (
                <div className="lg:col-span-2 bg-[#A8BD98] rounded-[6px] p-4">
                  <SectionHeader title="Best Selling" />
                  <div className="grid grid-cols-5 gap-3">
                    {bestSellingRow.map(p => <ProductCardWithBadge key={p._id} product={p} showBadge={false} />)}
                  </div>
                </div>
              )}
              {todayDealProducts.length > 0 && (
                <div className="bg-white border border-[#f3f4f6] rounded-[6px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[17px] font-bold text-[#111827]">Todays Deal</h2>
                    <div className="flex gap-1">
                      <button onClick={handlePrevDeal} className="w-7 h-7 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button onClick={handleNextDeal} className="w-7 h-7 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    {todayDealProducts.length > 0 && (
                      <ProductCardWithBadge product={todayDealProducts[todayDealIndex]} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}


      {/* PROMOTION BANNERS */}
      {promotionBanners.length > 0 && (
        <div className="py-4">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {promotionBanners.map((b, i) => (
                <div key={i} className="rounded-[6px] overflow-hidden cursor-pointer group">
                  <img src={b.img} alt={b.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.target.src = PH }} />
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}


      {/* AUCTION */}
      {auctionProducts.length > 0 && (
        <div className="py-5">
          <Container>
            <div className="bg-[#f9f4e8] rounded-[6px] overflow-hidden">
              <div className="flex">
                <div className="bg-[#8B6914] flex items-center justify-center px-4"
                  style={{ writingMode:'vertical-rl', textOrientation:'mixed' }}>
                  <span className="text-white font-black text-lg tracking-[6px] uppercase rotate-180">AUCTION</span>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-[18px] font-bold text-[#111827]">Auction Products</h2>
                      <p className="text-[12px] text-[#6b7280]">Products: {auctionProducts.length}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => scrollBy(auctionRef, -300)} className="w-7 h-7 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <button onClick={() => scrollBy(auctionRef, 300)} className="w-7 h-7 rounded-full border border-[#e5e7eb] flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div ref={auctionRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                    {auctionProducts.map(item => (
                      <div key={item._id} className="flex-shrink-0 w-[210px] bg-white rounded p-3 border border-[#f3f4f6] cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/product/${item._id}`)}>
                        <div className="relative">
                          {item.badge && (
                            <span className={`absolute top-0 left-0 z-10 text-[10px] font-bold px-1.5 py-0.5 text-white rounded ${getBadgeColor(item.badge)}`}>
                              {item.badge}
                            </span>
                          )}
                          <img src={item.image || PH} alt={item.title} className="w-full aspect-square object-contain mb-2"
                            onError={e => { e.target.src = PH }} />
                        </div>
                        <p className="text-[13px] font-medium text-[#374151] line-clamp-2">{item.title}</p>
                        <p className="text-[14px] font-bold text-[#111827] mt-1">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                        <button className="mt-2 w-full bg-[#0080FF] text-white text-[12px] py-1.5 rounded hover:bg-blue-600 transition-colors font-medium">
                          Bid Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}


      {/* CLASSIFIED ADS */}
      {classifiedAds.length > 0 && (
        <div className="py-5 bg-[#f5f5f5]">
          <Container>
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <h2 className="text-[16px] font-bold">Classified Ads</h2>
                <p className="text-[12px] text-[#6b7280] mt-0.5">Products ({classifiedAds.length})</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => scrollBy(classifiedRef, -300)} className="w-7 h-7 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button onClick={() => scrollBy(classifiedRef, 300)} className="w-7 h-7 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center hover:bg-[#0080FF] hover:text-white hover:border-[#0080FF] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
            <div ref={classifiedRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
              {classifiedAds.map(item => (
                <ClassifiedAdCard key={item._id} item={item} navigate={navigate} />
              ))}
            </div>
          </Container>
        </div>
      )}


      {/* NEWEST PREORDER PRODUCTS */}
      {preOrderProducts.length > 0 && (
        <div className="py-5">
          <Container>
            <div className="border border-[#e5e7eb] rounded-[6px] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#f3f4f6] bg-[#f9fafb]">
                <div className="flex items-center gap-2">
                  <div className="bg-[#f3af3d] text-white rounded p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span className="font-bold text-[15px] text-[#1f2937]">Newest Preorder Products</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="hidden md:flex flex-col justify-center bg-[#e8f4ff] rounded-[6px] p-4 min-w-[150px] max-w-[160px]">
                    <span className="bg-[#f3af3d] text-white text-[10px] font-bold px-2 py-1 rounded mb-3 text-center leading-tight">
                      Limited Pre-Orders Available
                    </span>
                    <div className="bg-[#0080FF] text-white text-[12px] px-3 py-1.5 rounded font-medium text-center" style={{ cursor: 'default' }}>
                      Get More Now
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {preOrderProducts.map(p => (
                      <PreOrderCard key={p._id} p={p} navigate={navigate} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}


      {/* SHOP BANNER IMAGE */}
      {shopsLongBanner && (
        <div className="py-5">
          <Container>
            <Link to="/categories" className="block w-full rounded-[6px] overflow-hidden group cursor-pointer">
              <img
                src={shopsLongBanner}
                alt="Shop Banner"
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.target.style.display = 'none' }}
              />
            </Link>
          </Container>
        </div>
      )}


      {/* ALL PRODUCTS GRID */}
      {allProductsDisplay.length > 0 && (
        <div className="py-5">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {allProductsDisplay.map(p => <ProductCardWithBadge key={p._id} product={p} />)}
            </div>
            <div className="text-center mt-6">
              <button 
                onClick={() => navigate('/categories')}
                className="border border-[#d1d5db] text-[#374151] px-10 py-2 rounded text-sm font-medium hover:border-[#0080FF] hover:text-[#0080FF] transition-colors"
              >
                Load More
              </button>
            </div>
          </Container>
        </div>
      )}
    </div>
  )
}