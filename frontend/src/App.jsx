import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
// import ProtectedRoute from './components/common/ProtectedRoute'

import Registration from './pages/Registration'
import Login from './pages/Login'
import Login_Admin  from './admin/pages/Login_Admin'
import Login_User   from './user/pages/Login_User'
import Login_Seller from './seller/pages/Login_Seller'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import Brands from './pages/Brands'
import Categories from './pages/Categories'
import Seller from './pages/Seller'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'
import CategoryProducts from './pages/CategoryProducts'
import BlogDetails from './pages/BlogDetails'
import SellerStore from './pages/SellerStore'
import BrandProducts from './pages/BrandProducts'
import FlashSale from './pages/FlashSale'
import FlashSaleDealProducts from './pages/FlashSaleDealProducts'
import SearchResults from './pages/SearchResults'
import TermsCondition from './pages/TermsCondition'
import ReturnPolicy from './pages/ReturnPolicy'
import SupportPolicy from './pages/SupportPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Cart     from './pages/Cart'
import Checkout from './pages/Checkout'

// Admin Panel
import AdminLayout              from './admin/components/AdminLayout'
import Dashboard_Admin          from './admin/pages/Dashboard_Admin'
import AllProducts_Admin        from './admin/pages/AllProducts_Admin'
import InHouseProducts_Admin    from './admin/pages/InHouseProducts_Admin'
import AddNewProduct_Admin      from './admin/pages/AddNewProduct_Admin'
import CategoryBasedDiscount_Admin from './admin/pages/CategoryBasedDiscount_Admin'
// import ProductReviews_Admin     from './admin/pages/ProductReviews_Admin'
import Customers_Admin          from './admin/pages/Customers_Admin'
import AddNewCustomer_Admin     from './admin/pages/AddNewCustomer_Admin'
import EditCustomer_Admin       from './admin/pages/EditCustomer_Admin'
import AllProductsSeller_Admin  from './admin/pages/AllProductsSeller_Admin'
import AllSellers_Admin         from './admin/pages/AllSellers_Admin'
import AddNewSeller_Admin       from './admin/pages/AddNewSeller_Admin'
import EditSeller_Admin         from './admin/pages/EditSeller_Admin'
import AppliedSeller_Admin      from './admin/pages/AppliedSeller_Admin'
import SellerRating_Admin       from './admin/pages/SellerRating_Admin'
import AllBrands_Admin          from './admin/pages/AllBrands_Admin'
import AddNewBrand_Admin        from './admin/pages/AddNewBrand_Admin'
import EditBrand_Admin          from './admin/pages/EditBrand_Admin'
import EditProduct_Admin        from './admin/pages/EditProduct_Admin'
import AllCategories_Admin      from './admin/pages/AllCategories_Admin'
import AddNewCategory_Admin     from './admin/pages/AddNewCategory_Admin'
import AllPosts_Admin           from './admin/pages/AllPosts_Admin'
import AddNewPost_Admin         from './admin/pages/AddNewPost_Admin'
import EditPost_Admin           from './admin/pages/EditPost_Admin'
import BlogCategories_Admin     from './admin/pages/BlogCategories_Admin'
import RefundRequests_Admin     from './admin/pages/RefundRequests_Admin'
import RefundReasons_Admin      from './admin/pages/RefundReasons_Admin'
import AllOrders_Admin          from './admin/pages/AllOrders_Admin'
import InhouseOrders_Admin      from './admin/pages/InhouseOrders_Admin'
import SellerOrders_Admin       from './admin/pages/SellerOrders_Admin'
import PickupPointOrders_Admin  from './admin/pages/PickupPointOrders_Admin'
import UnpaidOrders_Admin       from './admin/pages/UnpaidOrders_Admin'
import ProductReviews_Admin     from './admin/pages/ProductReviews_Admin';
import HomeSettings_Admin       from './admin/pages/HomeSettings_Admin';
import ViewOrder_Admin          from './admin/pages/ViewOrder_Admin';
import Profile_Admin          from './admin/pages/Profile_Admin';

// Seller Panel
import SellerLayout       from './seller/components/SellerLayout'
import Dashboard_Seller   from './seller/pages/Dashboard_Seller'
import Product_Seller     from './seller/pages/Product_Seller'
import Orders_Seller      from './seller/pages/Orders_Seller'
import Refund_Seller      from './seller/pages/Refund_Seller'
import AddNewProduct_Seller      from './seller/pages/AddNewProduct_Seller'
import EditProduct_Seller        from './seller/pages/EditProduct_Seller'
import ViewOrder_Seller          from './seller/pages/ViewOrder_Seller'
import PickupPointOrders_Seller  from './seller/pages/PickupPointOrders_Seller'
import UnpaidOrders_Seller       from './seller/pages/UnpaidOrders_Seller'
import SellerRating_Seller       from './seller/pages/SellerRating_Seller'
import Profile_Seller           from './seller/pages/Profile_Seller'


