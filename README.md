<!-- ═══════════════════════════════════════════════════════════════════════════
     MERN MULTI-VENDOR E-COMMERCE PLATFORM · README
     Author: Nasir Sarkar · https://nasir-sarkar.vercel.app/
     ═══════════════════════════════════════════════════════════════════════ -->

<a name="readme-top"></a>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,35:1e3a8a,70:2563eb,100:38bdf8&height=230&section=header&text=MERN%20Multi-Vendor%20E-Commerce&fontSize=44&fontColor=ffffff&fontAlignY=36&desc=Storefront%20%C2%B7%20Admin%20%C2%B7%20Seller%20%C2%B7%20Customer%20%E2%80%94%20four%20apps%2C%20one%20codebase&descAlignY=57&descSize=17&animation=fadeIn" width="100%" alt="MERN Multi-Vendor E-Commerce Platform" />

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=22&duration=2600&pause=800&color=2563EB&center=true&vCenter=true&width=760&lines=A+full-featured%2C+multi-role+e-commerce+ecosystem;Built+from+the+ground+up+with+the+MERN+stack;3+isolated+dashboards+%C2%B7+20+REST+resources+%C2%B7+18+Mongoose+models;Role-aware+JWT+auth+%C2%B7+100%25+database-driven+admin+panel" alt="Typing SVG" />

<br/>

<!-- ─────────────────────────── CORE STACK ─────────────────────────── -->
<p>
  <img src="https://skillicons.dev/icons?i=react,tailwind,vite,nodejs,express,mongodb,js,git&theme=dark&perline=8" alt="Tech stack icons" />
</p>

<!-- ─────────────────────────── BADGES ─────────────────────────── -->
<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js_Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

<p>
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="status" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/roles-admin%20%7C%20seller%20%7C%20user-8b5cf6?style=flat-square" alt="Roles" />
  <img src="https://img.shields.io/badge/API-REST-f97316?style=flat-square" alt="REST API" />
  <img src="https://img.shields.io/badge/architecture-multi--vendor-0ea5e9?style=flat-square" alt="Architecture" />
</p>

<br/>

<!-- ─────────────────────────── QUICK NAV ─────────────────────────── -->
<table>
<tr>
<td align="center" width="20%">
<a href="#-project-demo"><img src="https://img.shields.io/badge/%F0%9F%8E%A5-WATCH_DEMO-ef4444?style=for-the-badge" alt="Watch Demo" /></a>
</td>
<td align="center" width="20%">
<a href="#-key-features"><img src="https://img.shields.io/badge/%E2%9C%A8-FEATURES-6366f1?style=for-the-badge" alt="Features" /></a>
</td>
<td align="center" width="20%">
<a href="#%EF%B8%8F-tech-stack"><img src="https://img.shields.io/badge/%F0%9F%9B%A0%EF%B8%8F-TECH_STACK-0ea5e9?style=for-the-badge" alt="Tech Stack" /></a>
</td>
<td align="center" width="20%">
<a href="#-system-architecture"><img src="https://img.shields.io/badge/%F0%9F%A7%A9-ARCHITECTURE-a855f7?style=for-the-badge" alt="Architecture" /></a>
</td>
<td align="center" width="20%">
<a href="#-getting-started"><img src="https://img.shields.io/badge/%F0%9F%9A%80-GET_STARTED-22c55e?style=for-the-badge" alt="Get Started" /></a>
</td>
</tr>
</table>

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 📊 At a Glance

<div align="center">

| 🧭 Dashboards | 🔌 API Resources | 🗃️ Mongoose Models | 🧠 Controllers | 🎭 Roles | 🖥️ Storefront Pages |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **4** | **20** | **18** | **19** | **3** | **24** |
| Storefront · Admin<br/>Seller · Customer | modular REST<br/>route groups | fully normalized<br/>schemas | one per<br/>resource domain | `admin`<br/>`seller` · `user` | public, SEO-ready<br/>catalog & content |

