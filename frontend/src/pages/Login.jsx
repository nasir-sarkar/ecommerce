import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="aiz-main-wrapper flex flex-col justify-center bg-white min-h-screen" style={{ fontFamily: "'Public Sans', sans-serif", fontWeight: 400 }}>
      <section className="bg-white">
        <div className="container mx-auto">
          <div className="w-full py-[3rem] lg:my-[3rem] px-4 mx-auto" style={{ maxWidth: '780px' }}>

            {/* Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[0.5rem]" style={{ border: '1px solid #f2f2f2' }}>

              {/* Left side image */}
              <div className="hidden md:block px-0" style={{ borderRight: '1px solid #f2f2f2' }}>
                <img
                  className="w-full h-full object-cover"
                  src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/demo/link/link.png"
                  alt="Active eCommerce CMS"
                />
              </div>

              {/* Right side buttons */}
              <div className="px-[2rem] py-[3rem] flex flex-col justify-center">
                <div className="mb-[1.5rem] text-center">
                  <img
                    className="h-[40px] mx-auto"
                    src="https://demo.activeitzone.com/ecommerce_repo/public/assets/img/demo/link/logo.svg"
                    alt="Active eCommerce CMS"
                  />
                </div>

                <a
                  href="/user/pages/login"
                  onClick={(e) => { e.preventDefault(); navigate('/user/pages/login') }}
                  className="block w-full text-center py-[0.75rem] px-[1.5rem] mb-[1rem] rounded-[0.375rem] text-[14px] font-bold transition-colors"
                  style={{ backgroundColor: '#e9f3ff', color: '#1b84ff' }}
                >
                  Login as Customer
                </a>

                <a
                  href="/admin/pages/login"
                  onClick={(e) => { e.preventDefault(); navigate('/admin/pages/login') }}
                  className="block w-full text-center py-[0.75rem] px-[1.5rem] mb-[1rem] rounded-[0.375rem] text-[14px] font-bold transition-colors"
                  style={{ backgroundColor: '#f1e8ff', color: '#7339ea' }}
                >
                  Login as Admin
                </a>

                <a
                  href="/seller/pages/login"
                  onClick={(e) => { e.preventDefault(); navigate('/seller/pages/login') }}
                  className="block w-full text-center py-[0.75rem] px-[1.5rem] mb-[1rem] rounded-[0.375rem] text-[14px] font-bold transition-colors"
                  style={{ backgroundColor: '#dfffe8', color: '#12814c' }}
                >
                  Login as Seller
                </a>

                <small className="block text-[10px] text-center" style={{ color: '#78829d' }}>
                  * The above links of Login will forward you to main demo.
                </small>
              </div>
            </div>

            {/* Footer area */}
            <div style={{ marginTop: '20px' }}>
              <div className="flex justify-end">
                <a
                  href="/"
                  onClick={(e) => { e.preventDefault(); navigate('/') }}
                  className="text-[14px] font-bold inline-flex items-center hover:underline"
                  style={{ color: '#1b84ff' }}
                >
                  <span className="mr-2">&larr;</span>
                  Back to Previous Page
                </a>
              </div>
            </div>

            {/* Hidden internal links to keep navigation working inside this app */}
            <div className="hidden">
              <Link to="/admin/pages/login">/admin/login</Link>
              <Link to="/user/pages/login">/user/login</Link>
              <Link to="/seller/pages/login">/seller/login</Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}