// User Panel
import UserLayout             from './user/components/UserLayout'
import Dashboard_User         from './user/pages/Dashboard_User'
import Wishlist_User          from './user/pages/Wishlist_User'
import RefundRequests_User    from './user/pages/RefundRequests_User'
import ManageProfile_User     from './user/pages/ManageProfile_User'
import MyWallet_User          from './user/pages/MyWallet_User'
import FollowedSellers_User   from './user/pages/FollowedSellers_User'
import DeleteAccount_User     from './user/pages/DeleteAccount_User'
import UserComingSoon         from './user/components/UserComingSoon'
import PurchaseHistory_User from './user/pages/PurchaseHistory_User'

// Placeholders

function AdminComingSoon() {
  return (
    <div className="text-center py-20 px-4">
      <div className="text-[48px] mb-4">🚧</div>
      <h2 className="text-[20px] font-bold text-[#232734] mb-2">Coming Soon</h2>
      <p className="text-[#a1a5b3] text-[14px]">
        This section will be connected to the API in a future update.
      </p>
    </div>
  )
}

function Layout() {
  const location = useLocation()
  const path = location.pathname.toLowerCase()

  const adminLoginPath  = '/admin/pages/login'
  const userLoginPath   = '/user/pages/login'
  const sellerLoginPath = '/seller/pages/login'

  const isAdminLogin  = path === adminLoginPath
  const isUserLogin   = path === userLoginPath
  const isSellerLogin = path === sellerLoginPath

  const adminRoutes       = ['/admin']
  const sellerPanelRoutes = ['/seller/dashboard', '/seller/products', '/seller/orders', '/seller/reviews', '/seller/settings', '/seller/profile', '/seller/refund', '/seller/pickup-point', '/seller/unpaid', '/seller/rating']
  const userPanelRoutes   = ['/user']
  const noLayoutRoutes    = ['/registration', '/login', '/seller-login', adminLoginPath, userLoginPath, sellerLoginPath]

  const isAdminRoute       = adminRoutes.some(r => path.startsWith(r)) && !isAdminLogin
  const isSellerPanelRoute = sellerPanelRoutes.some(r => path.startsWith(r)) && !isSellerLogin
  const isUserPanelRoute   = userPanelRoutes.some(r => path.startsWith(r)) && !isUserLogin
  const hideLayout         = noLayoutRoutes.some(r => path === r || path.startsWith(r + '/'))

  // Admin Panel
  if (isAdminRoute) {
    return (
      
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index            element={<Dashboard_Admin />} />
            <Route path="dashboard" element={<Dashboard_Admin />} />

            {/* Products */}
            <Route path="products/all"               element={<AllProducts_Admin />} />
            <Route path="products/in-house"          element={<InHouseProducts_Admin />} />
            <Route path="products/seller"            element={<AllProductsSeller_Admin />} />
            <Route path="products/create"            element={<AddNewProduct_Admin />} />
            <Route path="products/edit/:id"          element={<EditProduct_Admin />} />
            <Route path="products/category-discount" element={<CategoryBasedDiscount_Admin />} />
            {/* <Route path="reviews"                    element={<ProductReviews_Admin />} /> */}

            {/* reviews */}
            <Route path="reviews" element={<ProductReviews_Admin />} />

             {/* Profile */} 
            <Route path="profile" element={<Profile_Admin />} />

            {/* Customers */}
            <Route path="customers/list"             element={<Customers_Admin />} />
            <Route path="customers/create"           element={<AddNewCustomer_Admin />} />
            <Route path="customers/edit/:id"         element={<EditCustomer_Admin />} />

            {/* Sellers */}
            <Route path="sellers/list"               element={<AllSellers_Admin />} />
            <Route path="sellers/create"             element={<AddNewSeller_Admin />} />
            <Route path="sellers/edit/:id"           element={<EditSeller_Admin />} />
            <Route path="sellers/applied"            element={<AppliedSeller_Admin />} />
            <Route path="sellers/rating"             element={<SellerRating_Admin />} />

            {/* Brands */}
            <Route path="brands/all"                 element={<AllBrands_Admin />} />
            <Route path="brands/create"              element={<AddNewBrand_Admin />} />
            <Route path="brands/edit/:id"            element={<EditBrand_Admin />} />

            {/* Categories */}
            <Route path="categories/all"             element={<AllCategories_Admin />} />
            <Route path="categories/create"          element={<AddNewCategory_Admin />} />

            {/* Blog System */}
            <Route path="blog/posts"                 element={<AllPosts_Admin />} />
            <Route path="blog/create"               element={<AddNewPost_Admin />} />
            <Route path="blog/edit/:id"             element={<EditPost_Admin />} />
            <Route path="blog/categories"            element={<BlogCategories_Admin />} />

            {/* Refunds */}
            <Route path="refunds/requests"           element={<RefundRequests_Admin />} />
            <Route path="refunds/reasons"            element={<RefundReasons_Admin />} />

            {/* Sales */}
            <Route path="sales/all"                  element={<AllOrders_Admin />} />
            <Route path="sales/inhouse"              element={<InhouseOrders_Admin />} />
            <Route path="sales/seller"               element={<SellerOrders_Admin />} />
            <Route path="sales/pickup-point"         element={<PickupPointOrders_Admin />} />
            <Route path="sales/unpaid"               element={<UnpaidOrders_Admin />} />
            <Route path="sales/orders/view/:id"      element={<ViewOrder_Admin />} />
            <Route path="homepage-settings"          element={<HomeSettings_Admin />} />

            <Route path="*"         element={<AdminComingSoon />} />
          </Route>
        </Routes>
    )
  }

  // Seller Panel
  if (isSellerPanelRoute) {
    return (
      
        <Routes>
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<Dashboard_Seller />} />
            <Route path="products"  element={<Product_Seller />} />
            <Route path="products/create" element={<AddNewProduct_Seller />} />
            <Route path="products/edit/:id" element={<EditProduct_Seller />} />
            <Route path="orders"           element={<Orders_Seller />} />
            <Route path="orders/view/:id"  element={<ViewOrder_Seller />} />
            <Route path="pickup-point"     element={<PickupPointOrders_Seller />} />
            <Route path="unpaid"           element={<UnpaidOrders_Seller />} />
            <Route path="rating"           element={<SellerRating_Seller />} />
            <Route path="profile"          element={<Profile_Seller />} />
            <Route path="refund"           element={<Refund_Seller />} />
          </Route>
        </Routes>
    
    )
  }

  // Auth pages (no navbar/footer)
  if (hideLayout) {
    return (
      <Routes>
        <Route path="/registration"        element={<Registration />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/admin/pages/login"   element={<Login_Admin />} />
        <Route path="/user/pages/login"    element={<Login_User />} />
        <Route path="/seller/pages/login"  element={<Login_Seller />} />
      </Routes>
    )
  }

  // User Panel (with main Navbar + Footer)
  if (isUserPanelRoute) {
    return (
      
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/user" element={<UserLayout />}>
                {/* Implemented pages */}
                <Route index               element={<Dashboard_User />} />
                <Route path="dashboard"    element={<Dashboard_User />} />
                <Route path="wishlist"     element={<Wishlist_User />} />
                <Route path="refund-requests" element={<RefundRequests_User />} />
                <Route path="purchase-history" element={<PurchaseHistory_User />} />

                {/* Coming soon — add pages as you build them */}
  
                <Route path="preorder/list"         element={<UserComingSoon page="Preorder List" />} />
                <Route path="preorder/conversations" element={<UserComingSoon page="Preorder Conversations" />} />
                <Route path="compare"               element={<UserComingSoon page="Compare" />} />
                <Route path="followed-sellers"      element={<FollowedSellers_User />} />
                <Route path="classified-products"   element={<UserComingSoon page="Classified Products" />} />
                <Route path="auction/bids"          element={<UserComingSoon page="Auction — Bidded Products" />} />
                <Route path="auction/purchase-history" element={<UserComingSoon page="Auction — Purchase History" />} />
                <Route path="conversations"         element={<UserComingSoon page="Conversations" />} />
                <Route path="wallet"                element={<MyWallet_User />} />
                <Route path="earning-points"        element={<UserComingSoon page="Earning Points" />} />
                <Route path="affiliate"             element={<UserComingSoon page="Affiliate System" />} />
                <Route path="affiliate/payment-history"  element={<UserComingSoon page="Affiliate — Payment History" />} />
                <Route path="affiliate/withdraw-history" element={<UserComingSoon page="Affiliate — Withdraw Request History" />} />
                <Route path="support-ticket"        element={<UserComingSoon page="Support Ticket" />} />
                <Route path="profile"               element={<ManageProfile_User />} />
                <Route path="account-delete"        element={<DeleteAccount_User />} />
                <Route path="packages"              element={<UserComingSoon page="Customer Packages" />} />
                <Route path="*"                     element={<UserComingSoon page="Page" />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      
    )
  }

  // Public / User-facing routes (with Navbar + Footer)
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/flash-sale"              element={<FlashSale />} />
          <Route path="/blogs"                   element={<Blogs />} />
          <Route path="/brands"                  element={<Brands />} />
          <Route path="/categories"              element={<Categories />} />
          <Route path="/seller"                  element={<Seller />} />
          <Route path="/contact"                 element={<Contact />} />
          <Route path="/product/:id"             element={<ProductDetails />} />
          <Route path="/category/:categoryName"  element={<CategoryProducts />} />
          <Route path="/blog/:id"                element={<BlogDetails />} />
          <Route path="/seller/:sellerName"      element={<SellerStore />} />
          <Route path="/brand/:brandName"        element={<BrandProducts />} />
          <Route path="/flash-sale/deal/:dealId" element={<FlashSaleDealProducts />} />
          <Route path="/search"                  element={<SearchResults />} />
          <Route path="/terms-conditions"        element={<TermsCondition />} />
          <Route path="/return-policy"           element={<ReturnPolicy />} />
          <Route path="/support-policy"          element={<SupportPolicy />} />
          <Route path="/privacy-policy"          element={<PrivacyPolicy />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}