</div>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 📖 Overview

> [!NOTE]
> **This is not a storefront clone.** It's a complete multi-vendor marketplace ecosystem — three independent, role-based dashboards sitting on top of a shared public storefront, all backed by a modular REST API with JWT authentication.

This is a **production-style, multi-role e-commerce platform** built with the MERN stack (MongoDB, Express, React, Node.js). It goes far beyond a typical storefront clone — it's a complete marketplace ecosystem with **three independent, role-based dashboards** (Admin, Seller, Customer) sitting on top of a shared public storefront, all backed by a modular REST API with JWT authentication.

The goal of this project was to simulate a real-world, scalable marketplace architecture: dynamic catalog management, order lifecycle handling, seller onboarding & ratings, discount engines, flash sales, wishlists, reviews, and a fully database-driven admin control panel — the kind of system that powers real multi-vendor platforms.

<div align="center">

```
┌──────────────────────────────────────────────────────────────────────────┐
│   ONE CODEBASE  ·  FOUR EXPERIENCES  ·  THREE ISOLATED AUTH SESSIONS     │
├────────────────┬────────────────┬────────────────┬───────────────────────┤
│  🌐 STOREFRONT │  🛠️ ADMIN      │  🏪 SELLER     │  👤 CUSTOMER          │
│  public        │  full control  │  self-service  │  self-service         │
│  no auth       │  role: admin   │  role: seller  │  role: user           │
└────────────────┴────────────────┴────────────────┴───────────────────────┘
```

</div>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 🎥 Project Demo

<div align="center">

> 📺 **A full walkthrough video of the platform (Storefront + Admin + Seller + Customer panels) is available here:**

<a href="https://lnkd.in/p/gMJH9xK2">
  <img src="https://img.shields.io/badge/%E2%96%B6%20WATCH%20FULL%20DEMO%20VIDEO-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=0A66C2" height="56" alt="Watch Full Demo Video" />
</a>

</div>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 🖼️ Screenshots

<div align="center">

<table>
<tr>
<td align="center" colspan="2">

### 🏠 Home Page

<img width="100%" alt="Home Page Screenshot" src="https://github.com/user-attachments/assets/a684108c-e1e5-4343-bb76-39676ec289dd" />

</td>
</tr>
<tr>
<td align="center" width="50%">

### 👤 Customer Dashboard

<img width="100%" alt="Admin Dashboard Screenshot" src="https://github.com/user-attachments/assets/cbd6801c-f2da-4654-a479-ed25bc6bb172" />

</td>
<td align="center" width="50%">

### 🛠️ Admin Dashboard

<img width="100%" alt="Seller Dashboard Screenshot" src="https://github.com/user-attachments/assets/6bf35a70-ed22-4c49-aa3f-79a24dad5e6f" />

</td>
</tr>
<tr>
<td align="center" colspan="2">

### 🏪 Seller Dashboard

<img width="100%" alt="Customer Dashboard Screenshot" src="https://github.com/user-attachments/assets/1eda98c4-c233-4083-bb9d-89281b6087eb" />

</td>
</tr>
</table>

</div>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 🧩 System Architecture

<div align="center">

