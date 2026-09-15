# Active eCommerce CMS — React + Tailwind CSS (Fixed v2)

A pixel-perfect React + Tailwind CSS clone of [demo.activeitzone.com/ecommerce](https://demo.activeitzone.com/ecommerce).

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✅ Fixes Applied (v2)

| Issue | Fix |
|-------|-----|
| ❌ Duplicate cart icon | ✅ Cart only appears once in the bottom nav bar |
| ❌ Broken/placeholder images | ✅ All images use real CDN URLs from source HTML |
| ❌ Categories page wrong layout | ✅ Rebuilt to exactly match: border card, 60px icon, 5-col sub-grid |
| ❌ No Product Details page | ✅ `/product/:id` with images, condition badge, tags, chat btn, related products |
| ❌ Products not clickable | ✅ All ProductCards navigate to `/product/:id` |
| ❌ Flash sale placeholders | ✅ Real deal images from Flash_Sale.html with live countdown |
| ❌ Blog placeholder images | ✅ Real blog images from Blogs.html |
| ❌ Brand placeholder images | ✅ All 70+ brand logos use real CDN URLs |

---

## 📁 Project Structure

```
src/
├── App.jsx                         ← Router (8 routes incl. /product/:id)
├── main.jsx
├── index.css                       ← Tailwind + CSS vars + global styles
├── data/
│   └── homeData.js                 ← All home page data with REAL image URLs
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Container.jsx           ← max-w-[1280px] wrapper
│   │   ├── Section.jsx
│   │   ├── SectionHeader.jsx       ← Title + prev/next arrows
│   │   └── Breadcrumb.jsx
│   ├── features/
│   │   ├── ProductCard.jsx         ← Clickable → /product/:id
│   │   └── BlogCard.jsx
│   └── layout/
│       ├── Navbar.jsx              ← Fixed: single cart, correct 2-row layout
│       └── Footer.jsx
└── pages/
    ├── Home.jsx                    ← Full home page with real images
    ├── FlashSale.jsx               ← Real deal images + live countdown
    ├── Blogs.jsx                   ← Real blog images + sidebar filter
    ├── Brands.jsx                  ← 70+ real brand logos
    ├── Categories.jsx              ← Exact HTML structure match
    ├── Seller.jsx
    ├── Contact.jsx
    └── ProductDetails.jsx          ← NEW: full product detail page
```

---

## 🛣️ Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/flash-sale` | Flash Sale (live countdown) |
| `/blogs` | Blogs |
| `/brands` | All Brands |
| `/categories` | All Categories |
| `/seller` | Sellers |
| `/contact` | Contact Us |
| `/product/:id` | Product Details ← NEW |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#0080FF` |
| Dark text | `#292933` |
| Gray | `#9d9da6` |
| Light bg | `#f5f5f5` |
| Success | `#85b567` |
| Warning / Stars | `#f3af3d` |
| Font | `Public Sans` |

---

## 📝 Notes

- All product/category/brand images load directly from the original demo CDN
- Navbar: **top row** has logo + search + login/registration; **bottom row** has category icon + nav links + cart (no duplication)  
- Product Details page matches the screenshot with: image gallery, brand, price box, condition badge, sold-by, location, tags, chat button, related products
- Categories page uses exact same structure as original: `border` card wrapper, 60×60px category icon, `row-cols-xl-5` 5-column sub-grid