```mermaid
flowchart TB
    subgraph CLIENT["⚛️  REACT + VITE SPA"]
        direction LR
        SF["🌐 Storefront<br/><sub>public pages</sub>"]
        AD["🛠️ Admin · role: admin"]
        SL["🏪 Seller · role: seller"]
        US["👤 Customer<br/><sub>role: user</sub>"]
    end

    CTX["🔐 AuthContext · JWT / session state"]
    PR["🛡️ ProtectedRoute<br/><sub>client-side guard</sub>"]

    subgraph API["🟢  NODE + EXPRESS REST API"]
        direction TB
        MW["🔑 auth.js · verifyToken · requireAdmin"]
        RT["🧭 20 Route Groups"]
        CT["🧠 19 Controllers"]
        UP["📂 upload.js · Multer · 5MB · images"]
    end

    DB[("🍃 MongoDB · 18 Mongoose models")]
    FS[["🗂️ /uploads<br/><sub>static assets</sub>"]]

    SF --> CTX
    AD --> CTX
    SL --> CTX
    US --> CTX
    CTX --> PR
    PR -->|"Axios · Bearer token"| MW
    MW --> RT --> CT --> DB
    CT --> UP --> FS
    FS -.->|"express.static"| CLIENT

    classDef client fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#e2e8f0
    classDef api fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#dcfce7
    classDef data fill:#3b0764,stroke:#a855f7,stroke-width:2px,color:#f3e8ff
    classDef guard fill:#451a03,stroke:#f97316,stroke-width:2px,color:#ffedd5

    class SF,AD,SL,US client
    class MW,RT,CT,UP api
    class DB,FS data
    class CTX,PR guard
```

</div>

### 🔐 Authentication Flow

<div align="center">

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 Client
    participant A as 🔐 AuthContext
    participant X as 🔗 Axios
    participant M as 🔑 auth middleware
    participant C as 🧠 Controller
    participant D as 🍃 MongoDB

    U->>A: submit credentials (admin / seller / user)
    A->>X: POST /api/auth/login
    X->>C: forward payload
    C->>D: lookup account
    D-->>C: hashed password
    C->>C: bcrypt.compare()
    C-->>A: ✅ JWT { id, role } · expires 7d
    A->>A: persist token + role in session state

    Note over A,M: every subsequent request

    A->>X: attach Authorization: Bearer <token>
    X->>M: protected request
    M->>M: jwt.verify() → req.user
    alt role matches route guard
        M->>C: next()
        C->>D: query / mutate
        D-->>U: 200 · { success: true, data }
    else invalid or wrong role
        M-->>U: 401 / 403 · { success: false }
    end
```

</div>

### 🗃️ Data Model Map

<div align="center">

```mermaid
erDiagram
    ADMIN     ||--o{ PRODUCT          : "approves"
    SELLER    ||--o{ PRODUCT          : "lists"
    SELLER    ||--o{ ORDER            : "fulfills"
    SELLER    ||--o{ REVIEW           : "is rated by"
    USER      ||--o{ ORDER            : "places"
    USER      ||--o{ WISHLIST         : "curates"
    USER      ||--o{ PRODUCTREVIEW    : "writes"
    USER      ||--o{ CONTACT          : "submits"
    CATEGORY  ||--o{ PRODUCT          : "groups"
    CATEGORY  ||--o{ CATEGORYDISCOUNT : "discounted by"
    BRAND     ||--o{ PRODUCT          : "brands"
    PRODUCT   ||--o{ PRODUCTREVIEW    : "receives"
    PRODUCT   ||--o{ ORDER            : "appears in"
    FLASHSALE ||--o{ PRODUCT          : "promotes"
    BLOGCATEGORY ||--o{ BLOG          : "organizes"
    HOME      ||--|| FOOTER           : "site chrome"
    POLICY    ||--|| FOOTER           : "linked from"
```

</div>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## ✨ Key Features

<details open>
<summary><b>🌐 &nbsp;Public Storefront</b> &nbsp;<sub><code>24 pages</code></sub></summary>

<br/>

- Dynamic home page with configurable sections (banners, featured categories, flash deals)
- Product browsing by category, brand, and search with live results
- Detailed product pages with reviews & ratings
- Shopping cart & multi-step checkout flow
- Flash sale campaigns with dedicated deal pages
- Seller storefronts — browse products by individual seller
- Blog system with categories and detail pages
- Wishlist, contact form, and static policy pages (Terms, Privacy, Returns, Support)

</details>

<details open>
<summary><b>🛠️ &nbsp;Admin Dashboard</b> &nbsp;<sub><code>36 pages · 100% DB-driven</code></sub></summary>

<br/>

- Fully **database-driven** control panel (no hardcoded/mock data)
- Product management — add, edit, approve in-house & seller products
- Category, brand, and category-based discount management
- Order management across in-house, seller, and pickup-point orders, plus unpaid order tracking
- Seller management — approvals, ratings, profile edits
- Customer management — add, edit, view customer accounts
- Blog & blog-category management with rich-text (TinyMCE) editor
- Refund request & refund reason management
- Product review moderation
- Home page content settings (banners, featured sections) editable from the panel
- Real-time analytics dashboard with consistent, DB-synced summaries

</details>

<details open>
<summary><b>🏪 &nbsp;Seller Dashboard</b> &nbsp;<sub><code>12 pages · isolated session</code></sub></summary>

<br/>

- Self-service product management (add/edit own listings)
- Order management — view, fulfill, and track orders, pickup points, and unpaid orders
- Refund handling for seller-fulfilled orders
- Seller ratings & profile management
- Dedicated seller authentication flow, isolated from admin/customer sessions

</details>

<details open>
<summary><b>👤 &nbsp;Customer Dashboard</b> &nbsp;<sub><code>9 pages</code></sub></summary>

<br/>

- Order & purchase history tracking
- Wishlist and followed-sellers management
- Digital wallet view
- Refund request submission
- Profile management & account deletion

</details>

<details open>
<summary><b>🔐 &nbsp;Authentication & Authorization</b></summary>

<br/>

- **JWT-based authentication** with role-aware middleware (`admin`, `seller`, `user`)
- Separate, isolated login flows for Admin, Seller, and Customer
- Protected routes on both client and server

</details>

## 🛠️ Tech Stack

<table>
<tr>
<td valign="bottom" width="50%">

### ⚛️ Frontend

**Frontend**
- ⚛️ React (Vite)
- 🎨 Tailwind CSS
- 🧭 React Router DOM
- 🔗 Axios
- 🖼️ Heroicons
- 📝 TinyMCE (rich-text editor)
- 📅 React Datepicker
- 🎯 React Select

<br/>

<img src="https://skillicons.dev/icons?i=react,tailwind,vite,js,html,css&theme=dark&perline=6" alt="Frontend icons" />

</td>
<td valign="bottom" width="50%">

### 🟢 Backend

**Backend**
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔑 JSON Web Tokens (JWT)
- 🔒 bcrypt.js (password hashing)
- 📂 Multer (file uploads)
- 🌐 CORS
- ⚙️ dotenv

<br/>

<img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,npm,git,github&theme=dark&perline=6" alt="Backend icons" />

</td>
</tr>
</table>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 🔌 REST API Surface

<details>
<summary><b>Expand the full route map</b> &nbsp;<sub><code>20 resource groups · base: /api</code></sub></summary>

<br/>

| # | Endpoint | Resource Domain |
|:--:|:---|:---|
| 01 | `/api/products` | Catalog — in-house & seller products |
| 02 | `/api/categories` | Category tree |
| 03 | `/api/brands` | Brand registry |
| 04 | `/api/category-discounts` | Category-based discount engine |
| 05 | `/api/flash-sale` | Flash sale campaigns & deal products |
| 06 | `/api/orders` | Order lifecycle — in-house, seller, pickup, unpaid |
| 07 | `/api/wishlist` | Customer wishlists |
| 08 | `/api/product-reviews` | Product reviews & moderation |
| 09 | `/api/reviews` | Seller ratings |
| 10 | `/api/sellers` | Seller directory, storefronts & ratings |
| 11 | `/api/auth` | Login / registration for all three roles |
| 12 | `/api/manage` | Admin management operations |
| 13 | `/api/dashboard` | DB-synced analytics summaries |
| 14 | `/api/home` | Home page content settings |
| 15 | `/api/footer` | Footer configuration |
| 16 | `/api/policy` | Terms · Privacy · Returns · Support |
| 17 | `/api/blogs` | Blog posts |
| 18 | `/api/blog-categories` | Blog taxonomy |
| 19 | `/api/contact` | Contact form submissions |
| 20 | `/api/upload` | Multer image uploads → `/uploads` |

> [!TIP]
> Every controller returns a consistent envelope — `{ success: boolean, data?, message? }` — so the frontend can handle success and failure uniformly across all 20 resources.

</details>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 📂 Project Structure

```
E-Commerce/
├── frontend/                # React + Vite client
│   └── src/
│       ├── admin/           # Admin dashboard (pages, components, layout)
│       ├── seller/          # Seller dashboard (pages, components, layout)
│       ├── user/            # Customer dashboard (pages, components, layout)
│       ├── pages/           # Public storefront pages
│       ├── components/      # Shared layout & feature components
│       ├── context/         # Auth context (JWT/session state)
│       └── data/            # Static/home page data
│
└── backend/                 # Node.js + Express API
    ├── controllers/         # Business logic per resource
    ├── routes/               # REST API route definitions
    ├── models/               # Mongoose schemas
    ├── middleware/            # Auth & upload middleware
    └── config/                # Database connection
```

<details>
<summary><b>🔬 Zoom in — annotated tree</b></summary>

<br/>

```
E-Commerce/
│
├── 📁 frontend/                     ⚛️  React 18 + Vite 5 SPA
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── App.jsx                  🧭  Route tree for all four experiences
│       ├── main.jsx
│       ├── index.css                🎨  Tailwind layers
│       │
│       ├── 🛠️ admin/                 36 pages · the control plane
│       │   ├── pages/               Dashboard · Products · Orders · Sellers
│       │   │                        Customers · Blogs · Refunds · Reviews
│       │   │                        HomeSettings · Discounts · Brands
│       │   ├── components/          Admin layout, tables, forms
│       │   └── data/
│       │
│       ├── 🏪 seller/                12 pages · self-service vendor panel
│       │   ├── pages/               Dashboard · Products · Orders
│       │   │                        PickupPoints · Unpaid · Refund · Rating
│       │   ├── components/
│       │   └── data/
│       │
│       ├── 👤 user/                  9 pages · customer account area
│       │   ├── pages/               PurchaseHistory · Wishlist · Wallet
│       │   │                        FollowedSellers · Refunds · Profile
│       │   └── components/
│       │
│       ├── 🌐 pages/                 24 public storefront pages
│       │                            Home · Categories · Brands · Search
│       │                            ProductDetails · Cart · Checkout
│       │                            FlashSale · SellerStore · Blogs · Policies
│       │
│       ├── 🧱 components/
│       │   ├── layout/              Navbar · Footer
│       │   ├── common/              Button · Container · Section
│       │   │                        Breadcrumb · SectionHeader
│       │   │                        ProtectedRoute  🛡️
│       │   └── features/            ProductCard · BlogCard
│       │
│       ├── 🔐 context/               AuthContext.jsx — JWT + role state
│       ├── 📦 data/
│       └── 🖼️ images/
│
└── 📁 backend/                      🟢  Node + Express 5 (ESM)
    ├── index.js                     🚪  Entry — mounts 20 route groups
    │
    ├── 🧭 routes/                    20 REST route definitions
    ├── 🧠 controllers/               19 controllers, one per domain
    ├── 🗃️ models/                    18 Mongoose schemas
    │                                Product · Order · User · Seller · Admin
    │                                Category · Brand · CategoryDiscount
    │                                FlashSale · Review · ProductReview
    │                                Wishlist · Blog · BlogCategory
    │                                Home · Footer · Policy · Contact
    │
    ├── 🛡️ middleware/
    │   ├── auth.js                  generateToken · verifyToken · requireAdmin
    │   └── upload.js                Multer · 5 MB cap · image-only filter
    │
    ├── ⚙️ config/
    │   └── db.js                    Mongoose connection bootstrap
    │
    └── 🗂️ src/uploads/               Served statically at /uploads
```

</details>

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 🚀 Getting Started

<div align="center">

```mermaid
flowchart LR
    A["1️⃣ Clone"] --> B["2️⃣ Install<br/>backend + frontend"]
    B --> C["3️⃣ Configure<br/>.env files"]
    C --> D["4️⃣ Run<br/>npm run dev ×2"]
    D --> E["🎉 localhost:5173<br/>+ localhost:5000"]

    classDef step fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#e2e8f0
    classDef done fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#dcfce7
    class A,B,C,D step
    class E done
```

</div>

### Prerequisites

<div align="center">

| Requirement | Notes |
|:---|:---|
| <img src="https://img.shields.io/badge/Node.js-installed-339933?style=flat-square&logo=node.js&logoColor=white" /> | Node.js installed |
| <img src="https://img.shields.io/badge/MongoDB-local%20or%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" /> | MongoDB (local instance or Atlas cluster) |

</div>

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd E-Commerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

> [!IMPORTANT]
> Both files are required. The backend won't connect without `MONGO_URI`, and the frontend can't reach the API without `VITE_API_URL`. Keep `.env` out of version control — it's already covered by `.gitignore`.

<table>
<tr>
<td valign="top" width="50%">

**`backend/.env`**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

</td>
<td valign="top" width="50%">

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

</td>
</tr>
</table>

<div align="center">

| Variable | Scope | Purpose |
|:---|:---:|:---|
| `PORT` | 🟢 backend | Express listen port — defaults to `5000` |
| `MONGO_URI` | 🟢 backend | Mongoose connection string (local or Atlas) |
| `JWT_SECRET` | 🟢 backend | Signing key for 7-day access tokens |
| `VITE_API_URL` | ⚛️ frontend | Base URL every Axios call is issued against |

</div>

### 3. Run the App

```bash
# Start the backend (from /backend)
npm run dev

# Start the frontend (from /frontend)
npm run dev
```

> [!TIP]
> The frontend `dev` script boots Vite through a small `patch-crypto.cjs` preload, which polyfills `crypto.getRandomValues` on older Node runtimes. On a modern Node version it's a harmless no-op, so `npm run dev` just works either way.

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

## 👨‍💻 Author

<div align="center">

<a href="https://nasir-sarkar.vercel.app/">
  <img src="https://img.shields.io/badge/%F0%9F%91%A8%E2%80%8D%F0%9F%92%BB%20NASIR%20SARKAR-0f172a?style=for-the-badge&labelColor=2563eb" height="48" alt="Nasir Sarkar" />
</a>

### **[Nasir Sarkar](https://nasir-sarkar.vercel.app/)**

**Full-stack MERN Developer**

<br/>

<a href="https://nasir-sarkar.vercel.app/"><img src="https://img.shields.io/badge/Portfolio-nasir--sarkar.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" /></a>
<a href="https://www.linkedin.com/in/nasir-sarkar"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>

</div>

<br/>

> This project was inspired by **ActiveItZone**’s e-commerce demo. Its storefront concept, design direction, visuals, and product presentation were taken as references. It can be considered a partial clone or custom implementation of the original concept. Respect to the original for the inspiration. 🙌

<p align="right"><a href="#readme-top">⬆ back to top</a></p>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" height="4" alt="" />

<div align="center">

### If you found this project interesting, consider giving it a ⭐!

<br/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=3000&pause=1000&color=2563EB&center=true&vCenter=true&width=600&lines=Thanks+for+scrolling+all+the+way+down.;Built+with+the+MERN+stack+and+far+too+much+coffee." alt="Outro" />

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:38bdf8,30:2563eb,65:1e3a8a,100:0f172a&height=150&section=footer" width="100%" alt="" />

</div>
